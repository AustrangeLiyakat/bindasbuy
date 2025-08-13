"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Home, Search, Plus, MessageCircle, User, ShoppingBag, Video, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CampusCart+
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/marketplace">
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/marketplace/sell">
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-lg">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{user.fullName}</CardTitle>
                <CardDescription>{user.college}</CardDescription>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {user.department}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="text-center">
                    <div className="font-semibold">0</div>
                    <div>Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{user.followers}</div>
                    <div>Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{user.following}</div>
                    <div>Following</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Link href="/feed">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="h-4 w-4 mr-3" />
                      Home Feed
                    </Button>
                  </Link>
                  <Link href="/reels">
                    <Button variant="ghost" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-3" />
                      Reels
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="ghost" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-3" />
                      Explore
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingBag className="h-4 w-4 mr-3" />
                      Marketplace
                    </Button>
                  </Link>
                  <Link href="/messages">
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageCircle className="h-4 w-4 mr-3" />
                      Messages
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Button>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Welcome to CampusCart+!</CardTitle>
                <CardDescription>Start exploring your campus marketplace and social feed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/feed">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </Link>
                  <Link href="/marketplace/sell">
                    <Button variant="outline" className="w-full bg-transparent">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Sell Item
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Feed Placeholder */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-sm">Start following other students or create your first post!</p>
                    <div className="mt-4 space-x-2">
                      <Link href="/feed">
                        <Button size="sm">Explore Feed</Button>
                      </Link>
                      <Link href="/marketplace">
                        <Button variant="outline" size="sm">
                          Browse Marketplace
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending on Campus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-semibold">#TextbookExchange</div>
                    <div className="text-gray-500">42 posts</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">#DormEssentials</div>
                    <div className="text-gray-500">28 posts</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">#CampusEvents</div>
                    <div className="text-gray-500">15 posts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Suggested for You</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Jane Smith</div>
                      <div className="text-xs text-gray-500">Computer Science</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
