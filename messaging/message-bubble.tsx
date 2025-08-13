"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Message } from "@/types/messaging"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const renderProductMessage = () => {
    // Mock product data
    const product = {
      id: "1",
      name: "MacBook Pro 13-inch",
      price: 899,
      image: "/placeholder.svg?height=200&width=200",
    }

    return (
      <Card className="max-w-xs">
        <CardContent className="p-3">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-32 object-cover rounded-md mb-2"
          />
          <h4 className="font-semibold text-sm">{product.name}</h4>
          <p className="text-purple-600 font-bold">${product.price}</p>
          <Button size="sm" className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600">
            View Product
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderImageMessage = () => {
    return (
      <div className="max-w-xs">
        <img src={message.imageUrl || "/placeholder.svg"} alt="Shared image" className="w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className={cn("flex items-end space-x-2", isOwn && "flex-row-reverse space-x-reverse")}>
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col", isOwn && "items-end")}>
        <div
          className={cn(
            "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
            isOwn
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-900",
          )}
        >
          {message.type === "text" && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
          {message.type === "product" && renderProductMessage()}
          {message.type === "image" && renderImageMessage()}
        </div>

        <span className="text-xs text-gray-500 mt-1 px-2">
          {formatTime(message.createdAt)}
          {isOwn && <span className="ml-1">{message.isRead ? "✓✓" : "✓"}</span>}
        </span>
      </div>
    </div>
  )
}
