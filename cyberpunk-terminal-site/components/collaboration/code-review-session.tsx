"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { webrtcService } from "@/lib/webrtc-service"

interface CodeComment {
  id: string
  line: number
  author: string
  content: string
  timestamp: Date
  resolved: boolean
}

interface CodeReviewSessionProps {
  initialCode?: string
  language?: string
}

export function CodeReviewSession({ initialCode = "", language = "typescript" }: CodeReviewSessionProps) {
  const [code, setCode] = useState(initialCode)
  const [comments, setComments] = useState<CodeComment[]>([])
  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [connectedPeers, setConnectedPeers] = useState<string[]>([])
  const [cursors, setCursors] = useState<Map<string, { line: number; column: number }>>(new Map())

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setCode(newCode)

    if (isCollaborating) {
      const cursorPosition = e.target.selectionStart
      const lines = newCode.substring(0, cursorPosition).split("\n")
      const line = lines.length
      const column = lines[lines.length - 1].length

      webrtcService.broadcastData({
        type: "code-change",
        data: {
          code: newCode,
          cursor: { line, column },
          timestamp: Date.now(),
        },
      })
    }
  }

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber)
  }

  const addComment = () => {
    if (!newComment.trim() || selectedLine === null) return

    const comment: CodeComment = {
      id: Date.now().toString(),
      line: selectedLine,
      author: "You",
      content: newComment,
      timestamp: new Date(),
      resolved: false,
    }

    setComments((prev) => [...prev, comment])
    setNewComment("")
    setSelectedLine(null)

    if (isCollaborating) {
      webrtcService.broadcastData({
        type: "code-comment",
        data: comment,
      })
    }
  }

  const resolveComment = (commentId: string) => {
    setComments((prev) => prev.map((comment) => (comment.id === commentId ? { ...comment, resolved: true } : comment)))

    if (isCollaborating) {
      webrtcService.broadcastData({
        type: "resolve-comment",
        data: { commentId },
      })
    }
  }

  const startCollaboration = async () => {
    try {
      setIsCollaborating(true)

      webrtcService.setEventHandlers({
        onDataMessage: (data, peerId) => {
          switch (data.type) {
            case "code-change":
              setCode(data.data.code)
              setCursors((prev) => new Map(prev.set(peerId, data.data.cursor)))
              break
            case "code-comment":
              setComments((prev) => [...prev, { ...data.data, author: `Peer ${peerId.slice(0, 8)}` }])
              break
            case "resolve-comment":
              setComments((prev) =>
                prev.map((comment) => (comment.id === data.data.commentId ? { ...comment, resolved: true } : comment)),
              )
              break
          }
        },
        onConnectionStateChange: (state, peerId) => {
          if (state === "connected") {
            setConnectedPeers((prev) => [...prev.filter((id) => id !== peerId), peerId])
            // Send current code state to new peer
            webrtcService.sendData(peerId, {
              type: "sync-state",
              data: { code, comments },
            })
          } else if (state === "disconnected") {
            setConnectedPeers((prev) => prev.filter((id) => id !== peerId))
            setCursors((prev) => {
              const newCursors = new Map(prev)
              newCursors.delete(peerId)
              return newCursors
            })
          }
        },
      })
    } catch (error) {
      console.error("Failed to start collaboration:", error)
      setIsCollaborating(false)
    }
  }

  const renderCodeWithLineNumbers = () => {
    const lines = code.split("\n")
    return lines.map((line, index) => {
      const lineNumber = index + 1
      const lineComments = comments.filter((comment) => comment.line === lineNumber && !comment.resolved)
      const hasComments = lineComments.length > 0
      const isSelected = selectedLine === lineNumber

      return (
        <div
          key={lineNumber}
          className={`flex ${isSelected ? "bg-cyan-500/10" : ""} ${hasComments ? "bg-yellow-500/10" : ""}`}
        >
          <div
            className={`w-12 text-right pr-2 py-1 text-xs font-mono cursor-pointer select-none ${
              hasComments ? "text-yellow-400" : "text-gray-500"
            } hover:text-cyan-400`}
            onClick={() => handleLineClick(lineNumber)}
          >
            {lineNumber}
          </div>
          <div className="flex-1 py-1 px-2 text-sm font-mono text-gray-300 whitespace-pre-wrap">{line || " "}</div>
          {hasComments && (
            <div className="w-4 flex items-center justify-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="bg-black/95 border border-cyan-500/50 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-cyan-400 font-mono text-sm">Code Review Session</span>
          {isCollaborating && <span className="text-green-400 text-xs">({connectedPeers.length} connected)</span>}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={isCollaborating ? () => setIsCollaborating(false) : startCollaboration}
            className={`text-xs px-3 py-1 ${
              isCollaborating
                ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                : "bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
            }`}
          >
            {isCollaborating ? "Stop Sharing" : "Start Collaboration"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Code Editor */}
        <div className="lg:col-span-2">
          <div className="border border-gray-700/50 rounded">
            <div className="bg-gray-900/50 px-3 py-2 border-b border-gray-700/50">
              <span className="text-cyan-400 text-xs font-mono">{language}</span>
            </div>
            <div className="relative">
              <ScrollArea className="h-96">
                <div className="absolute inset-0 pointer-events-none">{renderCodeWithLineNumbers()}</div>
              </ScrollArea>
              <Textarea
                ref={textareaRef}
                value={code}
                onChange={handleCodeChange}
                className="absolute inset-0 w-full h-96 bg-transparent border-none text-transparent caret-cyan-400 resize-none font-mono text-sm leading-6 pl-14"
                style={{ caretColor: "#00ffff" }}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Comments Panel */}
        <div className="space-y-4">
          {/* Add Comment */}
          {selectedLine !== null && (
            <div className="bg-gray-900/50 border border-gray-700/50 rounded p-3">
              <div className="text-cyan-400 text-xs mb-2">Comment on line {selectedLine}</div>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                className="bg-black/50 border-gray-600/50 text-gray-300 text-xs mb-2"
                rows={3}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={addComment}
                  className="text-xs px-3 py-1 bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
                >
                  Add Comment
                </Button>
                <Button
                  onClick={() => setSelectedLine(null)}
                  className="text-xs px-3 py-1 bg-gray-500/20 border-gray-500/50 text-gray-400 hover:bg-gray-500/30"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="bg-gray-900/50 border border-gray-700/50 rounded">
            <div className="px-3 py-2 border-b border-gray-700/50">
              <span className="text-cyan-400 text-xs font-mono">
                Comments ({comments.filter((c) => !c.resolved).length})
              </span>
            </div>
            <ScrollArea className="h-64">
              <div className="p-3 space-y-3">
                {comments
                  .filter((comment) => !comment.resolved)
                  .map((comment) => (
                    <div key={comment.id} className="bg-black/50 border border-gray-600/50 rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-yellow-400 text-xs">Line {comment.line}</span>
                        <span className="text-gray-500 text-xs">{comment.author}</span>
                      </div>
                      <div className="text-gray-300 text-xs mb-2">{comment.content}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">{comment.timestamp.toLocaleTimeString()}</span>
                        <Button
                          onClick={() => resolveComment(comment.id)}
                          className="text-xs px-2 py-1 bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                {comments.filter((c) => !c.resolved).length === 0 && (
                  <div className="text-gray-500 text-xs text-center py-4">No active comments</div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
