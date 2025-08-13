"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Heart, MessageCircle, Bookmark, TrendingUp, Users, BarChart3 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface AnalyticsData {
  overview: {
    totalPosts: number
    totalViews: number
    totalLikes: number
    totalComments: number
    totalSaves: number
    totalShares: number
    avgEngagementRate: number
  }
  content: Array<{
    id: string
    type: "post" | "reel"
    content?: string
    caption?: string
    images?: string[]
    video?: string
    mediaUrl?: string
    mediaType?: string
    postType?: string
    createdAt: string
    analytics: {
      totalViews: number
      totalLikes: number
      totalComments: number
      totalSaves: number
      totalReposts?: number
      totalShares?: number
      engagementRate: number
    }
    interactions: {
      likes: Array<{ user: { id: string; name: string; avatar: string }; createdAt: string }>
      comments: Array<{ user: { id: string; name: string; avatar: string }; content: string; createdAt: string }>
      saves: Array<{ user: { id: string; name: string; avatar: string }; createdAt: string }>
      reposts?: Array<{ user: { id: string; name: string; avatar: string }; createdAt: string }>
      shares?: Array<{ user: { id: string; name: string; avatar: string }; platform: string; createdAt: string }>
      views: Array<{ user: { id: string; name: string; avatar: string }; createdAt: string; watchTime?: number }>
    }
  }>
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("7d")
  const [contentType, setContentType] = useState("all")
  const [selectedContent, setSelectedContent] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }
    fetchAnalytics()
  }, [user, timeframe, contentType])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/posts?timeframe=${timeframe}&type=${contentType}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedContentData = selectedContent ? analytics?.content.find((c) => c.id === selectedContent) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Analytics</h1>
            <p className="text-gray-600">Monitor your posts and reels performance</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="posts">Posts Only</SelectItem>
                <SelectItem value="reels">Reels Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.overview.totalPosts || 0}</div>
              <p className="text-xs text-muted-foreground">Posts & Reels</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.overview.totalViews.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">Across all content</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.overview.avgEngagementRate.toFixed(1) || 0}%</div>
              <p className="text-xs text-muted-foreground">Average across content</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  (analytics?.overview.totalLikes || 0) +
                  (analytics?.overview.totalComments || 0) +
                  (analytics?.overview.totalSaves || 0)
                ).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Likes, comments, saves</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Analytics */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
            <TabsTrigger value="interactions">Detailed Interactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Likes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics?.overview.totalLikes.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics?.overview.totalComments.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-green-500" />
                    Saves
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics?.overview.totalSaves.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid gap-4">
              {analytics?.content.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedContent(selectedContent === item.id ? null : item.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={item.type === "post" ? "default" : "secondary"}>
                            {item.type === "post" ? "Post" : "Reel"}
                          </Badge>
                          <span className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {item.type === "post" ? item.content : item.caption}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{item.analytics.engagementRate.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {item.analytics.totalViews}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {item.analytics.totalLikes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {item.analytics.totalComments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="h-4 w-4" />
                        {item.analytics.totalSaves}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4">
            {selectedContentData ? (
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Interactions</CardTitle>
                  <CardDescription>
                    {selectedContentData.type === "post" ? "Post" : "Reel"} from{" "}
                    {new Date(selectedContentData.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Likes */}
                  {selectedContentData.interactions.likes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Likes ({selectedContentData.interactions.likes.length})
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedContentData.interactions.likes.map((like, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={like.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{like.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{like.user.name}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(like.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  {selectedContentData.interactions.comments.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        Comments ({selectedContentData.interactions.comments.length})
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedContentData.interactions.comments.map((comment, index) => (
                          <div key={index} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{comment.user.name}</div>
                              <div className="text-sm text-gray-700">{comment.content}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Saves */}
                  {selectedContentData.interactions.saves.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Bookmark className="h-4 w-4 text-green-500" />
                        Saves ({selectedContentData.interactions.saves.length})
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedContentData.interactions.saves.map((save, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={save.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{save.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{save.user.name}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(save.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    Select a post or reel from the Content Performance tab to view detailed interactions
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
