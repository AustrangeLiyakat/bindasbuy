import mongoose, { type Document, Schema } from "mongoose"

export interface IPost extends Document {
  _id: string
  author: string
  content: string
  images?: string[]
  video?: string
  type: "text" | "image" | "video" | "product"
  productId?: string
  likes: Array<{
    user: string
    createdAt: Date
  }>
  comments: Array<{
    _id: string
    user: string
    content: string
    replies: Array<{
      user: string
      content: string
      createdAt: Date
    }>
    createdAt: Date
  }>
  saves: Array<{
    user: string
    createdAt: Date
  }>
  reposts: Array<{
    user: string
    createdAt: Date
  }>
  views: Array<{
    user: string
    createdAt: Date
  }>
  analytics: {
    totalViews: number
    totalLikes: number
    totalComments: number
    totalSaves: number
    totalReposts: number
    engagementRate: number
    lastUpdated: Date
  }
  college: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      maxlength: [2000, "Content cannot be more than 2000 characters"],
    },
    images: [
      {
        type: String,
      },
    ],
    video: {
      type: String,
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "product"],
      default: "text",
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: [500, "Comment cannot be more than 500 characters"],
        },
        replies: [
          {
            user: {
              type: Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            content: {
              type: String,
              required: true,
              maxlength: [300, "Reply cannot be more than 300 characters"],
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    saves: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reposts: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    analytics: {
      totalViews: {
        type: Number,
        default: 0,
      },
      totalLikes: {
        type: Number,
        default: 0,
      },
      totalComments: {
        type: Number,
        default: 0,
      },
      totalSaves: {
        type: Number,
        default: 0,
      },
      totalReposts: {
        type: Number,
        default: 0,
      },
      engagementRate: {
        type: Number,
        default: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    college: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

PostSchema.index({ author: 1 })
PostSchema.index({ college: 1 })
PostSchema.index({ createdAt: -1 })
PostSchema.index({ type: 1 })
PostSchema.index({ "likes.user": 1 })
PostSchema.index({ "saves.user": 1 })
PostSchema.index({ "analytics.totalViews": -1 })
PostSchema.index({ "analytics.engagementRate": -1 })

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema)
