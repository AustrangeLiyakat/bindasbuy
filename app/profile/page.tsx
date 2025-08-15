"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Settings,
  Edit,
  MapPin,
  Calendar,
  Mail,
  GraduationCap,
  Package,
  Heart,
  MessageCircle,
  ArrowLeft,
  Video,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("posts")
  const [showEditDialog, setShowEditDialog] = useState(false)

  const mockUserPosts = [
    {
      id: "1",
      type: "product",
      title: "MacBook Pro 2021",
      price: "₹85,000",
      image: "/silver-macbook-on-desk.png",
      likes: 24,
      comments: 8,
    },
    {
      id: "2",
      type: "lifestyle",
      title: "Campus life vibes ✨",
      image: "/placeholder-iucjg.png",
      likes: 156,
      comments: 23,
    },
  ]

  const mockStats = {
    posts: 12,
    followers: 234,
    following: 189,
    itemsSold: 8,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Profile</h1>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/reels/create">
                <Button variant="default" size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Video className="h-4 w-4 mr-2" />
                  Create Reel
                </Button>
              </Link>
              {user?.role === "seller" && (
                <Link href="/seller/dashboard">
                  <Button variant="ghost" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    Seller Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(true)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  {user?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{user?.fullName}</h2>
                    <p className="text-gray-600">@{user?.email?.split('@')[0] || 'user'}</p>
                    <Badge variant={user?.role === "seller" ? "default" : "secondary"} className="mt-1">
                      {user?.role === "seller" ? "Seller" : "Student"}
                    </Badge>
                  </div>
                  <Button onClick={() => setShowEditDialog(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Link href="/feed">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      View Feed
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline" size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Button>
                  </Link>
                  <Link href="/marketplace/sell">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Sell Item
                    </Button>
                  </Link>
                  <Link href="/messages">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Messages
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockStats.posts}</div>
                    <div className="text-sm text-gray-600">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockStats.followers}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockStats.following}</div>
                    <div className="text-sm text-gray-600">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockStats.itemsSold}</div>
                    <div className="text-sm text-gray-600">Items Sold</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{user?.college}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>New Delhi, India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined March 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create New Content Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Link href="/marketplace/sell">
                <Button className="flex-1 min-w-[200px]">
                  <Package className="h-4 w-4 mr-2" />
                  List New Product
                </Button>
              </Link>
              <Button variant="outline" className="flex-1 min-w-[200px] bg-transparent">
                <Edit className="h-4 w-4 mr-2" />
                Create Post
              </Button>
              <Link href="/reels/create">
                <Button variant="outline" className="flex-1 min-w-[200px] bg-transparent">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Create Reel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockUserPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-square relative">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={post.type === "product" ? "default" : "secondary"}>
                        {post.type === "product" ? "Product" : "Post"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    {post.price && <p className="text-lg font-bold text-green-600 mb-2">{post.price}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">Start selling items to your campus community</p>
              <Link href="/marketplace/sell">
                <Button>List Your First Item</Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No liked posts yet</h3>
              <p className="text-gray-600 mb-4">Posts you like will appear here</p>
              <Link href="/feed">
                <Button>Explore Feed</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Profile</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(false)}>
                  ×
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <input type="text" defaultValue={user?.fullName} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    className="w-full p-2 border rounded-md mt-1 h-20"
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Save Changes</Button>
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
