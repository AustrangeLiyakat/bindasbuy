import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
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

    const formData = await request.formData()
    const file = formData.get("file") as File || formData.get("video") as File // Support both field names
    const type = formData.get("type") as string
    const caption = formData.get("caption") as string
    const hashtags = formData.get("hashtags") as string
    const musicName = formData.get("musicName") as string
    const musicArtist = formData.get("musicArtist") as string

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    if (!caption) {
      return NextResponse.json({ message: "Caption is required" }, { status: 400 })
    }

    // Determine media type
    const mediaType = type || (file.type.startsWith("video/") ? "video" : "image")

    // Validate file type based on media type
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov", "video/quicktime"]
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    
    if (mediaType === "video" && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid video file type. Supported formats: MP4, WebM, OGG, AVI, MOV" },
        { status: 400 }
      )
    }
    
    if (mediaType === "image" && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid image file type. Supported formats: JPEG, PNG, GIF, WebP" },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File too large. Maximum size is 50MB." },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "reels")
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${originalName}`
    const filepath = join(uploadDir, filename)

    // Save file
    await writeFile(filepath, buffer)

    // Generate media URL
    const mediaUrl = `/uploads/reels/${filename}`

    // Parse hashtags
    const hashtagArray = hashtags
      ? (typeof hashtags === 'string' ? JSON.parse(hashtags) : hashtags)
          .map((tag: string) => tag.trim().replace("#", ""))
          .filter((tag: string) => tag.length > 0)
      : []

    // Create music object if provided
    const music = musicName && musicArtist ? { title: musicName, artist: musicArtist } : undefined

    // Create reel in database
    const newReel = new Reel({
      userId: session.userId,
      author: session.userId, // Set author to same as userId
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      thumbnailUrl: mediaType === "image" ? mediaUrl : undefined, // Use image as thumbnail, generate for video later
      caption,
      hashtags: hashtagArray,
      music,
      duration: 0, // You'd need to extract this from the video file
      college: user.college, // Get college from user
      isPublic: true,
      isExternal: false, // This is a local upload
      externalSource: null,
      likes: [], // Empty array instead of number
      comments: [], // Empty array instead of number
      shares: [], // Empty array instead of number
      views: [], // Empty array instead of number
    })

    await newReel.save()

    // Populate the reel with user data
    const populatedReel = await Reel.findById(newReel._id)
      .populate("userId", "name username avatar isVerified")
      .lean()

    return NextResponse.json({
      message: "File uploaded successfully",
      reel: populatedReel,
      mediaUrl,
    })
  } catch (error) {
    console.error("Error uploading video:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
