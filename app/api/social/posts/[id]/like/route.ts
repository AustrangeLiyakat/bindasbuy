import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const post = await Post.findById(params.id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const userId = session.userId
    const existingLikeIndex = post.likes.findIndex((like: any) => like.user.toString() === userId)
    const isLiked = existingLikeIndex !== -1

    if (isLiked) {
      // Unlike the post
      post.likes.splice(existingLikeIndex, 1)
      post.analytics.totalLikes = Math.max(0, post.analytics.totalLikes - 1)
    } else {
      // Like the post
      post.likes.push({
        user: userId,
        createdAt: new Date(),
      })
      post.analytics.totalLikes += 1
    }

    const totalEngagements =
      post.analytics.totalLikes + post.analytics.totalComments + post.analytics.totalSaves + post.analytics.totalReposts
    post.analytics.engagementRate =
      post.analytics.totalViews > 0 ? (totalEngagements / post.analytics.totalViews) * 100 : 0
    post.analytics.lastUpdated = new Date()

    await post.save()

    return NextResponse.json({
      success: true,
      isLiked: !isLiked,
      likes: post.likes.length,
      analytics: post.analytics,
    })
  } catch (error) {
    console.error("Toggle like error:", error)
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
  }
}
