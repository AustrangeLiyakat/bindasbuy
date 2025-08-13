import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Reel from "@/models/Reel"
import User from "@/models/User"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const reel = await Reel.findById(params.id).populate("comments.user", "name email college avatar").lean()

    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 })
    }

    const formattedComments = reel.comments.map((comment: any) => ({
      id: comment._id.toString(),
      userId: comment.user._id.toString(),
      user: {
        id: comment.user._id.toString(),
        name: comment.user.name,
        username: comment.user.email.split("@")[0],
        avatar: comment.user.avatar || "/placeholder.svg?height=32&width=32",
      },
      content: comment.content,
      createdAt: comment.createdAt,
    }))

    return NextResponse.json({ comments: formattedComments })
  } catch (error) {
    console.error("Get reel comments error:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    const reel = await Reel.findById(params.id)
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 })
    }

    const user = await User.findById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newComment = {
      user: session.userId,
      content,
      createdAt: new Date(),
    }

    reel.comments.push(newComment)

    // Update analytics
    reel.analytics.totalComments += 1
    const totalEngagements =
      reel.analytics.totalLikes + reel.analytics.totalComments + reel.analytics.totalSaves + reel.analytics.totalShares
    reel.analytics.engagementRate =
      reel.analytics.totalViews > 0 ? (totalEngagements / reel.analytics.totalViews) * 100 : 0
    reel.analytics.lastUpdated = new Date()

    await reel.save()

    const formattedComment = {
      id: reel.comments[reel.comments.length - 1]._id.toString(),
      userId: user._id.toString(),
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.email.split("@")[0],
        avatar: user.avatar || "/placeholder.svg?height=32&width=32",
      },
      content,
      createdAt: newComment.createdAt,
    }

    return NextResponse.json({ comment: formattedComment, analytics: reel.analytics }, { status: 201 })
  } catch (error) {
    console.error("Add reel comment error:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
