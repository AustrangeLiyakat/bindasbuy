import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  console.log("🚀 Signup API called")
  try {
    console.log("📝 Connecting to database...")
    await connectDB()
    console.log("✅ Database connected")

    const data = await request.json()
    console.log("📥 Request data:", { ...data, password: "***hidden***" })
    const { email, password, fullName, college, studentId, department, phone, role = "student" } = data

    // Validate input
    console.log("🔍 Validating input...")
    if (!email || !password || !fullName || !college || !studentId || !department || !phone) {
      console.log("❌ Missing required fields")
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }
    console.log("✅ Input validation passed")

    // Validate college email (relaxed for testing)
    // if (!email.includes(".edu") && !email.includes(".ac.in")) {
    //   return NextResponse.json({ message: "Please use a valid college email address" }, { status: 400 })
    // }

    // Validate password strength
    if (password.length < 6) {
      console.log("❌ Password too short")
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }
    console.log("✅ Password validation passed")

    // Check if user already exists
    console.log("🔍 Checking for existing user...")
    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }],
    })

    if (existingUser) {
      console.log("❌ User already exists")
      return NextResponse.json({ message: "User with this email or student ID already exists" }, { status: 409 })
    }
    console.log("✅ No existing user found")

    // Hash password
    console.log("🔐 Hashing password...")
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    console.log("✅ Password hashed")

    // Create new user
    console.log("👤 Creating new user...")
    const newUser = new User({
      name: fullName,
      email,
      password: hashedPassword,
      college,
      studentId,
      phone,
      role,
      isVerified: true, // For demo purposes, auto-verify
      bio: `${role === "seller" ? "Seller" : "Student"} at ${college}`,
    })

    console.log("💾 Saving user to database...")
    await newUser.save()
    console.log("✅ User saved successfully")

    // Create session
    console.log("🍪 Creating session...")
    await createSession(newUser._id.toString(), {
      email: newUser.email,
      fullName: newUser.name,
      college: newUser.college,
      role: newUser.role,
    })
    console.log("✅ Session created")

    // Return user data (excluding password)
    console.log("📤 Sending response...")
    const userResponse = {
      id: newUser._id.toString(),
      email: newUser.email,
      fullName: newUser.name,
      college: newUser.college,
      studentId: newUser.studentId,
      phone: newUser.phone,
      role: newUser.role,
      isVerified: newUser.isVerified,
      bio: newUser.bio,
      avatar: newUser.avatar,
      followers: newUser.followers.length,
      following: newUser.following.length,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    }

    return NextResponse.json({
      user: userResponse,
      message: "Account created successfully!",
    })
  } catch (error) {
    console.error("❌ Signup error:", error)

    // Handle MongoDB duplicate key error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
