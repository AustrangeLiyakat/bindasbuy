import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Conversation, Message } from "@/models/Message"
import { getSession } from "@/lib/auth"

// GET /api/conversations - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const conversations = await Conversation.find({
      participants: session.userId,
    })
      .populate("participants", "name email college avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 })
      .lean()

    // Format conversations with unread count and participant info
    const formattedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        // Get unread messages count
        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          receiver: session.userId,
          isRead: false,
        })

        // Get the other participant (not current user)
        const otherParticipant = conversation.participants.find((p: any) => p._id.toString() !== session.userId)

        return {
          id: conversation._id.toString(),
          participants: conversation.participants.map((p: any) => ({
            id: p._id.toString(),
            name: p.name,
            username: p.email.split("@")[0],
            avatar: p.avatar || "/placeholder.svg?height=40&width=40",
            isOnline: false, // TODO: Implement real-time online status
            lastSeen: new Date().toISOString(),
          })),
          otherParticipant: otherParticipant
            ? {
                id: otherParticipant._id.toString(),
                name: otherParticipant.name,
                username: otherParticipant.email.split("@")[0],
                avatar: otherParticipant.avatar || "/placeholder.svg?height=40&width=40",
                isOnline: false,
                lastSeen: new Date().toISOString(),
              }
            : null,
          lastMessage: conversation.lastMessage
            ? {
                id: conversation.lastMessage._id.toString(),
                conversationId: conversation._id.toString(),
                senderId: conversation.lastMessage.sender.toString(),
                receiverId: conversation.lastMessage.receiver.toString(),
                content: conversation.lastMessage.content,
                type: conversation.lastMessage.type,
                productId: conversation.lastMessage.productId?.toString(),
                isRead: conversation.lastMessage.isRead,
                createdAt: conversation.lastMessage.createdAt,
                updatedAt: conversation.lastMessage.updatedAt,
              }
            : null,
          unreadCount,
          isOnline: false,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
        }
      }),
    )

    return NextResponse.json({ conversations: formattedConversations })
  } catch (error) {
    console.error("Get conversations error:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}

// POST /api/conversations - Create or get existing conversation
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { participantId } = await request.json()

    if (!participantId) {
      return NextResponse.json({ error: "Participant ID is required" }, { status: 400 })
    }

    if (participantId === session.userId) {
      return NextResponse.json({ error: "Cannot create conversation with yourself" }, { status: 400 })
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [session.userId, participantId] },
    })
      .populate("participants", "name email college avatar")
      .populate("lastMessage")

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [session.userId, participantId],
      })
      await conversation.save()
      await conversation.populate("participants", "name email college avatar")
    }

    // Format response
    const otherParticipant = conversation.participants.find((p: any) => p._id.toString() !== session.userId)

    const formattedConversation = {
      id: conversation._id.toString(),
      participants: conversation.participants.map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        username: p.email.split("@")[0],
        avatar: p.avatar || "/placeholder.svg?height=40&width=40",
        isOnline: false,
        lastSeen: new Date().toISOString(),
      })),
      otherParticipant: otherParticipant
        ? {
            id: otherParticipant._id.toString(),
            name: otherParticipant.name,
            username: otherParticipant.email.split("@")[0],
            avatar: otherParticipant.avatar || "/placeholder.svg?height=40&width=40",
            isOnline: false,
            lastSeen: new Date().toISOString(),
          }
        : null,
      lastMessage: null,
      unreadCount: 0,
      isOnline: false,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    }

    return NextResponse.json({ conversation: formattedConversation }, { status: 201 })
  } catch (error) {
    console.error("Create conversation error:", error)
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}
