export interface Post {
  id: string
  content: string
  images?: string[]
  authorId: string
  authorName: string
  authorAvatar?: string
  authorCollege: string
  likes: number
  comments: number
  reposts: number
  isLiked: boolean
  isReposted: boolean
  isSaved: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  postId: string
  likes: number
  isLiked: boolean
  createdAt: Date
}

export interface Story {
  id: string
  content: string
  image?: string
  authorId: string
  authorName: string
  authorAvatar?: string
  viewCount: number
  isViewed: boolean
  expiresAt: Date
  createdAt: Date
}
