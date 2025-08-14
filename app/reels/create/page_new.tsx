"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Camera, Upload, X, Music, Sparkles, Type, Sticker, ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

type MediaType = "video" | "image"

export default function CreateReelPage() {
  const [step, setStep] = useState<"choose" | "upload" | "edit" | "publish">("choose")
  const [uploadType, setUploadType] = useState<"file" | "external">("file")
  const [mediaType, setMediaType] = useState<MediaType>("video")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [mediaUrl, setMediaUrl] = useState<string>("")
  const [externalUrl, setExternalUrl] = useState<string>("")
  const [caption, setCaption] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [musicName, setMusicName] = useState("")
  const [musicArtist, setMusicArtist] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  const handleMediaTypeSelect = (type: MediaType) => {
    setMediaType(type)
    setStep("upload")
  }

  const handleUploadTypeSelect = (type: "file" | "external") => {
    setUploadType(type)
    if (type === "file") {
      fileInputRef.current?.click()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setMediaUrl(url)
      setStep("edit")
    }
  }

  const handleExternalUrlSubmit = () => {
    if (externalUrl.trim()) {
      setStep("edit")
    } else {
      alert("Please enter a valid URL")
    }
  }

  const handlePublish = async () => {
    if (!mediaUrl && !externalUrl) return
    
    setIsUploading(true)
    
    try {
      let response
      
      if (uploadType === "external") {
        // Handle external URL upload
        response = await fetch("/api/reels/external", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            externalUrl,
            caption,
            hashtags: hashtags.split(",").map(tag => tag.trim()).filter(Boolean),
            musicName: musicName || undefined,
            musicArtist: musicArtist || undefined,
          }),
        })
      } else {
        // Handle file upload
        const formData = new FormData()
        if (selectedFile) {
          formData.append("file", selectedFile)
          formData.append("type", mediaType)
          formData.append("caption", caption)
          formData.append("hashtags", JSON.stringify(hashtags.split(",").map(tag => tag.trim()).filter(Boolean)))
          if (musicName) formData.append("musicName", musicName)
          if (musicArtist) formData.append("musicArtist", musicArtist)
        }
        
        response = await fetch("/api/reels/upload", {
          method: "POST",
          body: formData,
        })
      }
      
      if (response.ok) {
        router.push("/reels")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to publish reel")
      }
    } catch (error) {
      console.error("Publish error:", error)
      alert("Failed to publish reel")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <X className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold">Create Reel</h1>
        <div />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={mediaType === "video" ? "video/*" : "image/*"}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Choose Media Type Step */}
      {step === "choose" && (
        <div className="p-6 max-w-md mx-auto">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Create Your Reel</h2>
              <p className="text-gray-400">Choose what type of content you want to share</p>
            </div>

            <div className="space-y-4">
              <Card 
                className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/20 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleMediaTypeSelect("video")}
              >
                <CardContent className="p-6 text-center">
                  <Video className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                  <h3 className="font-semibold text-lg mb-2">Video Reel</h3>
                  <p className="text-sm text-gray-400">Share your moments with video</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/20 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleMediaTypeSelect("image")}
              >
                <CardContent className="p-6 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                  <h3 className="font-semibold text-lg mb-2">Photo Reel</h3>
                  <p className="text-sm text-gray-400">Share your best photos</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Upload Step */}
      {step === "upload" && (
        <div className="p-6 max-w-md mx-auto">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Add Your {mediaType === "video" ? "Video" : "Photo"}
              </h2>
              <p className="text-gray-400">Choose how you want to add your content</p>
            </div>

            <div className="space-y-4">
              {/* File Upload Option */}
              <Card 
                className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => handleUploadTypeSelect("file")}
              >
                <CardContent className="p-6 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-blue-400" />
                  <h3 className="font-medium mb-2">Upload from Device</h3>
                  <p className="text-sm text-gray-400">
                    Choose a {mediaType} from your device
                  </p>
                </CardContent>
              </Card>

              {/* External URL Option */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Sparkles className="h-10 w-10 mx-auto mb-3 text-purple-400" />
                    <h3 className="font-medium mb-2">Add External Content</h3>
                    <p className="text-sm text-gray-400">
                      Paste a link to Instagram, TikTok, or YouTube content
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      placeholder="https://www.instagram.com/reel/..."
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                    <Button 
                      onClick={() => {
                        setUploadType("external")
                        handleExternalUrlSubmit()
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={!externalUrl.trim()}
                    >
                      Add External Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button 
              variant="ghost" 
              onClick={() => setStep("choose")}
              className="w-full"
            >
              Back
            </Button>
          </div>
        </div>
      )}

      {/* Edit Step */}
      {step === "edit" && (mediaUrl || externalUrl) && (
        <div className="h-[calc(100vh-80px)] flex">
          {/* Media Preview */}
          <div className="flex-1 bg-black flex items-center justify-center">
            <div className="relative max-w-sm w-full aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden">
              {uploadType === "external" ? (
                <div className="w-full h-full flex items-center justify-center text-white p-4">
                  <div className="text-center">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-400" />
                    <p className="text-lg font-medium mb-2">External Content</p>
                    <p className="text-sm text-gray-400 break-all">{externalUrl}</p>
                  </div>
                </div>
              ) : mediaType === "video" ? (
                <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" controls loop />
              ) : (
                <Image src={mediaUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              )}
            </div>
          </div>

          {/* Edit Tools */}
          <div className="w-80 bg-gray-900 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Caption */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-white">Caption</h3>
                  <Textarea
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white resize-none"
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Hashtags */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-white">Hashtags</h3>
                  <Input
                    placeholder="college, student, campus..."
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
                </CardContent>
              </Card>

              {/* Music */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-white">Music (Optional)</h3>
                  <div className="space-y-2">
                    <Input
                      placeholder="Song name..."
                      value={musicName}
                      onChange={(e) => setMusicName(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Input
                      placeholder="Artist name..."
                      value={musicArtist}
                      onChange={(e) => setMusicArtist(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Effects */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-white">Effects</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" size="sm" className="aspect-square border-gray-600 bg-transparent">
                      <Sparkles className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="aspect-square border-gray-600 bg-transparent">
                      <Type className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="aspect-square border-gray-600 bg-transparent">
                      <Sticker className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="aspect-square border-gray-600 bg-transparent">
                      <Music className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Next Button */}
              <Button
                onClick={() => setStep("publish")}
                className={`w-full ${
                  mediaType === "video"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                }`}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Step */}
      {step === "publish" && (
        <div className="p-4 max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Media Preview */}
            <div className="flex justify-center">
              <div className="w-48 aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden">
                {uploadType === "external" ? (
                  <div className="w-full h-full flex items-center justify-center text-white p-4">
                    <div className="text-center">
                      <Sparkles className="h-12 w-12 mx-auto mb-2 text-purple-400" />
                      <p className="text-sm font-medium">External Content</p>
                    </div>
                  </div>
                ) : mediaType === "video" ? (
                  <video src={mediaUrl} className="w-full h-full object-cover" muted loop autoPlay />
                ) : (
                  <Image
                    src={mediaUrl || "/placeholder.svg"}
                    alt="Preview"
                    width={192}
                    height={341}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium mb-2">Caption</label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="bg-gray-800 border-gray-700 text-white"
                rows={3}
              />
            </div>

            {/* Hashtags */}
            <div>
              <label className="block text-sm font-medium mb-2">Hashtags</label>
              <Input
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#CollegeLife #CampusVibes"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Music Info (if provided) */}
            {(musicName || musicArtist) && (
              <div>
                <label className="block text-sm font-medium mb-2">Music</label>
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center">
                    <Music className="h-4 w-4 mr-2 text-purple-400" />
                    <div>
                      <p className="text-sm font-medium">{musicName}</p>
                      {musicArtist && <p className="text-xs text-gray-400">{musicArtist}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("edit")}
                className="flex-1 border-gray-600 bg-transparent"
              >
                Back
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isUploading || !caption.trim()}
                className={`flex-1 ${
                  mediaType === "video"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                }`}
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Publishing...
                  </>
                ) : (
                  `Publish ${mediaType === "video" ? "Video" : "Photo"} Reel`
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
