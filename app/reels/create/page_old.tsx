"use client"

import type React from "react"

import { useState, useRef } from "react"
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
  const [mediaFile, setMediaFile] = useState<File | null>(null)
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

  const handleFileUpload = async () => {
    if (!mediaFile || !caption.trim()) {
      alert("Please select a file and add a caption")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("video", mediaFile)
      formData.append("caption", caption)
      formData.append("hashtags", hashtags)
      if (musicName) formData.append("musicName", musicName)
      if (musicArtist) formData.append("musicArtist", musicArtist)

      const response = await fetch("/api/reels/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Upload successful:", result)
        router.push("/reels")
      } else {
        const error = await response.json()
        alert(error.message || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleExternalUpload = async () => {
    if (!externalUrl.trim() || !caption.trim()) {
      alert("Please provide a URL and caption")
      return
    }

    setIsUploading(true)
    try {
      const response = await fetch("/api/reels/external", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaUrl: externalUrl,
          mediaType,
          caption,
          hashtags: hashtags.split(",").map(tag => tag.trim()),
          music: musicName && musicArtist ? { name: musicName, artist: musicArtist } : undefined,
          externalSource: getSourceFromUrl(externalUrl),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("External reel added:", result)
        router.push("/reels")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to add external reel")
      }
    } catch (error) {
      console.error("External upload error:", error)
      alert("Failed to add external reel. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const getSourceFromUrl = (url: string) => {
    if (url.includes("instagram.com")) return "Instagram"
    if (url.includes("tiktok.com")) return "TikTok"
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube"
    return "External"
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const isVideo = file.type.startsWith("video/")
      const isImage = file.type.startsWith("image/")

      if ((mediaType === "video" && isVideo) || (mediaType === "image" && isImage)) {
        setMediaFile(file)
        const url = URL.createObjectURL(file)
        setMediaUrl(url)
        setStep("edit")
      }
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handlePublish = async () => {
    if (!mediaFile) return

    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      router.push("/reels")
    }, 2000)
  }

  const handleBack = () => {
    if (step === "upload") {
      setStep("choose")
    } else if (step === "edit") {
      setStep("upload")
      setMediaFile(null)
      setMediaUrl("")
    } else if (step === "publish") {
      setStep("edit")
    }
  }

  const handlePublish = async () => {
    if (!mediaUrl && !externalUrl) return;
    
    setIsUploading(true);
    
    try {
      let response;
      
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
        });
      } else {
        // Handle file upload
        const formData = new FormData();
        if (selectedFile) {
          formData.append("file", selectedFile);
          formData.append("type", mediaType);
          formData.append("caption", caption);
          formData.append("hashtags", JSON.stringify(hashtags.split(",").map(tag => tag.trim()).filter(Boolean)));
          if (musicName) formData.append("musicName", musicName);
          if (musicArtist) formData.append("musicArtist", musicArtist);
        }
        
        response = await fetch("/api/reels/upload", {
          method: "POST",
          body: formData,
        });
      }
      
      if (response.ok) {
        router.push("/reels");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to publish reel");
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to publish reel");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-800"
          onClick={step === "choose" ? () => router.back() : handleBack}
        >
          <X className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">Create Reel</h1>
        <div className="w-10" />
      </div>

      {/* Choose Media Type Step */}
      {step === "choose" && (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] p-8">
          <div className="text-center mb-8">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Create Your Reel</h2>
            <p className="text-gray-400">Share your campus life, products, or experiences with the community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            <Card
              className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => handleMediaTypeSelect("video")}
            >
              <CardContent className="p-6 text-center">
                <Video className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Video Reel</h3>
                <p className="text-sm text-gray-400">Share moving moments and stories</p>
              </CardContent>
            </Card>

            <Card
              className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => handleMediaTypeSelect("image")}
            >
              <CardContent className="p-6 text-center">
                <ImageIcon className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Photo Reel</h3>
                <p className="text-sm text-gray-400">Share stunning photos and moments</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Upload Step */}
      {step === "upload" && (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
          <div className="text-center mb-8">
            {mediaType === "video" ? (
              <Video className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            ) : (
              <ImageIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            )}
            <h2 className="text-2xl font-bold mb-2">Upload {mediaType === "video" ? "Video" : "Photo"}</h2>
            <p className="text-gray-400">
              Upload from device or add external link
            </p>
          </div>

          {/* Upload Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mb-8">
            <Card
              className={`cursor-pointer transition-colors ${
                uploadType === "file" 
                  ? "bg-purple-600 border-purple-500" 
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700"
              }`}
              onClick={() => setUploadType("file")}
            >
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 text-white mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Upload File</h3>
                <p className="text-sm text-gray-300">Choose from device</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-colors ${
                uploadType === "external" 
                  ? "bg-purple-600 border-purple-500" 
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700"
              }`}
              onClick={() => setUploadType("external")}
            >
              <CardContent className="p-6 text-center">
                <Sparkles className="h-12 w-12 text-white mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">External Link</h3>
                <p className="text-sm text-gray-300">Instagram, TikTok, etc.</p>
              </CardContent>
            </Card>
          </div>

          {/* File Upload */}
          {uploadType === "file" && (
            <div className="space-y-4 w-full max-w-md">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
              >
                <Upload className="mr-2 h-5 w-5" />
                Choose {mediaType === "video" ? "Video" : "Photo"}
              </Button>
              
              {mediaFile && (
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-white mb-2">Selected: {mediaFile.name}</p>
                  <p className="text-gray-400 text-sm">
                    Size: {(mediaFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          )}

          {/* External URL */}
          {uploadType === "external" && (
            <div className="space-y-4 w-full max-w-md">
              <div>
                <label className="block text-white font-medium mb-2">
                  External URL (Instagram, TikTok, YouTube, etc.)
                </label>
                <Input
                  type="url"
                  placeholder="https://www.instagram.com/reel/..."
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Example: https://www.instagram.com/reel/DNPZEJ8TlMC/
                </p>
              </div>
            </div>
          )}

          {/* Continue to Edit */}
          {((uploadType === "file" && mediaFile) || (uploadType === "external" && externalUrl)) && (
            <div className="space-y-4 w-full max-w-md mt-6">
              <Button
                onClick={() => setStep("edit")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                Continue to Edit
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={mediaType === "video" ? "video/*" : "image/*"}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setMediaFile(file)
                const url = URL.createObjectURL(file)
                setMediaUrl(url)
              }
            }}
            className="hidden"
          />
        </div>
      )}
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              }`}
              size="lg"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload {mediaType === "video" ? "Video" : "Photo"}
            </Button>

            {mediaType === "video" && (
              <Button
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                size="lg"
              >
                <Camera className="h-5 w-5 mr-2" />
                Record Video
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={mediaType === "video" ? "video/*" : "image/*"}
            onChange={handleFileSelect}
            className="hidden"
          />
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
                {mediaType === "video" ? (
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

            {/* Publish Button */}
            <Button
              onClick={handlePublish}
              disabled={isUploading}
              className={`w-full ${
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
      )}
    </div>
  )
}
