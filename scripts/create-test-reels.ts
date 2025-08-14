import connectDB from "@/lib/mongodb"
import Reel from "@/models/Reel"
import User from "@/models/User"

export async function createTestReel() {
  try {
    await connectDB()
    
    // First, let's find an existing user or create one
    let user = await User.findOne({})
    if (!user) {
      console.log("No users found, please create a user first")
      return null
    }
    
    console.log("Found user:", user.name, user._id)
    
    // Create a test reel with an external video URL
    const testReel = new Reel({
      userId: user._id,
      author: user._id,
      caption: "Test reel with external video content! 🎥✨ This is a sample reel to test the video display functionality.",
      mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Sample video URL
      mediaType: "video",
      thumbnailUrl: "https://sample-videos.com/zip/10/jpg/SampleJPGImage_1280x720_1mb.jpg",
      duration: 30,
      hashtags: ["test", "sample", "video", "campus"],
      music: {
        title: "Sample Track",
        artist: "Test Artist",
        url: "https://example.com/music.mp3"
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
    })
    
    const savedReel = await testReel.save()
    console.log("Test reel created:", savedReel._id)
    return savedReel
    
  } catch (error) {
    console.error("Error creating test reel:", error)
    return null
  }
}

// Also create one with the Instagram URL you mentioned
export async function createInstagramTestReel() {
  try {
    await connectDB()
    
    let user = await User.findOne({})
    if (!user) {
      console.log("No users found, please create a user first")
      return null
    }
    
    const instagramReel = new Reel({
      userId: user._id,
      author: user._id,
      caption: "Instagram reel integration test! 📱✨ Testing external content from Instagram.",
      mediaUrl: "https://www.instagram.com/reel/DNPZEJ8TlMC/", // The Instagram URL you mentioned
      mediaType: "video",
      hashtags: ["instagram", "external", "test"],
      isPublic: true,
      isExternal: true,
      externalSource: "instagram",
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
    
    const savedReel = await instagramReel.save()
    console.log("Instagram test reel created:", savedReel._id)
    return savedReel
    
  } catch (error) {
    console.error("Error creating Instagram test reel:", error)
    return null
  }
}
