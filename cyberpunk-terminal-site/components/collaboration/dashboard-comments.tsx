"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, Send } from "lucide-react"
import type { Comment, User } from "@/lib/collaboration-service"

interface DashboardCommentsProps {
  comments: Comment[]
  users: User[]
  onAddComment: (content: string, x: number, y: number) => void
  currentUser: User
}

export default function DashboardComments({ comments, users, onAddComment, currentUser }: DashboardCommentsProps) {
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 })

  const handleAddComment = (e: React.MouseEvent) => {
    if (isAddingComment) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setCommentPosition({ x, y })
    }
  }

  const submitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment, commentPosition.x, commentPosition.y)
      setNewComment("")
      setIsAddingComment(false)
    }
  }

  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  return (
    <div className="relative w-full h-full">
      {/* Comment Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsAddingComment(!isAddingComment)}
          className={`flex items-center gap-2 px-3 py-2 rounded border transition-colors ${
            isAddingComment
              ? "bg-yellow-400/20 text-yellow-400 border-yellow-400/30"
              : "bg-gray-800 text-gray-400 border-gray-600/30 hover:text-yellow-400"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{isAddingComment ? "Cancel" : "Add Comment"}</span>
        </button>
      </div>

      {/* Click overlay for adding comments */}
      {isAddingComment && <div className="absolute inset-0 cursor-crosshair z-20" onClick={handleAddComment} />}

      {/* Existing Comments */}
      {comments.map((comment) => {
        const user = getUserById(comment.userId)
        return (
          <div key={comment.id} className="absolute z-30" style={{ left: comment.x, top: comment.y }}>
            {/* Comment Marker */}
            <div className="relative">
              <div
                className="w-6 h-6 rounded-full border-2 border-yellow-400 bg-yellow-400/20 flex items-center justify-center cursor-pointer group"
                style={{ backgroundColor: user?.color + "20", borderColor: user?.color }}
              >
                <MessageCircle className="w-3 h-3" style={{ color: user?.color }} />
              </div>

              {/* Comment Popup */}
              <div className="absolute left-8 top-0 w-64 bg-gray-900 border border-gray-600/30 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: user?.color }}
                    >
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-300">{user?.name}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-gray-300">{comment.content}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* New Comment Input */}
      {isAddingComment && commentPosition.x > 0 && (
        <div
          className="absolute z-40 w-64 bg-gray-900 border border-yellow-400/30 rounded-lg shadow-xl"
          style={{ left: commentPosition.x, top: commentPosition.y }}
        >
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: currentUser.color }}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-300">{currentUser.name}</span>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 bg-gray-800 border border-gray-600/30 rounded text-sm text-gray-300 resize-none"
              rows={3}
              autoFocus
            />

            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => {
                  setIsAddingComment(false)
                  setCommentPosition({ x: 0, y: 0 })
                  setNewComment("")
                }}
                className="text-xs text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={submitComment}
                disabled={!newComment.trim()}
                className="flex items-center gap-1 px-3 py-1 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded text-xs hover:bg-yellow-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3 h-3" />
                Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
