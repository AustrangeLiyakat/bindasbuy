import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Reel from "@/models/Reel"
import User from "@/models/User"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const mediaType = searchParams.get("mediaType") || "all"
    const college = searchParams.get("college")
    const author = searchParams.get("author")

    // Build filter query
    const filter: any = { isPublic: true }
    if (mediaType !== "all") filter.mediaType = mediaType
    if (college) filter.college = college
    if (author) filter.author = author

    // Get reels with pagination
    const skip = (page - 1) * limit
    const reels = await Reel.find(filter)
      .populate("author", "name email college avatar")
      .populate("likes.user", "name avatar")
      .populate("comments.user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Reel.countDocuments(filter)

    // Format response
    const session = await getSession()
    const formattedReels = reels.map((reel) => ({
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
    }))

    return NextResponse.json({
      reels: formattedReels,
      hasMore: skip + limit < total,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get reels error:", error)
    return NextResponse.json({ error: "Failed to fetch reels" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { caption, mediaUrl, mediaType, thumbnailUrl, duration, music } = body

    // Validate required fields
    if (!mediaUrl || !mediaType) {
      return NextResponse.json({ error: "Media URL and type are required" }, { status: 400 })
    }

    // Get user details
    const user = await User.findById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create reel
    const reel = new Reel({
      author: session.userId,
      caption: caption || "",
      mediaUrl,
      mediaType,
      thumbnailUrl,
      duration,
      music,
      college: user.college,
      likes: [],
      comments: [],
      saves: [],
      shares: [],
      views: [],
      analytics: {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalSaves: 0,
        totalShares: 0,
        averageWatchTime: 0,
        engagementRate: 0,
        lastUpdated: new Date(),
      },
    })

    await reel.save()

    // Populate author info for response
    await reel.populate("author", "name email college avatar")

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
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0,
      views: 0,
      analytics: reel.analytics,
      isLiked: false,
      isSaved: false,
      isOwner: true,
      createdAt: reel.createdAt,
      updatedAt: reel.updatedAt,
    }

    return NextResponse.json({ reel: formattedReel }, { status: 201 })
  } catch (error) {
    console.error("Create reel error:", error)
    return NextResponse.json({ error: "Failed to create reel" }, { status: 500 })
  }
}
