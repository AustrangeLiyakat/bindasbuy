import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import User from "@/models/User"
import { getSession } from "@/lib/auth"

// GET /api/products - Get all products with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const condition = searchParams.get("condition")
    const location = searchParams.get("location")
    const search = searchParams.get("search")
    const college = searchParams.get("college")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Build filter query
    const filter: any = { isAvailable: true }

    if (category) filter.category = category
    if (condition) filter.condition = condition
    if (college) filter.college = college
    if (location) filter.location = { $regex: location, $options: "i" }
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = Number.parseFloat(maxPrice)
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    // Get products with pagination
    const skip = (page - 1) * limit
    const products = await Product.find(filter)
      .populate("seller", "name email college avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Product.countDocuments(filter)

    // Format response
    const formattedProducts = products.map((product) => ({
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      condition: product.condition,
      images: product.images,
      sellerId: product.seller._id.toString(),
      sellerName: product.seller.name,
      sellerCollege: product.seller.college,
      sellerAvatar: product.seller.avatar,
      location: product.location,
      deliveryOptions: product.deliveryOptions,
      isAvailable: product.isAvailable,
      views: product.views,
      likes: product.likes.length,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const data = await request.json()
    const { title, description, price, category, condition, images, location, deliveryOptions, tags } = data

    // Validate required fields
    if (!title || !description || !price || !category || !condition || !images?.length || !location) {
      return NextResponse.json({ message: "All required fields must be provided" }, { status: 400 })
    }

    // Get user details
    const user = await User.findById(session.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Create product
    const product = new Product({
      title,
      description,
      price: Number.parseFloat(price),
      category,
      condition,
      images,
      seller: session.userId,
      college: user.college,
      location,
      deliveryOptions: deliveryOptions || ["pickup"],
      tags: tags || [],
    })

    await product.save()

    // Populate seller info for response
    await product.populate("seller", "name email college avatar")

    const formattedProduct = {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      condition: product.condition,
      images: product.images,
      sellerId: product.seller._id.toString(),
      sellerName: product.seller.name,
      sellerCollege: product.seller.college,
      sellerAvatar: product.seller.avatar,
      location: product.location,
      deliveryOptions: product.deliveryOptions,
      isAvailable: product.isAvailable,
      views: product.views,
      likes: product.likes.length,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }

    return NextResponse.json({ product: formattedProduct }, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
