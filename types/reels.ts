export interface Reel {
  id: string
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  authorId: string
  authorName: string
  authorAvatar?: string
  authorCollege: string
  likes: number
  comments: number
  views: number
  isLiked: boolean
  isSaved: boolean
  tags?: string[]
  createdAt: Date
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
