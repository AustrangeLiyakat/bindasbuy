import mongoose, { type Document, Schema } from "mongoose"

export interface IMessage extends Document {
  _id: string
  conversationId: string
  sender: string
  receiver: string
  content: string
  type: "text" | "image" | "product"
  productId?: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IConversation extends Document {
  _id: string
  participants: string[]
  lastMessage?: string
  lastMessageAt: Date
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      maxlength: [1000, "Message cannot be more than 1000 characters"],
    },
    type: {
      type: String,
      enum: ["text", "image", "product"],
      default: "text",
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
MessageSchema.index({ conversationId: 1, createdAt: -1 })
MessageSchema.index({ sender: 1 })
MessageSchema.index({ receiver: 1 })

ConversationSchema.index({ participants: 1 })
ConversationSchema.index({ lastMessageAt: -1 })

export const Message = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema)
export const Conversation =
  mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema)
