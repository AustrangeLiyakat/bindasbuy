import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Reel from "@/models/Reel"
import User from "@/models/User"

export async function POST() {
  try {
    await connectDB()
    
    // First, let's find an existing user or create one
    let user = await User.findOne({})
    if (!user) {
      return NextResponse.json({ error: "No users found, please create a user first" }, { status: 400 })
    }
    
    console.log("Found user:", user.name, user._id)
    
    // Create test reels
    const testReels = [
      {
        userId: user._id,
        author: user._id,
        caption: "Test reel with sample video! 🎥✨ This is a sample reel to test the video display functionality.",
        mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        mediaType: "video",
        thumbnailUrl: "https://sample-videos.com/zip/10/jpg/SampleJPGImage_1280x720_1mb.jpg",
        duration: 30,
        hashtags: ["test", "sample", "video", "campus"],
        music: {
          title: "Sample Track",
          artist: "Test Artist"
        },
        isPublic: true,
        college: user.college || "Test College",
        analytics: {
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          totalSaves: 0,
          totalShares: 0,
          averageWatchTime: 0,
          engagementRate: 0,
          lastUpdated: new Date()
        }
      },
      {
        userId: user._id,
        author: user._id,
        caption: "Instagram test reel! 📱✨ Testing external content integration.",
        mediaUrl: "https://www.instagram.com/reel/DNPZEJ8TlMC/",
        mediaType: "video",
        hashtags: ["instagram", "test", "external"],
        isPublic: true,
        isExternal: true,
        externalSource: "instagram",
        college: user.college || "Test College",
        analytics: {
          totalViews: 2,
          totalLikes: 1,
          totalComments: 0,
          totalSaves: 0,
          totalShares: 0,
          averageWatchTime: 15,
          engagementRate: 0.5,
          lastUpdated: new Date()
        }
      }
    ]
    
    const savedReels = await Reel.insertMany(testReels)
    console.log("Test reels created:", savedReels.length)
    
    return NextResponse.json({ 
      message: "Test reels created successfully", 
      count: savedReels.length,
      reels: savedReels.map(r => ({ id: r._id, caption: r.caption }))
    })
    
  } catch (error) {
    console.error("Error creating test reels:", error)
    return NextResponse.json({ error: "Failed to create test reels" }, { status: 500 })
  }
}
