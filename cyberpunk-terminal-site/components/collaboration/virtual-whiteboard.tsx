"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { webrtcService } from "@/lib/webrtc-service"

interface DrawingData {
  type: "draw" | "clear" | "undo"
  x?: number
  y?: number
  prevX?: number
  prevY?: number
  color?: string
  lineWidth?: number
  timestamp: number
}

export function VirtualWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser">("pen")
  const [currentColor, setCurrentColor] = useState("#00ffff")
  const [lineWidth, setLineWidth] = useState(2)
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [connectedPeers, setConnectedPeers] = useState<string[]>([])

  const drawingHistory = useRef<DrawingData[]>([])

  const draw = useCallback(
    (x: number, y: number, prevX?: number, prevY?: number, color = currentColor, width = lineWidth) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      if (prevX !== undefined && prevY !== undefined) {
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(x, y, width / 2, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    [currentColor, lineWidth],
  )

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    draw(x, y)

    const drawingData: DrawingData = {
      type: "draw",
      x,
      y,
      color: currentTool === "eraser" ? "#000000" : currentColor,
      lineWidth: currentTool === "eraser" ? lineWidth * 3 : lineWidth,
      timestamp: Date.now(),
    }

    drawingHistory.current.push(drawingData)

    if (isCollaborating) {
      webrtcService.broadcastData({
        type: "whiteboard",
        data: drawingData,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const lastDrawing = drawingHistory.current[drawingHistory.current.length - 1]
    const prevX = lastDrawing?.x
    const prevY = lastDrawing?.y

    draw(x, y, prevX, prevY, currentTool === "eraser" ? "#000000" : currentColor)

    const drawingData: DrawingData = {
      type: "draw",
      x,
      y,
      prevX,
      prevY,
      color: currentTool === "eraser" ? "#000000" : currentColor,
      lineWidth: currentTool === "eraser" ? lineWidth * 3 : lineWidth,
      timestamp: Date.now(),
    }

    drawingHistory.current.push(drawingData)

    if (isCollaborating) {
      webrtcService.broadcastData({
        type: "whiteboard",
        data: drawingData,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawingHistory.current = []

    if (isCollaborating) {
      webrtcService.broadcastData({
        type: "whiteboard",
        data: { type: "clear", timestamp: Date.now() },
      })
    }
  }

  const undoLastAction = () => {
    if (drawingHistory.current.length === 0) return

    drawingHistory.current.pop()
    redrawCanvas()

    if (isCollaborating) {
      webrtcService.broadcastData({
        type: "whiteboard",
        data: { type: "undo", timestamp: Date.now() },
      })
    }
  }

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawingHistory.current.forEach((drawing) => {
      if (drawing.type === "draw" && drawing.x !== undefined && drawing.y !== undefined) {
        draw(drawing.x, drawing.y, drawing.prevX, drawing.prevY, drawing.color, drawing.lineWidth)
      }
    })
  }

  const startCollaboration = async () => {
    try {
      setIsCollaborating(true)

      webrtcService.setEventHandlers({
        onDataMessage: (data, peerId) => {
          if (data.type === "whiteboard") {
            handleRemoteDrawing(data.data)
          }
        },
        onConnectionStateChange: (state, peerId) => {
          if (state === "connected") {
            setConnectedPeers((prev) => [...prev.filter((id) => id !== peerId), peerId])
          } else if (state === "disconnected") {
            setConnectedPeers((prev) => prev.filter((id) => id !== peerId))
          }
        },
      })
    } catch (error) {
      console.error("Failed to start collaboration:", error)
      setIsCollaborating(false)
    }
  }

  const handleRemoteDrawing = (drawingData: DrawingData) => {
    if (drawingData.type === "draw" && drawingData.x !== undefined && drawingData.y !== undefined) {
      draw(drawingData.x, drawingData.y, drawingData.prevX, drawingData.prevY, drawingData.color, drawingData.lineWidth)
      drawingHistory.current.push(drawingData)
    } else if (drawingData.type === "clear") {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
        drawingHistory.current = []
      }
    } else if (drawingData.type === "undo") {
      drawingHistory.current.pop()
      redrawCanvas()
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Set initial background
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  return (
    <div className="bg-black/95 border border-cyan-500/50 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-cyan-400 font-mono text-sm">Virtual Whiteboard</span>
          {isCollaborating && <span className="text-green-400 text-xs">({connectedPeers.length} connected)</span>}
        </div>
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

      {/* Toolbar */}
      <div className="flex items-center space-x-4 mb-4 p-2 bg-gray-900/50 rounded border border-gray-700/50">
        <div className="flex space-x-2">
          <Button
            onClick={() => setCurrentTool("pen")}
            className={`text-xs px-3 py-1 ${
              currentTool === "pen"
                ? "bg-cyan-500/30 border-cyan-500/50 text-cyan-300"
                : "bg-gray-700/30 border-gray-600/50 text-gray-400"
            }`}
          >
            Pen
          </Button>
          <Button
            onClick={() => setCurrentTool("eraser")}
            className={`text-xs px-3 py-1 ${
              currentTool === "eraser"
                ? "bg-cyan-500/30 border-cyan-500/50 text-cyan-300"
                : "bg-gray-700/30 border-gray-600/50 text-gray-400"
            }`}
          >
            Eraser
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-cyan-400 text-xs">Color:</span>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-6 h-6 rounded border border-cyan-500/50"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-cyan-400 text-xs">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-16"
          />
          <span className="text-cyan-300 text-xs w-6">{lineWidth}</span>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={undoLastAction}
            className="text-xs px-3 py-1 bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30"
          >
            Undo
          </Button>
          <Button
            onClick={clearCanvas}
            className="text-xs px-3 py-1 bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="border border-cyan-500/30 rounded">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair"
          style={{ display: "block" }}
        />
      </div>
    </div>
  )
}
