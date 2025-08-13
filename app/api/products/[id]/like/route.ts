import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import { getSession } from "@/lib/auth"

// POST /api/products/[id]/like - Toggle product like
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    const userId = session.userId
    const isLiked = product.likes.includes(userId)

    if (isLiked) {
      // Unlike the product
      product.likes = product.likes.filter((id) => id.toString() !== userId)
    } else {
      // Like the product
      product.likes.push(userId)
    }

    await product.save()

    return NextResponse.json({
      liked: !isLiked,
      likesCount: product.likes.length,
    })
  } catch (error) {
    console.error("Toggle like error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
