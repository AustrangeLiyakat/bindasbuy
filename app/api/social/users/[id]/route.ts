import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import Post from "@/models/Post"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const user = await User.findById(params.id).select("-password").lean()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's posts count
    const postsCount = await Post.countDocuments({ author: params.id })

    // Check if current user is following this user
    const session = await getSession()
    let isFollowing = false
    if (session && session.userId !== params.id) {
      const currentUser = await User.findById(session.userId)
      isFollowing = currentUser?.following.includes(params.id) || false
    }

    const userProfile = {
      id: user._id.toString(),
      fullName: user.name,
      userName: user.email.split("@")[0],
      email: user.email,
      college: user.college,
      bio: user.bio,
      avatar: user.avatar || "/placeholder.svg?height=100&width=100",
      followers: user.followers.length,
      following: user.following.length,
      postsCount,
      isFollowing,
      isVerified: user.isVerified,
      role: user.role,
      joinedAt: user.createdAt,
    }

    return NextResponse.json({ user: userProfile })
  } catch (error) {
    console.error("Get user profile error:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}
