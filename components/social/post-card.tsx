"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Post } from "@/types/social"
import { Heart, MessageCircle, Share2, ShoppingBag, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PostCardProps {
  post: Post
  onPostUpdate?: (post: Post) => void
}

export function PostCard({ post, onPostUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likes, setLikes] = useState(post.likes || 0)

  const handleLike = () => {
    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setLikes(prev => newIsLiked ? prev + 1 : prev - 1)
    
    if (onPostUpdate) {
      onPostUpdate({
        ...post,
        isLiked: newIsLiked,
        likes: newIsLiked ? likes + 1 : likes - 1
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
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
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
            <span>{likes} likes</span>
            <span>{post.comments?.length || 0} comments</span>
            <span>{post.shares || 0} shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Button variant="ghost" size="sm" onClick={handleLike} className="flex-1">
            <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            Like
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
