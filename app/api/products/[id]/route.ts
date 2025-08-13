import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import { getSession } from "@/lib/auth"

// GET /api/products/[id] - Get single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const product = await Product.findById(params.id).populate("seller", "name email college avatar phone").lean()

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Increment view count
    await Product.findByIdAndUpdate(params.id, { $inc: { views: 1 } })

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
      sellerPhone: product.seller.phone,
      location: product.location,
      deliveryOptions: product.deliveryOptions,
      isAvailable: product.isAvailable,
      views: product.views + 1,
      likes: product.likes.length,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }

    return NextResponse.json({ product: formattedProduct })
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user owns the product
    if (product.seller.toString() !== session.userId) {
      return NextResponse.json({ message: "Not authorized to update this product" }, { status: 403 })
    }

    const data = await request.json()
    const { title, description, price, category, condition, images, location, deliveryOptions, tags, isAvailable } =
      data

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: Number.parseFloat(price) }),
        ...(category && { category }),
        ...(condition && { condition }),
        ...(images && { images }),
        ...(location && { location }),
        ...(deliveryOptions && { deliveryOptions }),
        ...(tags && { tags }),
        ...(typeof isAvailable === "boolean" && { isAvailable }),
      },
      { new: true },
    ).populate("seller", "name email college avatar")

    const formattedProduct = {
      id: updatedProduct._id.toString(),
      title: updatedProduct.title,
      description: updatedProduct.description,
      price: updatedProduct.price,
      category: updatedProduct.category,
      condition: updatedProduct.condition,
      images: updatedProduct.images,
      sellerId: updatedProduct.seller._id.toString(),
      sellerName: updatedProduct.seller.name,
      sellerCollege: updatedProduct.seller.college,
      sellerAvatar: updatedProduct.seller.avatar,
      location: updatedProduct.location,
      deliveryOptions: updatedProduct.deliveryOptions,
      isAvailable: updatedProduct.isAvailable,
      views: updatedProduct.views,
      likes: updatedProduct.likes.length,
      tags: updatedProduct.tags,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt,
    }

    return NextResponse.json({ product: formattedProduct })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user owns the product
    if (product.seller.toString() !== session.userId) {
      return NextResponse.json({ message: "Not authorized to delete this product" }, { status: 403 })
    }

    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
