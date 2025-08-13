import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Reel from "@/models/Reel"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const reel = await Reel.findById(params.id)
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 })
    }

    const userId = session.userId
    const existingLikeIndex = reel.likes.findIndex((like: any) => like.user.toString() === userId)
    const isLiked = existingLikeIndex !== -1

    if (isLiked) {
      // Unlike the reel
      reel.likes.splice(existingLikeIndex, 1)
      reel.analytics.totalLikes = Math.max(0, reel.analytics.totalLikes - 1)
    } else {
      // Like the reel
      reel.likes.push({
        user: userId,
        createdAt: new Date(),
      })
      reel.analytics.totalLikes += 1
    }

    // Update engagement rate
    const totalEngagements =
      reel.analytics.totalLikes + reel.analytics.totalComments + reel.analytics.totalSaves + reel.analytics.totalShares
    reel.analytics.engagementRate =
      reel.analytics.totalViews > 0 ? (totalEngagements / reel.analytics.totalViews) * 100 : 0
    reel.analytics.lastUpdated = new Date()

    await reel.save()

    return NextResponse.json({
      success: true,
      isLiked: !isLiked,
      likes: reel.likes.length,
      analytics: reel.analytics,
    })
  } catch (error) {
    console.error("Toggle reel like error:", error)
    return NextResponse.json({ error: "Failed to like reel" }, { status: 500 })
  }
}
