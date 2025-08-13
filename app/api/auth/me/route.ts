import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Fetch full user data from database
    const user = await User.findById(session.userId).select("-password")

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Return user data
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      fullName: user.name,
      college: user.college,
      studentId: user.studentId,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      bio: user.bio,
      avatar: user.avatar,
      followers: user.followers.length,
      following: user.following.length,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json(userResponse)
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
