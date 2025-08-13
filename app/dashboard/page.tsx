"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ShoppingBag,
  Plus,
  TrendingUp,
  MessageCircle,
  Heart,
  Eye,
  Users,
  ArrowRight,
  Package,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/layout/bottom-nav"
import { mockProducts } from "@/lib/products"

export default function DashboardPage() {
  const { user } = useAuth()

  // Mock data for dashboard
  const userStats = {
    itemsListed: 5,
    itemsSold: 3,
    totalEarnings: 12500,
    profileViews: 45,
    followers: 23,
    following: 18,
  }

  const recentActivity = [
    { type: "sale", item: "MacBook Air M2", amount: 85000, time: "2 hours ago" },
    { type: "message", item: "iPhone 13 Pro", user: "Sarah Wilson", time: "4 hours ago" },
    { type: "like", item: "College Hoodie", user: "Raj Patel", time: "6 hours ago" },
    { type: "view", item: "Data Structures Book", views: 12, time: "1 day ago" },
  ]

  const myListings = mockProducts.slice(0, 3)

  const quickActions = [
    {
      title: "Sell an Item",
      description: "List something for sale",
      icon: Plus,
      href: "/marketplace/sell",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Browse Marketplace",
      description: "Find items to buy",
      icon: ShoppingBag,
      href: "/marketplace",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Messages",
      description: "Chat with buyers/sellers",
      icon: MessageCircle,
      href: "/messages",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Social Feed",
      description: "See what's happening",
      icon: Users,
      href: "/feed",
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.fullName}!</p>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {user?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{userStats.itemsListed}</div>
              <div className="text-sm text-gray-600">Items Listed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{userStats.itemsSold}</div>
              <div className="text-sm text-gray-600">Items Sold</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">₹{userStats.totalEarnings.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Earnings</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{userStats.profileViews}</div>
              <div className="text-sm text-gray-600">Profile Views</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
              <div className="text-2xl font-bold">{userStats.followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">{userStats.following}</div>
              <div className="text-sm text-gray-600">Following</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with these common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${action.color} text-white mb-3`}
                      >
                        <action.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  {activity.type === "sale" && <TrendingUp className="h-5 w-5 text-green-600" />}
                  {activity.type === "message" && <MessageCircle className="h-5 w-5 text-blue-600" />}
                  {activity.type === "like" && <Heart className="h-5 w-5 text-red-600" />}
                  {activity.type === "view" && <Eye className="h-5 w-5 text-orange-600" />}

                  <div className="flex-1">
                    <div className="font-medium">
                      {activity.type === "sale" && `Sold ${activity.item} for ₹${activity.amount?.toLocaleString()}`}
                      {activity.type === "message" && `New message about ${activity.item} from ${activity.user}`}
                      {activity.type === "like" && `${activity.user} liked your ${activity.item}`}
                      {activity.type === "view" && `${activity.item} got ${activity.views} new views`}
                    </div>
                    <div className="text-sm text-gray-600">{activity.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* My Listings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Listings</CardTitle>
                <CardDescription>Items you're currently selling</CardDescription>
              </div>
              <Link href="/marketplace/sell">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {myListings.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-gray-600">₹{product.price.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye className="h-3 w-3" />
                      {product.views}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Heart className="h-3 w-3" />
                      {product.likes}
                    </div>
                  </div>
                </div>
              ))}

              <Link href="/seller/dashboard">
                <Button variant="outline" className="w-full bg-transparent">
                  View All Listings
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
