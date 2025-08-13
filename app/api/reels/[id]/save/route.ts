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
    const existingSaveIndex = reel.saves.findIndex((save: any) => save.user.toString() === userId)
    const isSaved = existingSaveIndex !== -1

    if (isSaved) {
      // Unsave the reel
      reel.saves.splice(existingSaveIndex, 1)
      reel.analytics.totalSaves = Math.max(0, reel.analytics.totalSaves - 1)
    } else {
      // Save the reel
      reel.saves.push({
        user: userId,
        createdAt: new Date(),
      })
      reel.analytics.totalSaves += 1
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
      isSaved: !isSaved,
      saves: reel.saves.length,
      analytics: reel.analytics,
    })
  } catch (error) {
    console.error("Toggle reel save error:", error)
    return NextResponse.json({ error: "Failed to save reel" }, { status: 500 })
  }
}
