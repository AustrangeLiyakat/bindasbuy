import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const post = await Post.findById(params.id)
      .populate("author", "name email college avatar")
      .populate("productId", "title price images")
      .populate("likes.user", "name avatar")
      .populate("comments.user", "name avatar")
      .populate("saves.user", "name avatar")
      .lean()

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Track view if user is authenticated
    const session = await getSession()
    if (session && session.userId !== post.author._id.toString()) {
      // Add view tracking
      await Post.findByIdAndUpdate(params.id, {
        $addToSet: {
          views: {
            user: session.userId,
            createdAt: new Date(),
          },
        },
        $inc: {
          "analytics.totalViews": 1,
        },
        $set: {
          "analytics.lastUpdated": new Date(),
        },
      })
    }

    // Format response
    const formattedPost = {
      id: post._id.toString(),
      type: post.type,
      userId: post.author._id.toString(),
      userName: post.author.name,
      userAvatar: post.author.avatar || "/placeholder.svg?height=40&width=40",
      userCollege: post.author.college,
      content: post.content,
      images: post.images || [],
      video: post.video,
      productId: post.productId?._id.toString(),
      product: post.productId
        ? {
            title: post.productId.title,
            price: post.productId.price,
            images: post.productId.images,
          }
        : null,
      likes: post.likes?.length || 0,
      comments: post.comments?.length || 0,
      saves: post.saves?.length || 0,
      reposts: post.reposts?.length || 0,
      views: post.views?.length || 0,
      analytics: post.analytics,
      isLiked: session ? post.likes?.some((like: any) => like.user._id.toString() === session.userId) : false,
      isSaved: session ? post.saves?.some((save: any) => save.user.toString() === session.userId) : false,
      isOwner: session ? post.author._id.toString() === session.userId : false,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }

    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    console.error("Get post error:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const post = await Post.findById(params.id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check authorization - only post author can edit
    if (post.author.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized - You can only edit your own posts" }, { status: 403 })
    }

    const body = await request.json()
    const { content, images, video, isPublic } = body

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      {
        content: content || post.content,
        images: images !== undefined ? images : post.images,
        video: video !== undefined ? video : post.video,
        isPublic: isPublic !== undefined ? isPublic : post.isPublic,
        updatedAt: new Date(),
      },
      { new: true },
    )
      .populate("author", "name email college avatar")
      .populate("productId", "title price images")

    const formattedPost = {
      id: updatedPost._id.toString(),
      type: updatedPost.type,
      userId: updatedPost.author._id.toString(),
      userName: updatedPost.author.name,
      userAvatar: updatedPost.author.avatar || "/placeholder.svg?height=40&width=40",
      userCollege: updatedPost.author.college,
      content: updatedPost.content,
      images: updatedPost.images || [],
      video: updatedPost.video,
      isPublic: updatedPost.isPublic,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    }

    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    console.error("Update post error:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const post = await Post.findById(params.id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check authorization - only post author can delete
    if (post.author.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized - You can only delete your own posts" }, { status: 403 })
    }

    await Post.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
