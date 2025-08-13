import type { Post, Comment, UserProfile } from "@/types/social"

// Mock social data - for backward compatibility
export const mockPosts: Post[] = [
  {
    id: "1",
    type: "product",
    userId: "1",
    userName: "John Doe",
    userAvatar: "/placeholder.svg?height=40&width=40",
    userCollege: "IIT Delhi",
    content: "Selling my Data Structures textbook! Perfect for CS students. DM me if interested! 📚",
    images: ["/placeholder-f9bsl.png"],
    productId: "1",
    likes: 24,
    comments: [
      {
        id: "1",
        postId: "1",
        userId: "2",
        userName: "Sarah Wilson",
        userAvatar: "/placeholder.svg?height=32&width=32",
        content: "Is this still available?",
        likes: 2,
        isLiked: false,
        replies: [
          {
            id: "1",
            commentId: "1",
            userId: "1",
            userName: "John Doe",
            userAvatar: "/placeholder.svg?height=32&width=32",
            content: "Yes! DM me",
            likes: 1,
            isLiked: false,
            createdAt: new Date("2024-01-15T10:30:00"),
          },
        ],
        createdAt: new Date("2024-01-15T10:15:00"),
      },
    ],
    shares: 5,
    isLiked: false,
    createdAt: new Date("2024-01-15T09:00:00"),
    updatedAt: new Date("2024-01-15T09:00:00"),
  },
  {
    id: "2",
    type: "lifestyle",
    userId: "2",
    userName: "Sarah Wilson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    userCollege: "IIT Delhi",
    content: "Late night coding session at the library! Who else is pulling an all-nighter? 💻✨",
    images: ["/coding-session-library.png"],
    likes: 89,
    comments: [
      {
        id: "2",
        postId: "2",
        userId: "3",
        userName: "Mike Chen",
        userAvatar: "/placeholder.svg?height=32&width=32",
        content: "Same here! Assignment deadline tomorrow 😅",
        likes: 12,
        isLiked: true,
        replies: [],
        createdAt: new Date("2024-01-14T23:45:00"),
      },
      {
        id: "3",
        postId: "2",
        userId: "4",
        userName: "Lisa Park",
        userAvatar: "/placeholder.svg?height=32&width=32",
        content: "The library looks so aesthetic at night!",
        likes: 8,
        isLiked: false,
        replies: [],
        createdAt: new Date("2024-01-15T00:15:00"),
      },
    ],
    shares: 12,
    isLiked: true,
    createdAt: new Date("2024-01-14T23:30:00"),
    updatedAt: new Date("2024-01-14T23:30:00"),
  },
]

// API functions to replace mock data operations
export async function getPosts(filters?: {
  page?: number
  limit?: number
  type?: string
  college?: string
}): Promise<{ posts: Post[]; hasMore: boolean; total: number; pagination: any }> {
  const params = new URLSearchParams()

  if (filters?.page) params.append("page", filters.page.toString())
  if (filters?.limit) params.append("limit", filters.limit.toString())
  if (filters?.type) params.append("type", filters.type)
  if (filters?.college) params.append("college", filters.college)

  const response = await fetch(`/api/social/posts?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch posts")
  }

  return response.json()
}

export async function createPost(postData: {
  content: string
  images?: string[]
  video?: string
  type: string
  productId?: string
}): Promise<Post> {
  const response = await fetch("/api/social/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create post")
  }

  const data = await response.json()
  return data.post
}

export async function togglePostLike(postId: string): Promise<{ success: boolean; isLiked: boolean; likes: number }> {
  const response = await fetch(`/api/social/posts/${postId}/like`, {
    method: "POST",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to toggle like")
  }

  return response.json()
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  const response = await fetch(`/api/social/posts/${postId}/comments`)
  if (!response.ok) {
    throw new Error("Failed to fetch comments")
  }

  const data = await response.json()
  return data.comments
}

export async function addComment(postId: string, content: string): Promise<Comment> {
  const response = await fetch(`/api/social/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to add comment")
  }

  const data = await response.json()
  return data.comment
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const response = await fetch(`/api/social/users/${userId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }

  const data = await response.json()
  return data.user
}

export async function toggleUserFollow(userId: string): Promise<{
  success: boolean
  isFollowing: boolean
  followersCount: number
  followingCount: number
}> {
  const response = await fetch(`/api/social/users/${userId}/follow`, {
    method: "POST",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to toggle follow")
  }

  return response.json()
}

// Legacy functions for backward compatibility (now use API calls)
export function getPostById(id: string): Promise<Post | undefined> {
  return fetch(`/api/social/posts/${id}`)
    .then((res) => (res.ok ? res.json().then((data) => data.post) : undefined))
    .catch(() => undefined)
}

export async function getPostsByUser(userId: string): Promise<Post[]> {
  try {
    const response = await fetch(`/api/social/posts?userId=${userId}`)
    if (!response.ok) return []
    const data = await response.json()
    return data.posts
  } catch {
    return []
  }
}
