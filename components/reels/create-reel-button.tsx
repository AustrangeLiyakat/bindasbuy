"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Video } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateReelButtonProps {
  variant?: "floating" | "compact" | "full"
  className?: string
  showLabel?: boolean
}

export function CreateReelButton({ 
  variant = "floating", 
  className,
  showLabel = false 
}: CreateReelButtonProps) {
  const buttonContent = (
    <>
      {variant === "full" ? <Video className="h-4 w-4 mr-2" /> : <Plus className="h-5 w-5" />}
      {(variant === "full" || showLabel) && "Create Reel"}
    </>
  )

  if (variant === "floating") {
    return (
      <Link href="/reels/create">
        <Button 
          size="lg"
          className={cn(
            "fixed bottom-20 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 z-40",
            className
          )}
          title="Create Reel"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    )
  }

  if (variant === "compact") {
    return (
      <Link href="/reels/create">
        <Button 
          variant="outline"
          size="sm"
          className={cn(
            "bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 hover:from-pink-100 hover:to-purple-100",
            className
          )}
        >
          {buttonContent}
        </Button>
      </Link>
    )
  }

  return (
    <Link href="/reels/create">
      <Button 
        className={cn(
          "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
          className
        )}
      >
        {buttonContent}
      </Button>
    </Link>
  )
}
