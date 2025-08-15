"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ReelPlayer } from "@/components/reels/reel-player"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { Reel } from "@/types/reels"

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchReels()
  }, [])

  const fetchReels = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch("/api/reels?limit=20")
      if (!response.ok) {
        throw new Error("Failed to fetch reels")
      }
      
      const data = await response.json()
      console.log("Fetched reels data:", data) // Debug log
      console.log("Number of reels:", data.reels?.length || 0)
      
      if (data.reels && data.reels.length > 0) {
        // Add computed user field for compatibility
        const formattedReels = data.reels.map((reel: any) => {
          console.log("Processing reel:", {
            id: reel.id,
            mediaUrl: reel.mediaUrl,
            mediaType: reel.mediaType,
            isExternal: reel.isExternal,
            caption: reel.caption?.substring(0, 30)
          })
          
          return {
            ...reel,
            user: {
              name: reel.userName,
              username: reel.userName,
              avatar: reel.userAvatar,
              isVerified: false
            },
            hashtags: reel.hashtags || []
          }
        })
        console.log("Final formatted reels:", formattedReels.length)
        setReels(formattedReels)
      } else {
        console.log("No reels in response or empty array")
        setError("No reels found. Try uploading some content!")
      }
    } catch (error) {
      console.error("Error fetching reels:", error)
      setError("Failed to load reels. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading reels...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">{error}</p>
          <button 
            onClick={fetchReels}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (reels.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">No reels found</p>
          <p className="text-gray-400 mb-4">Be the first to share something amazing!</p>
          <a 
            href="/reels/create"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg inline-block"
          >
            Create Reel
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reels.map((reel, index) => (
          <div key={reel.id} className="h-screen snap-start flex items-center justify-center p-2 sm:p-4">
            {/* Container with proper aspect ratio - responsive */}
            <div className="reel-container bg-black rounded-lg overflow-hidden shadow-2xl">
              <ReelPlayer
                reel={reel}
                isActive={index === currentIndex}
                onLike={() => handleLike(reel.id)}
                onFollow={() => handleFollow(reel.userId)}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Floating Action Button for Create Reel */}
      <Link href="/reels/create">
        <Button 
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}
