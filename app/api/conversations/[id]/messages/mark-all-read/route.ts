import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Conversation, Message } from "@/models/Message"
import { getSession } from "@/lib/auth"

// POST /api/conversations/[id]/messages/mark-all-read - Mark all messages as read
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const conversationId = params.id

    // Verify user is participant in conversation
    const conversation = await Conversation.findById(conversationId)
    if (!conversation || !conversation.participants.includes(session.userId)) {
      return NextResponse.json({ error: "Conversation not found or access denied" }, { status: 404 })
    }

    // Mark all unread messages from other participants as read
    await Message.updateMany(
      {
        conversationId,
        receiver: session.userId,
        isRead: false,
      },
      { isRead: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Mark all messages as read error:", error)
    return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 })
  }
}
