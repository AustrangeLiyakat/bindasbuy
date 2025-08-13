import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import { getSession } from "@/lib/auth"

// GET /api/orders/[id] - Get specific order
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const order = await Order.findById(params.id)
      .populate("buyer", "name email college avatar")
      .populate("seller", "name email college avatar")
      .populate("product", "title price images category")
      .lean()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if user is buyer or seller
    if (order.buyer._id.toString() !== session.userId && order.seller._id.toString() !== session.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

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
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }

    return NextResponse.json({ order: formattedOrder })
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

// PUT /api/orders/[id] - Update order status
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const data = await request.json()
    const { orderStatus, paymentStatus, razorpayPaymentId, deliveryDate } = data

    const order = await Order.findById(params.id)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check permissions - only seller can update order status, only system can update payment status
    if (orderStatus && order.seller.toString() !== session.userId) {
      return NextResponse.json({ error: "Only seller can update order status" }, { status: 403 })
    }

    // Update order
    const updateData: any = {}
    if (orderStatus) updateData.orderStatus = orderStatus
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (razorpayPaymentId) updateData.razorpayPaymentId = razorpayPaymentId
    if (deliveryDate) updateData.deliveryDate = new Date(deliveryDate)

    const updatedOrder = await Order.findByIdAndUpdate(params.id, updateData, { new: true })
      .populate("buyer", "name email college avatar")
      .populate("seller", "name email college avatar")
      .populate("product", "title price images category")

    const formattedOrder = {
      id: updatedOrder._id.toString(),
      buyer: {
        id: updatedOrder.buyer._id.toString(),
        name: updatedOrder.buyer.name,
        email: updatedOrder.buyer.email,
        college: updatedOrder.buyer.college,
        avatar: updatedOrder.buyer.avatar,
      },
      seller: {
        id: updatedOrder.seller._id.toString(),
        name: updatedOrder.seller.name,
        email: updatedOrder.seller.email,
        college: updatedOrder.seller.college,
        avatar: updatedOrder.seller.avatar,
      },
      product: {
        id: updatedOrder.product._id.toString(),
        title: updatedOrder.product.title,
        price: updatedOrder.product.price,
        images: updatedOrder.product.images,
        category: updatedOrder.product.category,
      },
      quantity: updatedOrder.quantity,
      totalAmount: updatedOrder.totalAmount,
      shippingAddress: updatedOrder.shippingAddress,
      paymentMethod: updatedOrder.paymentMethod,
      paymentStatus: updatedOrder.paymentStatus,
      orderStatus: updatedOrder.orderStatus,
      razorpayOrderId: updatedOrder.razorpayOrderId,
      razorpayPaymentId: updatedOrder.razorpayPaymentId,
      deliveryDate: updatedOrder.deliveryDate,
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
    }

    return NextResponse.json({ order: formattedOrder })
  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
