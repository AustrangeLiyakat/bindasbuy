"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const mockStories = [
  {
    id: "1",
    userName: "Your Story",
    userAvatar: "/placeholder.svg?height=60&width=60",
    isOwn: true,
  },
  {
    id: "2",
    userName: "Sarah",
    userAvatar: "/placeholder.svg?height=60&width=60",
    hasNewStory: true,
  },
  {
    id: "3",
    userName: "Mike",
    userAvatar: "/placeholder.svg?height=60&width=60",
    hasNewStory: true,
  },
  {
    id: "4",
    userName: "Lisa",
    userAvatar: "/placeholder.svg?height=60&width=60",
    hasNewStory: false,
  },
  {
    id: "5",
    userName: "Alex",
    userAvatar: "/placeholder.svg?height=60&width=60",
    hasNewStory: true,
  },
]

export function StoriesBar() {
  return (
    <div className="mb-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 p-1">
          {mockStories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1 cursor-pointer">
              <div
                className={`relative ${
                  story.hasNewStory ? "ring-2 ring-gradient-to-r from-purple-600 to-blue-600 rounded-full p-0.5" : ""
                }`}
              >
                <Avatar className="w-16 h-16">
                  <AvatarImage src={story.userAvatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {story.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {story.isOwn && (
                  <Button
                    size="sm"
                    className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <span className="text-xs text-center max-w-[70px] truncate">{story.userName}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
