import mongoose, { type Document, Schema } from "mongoose"

export interface IOrder extends Document {
  _id: string
  buyer: string
  seller: string
  product: string
  quantity: number
  totalAmount: number
  shippingAddress: {
    fullName: string
    phone: string
    email: string
    street: string
    city: string
    state: string
    pincode: string
    landmark?: string
  }
  paymentMethod: string
  paymentStatus: "pending" | "completed" | "failed" | "refunded"
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  razorpayOrderId?: string
  razorpayPaymentId?: string
  deliveryDate?: Date
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      landmark: String,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["razorpay", "cod", "upi"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    deliveryDate: Date,
  },
  {
    timestamps: true,
  },
)

// Indexes
OrderSchema.index({ buyer: 1 })
OrderSchema.index({ seller: 1 })
OrderSchema.index({ product: 1 })
OrderSchema.index({ createdAt: -1 })
OrderSchema.index({ orderStatus: 1 })
OrderSchema.index({ paymentStatus: 1 })

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
