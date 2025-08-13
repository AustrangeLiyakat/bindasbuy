"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatWindow } from "@/components/messaging/chat-window"
import { mockConversations } from "@/lib/messaging"
import type { Conversation } from "@/types/messaging"

interface ConversationPageProps {
  params: {
    conversationId: string
  }
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Find conversation by ID
    const found = mockConversations.find((conv) => conv.id === params.conversationId)
    setConversation(found || null)
    setLoading(false)
  }, [params.conversationId])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold mb-2">Conversation not found</h1>
        <Button onClick={() => router.push("/messages")}>Back to Messages</Button>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col md:hidden">
      {/* Mobile Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/messages")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold">{conversation.participants[1]?.name || conversation.participants[0]?.name}</h1>
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow conversation={conversation} />
      </div>
    </div>
  )
}
