"use client"

import { useState, useRef, useEffect } from "react"
import { Heart, MessageCircle, Share, MoreHorizontal, Volume2, VolumeX, Play, Pause, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Reel } from "@/types/reels"
import { cn } from "@/lib/utils"
import { processVideoUrl, getPlatformFromUrl, getVideoThumbnail } from "@/lib/video-utils"
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
  const [showControls, setShowControls] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const [embedError, setEmbedError] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [videoAspectRatio, setVideoAspectRatio] = useState<'portrait' | 'landscape' | 'square'>('portrait')
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Determine if this is external content
  const isExternalContent = reel.isExternal || 
    (reel.mediaUrl.includes('instagram.com') || 
     reel.mediaUrl.includes('tiktok.com') || 
     reel.mediaUrl.includes('youtube.com')) && !reel.mediaUrl.startsWith('/uploads/')

  // Determine if this is a local uploaded file
  const isLocalFile = reel.mediaUrl.startsWith('/uploads/') || reel.mediaUrl.startsWith('./uploads/') || !reel.isExternal

  console.log("ReelPlayer rendered with reel:", {
    id: reel.id,
    mediaUrl: reel.mediaUrl,
    mediaType: reel.mediaType,
    isExternal: reel.isExternal,
    isExternalContent,
    isLocalFile,
    timestamp: new Date().getTime()
  })

  useEffect(() => {
    if (reel.mediaType !== "video") return

    const video = videoRef.current
    if (!video) return

    console.log("Video effect running:", {
      isActive,
      videoSrc: video.src,
      isExternal: isExternalContent
    })

    // Detect video aspect ratio when loaded
    const handleVideoLoad = () => {
      if (video.videoWidth && video.videoHeight) {
        const aspectRatio = video.videoWidth / video.videoHeight
        if (aspectRatio > 1.2) {
          setVideoAspectRatio('landscape')
        } else if (aspectRatio < 0.8) {
          setVideoAspectRatio('portrait')
        } else {
          setVideoAspectRatio('square')
        }
        console.log("Video aspect ratio detected:", aspectRatio, videoAspectRatio)
      }
    }

    video.addEventListener('loadedmetadata', handleVideoLoad)

    const handleVideoPlay = async () => {
      if (isActive) {
        try {
          // Ensure audio is enabled for active video
          video.muted = false
          setIsMuted(false)
          
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

    return () => {
      video.removeEventListener('loadedmetadata', handleVideoLoad)
    }
  }, [isActive, reel.mediaType, reel.mediaUrl, isExternalContent, videoAspectRatio])

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls && !isInteracting) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, isInteracting])

  const handleInteractionStart = () => {
    setIsInteracting(true)
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
  }

  const handleInteractionEnd = () => {
    setIsInteracting(false)
    // Controls will auto-hide after timeout
  }

  const togglePlay = async () => {
    if (reel.mediaType !== "video") return

    const video = videoRef.current
    const iframe = iframeRef.current
    
    if (video) {
      // Handle direct video
      try {
        if (isPlaying) {
          video.pause()
          setIsPlaying(false)
        } else {
          video.muted = false // Ensure audio is enabled
          setIsMuted(false)
          await video.play()
          setIsPlaying(true)
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.warn("Video toggle failed:", error)
        }
        setIsPlaying(false)
      }
    } else if (iframe && isExternalContent) {
      // For embedded videos, we can't directly control playback
      // But we can track user intent and show visual feedback
      setIsPlaying(!isPlaying)
      handleInteractionStart()
      
      // Try to send play/pause message to iframe (works for some platforms)
      try {
        const getTargetOrigin = (url: string) => {
          if (url.includes('youtube.com') || url.includes('youtu.be')) return 'https://www.youtube.com'
          if (url.includes('instagram.com')) return 'https://www.instagram.com'
          if (url.includes('tiktok.com')) return 'https://www.tiktok.com'
          return 'https://www.youtube.com' // Default to YouTube for safety
        }
        
        iframe.contentWindow?.postMessage(
          isPlaying ? '{"event":"command","func":"pauseVideo","args":""}' : '{"event":"command","func":"playVideo","args":""}',
          getTargetOrigin(reel.mediaUrl)
        )
      } catch (error) {
        console.log("Could not control embedded video:", error)
      }
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    const iframe = iframeRef.current
    
    if (video) {
      video.muted = !isMuted
      setIsMuted(!isMuted)
    } else if (iframe && isExternalContent) {
      // For embedded videos, track mute state and try to send message
      setIsMuted(!isMuted)
      try {
        const getTargetOrigin = (url: string) => {
          if (url.includes('youtube.com') || url.includes('youtu.be')) return 'https://www.youtube.com'
          if (url.includes('instagram.com')) return 'https://www.instagram.com'
          if (url.includes('tiktok.com')) return 'https://www.tiktok.com'
          return 'https://www.youtube.com' // Default to YouTube for safety
        }
        
        iframe.contentWindow?.postMessage(
          isMuted ? '{"event":"command","func":"unMute","args":""}' : '{"event":"command","func":"mute","args":""}',
          getTargetOrigin(reel.mediaUrl)
        )
      } catch (error) {
        console.log("Could not control embedded video audio:", error)
      }
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

  // Get appropriate video CSS class based on aspect ratio
  const getVideoClassName = () => {
    const baseClasses = "reel-video h-full w-full rounded-lg"
    switch (videoAspectRatio) {
      case 'landscape':
        return `${baseClasses} reel-video-landscape object-contain`
      case 'square':
        return `${baseClasses} reel-video-square object-cover`
      case 'portrait':
      default:
        return `${baseClasses} reel-video-portrait object-cover`
    }
  }
  const getEmbeddableUrl = (url: string) => {
    return processVideoUrl(url, reel.externalSource)
  }

  // Get platform-specific thumbnail if not provided
  const getEffectiveThumbnail = () => {
    if (reel.thumbnailUrl) return reel.thumbnailUrl
    if (isExternalContent) {
      const autoThumbnail = getVideoThumbnail(reel.mediaUrl)
      if (autoThumbnail) return autoThumbnail
    }
    return undefined
  }

  const renderMedia = () => {
    if (reel.mediaType === "video") {
      // Prioritize local files for direct video playback
      if (isLocalFile || !isExternalContent) {
        return (
          <video
            ref={videoRef}
            className={getVideoClassName()}
            loop
            muted={false} // Start with audio enabled
            playsInline
            autoPlay={isActive}
            poster={getEffectiveThumbnail()}
            onClick={togglePlay}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onError={() => {
              console.log("Local video failed, trying as external")
              setVideoError(true)
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedData={() => {
              console.log("Local video loaded successfully")
              setVideoError(false)
            }}
          >
            <source src={reel.mediaUrl} type="video/mp4" />
            <source src={reel.mediaUrl} type="video/webm" />
            <source src={reel.mediaUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        )
      }
      
      // Handle external content with embedding
      if (isExternalContent) {
        const embeddableUrl = getEmbeddableUrl(reel.mediaUrl)
        
        // Try to embed the video
        if (embeddableUrl !== reel.mediaUrl && !embedError) {
          return (
            <div className="h-full w-full relative">
              <iframe
                ref={iframeRef}
                src={embeddableUrl + "&autoplay=1&mute=0"} // Enable autoplay with audio
                className="h-full w-full object-cover rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onError={() => {
                  console.log("Embed failed, trying direct video")
                  setEmbedError(true)
                }}
                onLoad={() => {
                  console.log("Embed loaded successfully")
                  setIsPlaying(true) // Assume it's playing since autoplay is enabled
                }}
              />
              {/* Overlay for consistent interaction */}
              <div 
                className="absolute inset-0 bg-transparent cursor-pointer"
                onClick={togglePlay}
                onMouseEnter={handleInteractionStart}
                onMouseLeave={handleInteractionEnd}
                onTouchStart={handleInteractionStart}
                onTouchEnd={handleInteractionEnd}
              />
              
              {/* Custom controls for embedded content */}
              {showControls && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 rounded-full p-4 pointer-events-auto cursor-pointer" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white" />}
                  </div>
                </div>
              )}
            </div>
          )
        } else {
          // Try to play as direct video or show fallback
          if (embedError || embeddableUrl === reel.mediaUrl) {
            // If embed failed or no embed URL available, try direct video
            return (
              <div className="h-full w-full relative">
                <video
                  ref={videoRef}
                  className={getVideoClassName()}
                  loop
                  muted={false} // Start with audio enabled
                  playsInline
                  autoPlay={isActive}
                  poster={getEffectiveThumbnail()}
                  onClick={togglePlay}
                  onMouseEnter={handleInteractionStart}
                  onMouseLeave={handleInteractionEnd}
                  onTouchStart={handleInteractionStart}
                  onTouchEnd={handleInteractionEnd}
                  onError={() => {
                    console.log("Direct video also failed")
                    setVideoError(true)
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  crossOrigin="anonymous"
                >
                  <source src={reel.mediaUrl} type="video/mp4" />
                  <source src={reel.mediaUrl} type="video/webm" />
                  <source src={reel.mediaUrl} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Fallback content if video fails */}
                {videoError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-blue-900/90 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="bg-white/20 rounded-full p-6 mb-4 mx-auto w-24 h-24 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-white text-lg font-bold mb-2">Video Content</h3>
                      <p className="text-white/80 text-sm mb-4">Tap to view on original platform</p>
                      <Button
                        onClick={() => window.open(reel.mediaUrl, '_blank')}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Original
                      </Button>
                      <div className="mt-4 text-xs text-white/60">
                        {reel.externalSource?.toUpperCase() || 'EXTERNAL'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          }
        }
      }
    } else {
      // Handle images
      return (
        <div
          className="h-full w-full relative cursor-pointer"
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
        >
          <Image
            src={reel.mediaUrl || "/placeholder.svg"}
            alt={reel.caption}
            fill
            className="object-cover rounded-lg"
            priority={isActive}
          />
        </div>
      )
    }
  }

  return (
    <div className="relative h-full w-full bg-black rounded-lg overflow-hidden">
      {renderMedia()}

      {/* Video Error State - Show for all video types */}
      {videoError && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="mb-2">Video could not be loaded</p>
            <p className="text-sm text-gray-400 break-all px-4">{reel.mediaUrl}</p>
            {isExternalContent && (
              <Button
                onClick={() => window.open(reel.mediaUrl, '_blank')}
                className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Original
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Video Controls Overlay - Show for all videos */}
      {reel.mediaType === "video" && showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div 
            className="bg-black/50 rounded-full p-4 pointer-events-auto cursor-pointer transition-opacity duration-300"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white" />}
          </div>
        </div>
      )}

      {/* Mute Button - Show for all videos */}
      {reel.mediaType === "video" && (
        <div className="absolute top-4 right-4 z-30">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-white hover:bg-white/20 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-70'}`} 
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>
      )}

      {/* Tap to show controls indicator */}
      {reel.mediaType === "video" && !showControls && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-auto cursor-pointer"
          onClick={() => {
            handleInteractionStart()
            setTimeout(handleInteractionEnd, 100) // Brief touch to show controls
          }}
        >
          <div className="text-white/50 text-center">
            <Play className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm">Tap to control</p>
          </div>
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
                <AvatarImage src={reel.userAvatar || "/placeholder.svg"} />
                <AvatarFallback>{reel.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <span className="text-white font-semibold mr-2">{reel.userName}</span>
                {reel.user?.isVerified && (
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
              {reel.hashtags?.map((tag, index) => (
                <span key={index} className="text-blue-400 text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Music */}
            {reel.music && (
              <div className="flex items-center text-white text-xs">
                <span className="mr-2">🎵</span>
                <span className="truncate">
                  {reel.music.title} - {reel.music.artist}
                </span>
              </div>
            )}

            {/* Content Type Badge */}
            <div className="flex items-center text-white/70 text-xs mt-1">
              <span className="bg-white/20 px-2 py-1 rounded-full">
                {isLocalFile ? `📱 ${reel.mediaType === "video" ? "Uploaded Video" : "Uploaded Photo"}` :
                 isExternalContent ? `🌐 ${reel.externalSource?.toUpperCase() || 'External'}` : 
                 reel.mediaType === "video" ? "📹 Video" : "📷 Photo"}
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
                className={cn(
                  "text-white hover:bg-white/20 transition-colors",
                  reel.isLiked && "text-red-500"
                )}
                onClick={onLike}
              >
                <Heart className={cn("h-6 w-6", reel.isLiked && "fill-current")} />
              </Button>
              <span className="text-white text-xs">{formatNumber(reel.likes)}</span>
            </div>

            {/* Comment */}
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <MessageCircle className="h-6 w-6" />
              </Button>
              <span className="text-white text-xs">{formatNumber(reel.comments)}</span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Share className="h-6 w-6" />
              </Button>
              <span className="text-white text-xs">{formatNumber(reel.shares)}</span>
            </div>

            {/* More */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <MoreHorizontal className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
