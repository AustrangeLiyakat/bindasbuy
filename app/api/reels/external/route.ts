import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Reel from "@/models/Reel"
import User from "@/models/User"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get user data including college
    const user = await User.findById(session.userId).select('college name avatar')
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const {
      mediaUrl,
      mediaType = "video",
      thumbnailUrl,
      caption,
      hashtags,
      music,
      duration,
      isExternal = true,
      externalSource,
    } = await request.json()

    console.log("External reel request body:", {
      mediaUrl,
      caption,
      hashtags,
      music,
      externalSource
    })

    if (!mediaUrl || !caption) {
      console.log("Validation failed:", { mediaUrl: !!mediaUrl, caption: !!caption })
      return NextResponse.json(
        { message: "Media URL and caption are required" },
        { status: 400 }
      )
    }

    // Validate external URL
    try {
      new URL(mediaUrl)
    } catch {
      return NextResponse.json({ message: "Invalid media URL" }, { status: 400 })
    }

    // Parse hashtags if provided as string
    let hashtagArray = []
    if (hashtags) {
      if (typeof hashtags === "string") {
        hashtagArray = hashtags
          .split(",")
          .map((tag) => tag.trim().replace("#", ""))
          .filter((tag) => tag.length > 0)
      } else if (Array.isArray(hashtags)) {
        hashtagArray = hashtags
      }
    }

    // Create reel in database
    const newReel = new Reel({
      userId: session.userId,
      author: session.userId,
      mediaUrl,
      mediaType,
      thumbnailUrl: thumbnailUrl || mediaUrl,
      caption,
      hashtags: hashtagArray,
      music,
      duration: duration || 0,
      college: user.college, // Get college from user
      isPublic: true,
      isExternal,
      externalSource: externalSource || "unknown",
      likes: [], // Empty array instead of missing
      comments: [], // Empty array instead of missing
      shares: [], // Empty array instead of missing
      views: [], // Empty array instead of missing
    })

    await newReel.save()

    // Populate the reel with user data
    const populatedReel = await Reel.findById(newReel._id)
      .populate("author", "name email avatar college")
      .lean()

    return NextResponse.json({
      message: "External reel added successfully",
      reel: populatedReel,
    })
  } catch (error) {
    console.error("Error adding external reel:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
