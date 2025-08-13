import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
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
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, productId, quantity, shippingAddress } = body

    const crypto = require("crypto")
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex")

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Get product details
    const product = await Product.findById(productId).populate("seller")
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Calculate total amount
    const totalAmount = product.price * quantity

    // Create order in database
    const order = new Order({
      buyer: session.userId,
      seller: product.seller._id,
      product: productId,
      quantity,
      totalAmount,
      shippingAddress,
      paymentMethod: "razorpay",
      paymentStatus: "completed",
      orderStatus: "confirmed",
      razorpayOrderId,
      razorpayPaymentId,
    })

    await order.save()

    // Mark product as unavailable if quantity matches available stock
    if (quantity >= 1) {
      product.isAvailable = false
      await product.save()
    }

    // Populate order data for response
    await order.populate("buyer", "name email college avatar")
    await order.populate("seller", "name email college avatar")
    await order.populate("product", "title price images category")

    const formattedOrder = {
      id: order._id.toString(),
      buyer: {
        id: order.buyer._id.toString(),
        name: order.buyer.name,
        email: order.buyer.email,
        college: order.buyer.college,
        avatar: order.buyer.avatar,
      },
      seller: {
        id: order.seller._id.toString(),
        name: order.seller.name,
        email: order.seller.email,
        college: order.seller.college,
        avatar: order.seller.avatar,
      },
      product: {
        id: order.product._id.toString(),
        title: order.product.title,
        price: order.product.price,
        images: order.product.images,
        category: order.product.category,
      },
      quantity: order.quantity,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }

    return NextResponse.json({
      success: true,
      order: formattedOrder,
      message: "Payment confirmed and order created successfully",
    })
  } catch (error) {
    console.error("Payment confirmation error:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
