import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import connectDB from "@/lib/mongodb"
import Reel from "@/models/Reel"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("video") as File
    const caption = formData.get("caption") as string
    const hashtags = formData.get("hashtags") as string
    const musicName = formData.get("musicName") as string
    const musicArtist = formData.get("musicArtist") as string

    if (!file) {
      return NextResponse.json({ message: "No video file provided" }, { status: 400 })
    }

    if (!caption) {
      return NextResponse.json({ message: "Caption is required" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only video files are allowed." },
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

    // Generate video URL
    const videoUrl = `/uploads/reels/${filename}`

    // Parse hashtags
    const hashtagArray = hashtags
      ? hashtags
          .split(",")
          .map((tag) => tag.trim().replace("#", ""))
          .filter((tag) => tag.length > 0)
      : []

    // Create music object if provided
    const music = musicName && musicArtist ? { name: musicName, artist: musicArtist } : undefined

    // Create reel in database
    const newReel = new Reel({
      userId: session.userId,
      mediaUrl: videoUrl,
      mediaType: "video",
      thumbnailUrl: videoUrl, // For now, use the same URL. In production, you'd generate a thumbnail
      caption,
      hashtags: hashtagArray,
      music,
      duration: 0, // You'd need to extract this from the video file
      isPublic: true,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
    })

    await newReel.save()

    // Populate the reel with user data
    const populatedReel = await Reel.findById(newReel._id)
      .populate("userId", "name username avatar isVerified")
      .lean()

    return NextResponse.json({
      message: "Video uploaded successfully",
      reel: populatedReel,
      videoUrl,
    })
  } catch (error) {
    console.error("Error uploading video:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
