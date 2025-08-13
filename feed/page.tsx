"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PostCard } from "@/components/social/post-card"
import { CreatePostDialog } from "@/components/social/create-post-dialog"
import { StoriesBar } from "@/components/social/stories-bar"
import type { Post } from "@/types/social"
import { ArrowLeft, Plus, Search, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"
import BottomNav from "@/components/layout/bottom-nav"

export default function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [feedType, setFeedType] = useState<"all" | "product" | "text" | "image" | "video">("all")

  useEffect(() => {
    fetchPosts()
  }, [feedType])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const typeParam = feedType === "all" ? "" : `&type=${feedType}`
      const response = await fetch(`/api/social/posts?limit=20${typeParam}`)

      if (response.ok) {
        const data = await response.json()
        // Transform API response to match Post interface
        const transformedPosts = data.posts.map((post: any) => ({
          id: post.id,
          type: post.type === "product" ? "product" : "lifestyle",
          userId: post.userId,
          userName: post.userName,
          userAvatar: post.userAvatar,
          userCollege: post.userCollege,
          content: post.content,
          images: post.images || [],
          video: post.video,
          productId: post.productId,
          product: post.product,
          likes: post.likes,
          comments: [], // Will be loaded separately when needed
          shares: post.reposts || 0,
          saves: post.saves || 0,
          views: post.views || 0,
          isLiked: post.isLiked,
          isSaved: post.isSaved,
          isOwner: post.isOwner,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        }))
        setPosts(transformedPosts)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts((prev) => prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
  }

  const handlePostCreate = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CampusCart+
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsCreatePostOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Feed Type Selector */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto">
            <Button
              variant={feedType === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFeedType("all")}
              className="rounded-full whitespace-nowrap"
            >
              All Posts
            </Button>
            <Button
              variant={feedType === "product" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFeedType("product")}
              className="rounded-full whitespace-nowrap"
            >
              Marketplace
            </Button>
            <Button
              variant={feedType === "image" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFeedType("image")}
              className="rounded-full whitespace-nowrap"
            >
              Photos
            </Button>
            <Button
              variant={feedType === "video" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFeedType("video")}
              className="rounded-full whitespace-nowrap"
            >
              Videos
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Stories */}
        <StoriesBar />

        {/* Create Post Prompt */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <Button
                variant="ghost"
                className="flex-1 justify-start text-gray-500 bg-gray-100 hover:bg-gray-200"
                onClick={() => setIsCreatePostOpen(true)}
              >
                What's happening on campus?
              </Button>
              <Button size="sm" onClick={() => setIsCreatePostOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <MessageCircle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">Be the first to share something with your campus community!</p>
                <Button onClick={() => setIsCreatePostOpen(true)}>Create Your First Post</Button>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} />)
          )}
        </div>
      </div>

      {/* Create Post Dialog */}
      <CreatePostDialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} onPostCreate={handlePostCreate} />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
