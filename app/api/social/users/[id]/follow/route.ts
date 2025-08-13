import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const targetUserId = params.id
    const currentUserId = session.userId

    if (targetUserId === currentUserId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    const [currentUser, targetUser] = await Promise.all([User.findById(currentUserId), User.findById(targetUserId)])

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isFollowing = currentUser.following.includes(targetUserId)

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUserId)
      targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId)
    } else {
      // Follow
      currentUser.following.push(targetUserId)
      targetUser.followers.push(currentUserId)
    }

    await Promise.all([currentUser.save(), targetUser.save()])

    return NextResponse.json({
      success: true,
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
    })
  } catch (error) {
    console.error("Toggle follow error:", error)
    return NextResponse.json({ error: "Failed to toggle follow" }, { status: 500 })
  }
}
