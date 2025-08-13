"use client"

import { useState, useRef, useEffect } from "react"
import { Heart, MessageCircle, Share, MoreHorizontal, Volume2, VolumeX, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Reel } from "@/types/reels"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ReelPlayerProps {
  reel: Reel
  isActive: boolean
  onLike: () => void
  onFollow: () => void
}

export function ReelPlayer({ reel, isActive, onLike, onFollow }: ReelPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (reel.mediaType !== "video") return

    const video = videoRef.current
    if (!video) return

    const handleVideoPlay = async () => {
      if (isActive) {
        try {
          await video.play()
          setIsPlaying(true)
        } catch (error) {
          if (error instanceof Error && error.name !== "AbortError") {
            console.warn("Video play failed:", error)
          }
          setIsPlaying(false)
        }
      } else {
        video.pause()
        setIsPlaying(false)
      }
    }

    handleVideoPlay()
  }, [isActive, reel.mediaType])

  const togglePlay = async () => {
    if (reel.mediaType !== "video") return

    const video = videoRef.current
    if (!video) return

    try {
      if (isPlaying) {
        video.pause()
        setIsPlaying(false)
      } else {
        await video.play()
        setIsPlaying(true)
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.warn("Video toggle failed:", error)
      }
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <div className="relative h-full w-full bg-black">
      {reel.mediaType === "video" ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          loop
          muted={isMuted}
          playsInline
          poster={reel.thumbnailUrl}
          onClick={togglePlay}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <source src={reel.mediaUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          className="h-full w-full relative cursor-pointer"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <Image
            src={reel.mediaUrl || "/placeholder.svg"}
            alt={reel.caption}
            fill
            className="object-cover"
            priority={isActive}
          />
        </div>
      )}

      {reel.mediaType === "video" && showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 rounded-full p-4">
            {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white" />}
          </div>
        </div>
      )}

      {reel.mediaType === "video" && (
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>
      )}

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-end justify-between">
          {/* Left Content */}
          <div className="flex-1 mr-4">
            {/* User Info */}
            <div className="flex items-center mb-3">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={reel.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{reel.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <span className="text-white font-semibold mr-2">{reel.user.username}</span>
                {reel.user.isVerified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                {!reel.isFollowing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-black bg-transparent"
                    onClick={onFollow}
                  >
                    Follow
                  </Button>
                )}
              </div>
            </div>

            {/* Caption */}
            <p className="text-white text-sm mb-2 line-clamp-2">{reel.caption}</p>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {reel.hashtags.map((tag) => (
                <span key={tag} className="text-blue-400 text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            {reel.music && (
              <div className="flex items-center text-white text-xs">
                <span className="mr-2">🎵</span>
                <span className="truncate">
                  {reel.music.name} - {reel.music.artist}
                </span>
              </div>
            )}

            <div className="flex items-center text-white/70 text-xs mt-1">
              <span className="bg-white/20 px-2 py-1 rounded-full">
                {reel.mediaType === "video" ? "📹 Video" : "📷 Photo"}
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex flex-col items-center space-y-4">
            {/* Like */}
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className={cn("text-white hover:bg-white/20 h-12 w-12", reel.isLiked && "text-red-500")}
                onClick={onLike}
              >
                <Heart className={cn("h-7 w-7", reel.isLiked && "fill-current")} />
              </Button>
              <span className="text-white text-xs font-medium">{formatNumber(reel.likes)}</span>
            </div>

            {/* Comment */}
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-12 w-12">
                <MessageCircle className="h-7 w-7" />
              </Button>
              <span className="text-white text-xs font-medium">{formatNumber(reel.comments)}</span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-12 w-12">
                <Share className="h-7 w-7" />
              </Button>
              <span className="text-white text-xs font-medium">{formatNumber(reel.shares)}</span>
            </div>

            {/* More */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-12 w-12">
              <MoreHorizontal className="h-7 w-7" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
