export interface Reel {
  id: string
  userId: string
  userName: string
  userAvatar: string
  userCollege: string
  caption: string
  mediaUrl: string
  mediaType: "video" | "image"
  thumbnailUrl?: string
  duration?: number
  music?: {
    title: string
    artist: string
    url?: string
  }
  likes: number
  comments: number
  saves: number
  shares: number
  views: number
  isLiked: boolean
  isSaved: boolean
  isOwner: boolean
  hashtags: string[]
  isExternal?: boolean
  externalSource?: string
  analytics?: {
    totalViews: number
    totalLikes: number
    totalComments: number
    totalSaves: number
    totalShares: number
    averageWatchTime: number
    engagementRate: number
    lastUpdated: Date
  }
  createdAt: Date
  updatedAt: Date
  
  // Legacy/computed fields for compatibility
  user: {
    name: string
    username: string
    avatar: string
    isVerified?: boolean
  }
  isFollowing?: boolean
}

export interface ReelComment {
  id: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  reelId: string
  likes: number
  isLiked: boolean
  createdAt: Date
}
