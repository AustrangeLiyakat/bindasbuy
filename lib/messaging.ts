import type { Conversation, Message, User } from "@/types/messaging"

// Mock data for backward compatibility
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Chen",
    username: "alex_chen",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sarah Johnson",
    username: "sarah_sells",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
]

export const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: {
      id: "1",
      conversationId: "1",
      senderId: "2",
      receiverId: "1",
      content: "Is the MacBook still available?",
      type: "text",
      isRead: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    unreadCount: 2,
    isOnline: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
]

export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      conversationId: "1",
      senderId: "1",
      receiverId: "2",
      content: "Hi! I saw your MacBook listing. Is it still available?",
      type: "text",
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

// API functions to replace mock data operations
export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch("/api/conversations")
  if (!response.ok) {
    throw new Error("Failed to fetch conversations")
  }

  const data = await response.json()
  return data.conversations
}

export async function createConversation(participantId: string): Promise<Conversation> {
  const response = await fetch("/api/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ participantId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create conversation")
  }

  const data = await response.json()
  return data.conversation
}

export async function getMessages(
  conversationId: string,
  page = 1,
  limit = 50,
): Promise<{ messages: Message[]; pagination: any }> {
  const response = await fetch(`/api/conversations/${conversationId}/messages?page=${page}&limit=${limit}`)
  if (!response.ok) {
    throw new Error("Failed to fetch messages")
  }

  return response.json()
}

export async function sendMessage(
  conversationId: string,
  content: string,
  type: "text" | "image" | "product" = "text",
  productId?: string,
): Promise<Message> {
  const response = await fetch(`/api/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, type, productId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to send message")
  }

  const data = await response.json()
  return data.message
}

export async function markMessageAsRead(conversationId: string, messageId: string): Promise<void> {
  const response = await fetch(`/api/conversations/${conversationId}/messages/${messageId}/read`, {
    method: "POST",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to mark message as read")
  }
}

export async function markAllMessagesAsRead(conversationId: string): Promise<void> {
  const response = await fetch(`/api/conversations/${conversationId}/messages/mark-all-read`, {
    method: "POST",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to mark messages as read")
  }
}

// Legacy functions for backward compatibility
export function getConversationById(id: string): Promise<Conversation | undefined> {
  return getConversations()
    .then((conversations) => conversations.find((c) => c.id === id))
    .catch(() => undefined)
}

export function getMessagesByConversation(conversationId: string): Promise<Message[]> {
  return getMessages(conversationId)
    .then((data) => data.messages)
    .catch(() => [])
}
