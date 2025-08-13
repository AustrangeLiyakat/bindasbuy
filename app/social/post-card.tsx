"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CommentDialog } from "./comment-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import type { Post } from "@/types/social"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Repeat2,
  ShoppingBag,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PostCardProps {
  post: Post
  onPostUpdate: (post: Post) => void
}

export function PostCard({ post, onPostUpdate }: PostCardProps) {
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isReposting, setIsReposting] = useState(false)

  const handleLike = async () => {
    if (isLiking) return

    try {
      setIsLiking(true)
      const response = await fetch(`/api/social/posts/${post.id}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        const updatedPost = {
          ...post,
          likes: data.likes,
          isLiked: data.isLiked,
        }
        onPostUpdate(updatedPost)
      }
    } catch (error) {
      console.error("Failed to like post:", error)
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleSave = async () => {
    if (isSaving) return

    try {
      setIsSaving(true)
      const response = await fetch(`/api/social/posts/${post.id}/save`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        const updatedPost = {
          ...post,
          saves: data.saves,
          isSaved: data.isSaved,
        }
        onPostUpdate(updatedPost)
        toast({
          title: data.isSaved ? "Post saved" : "Post unsaved",
          description: data.isSaved ? "Added to your saved posts" : "Removed from saved posts",
        })
      }
    } catch (error) {
      console.error("Failed to save post:", error)
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRepost = async () => {
    if (isReposting) return

    try {
      setIsReposting(true)
      const response = await fetch(`/api/social/posts/${post.id}/repost`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        const updatedPost = {
          ...post,
          shares: data.reposts,
        }
        onPostUpdate(updatedPost)
        toast({
          title: data.isReposted ? "Post reposted" : "Repost removed",
          description: data.isReposted ? "Shared to your profile" : "Removed from your profile",
        })
      }
    } catch (error) {
      console.error("Failed to repost:", error)
      toast({
        title: "Error",
        description: "Failed to repost. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsReposting(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.userName}'s post`,
          text: post.content,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Post link copied to clipboard",
      })
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/social/posts/${post.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Post deleted",
          description: "Your post has been deleted successfully",
        })
        // Remove post from feed (parent component should handle this)
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to delete post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.userAvatar || "/placeholder.svg"} />
              <AvatarFallback>
                {post.userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/profile/${post.userId}`}>
                  <span className="font-semibold hover:underline">{post.userName}</span>
                </Link>
                {post.type === "product" && (
                  <Badge variant="secondary" className="text-xs">
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Selling
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {post.userCollege} • {formatTimeAgo(post.createdAt)}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {post.isOwner ? (
                <>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>Report Post</DropdownMenuItem>
                  <DropdownMenuItem>Hide Post</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Post Content */}
        <p className="mb-4 leading-relaxed">{post.content}</p>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4">
            {post.images.length === 1 ? (
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image src={post.images[0] || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {post.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Post image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {index === 3 && post.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">+{post.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video */}
        {post.video && (
          <div className="mb-4">
            <video
              src={post.video}
              controls
              className="w-full rounded-lg"
              poster="/placeholder.svg?height=300&width=500"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Product Link */}
        {post.type === "product" && post.productId && (
          <Link href={`/marketplace/product/${post.productId}`}>
            <Card className="mb-4 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-purple-700">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="text-sm font-medium">View Product Details</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{post.views || 0}</span>
            </div>
            <span>{post.likes} likes</span>
            <span>{post.comments?.length || 0} comments</span>
            {post.saves > 0 && <span>{post.saves} saves</span>}
            {post.shares > 0 && <span>{post.shares} reposts</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLiking} className="flex-1">
            <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`} />
            {post.isLiked ? "Liked" : "Like"}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => setIsCommentDialogOpen(true)} className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Comment
          </Button>

          <Button variant="ghost" size="sm" onClick={handleRepost} disabled={isReposting} className="flex-1">
            <Repeat2 className="h-4 w-4 mr-2" />
            Repost
          </Button>

          <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaving} className="flex-1">
            <Bookmark className={`h-4 w-4 mr-2 ${post.isSaved ? "fill-blue-500 text-blue-500" : ""}`} />
            {post.isSaved ? "Saved" : "Save"}
          </Button>

          <Button variant="ghost" size="sm" onClick={handleShare} className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>

      {/* Comment Dialog */}
      <CommentDialog
        post={post}
        open={isCommentDialogOpen}
        onOpenChange={setIsCommentDialogOpen}
        onPostUpdate={onPostUpdate}
      />
    </Card>
  )
}
