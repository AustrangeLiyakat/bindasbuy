export interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  conversationId: string
  type: "text" | "image" | "file"
  isRead: boolean
  createdAt: Date
}

export interface Conversation {
  id: string
  participants: string[]
  participantNames: string[]
  participantAvatars: string[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: Date
}
