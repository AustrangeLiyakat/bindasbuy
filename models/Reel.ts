import mongoose, { type Document, Schema } from "mongoose"

export interface IReel extends Document {
  _id: string
  userId: string
  author: string
  caption: string
  mediaUrl: string
  mediaType: "video" | "image"
  thumbnailUrl?: string
  duration?: number
  hashtags: string[]
  music?: {
    title: string
    artist: string
    url: string
  }
  isPublic: boolean
  isExternal?: boolean
  externalSource?: string
  likes: Array<{
    user: string
    createdAt: Date
  }>
  comments: Array<{
    _id: string
    user: string
    content: string
    createdAt: Date
  }>
  saves: Array<{
    user: string
    createdAt: Date
  }>
  shares: Array<{
    user: string
    platform: string
    createdAt: Date
  }>
  views: Array<{
    user: string
    watchTime: number
    createdAt: Date
  }>
  analytics: {
    totalViews: number
    totalLikes: number
    totalComments: number
    totalSaves: number
    totalShares: number
    averageWatchTime: number
    engagementRate: number
    lastUpdated: Date
  }
  college: string
  createdAt: Date
  updatedAt: Date
}

const ReelSchema = new Schema<IReel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      maxlength: [500, "Caption cannot be more than 500 characters"],
    },
    mediaUrl: {
      type: String,
      required: [true, "Media URL is required"],
    },
    mediaType: {
      type: String,
      enum: ["video", "image"],
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    duration: {
      type: Number,
      min: 0,
    },
    hashtags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    isExternal: {
      type: Boolean,
      default: false,
    },
    externalSource: {
      type: String,
    },
    music: {
      title: String,
      artist: String,
      url: String,
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
          maxlength: [300, "Comment cannot be more than 300 characters"],
        },
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
    shares: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        platform: {
          type: String,
          enum: ["whatsapp", "instagram", "twitter", "facebook", "copy"],
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
        watchTime: {
          type: Number,
          default: 0,
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
      totalShares: {
        type: Number,
        default: 0,
      },
      averageWatchTime: {
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
  },
  {
    timestamps: true,
  },
)

// Indexes for optimal query performance
ReelSchema.index({ author: 1 })
ReelSchema.index({ college: 1 })
ReelSchema.index({ createdAt: -1 })
ReelSchema.index({ mediaType: 1 })
ReelSchema.index({ "likes.user": 1 })
ReelSchema.index({ "saves.user": 1 })
ReelSchema.index({ "analytics.totalViews": -1 })
ReelSchema.index({ "analytics.engagementRate": -1 })

export default mongoose.models.Reel || mongoose.model<IReel>("Reel", ReelSchema)
