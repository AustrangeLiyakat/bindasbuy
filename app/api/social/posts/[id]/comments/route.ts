import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"
import User from "@/models/User"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const post = await Post.findById(params.id)
      .populate("comments.user", "name email college avatar")
      .populate("comments.replies.user", "name email college avatar") // Added replies population
      .lean()

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const formattedComments = post.comments.map((comment: any) => ({
      id: comment._id.toString(),
      userId: comment.user._id.toString(),
      user: {
        id: comment.user._id.toString(),
        name: comment.user.name,
        username: comment.user.email.split("@")[0],
        avatar: comment.user.avatar || "/placeholder.svg?height=32&width=32",
      },
      content: comment.content,
      replies:
        comment.replies?.map((reply: any) => ({
          id: reply._id?.toString(),
          userId: reply.user._id.toString(),
          user: {
            id: reply.user._id.toString(),
            name: reply.user.name,
            username: reply.user.email.split("@")[0],
            avatar: reply.user.avatar || "/placeholder.svg?height=32&width=32",
          },
          content: reply.content,
          createdAt: reply.createdAt,
        })) || [],
      createdAt: comment.createdAt,
    }))

    return NextResponse.json({ comments: formattedComments })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { content, parentCommentId } = body // Added support for replies

    if (!content) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    const post = await Post.findById(params.id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const user = await User.findById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (parentCommentId) {
      const commentIndex = post.comments.findIndex((comment: any) => comment._id.toString() === parentCommentId)
      if (commentIndex === -1) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 })
      }

      const newReply = {
        user: session.userId,
        content,
        createdAt: new Date(),
      }

      post.comments[commentIndex].replies.push(newReply)
    } else {
      const newComment = {
        user: session.userId,
        content,
        replies: [],
        createdAt: new Date(),
      }

      post.comments.push(newComment)
    }

    post.analytics.totalComments += 1
    const totalEngagements =
      post.analytics.totalLikes + post.analytics.totalComments + post.analytics.totalSaves + post.analytics.totalReposts
    post.analytics.engagementRate =
      post.analytics.totalViews > 0 ? (totalEngagements / post.analytics.totalViews) * 100 : 0
    post.analytics.lastUpdated = new Date()

    await post.save()

    // Format response
    const formattedComment = {
      id: post.comments[post.comments.length - 1]._id.toString(),
      userId: user._id.toString(),
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.email.split("@")[0],
        avatar: user.avatar || "/placeholder.svg?height=32&width=32",
      },
      content,
      replies: [],
      createdAt: new Date(),
    }

    return NextResponse.json({ comment: formattedComment, analytics: post.analytics }, { status: 201 })
  } catch (error) {
    console.error("Add comment error:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
