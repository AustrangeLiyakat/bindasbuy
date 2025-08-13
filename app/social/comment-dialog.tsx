"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import type { Post, Comment } from "@/types/social"
import { addComment } from "@/lib/social"
import { Heart, Send } from "lucide-react"

interface CommentDialogProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
  onPostUpdate: (post: Post) => void
}

export function CommentDialog({ post, open, onOpenChange, onPostUpdate }: CommentDialogProps) {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState("")

  const handleSubmitComment = () => {
    if (!newComment.trim() || !user) return

    const comment = addComment(post.id, newComment.trim(), user.id, user.fullName)
    if (comment) {
      // Update the post with new comment
      const updatedPost = { ...post, comments: [...post.comments, comment] }
      onPostUpdate(updatedPost)
      setNewComment("")
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        {/* Comments List */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {post.comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No comments yet</p>
                <p className="text-sm">Be the first to comment!</p>
              </div>
            ) : (
              post.comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
            )}
          </div>
        </ScrollArea>

        {/* Add Comment */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Avatar className="w-8 h-8">
            <AvatarFallback>
              {user?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
            />
            <Button size="sm" onClick={handleSubmitComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.userAvatar || "/placeholder.svg"} />
          <AvatarFallback>
            {comment.userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg px-3 py-2">
            <div className="font-semibold text-sm">{comment.userName}</div>
            <p className="text-sm">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
            <span>{formatTimeAgo(comment.createdAt)}</span>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
              <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`} />
              {comment.likes > 0 && comment.likes}
            </Button>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
              Reply
            </Button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="ml-11 space-y-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={reply.userAvatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {reply.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="font-semibold text-xs">{reply.userName}</div>
                  <p className="text-xs">{reply.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                  <span>{formatTimeAgo(reply.createdAt)}</span>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                    <Heart className={`h-3 w-3 mr-1 ${reply.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    {reply.likes > 0 && reply.likes}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
