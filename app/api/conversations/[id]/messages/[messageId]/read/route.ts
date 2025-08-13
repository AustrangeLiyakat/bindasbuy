import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Message } from "@/models/Message"
import { getSession } from "@/lib/auth"

// POST /api/conversations/[id]/messages/[messageId]/read - Mark message as read
export async function POST(request: NextRequest, { params }: { params: { id: string; messageId: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { messageId } = params

    // Find and update message
    const message = await Message.findById(messageId)
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Only the receiver can mark message as read
    if (message.receiver.toString() !== session.userId) {
      return NextResponse.json({ error: "Not authorized to mark this message as read" }, { status: 403 })
    }

    message.isRead = true
    await message.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Mark message as read error:", error)
    return NextResponse.json({ error: "Failed to mark message as read" }, { status: 500 })
  }
}
