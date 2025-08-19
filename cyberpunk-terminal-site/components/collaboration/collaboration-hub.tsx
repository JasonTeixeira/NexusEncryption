"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { VirtualWhiteboard } from "./virtual-whiteboard"
import { CodeReviewSession } from "./code-review-session"
import { ScreenShare } from "./screen-share"

type CollaborationTool = "whiteboard" | "code-review" | "screen-share" | null

export function CollaborationHub() {
  const [activeTool, setActiveTool] = useState<CollaborationTool>(null)
  const [isMinimized, setIsMinimized] = useState(false)

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
        >
          <span className="mr-2">🤝</span>
          Collaboration Tools
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-4 z-40 bg-black/95 border border-purple-500/50 rounded-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-purple-400 font-mono text-lg">Collaboration Hub</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400"
          />
          <button onClick={() => setActiveTool(null)} className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400" />
        </div>
      </div>

      {/* Tool Selection */}
      {!activeTool && (
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <div
              onClick={() => setActiveTool("whiteboard")}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6 cursor-pointer hover:border-cyan-400/50 transition-colors group"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-cyan-400 font-mono text-lg mb-2">Virtual Whiteboard</h3>
                <p className="text-gray-400 text-sm">
                  Collaborative drawing and diagramming for real-time visual communication
                </p>
                <div className="mt-4 text-cyan-300 text-xs group-hover:text-cyan-200">Click to start →</div>
              </div>
            </div>

            <div
              onClick={() => setActiveTool("code-review")}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 cursor-pointer hover:border-green-400/50 transition-colors group"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-green-400 font-mono text-lg mb-2">Code Review</h3>
                <p className="text-gray-400 text-sm">
                  Live code collaboration with comments, suggestions, and real-time editing
                </p>
                <div className="mt-4 text-green-300 text-xs group-hover:text-green-200">Click to start →</div>
              </div>
            </div>

            <div
              onClick={() => setActiveTool("screen-share")}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 cursor-pointer hover:border-purple-400/50 transition-colors group"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">📺</div>
                <h3 className="text-purple-400 font-mono text-lg mb-2">Screen Share</h3>
                <p className="text-gray-400 text-sm">
                  Share your screen for presentations, demos, and collaborative troubleshooting
                </p>
                <div className="mt-4 text-purple-300 text-xs group-hover:text-purple-200">Click to start →</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Tool */}
      {activeTool && (
        <div className="flex-1 p-4 overflow-auto">
          <div className="mb-4">
            <Button
              onClick={() => setActiveTool(null)}
              className="bg-gray-500/20 border border-gray-500/50 text-gray-400 hover:bg-gray-500/30 text-xs"
            >
              ← Back to Tools
            </Button>
          </div>

          {activeTool === "whiteboard" && <VirtualWhiteboard />}
          {activeTool === "code-review" && <CodeReviewSession />}
          {activeTool === "screen-share" && <ScreenShare />}
        </div>
      )}
    </div>
  )
}
