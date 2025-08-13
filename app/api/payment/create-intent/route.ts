import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity = 1, shippingAddress } = body

    // Validate product
    const product = await Product.findById(productId).populate("seller")
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (!product.isAvailable) {
      return NextResponse.json({ error: "Product is no longer available" }, { status: 400 })
    }

    // Calculate amount
    const amount = product.price * quantity
    const amountInPaise = Math.round(amount * 100) // Convert to paise for Razorpay

    const Razorpay = require("razorpay")
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        productId,
        sellerId: product.seller._id.toString(),
        buyerId: session.userId,
        quantity: quantity.toString(),
      },
    })

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      product: {
        id: product._id.toString(),
        title: product.title,
        price: product.price,
        images: product.images,
      },
      seller: {
        id: product.seller._id.toString(),
        name: product.seller.name,
      },
    })
  } catch (error) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
