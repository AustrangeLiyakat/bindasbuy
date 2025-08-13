import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { getSession } from "@/lib/auth"

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all" // 'buyer', 'seller', or 'all'
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Build filter query
    const filter: any = {}

    if (type === "buyer") {
      filter.buyer = session.userId
    } else if (type === "seller") {
      filter.seller = session.userId
    } else {
      // Show both buyer and seller orders
      filter.$or = [{ buyer: session.userId }, { seller: session.userId }]
    }

    if (status) filter.orderStatus = status

    // Get orders with pagination
    const skip = (page - 1) * limit
    const orders = await Order.find(filter)
      .populate("buyer", "name email college avatar")
      .populate("seller", "name email college avatar")
      .populate("product", "title price images category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Order.countDocuments(filter)

    // Format response
    const formattedOrders = orders.map((order) => ({
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
    }))

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const data = await request.json()
    const { productId, quantity, shippingAddress, paymentMethod, razorpayOrderId } = data

    // Validate required fields
    if (!productId || !quantity || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get product details
    const product = await Product.findById(productId).populate("seller")
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (!product.isAvailable) {
      return NextResponse.json({ error: "Product is no longer available" }, { status: 400 })
    }

    // Calculate total amount
    const totalAmount = product.price * quantity

    // Create order
    const order = new Order({
      buyer: session.userId,
      seller: product.seller._id,
      product: productId,
      quantity,
      totalAmount,
      shippingAddress,
      paymentMethod,
      razorpayOrderId,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      orderStatus: "pending",
    })

    await order.save()

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
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }

    return NextResponse.json({ order: formattedOrder }, { status: 201 })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
