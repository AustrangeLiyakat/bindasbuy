import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Reel from "@/models/Reel"
import User from "@/models/User"

export async function POST() {
  try {
    await connectDB()
    
    // Find the first user in the database
    const user = await User.findOne({})
    if (!user) {
      return NextResponse.json({ error: "No users found. Please create a user first." }, { status: 400 })
    }
    
    console.log("Found user for test reels:", user.name, user._id)
    
    // Delete existing test reels first
    await Reel.deleteMany({ caption: { $regex: /test/i } })
    console.log("Cleared existing test reels")
    
    // Create a simple video reel with a working video URL
    const testReel = new Reel({
      userId: user._id,
      author: user._id,
      caption: "Test video reel! 🎥 This should work with a real video file.",
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      mediaType: "video",
      thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
      duration: 60,
      hashtags: ["test", "video", "sample"],
      isPublic: true,
      isExternal: false,
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
    })
    
    const savedReel = await testReel.save()
    console.log("Created test reel:", savedReel._id)
    
    // Create an Instagram external reel
    const instagramReel = new Reel({
      userId: user._id,
      author: user._id,
      caption: "Instagram Reel Test! 📱 External content from Instagram.",
      mediaUrl: "https://www.instagram.com/reel/DNPZEJ8TlMC/",
      mediaType: "video",
      hashtags: ["instagram", "external", "test"],
      isPublic: true,
      isExternal: true,
      externalSource: "instagram",
      college: user.college || "Test College",
      analytics: {
        totalViews: 5,
        totalLikes: 2,
        totalComments: 1,
        totalSaves: 0,
        totalShares: 1,
        averageWatchTime: 25,
        engagementRate: 0.6,
        lastUpdated: new Date()
      }
    })
    
    const savedInstagramReel = await instagramReel.save()
    console.log("Created Instagram test reel:", savedInstagramReel._id)
    
    return NextResponse.json({ 
      success: true, 
      message: "Test reels created successfully",
      reels: [
        { id: savedReel._id, type: "direct_video", caption: savedReel.caption },
        { id: savedInstagramReel._id, type: "instagram_external", caption: savedInstagramReel.caption }
      ]
    })
    
  } catch (error) {
    console.error("Error creating test reels:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
