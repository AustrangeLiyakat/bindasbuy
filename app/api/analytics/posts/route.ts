import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"
import Reel from "@/models/Reel"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "7d" // 7d, 30d, 90d, all
    const type = searchParams.get("type") || "all" // posts, reels, all

    // Calculate date filter
    let dateFilter = {}
    if (timeframe !== "all") {
      const days = Number.parseInt(timeframe.replace("d", ""))
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      dateFilter = { createdAt: { $gte: startDate } }
    }

    const filter = { author: session.userId, ...dateFilter }

    // Fetch posts and reels analytics
    const [posts, reels] = await Promise.all([
      type === "reels"
        ? []
        : Post.find(filter)
            .populate("likes.user", "name avatar")
            .populate("comments.user", "name avatar")
            .populate("saves.user", "name avatar")
            .populate("reposts.user", "name avatar")
            .populate("views.user", "name avatar")
            .sort({ createdAt: -1 })
            .lean(),
      type === "posts"
        ? []
        : Reel.find(filter)
            .populate("likes.user", "name avatar")
            .populate("comments.user", "name avatar")
            .populate("saves.user", "name avatar")
            .populate("shares.user", "name avatar")
            .populate("views.user", "name avatar")
            .sort({ createdAt: -1 })
            .lean(),
    ])

    // Calculate overall analytics
    const totalPosts = posts.length + reels.length
    const totalViews = [...posts, ...reels].reduce((sum, item) => sum + (item.analytics?.totalViews || 0), 0)
    const totalLikes = [...posts, ...reels].reduce((sum, item) => sum + (item.analytics?.totalLikes || 0), 0)
    const totalComments = [...posts, ...reels].reduce((sum, item) => sum + (item.analytics?.totalComments || 0), 0)
    const totalSaves = [...posts, ...reels].reduce((sum, item) => sum + (item.analytics?.totalSaves || 0), 0)
    const totalShares = [...posts, ...reels].reduce(
      (sum, item) => sum + (item.analytics?.totalReposts || item.analytics?.totalShares || 0),
      0,
    )

    const avgEngagementRate =
      totalPosts > 0
        ? [...posts, ...reels].reduce((sum, item) => sum + (item.analytics?.engagementRate || 0), 0) / totalPosts
        : 0

    // Format content with detailed analytics
    const formattedPosts = posts.map((post: any) => ({
      id: post._id.toString(),
      type: "post",
      content: post.content,
      images: post.images,
      video: post.video,
      postType: post.type,
      createdAt: post.createdAt,
      analytics: post.analytics,
      interactions: {
        likes: post.likes.map((like: any) => ({
          user: {
            id: like.user._id.toString(),
            name: like.user.name,
            avatar: like.user.avatar || "/placeholder.svg?height=32&width=32",
          },
          createdAt: like.createdAt,
        })),
        comments: post.comments.map((comment: any) => ({
          user: {
            id: comment.user._id.toString(),
            name: comment.user.name,
            avatar: comment.user.avatar || "/placeholder.svg?height=32&width=32",
          },
          content: comment.content,
          createdAt: comment.createdAt,
        })),
        saves: post.saves.map((save: any) => ({
          user: {
            id: save.user._id.toString(),
            name: save.user.name,
            avatar: save.user.avatar || "/placeholder.svg?height=32&width=32",
          },
          createdAt: save.createdAt,
        })),
        reposts: post.reposts.map((repost: any) => ({
          user: {
            id: repost.user._id.toString(),
            name: repost.user.name,
            avatar: repost.user.avatar || "/placeholder.svg?height=32&width=32",
          },
          createdAt: repost.createdAt,
        })),
        views: post.views.map((view: any) => ({
          user: {
            id: view.user._id.toString(),
            name: view.user.name,
            avatar: view.user.avatar || "/placeholder.svg?height=32&width=32",
          },
          createdAt: view.createdAt,
        })),
      },
    }))

    const formattedReels = reels.map((reel: any) => ({
      id: reel._id.toString(),
      type: "reel",
      caption: reel.caption,
      mediaUrl: reel.mediaUrl,
      mediaType: reel.mediaType,
      thumbnailUrl: reel.thumbnailUrl,
      createdAt: reel.createdAt,
      analytics: reel.analytics,
      interactions: {
        likes: reel.likes.map((like: any) => ({
          user: {
            id: like.user._id.toString(),
            name: like.user.name,
            avatar: like.user.avatar || "/placeholder.svg?height=32&width=32",
          },
          createdAt: like.createdAt,
        })),
        comments: reel.comments.map((comment: any) => ({
          user: {
            id: comment.user._id.toString(),
            name: comment.user.name,
            avatar: comment.user.avatar || "/placeholder.svg?height=32&width=32",
          },
          content: comment.content,
          createdAt: comment.createdAt,
        })),
        saves: reel.saves.map((save: any) => ({
          user: {
            id: save.user._id.toString(),
            name: save.user.name,
            avatar: save.user.avatar || "/placeholder.svg?height=32&width=32",
          },
          createdAt: save.createdAt,
        })),
        shares: reel.shares.map((share: any) => ({
          user: {
            id: share.user._id.toString(),
            name: share.user.name,
            avatar: share.user.avatar || "/placeholder.svg?height=32&width=32",
          },
          platform: share.platform,
          createdAt: share.createdAt,
        })),
        views: reel.views.map((view: any) => ({
          user: {
            id: view.user._id.toString(),
            name: view.user.name,
            avatar: view.user.avatar || "/placeholder.svg?height=32&width=32",
          },
          watchTime: view.watchTime,
          createdAt: view.createdAt,
        })),
      },
    }))

    const allContent = [...formattedPosts, ...formattedReels].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return NextResponse.json({
      overview: {
        totalPosts,
        totalViews,
        totalLikes,
        totalComments,
        totalSaves,
        totalShares,
        avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
      },
      content: allContent,
      timeframe,
      type,
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
