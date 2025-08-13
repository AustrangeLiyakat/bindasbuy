import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    if (!user.isVerified) {
      return NextResponse.json({ message: "Please verify your email before logging in" }, { status: 401 })
    }

    // Create session
    await createSession(user._id.toString(), {
      email: user.email,
      fullName: user.name,
      college: user.college,
      role: user.role,
    })

    // Return user data (excluding password)
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

    return NextResponse.json({ user: userResponse })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
