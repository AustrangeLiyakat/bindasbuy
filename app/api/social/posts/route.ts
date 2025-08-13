import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"
import User from "@/models/User"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const type = searchParams.get("type") || "all"
    const college = searchParams.get("college")
    const author = searchParams.get("author") // Added author filter for user-specific posts

    // Build filter query
    const filter: any = { isPublic: true }
    if (type !== "all") filter.type = type
    if (college) filter.college = college
    if (author) filter.author = author // Filter by author

    // Get posts with pagination
    const skip = (page - 1) * limit
    const posts = await Post.find(filter)
      .populate("author", "name email college avatar")
      .populate("productId", "title price images")
      .populate("likes.user", "name avatar") // Populate like users for analytics
      .populate("comments.user", "name avatar") // Populate comment users
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Post.countDocuments(filter)

    // Format response with enhanced analytics
    const session = await getSession()
    const formattedPosts = posts.map((post) => ({
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
      likes: post.likes?.length || 0, // Updated for new model structure
      comments: post.comments?.length || 0,
      saves: post.saves?.length || 0, // Added saves count
      reposts: post.reposts?.length || 0, // Added reposts count
      views: post.views?.length || 0, // Added views count
      analytics: post.analytics, // Include analytics data
      isLiked: session ? post.likes?.some((like: any) => like.user._id.toString() === session.userId) : false,
      isSaved: session ? post.saves?.some((save: any) => save.user.toString() === session.userId) : false, // Added save status
      isOwner: session ? post.author._id.toString() === session.userId : false, // Added ownership check
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }))

    return NextResponse.json({
      posts: formattedPosts,
      hasMore: skip + limit < total,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { content, images, video, type, productId } = body

    // Validate required fields
    if (!content || !type) {
      return NextResponse.json({ error: "Content and type are required" }, { status: 400 })
    }

    // Get user details
    const user = await User.findById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create post with enhanced structure
    const post = new Post({
      author: session.userId,
      content,
      images: images || [],
      video,
      type,
      productId: productId || null,
      college: user.college,
      likes: [], // Initialize as empty arrays
      comments: [],
      saves: [],
      reposts: [],
      views: [],
      analytics: {
        // Initialize analytics
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalSaves: 0,
        totalReposts: 0,
        engagementRate: 0,
        lastUpdated: new Date(),
      },
    })

    await post.save()

    // Populate author and product info for response
    await post.populate("author", "name email college avatar")
    if (productId) {
      await post.populate("productId", "title price images")
    }

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
      likes: 0,
      comments: 0,
      saves: 0, // Added saves
      reposts: 0, // Added reposts
      views: 0, // Added views
      analytics: post.analytics, // Include analytics
      isLiked: false,
      isSaved: false, // Added save status
      isOwner: true, // Creator is always owner
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }

    return NextResponse.json({ post: formattedPost }, { status: 201 })
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
