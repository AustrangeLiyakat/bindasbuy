import mongoose, { type Document, Schema } from "mongoose"

export interface IProduct extends Document {
  _id: string
  title: string
  description: string
  price: number
  category: string
  condition: "new" | "like-new" | "good" | "fair"
  images: string[]
  seller: string
  college: string
  location: string
  deliveryOptions: string[]
  isAvailable: boolean
  views: number
  likes: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Books", "Electronics", "Fashion", "Stationery", "Dorm Items", "Event Tickets", "Other"],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["new", "like-new", "good", "fair"],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    college: {
      type: String,
      required: [true, "College is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    deliveryOptions: [
      {
        type: String,
        enum: ["pickup", "campus-delivery", "hostel-delivery"],
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
ProductSchema.index({ seller: 1 })
ProductSchema.index({ category: 1 })
ProductSchema.index({ college: 1 })
ProductSchema.index({ isAvailable: 1 })
ProductSchema.index({ createdAt: -1 })
ProductSchema.index({ price: 1 })

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
