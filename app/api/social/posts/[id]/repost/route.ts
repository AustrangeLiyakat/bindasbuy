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
    const existingRepostIndex = post.reposts.findIndex((repost: any) => repost.user.toString() === userId)
    const isReposted = existingRepostIndex !== -1

    if (isReposted) {
      // Remove repost
      post.reposts.splice(existingRepostIndex, 1)
      post.analytics.totalReposts = Math.max(0, post.analytics.totalReposts - 1)
    } else {
      // Add repost
      post.reposts.push({
        user: userId,
        createdAt: new Date(),
      })
      post.analytics.totalReposts += 1
    }

    // Update engagement rate
    const totalEngagements =
      post.analytics.totalLikes + post.analytics.totalComments + post.analytics.totalSaves + post.analytics.totalReposts
    post.analytics.engagementRate =
      post.analytics.totalViews > 0 ? (totalEngagements / post.analytics.totalViews) * 100 : 0
    post.analytics.lastUpdated = new Date()

    await post.save()

    return NextResponse.json({
      success: true,
      isReposted: !isReposted,
      reposts: post.reposts.length,
      analytics: post.analytics,
    })
  } catch (error) {
    console.error("Toggle repost error:", error)
    return NextResponse.json({ error: "Failed to repost" }, { status: 500 })
  }
}
