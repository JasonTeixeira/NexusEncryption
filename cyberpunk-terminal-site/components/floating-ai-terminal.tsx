"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Minus, Maximize2, Minimize2, MessageSquare } from "lucide-react"
import { AITerminalChat } from "./ai-terminal-chat"
import { useSound } from "@/contexts/sound-context"

interface Position {
  x: number
  y: number
}

export function FloatingAITerminal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const [isMaximized, setIsMaximized] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const { playCommand, playSuccess } = useSound()

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return

    const rect = terminalRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
      playCommand()
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      // Keep within viewport bounds
      const maxX = window.innerWidth - 400
      const maxY = window.innerHeight - 300

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
    playSuccess()
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
    playCommand()
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
    playCommand()
  }

  const closeTerminal = () => {
    setIsOpen(false)
    setIsMinimized(false)
    setIsMaximized(false)
    playCommand()
  }

  // Floating button when closed
  if (!isOpen) {
    return (
      <button onClick={toggleOpen} className="fixed bottom-6 right-6 z-50 group" aria-label="Open AI Assistant">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />

          {/* Main button */}
          <div
            className="relative bg-black/90 border border-cyan-400/50 rounded-full p-4 
                         hover:border-cyan-400 transition-all duration-300 
                         hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]
                         group-hover:scale-110"
          >
            <MessageSquare className="w-6 h-6 text-cyan-400" />
          </div>

          {/* Pulse ring */}
          <div
            className="absolute inset-0 border-2 border-cyan-400/30 rounded-full 
                         animate-ping opacity-75"
          />
        </div>

        {/* Tooltip */}
        <div
          className="absolute bottom-full right-0 mb-2 px-3 py-1 
                       bg-black/90 border border-cyan-400/50 rounded
                       text-cyan-400 text-sm whitespace-nowrap
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          AI Assistant
        </div>
      </button>
    )
  }

  return (
    <div
      ref={terminalRef}
      className={`fixed z-40 transition-all duration-300 ${
        isMaximized ? "inset-4" : isMinimized ? "w-96 h-12" : "w-[600px] h-[500px]"
      }`}
      style={
        isMaximized
          ? {}
          : {
              left: position.x,
              top: position.y,
            }
      }
    >
      <div className="h-full bg-[#0A0A0F] border border-cyan-400/30 rounded-lg shadow-2xl overflow-hidden relative">
        <div
          className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent opacity-20 animate-pulse"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"
          aria-hidden="true"
        />

        <div
          className="relative z-30 bg-[#1C1C24] px-4 py-3 flex items-center justify-between border-b border-cyan-400/20 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C940]" />
            </div>
            <span className="text-gray-400 text-sm font-mono ml-2">AI Assistant</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMinimize}
              className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 p-1"
              aria-label="Minimize"
            >
              <Minus className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMaximize}
              className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 p-1"
              aria-label={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={closeTerminal}
              className="text-gray-500 hover:text-red-400 transition-colors duration-300 p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="relative z-30 h-[calc(100%-60px)] overflow-hidden">
            <AITerminalChat />
          </div>
        )}
      </div>
    </div>
  )
}
