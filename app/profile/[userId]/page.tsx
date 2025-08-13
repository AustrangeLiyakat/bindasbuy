"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/social/post-card"
import { ProductCard } from "@/components/marketplace/product-card"
import { getUserProfile, getPostsByUser } from "@/lib/social"
import { getProductsBySeller } from "@/lib/products"
import type { UserProfile, Post } from "@/types/social"
import type { Product } from "@/types/product"
import { ArrowLeft, MessageCircle, MoreHorizontal, MapPin, Calendar, CheckCircle } from "lucide-react"

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const userId = params.userId as string
    const userProfile = getUserProfile(userId)
    const userPosts = getPostsByUser(userId)
    const userProducts = getProductsBySeller(userId)

    if (userProfile) {
      setProfile(userProfile)
      setIsFollowing(userProfile.isFollowing)
    }
    setPosts(userPosts)
    setProducts(userProducts)
  }, [params.userId])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    if (profile) {
      setProfile({
        ...profile,
        followers: isFollowing ? profile.followers - 1 : profile.followers + 1,
        isFollowing: !isFollowing,
      })
    }
  }

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts((prev) => prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
            <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === profile.id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">{profile.fullName}</h1>
            </div>

            <div className="flex items-center gap-2">
              {!isOwnProfile && (
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {profile.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {!isOwnProfile && (
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      onClick={handleFollow}
                      className={
                        isFollowing ? "flex-1 md:w-32" : "flex-1 md:w-32 bg-gradient-to-r from-purple-600 to-blue-600"
                      }
                      variant={isFollowing ? "outline" : "default"}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                  {profile.isVerified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                </div>
                <p className="text-gray-600 mb-1">@{profile.userName}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.college}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {profile.joinedAt.toLocaleDateString()}</span>
                  </div>
                </div>

                <Badge variant="secondary" className="mb-4">
                  {profile.department}
                </Badge>

                {profile.bio && <p className="text-gray-700 mb-4">{profile.bio}</p>}

                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold">{profile.postsCount}</span>
                    <span className="text-gray-600 ml-1">posts</span>
                  </div>
                  <div>
                    <span className="font-semibold">{profile.followers}</span>
                    <span className="text-gray-600 ml-1">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold">{profile.following}</span>
                    <span className="text-gray-600 ml-1">following</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="products">Listings</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6 mt-6">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-gray-600">
                    {isOwnProfile
                      ? "Share your first post with the community!"
                      : "This user hasn't posted anything yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} />)
            )}
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            {products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                  <p className="text-gray-600">
                    {isOwnProfile
                      ? "Start selling items to your campus community!"
                      : "This user hasn't listed anything for sale yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">Liked posts</h3>
                <p className="text-gray-600">Posts you've liked will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
