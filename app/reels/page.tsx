"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ReelPlayer } from "@/components/reels/reel-player"
import { mockReels } from "@/lib/reels"
import type { Reel } from "@/types/reels"

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading reels
    setTimeout(() => {
      setReels(mockReels)
      setLoading(false)
    }, 1000)
  }, [])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollTop = container.scrollTop
    const itemHeight = container.clientHeight
    const newIndex = Math.round(scrollTop / itemHeight)

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
      setCurrentIndex(newIndex)
    }
  }

  const handleLike = async (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel,
      ),
    )
  }

  const handleFollow = async (userId: string) => {
    setReels((prev) =>
      prev.map((reel) => (reel.userId === userId ? { ...reel, isFollowing: !reel.isFollowing } : reel)),
    )
  }

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black overflow-hidden">
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reels.map((reel, index) => (
          <div key={reel.id} className="h-screen snap-start">
            <ReelPlayer
              reel={reel}
              isActive={index === currentIndex}
              onLike={() => handleLike(reel.id)}
              onFollow={() => handleFollow(reel.userId)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
