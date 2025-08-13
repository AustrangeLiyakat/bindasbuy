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
    const existingSaveIndex = post.saves.findIndex((save: any) => save.user.toString() === userId)
    const isSaved = existingSaveIndex !== -1

    if (isSaved) {
      // Unsave the post
      post.saves.splice(existingSaveIndex, 1)
      post.analytics.totalSaves = Math.max(0, post.analytics.totalSaves - 1)
    } else {
      // Save the post
      post.saves.push({
        user: userId,
        createdAt: new Date(),
      })
      post.analytics.totalSaves += 1
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
      isSaved: !isSaved,
      saves: post.saves.length,
      analytics: post.analytics,
    })
  } catch (error) {
    console.error("Toggle save error:", error)
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 })
  }
}
