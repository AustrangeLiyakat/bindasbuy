"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Conversation } from "@/types/messaging"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  onConversationSelect: (conversation: Conversation) => void
}

export function ConversationList({ conversations, selectedConversation, onConversationSelect }: ConversationListProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d`
    }
  }

  const getOtherParticipant = (conversation: Conversation) => {
    // In a real app, filter out current user
    return conversation.participants[1] || conversation.participants[0]
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        const otherUser = getOtherParticipant(conversation)
        const isSelected = selectedConversation?.id === conversation.id

        return (
          <div
            key={conversation.id}
            onClick={() => onConversationSelect(conversation)}
            className={cn(
              "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
              isSelected && "bg-purple-50 border-r-2 border-purple-600",
            )}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={otherUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                </Avatar>
                {otherUser.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{otherUser.name}</h3>
                  <div className="flex items-center space-x-2">
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.createdAt)}</span>
                    )}
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-sm truncate",
                      conversation.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-600",
                    )}
                  >
                    {conversation.lastMessage?.type === "product"
                      ? "Shared a product"
                      : conversation.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
