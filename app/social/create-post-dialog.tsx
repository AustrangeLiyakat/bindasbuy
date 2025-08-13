"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Camera, ImageIcon, ShoppingBag, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [postType, setPostType] = useState<"lifestyle" | "product">("lifestyle")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...newImages].slice(0, 4)) // Max 4 images
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please write something to share with your community",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, submit to API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Post shared!",
        description: "Your post has been shared with your campus community",
      })

      // Reset form
      setContent("")
      setImages([])
      setPostType("lifestyle")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Failed to share post",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                {user?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{user?.fullName}</div>
              <div className="text-sm text-gray-600">{user?.college}</div>
            </div>
          </div>

          {/* Post Type */}
          <Tabs value={postType} onValueChange={(value) => setPostType(value as "lifestyle" | "product")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lifestyle">Lifestyle Post</TabsTrigger>
              <TabsTrigger value="product">Product Post</TabsTrigger>
            </TabsList>

            <TabsContent value="lifestyle" className="space-y-4">
              <Textarea
                placeholder="What's happening on campus? Share your thoughts, experiences, or moments..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </TabsContent>

            <TabsContent value="product" className="space-y-4">
              <Textarea
                placeholder="Describe the item you're selling. Include details about condition, price, and why fellow students would love it..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <ShoppingBag className="h-4 w-4 inline mr-2" />
                Tip: After posting, you can create a detailed product listing in the marketplace for better visibility!
              </div>
            </TabsContent>
          </Tabs>

          {/* Images */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Media Upload */}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <Button variant="ghost" size="sm" asChild>
                <span>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Photo
                </span>
              </Button>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </label>
            <Button variant="ghost" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </Button>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {isSubmitting ? "Sharing..." : "Share Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
