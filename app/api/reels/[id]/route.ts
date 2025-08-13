import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Reel from "@/models/Reel"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const reel = await Reel.findById(params.id)
      .populate("author", "name email college avatar")
      .populate("likes.user", "name avatar")
      .populate("comments.user", "name avatar")
      .lean()

    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 })
    }

    // Track view if user is authenticated
    const session = await getSession()
    if (session && session.userId !== reel.author._id.toString()) {
      await Reel.findByIdAndUpdate(params.id, {
        $addToSet: {
          views: {
            user: session.userId,
            watchTime: 0, // Will be updated by client
            createdAt: new Date(),
          },
        },
        $inc: {
          "analytics.totalViews": 1,
        },
        $set: {
          "analytics.lastUpdated": new Date(),
        },
      })
    }

    const formattedReel = {
      id: reel._id.toString(),
      userId: reel.author._id.toString(),
      userName: reel.author.name,
      userAvatar: reel.author.avatar || "/placeholder.svg?height=40&width=40",
      userCollege: reel.author.college,
      caption: reel.caption,
      mediaUrl: reel.mediaUrl,
      mediaType: reel.mediaType,
      thumbnailUrl: reel.thumbnailUrl,
      duration: reel.duration,
      music: reel.music,
      likes: reel.likes?.length || 0,
      comments: reel.comments?.length || 0,
      saves: reel.saves?.length || 0,
      shares: reel.shares?.length || 0,
      views: reel.views?.length || 0,
      analytics: reel.analytics,
      isLiked: session ? reel.likes?.some((like: any) => like.user._id.toString() === session.userId) : false,
      isSaved: session ? reel.saves?.some((save: any) => save.user.toString() === session.userId) : false,
      isOwner: session ? reel.author._id.toString() === session.userId : false,
      createdAt: reel.createdAt,
      updatedAt: reel.updatedAt,
    }

    return NextResponse.json({ reel: formattedReel })
  } catch (error) {
    console.error("Get reel error:", error)
    return NextResponse.json({ error: "Failed to fetch reel" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check authorization - only reel author can edit
    if (reel.author.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized - You can only edit your own reels" }, { status: 403 })
    }

    const body = await request.json()
    const { caption, isPublic } = body

    // Update reel
    const updatedReel = await Reel.findByIdAndUpdate(
      params.id,
      {
        caption: caption !== undefined ? caption : reel.caption,
        isPublic: isPublic !== undefined ? isPublic : reel.isPublic,
        updatedAt: new Date(),
      },
      { new: true },
    ).populate("author", "name email college avatar")

    const formattedReel = {
      id: updatedReel._id.toString(),
      userId: updatedReel.author._id.toString(),
      userName: updatedReel.author.name,
      userAvatar: updatedReel.author.avatar || "/placeholder.svg?height=40&width=40",
      userCollege: updatedReel.author.college,
      caption: updatedReel.caption,
      mediaUrl: updatedReel.mediaUrl,
      mediaType: updatedReel.mediaType,
      isPublic: updatedReel.isPublic,
      createdAt: updatedReel.createdAt,
      updatedAt: updatedReel.updatedAt,
    }

    return NextResponse.json({ reel: formattedReel })
  } catch (error) {
    console.error("Update reel error:", error)
    return NextResponse.json({ error: "Failed to update reel" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check authorization - only reel author can delete
    if (reel.author.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized - You can only delete your own reels" }, { status: 403 })
    }

    await Reel.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Reel deleted successfully" })
  } catch (error) {
    console.error("Delete reel error:", error)
    return NextResponse.json({ error: "Failed to delete reel" }, { status: 500 })
  }
}
