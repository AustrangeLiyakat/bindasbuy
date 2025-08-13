import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Conversation, Message } from "@/models/Message"
import { getSession } from "@/lib/auth"

// GET /api/conversations/[id]/messages - Get messages for a conversation
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // Get messages with pagination
    const skip = (page - 1) * limit
    const messages = await Message.find({ conversationId })
      .populate("sender", "name email college avatar")
      .populate("receiver", "name email college avatar")
      .populate("productId", "title price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Message.countDocuments({ conversationId })

    // Format messages
    const formattedMessages = messages.reverse().map((message) => ({
      id: message._id.toString(),
      conversationId: message.conversationId.toString(),
      senderId: message.sender._id.toString(),
      receiverId: message.receiver._id.toString(),
      sender: {
        id: message.sender._id.toString(),
        name: message.sender.name,
        username: message.sender.email.split("@")[0],
        avatar: message.sender.avatar || "/placeholder.svg?height=40&width=40",
      },
      receiver: {
        id: message.receiver._id.toString(),
        name: message.receiver.name,
        username: message.receiver.email.split("@")[0],
        avatar: message.receiver.avatar || "/placeholder.svg?height=40&width=40",
      },
      content: message.content,
      type: message.type,
      productId: message.productId?._id.toString(),
      product: message.productId
        ? {
            id: message.productId._id.toString(),
            title: message.productId.title,
            price: message.productId.price,
            images: message.productId.images,
          }
        : null,
      isRead: message.isRead,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }))

    return NextResponse.json({
      messages: formattedMessages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    })
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// POST /api/conversations/[id]/messages - Send a message
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const conversationId = params.id
    const { content, type = "text", productId } = await request.json()

    if (!content && type === "text") {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId)
    if (!conversation || !conversation.participants.includes(session.userId)) {
      return NextResponse.json({ error: "Conversation not found or access denied" }, { status: 404 })
    }

    // Get the other participant
    const receiverId = conversation.participants.find((id) => id.toString() !== session.userId)

    // Create message
    const message = new Message({
      conversationId,
      sender: session.userId,
      receiver: receiverId,
      content,
      type,
      productId: productId || null,
    })

    await message.save()

    // Update conversation's last message
    conversation.lastMessage = message._id
    conversation.lastMessageAt = new Date()
    await conversation.save()

    // Populate message data for response
    await message.populate("sender", "name email college avatar")
    await message.populate("receiver", "name email college avatar")
    if (productId) {
      await message.populate("productId", "title price images")
    }

    const formattedMessage = {
      id: message._id.toString(),
      conversationId: message.conversationId.toString(),
      senderId: message.sender._id.toString(),
      receiverId: message.receiver._id.toString(),
      sender: {
        id: message.sender._id.toString(),
        name: message.sender.name,
        username: message.sender.email.split("@")[0],
        avatar: message.sender.avatar || "/placeholder.svg?height=40&width=40",
      },
      receiver: {
        id: message.receiver._id.toString(),
        name: message.receiver.name,
        username: message.receiver.email.split("@")[0],
        avatar: message.receiver.avatar || "/placeholder.svg?height=40&width=40",
      },
      content: message.content,
      type: message.type,
      productId: message.productId?._id.toString(),
      product: message.productId
        ? {
            id: message.productId._id.toString(),
            title: message.productId.title,
            price: message.productId.price,
            images: message.productId.images,
          }
        : null,
      isRead: message.isRead,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }

    return NextResponse.json({ message: formattedMessage }, { status: 201 })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
