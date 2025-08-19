"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { CheckCircle, Loader2, Terminal } from "lucide-react"

interface TerminalTransitionProps {
  onComplete?: () => void
  duration?: number
  targetPage?: string
}

interface CommandLine {
  type: "command" | "output" | "success" | "error" | "loading"
  text: string
  delay?: number
}

export default function TerminalTransition({
  onComplete,
  duration = 1000, // Optimized duration for snappier transitions
  targetPage = "application",
}: TerminalTransitionProps) {
  const [lines, setLines] = useState<CommandLine[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [currentText, setCurrentText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [progress, setProgress] = useState(0)

  const commandSequence: CommandLine[] = useMemo(
    () => [
      { type: "command", text: "$ navigate --to=" + targetPage, delay: 0 },
      { type: "output", text: "Initializing navigation...", delay: 100 },
      { type: "success", text: "✓ Route validated", delay: 100 },
      { type: "loading", text: "Loading " + targetPage, delay: 200 },
      { type: "success", text: "✓ Ready to proceed", delay: 100 },
    ],
    [targetPage],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 100 / (duration / 50) // Smoother increments
      })
    }, 50)
    return () => clearInterval(interval)
  }, [duration])

  const typeText = useCallback((text: string, callback?: () => void) => {
    setIsTyping(true)
    let charIndex = 0
    const typingInterval = setInterval(() => {
      if (charIndex <= text.length) {
        setCurrentText(text.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
        if (callback) callback()
      }
    }, 15) // Faster typing speed
  }, [])

  // Process command sequence
  useEffect(() => {
    if (currentLineIndex >= commandSequence.length) {
      setTimeout(() => {
        if (onComplete) onComplete()
      }, 200) // Reduced delay
      return
    }

    const currentCommand = commandSequence[currentLineIndex]

    setTimeout(() => {
      typeText(currentCommand.text, () => {
        setLines((prev) => [...prev, { ...currentCommand, text: currentText }])
        setCurrentText("")
        setCurrentLineIndex((prev) => prev + 1)
      })
    }, currentCommand.delay || 0)
  }, [currentLineIndex, commandSequence, typeText, currentText, onComplete])

  // Get color based on line type
  const getLineColor = (type: CommandLine["type"]) => {
    switch (type) {
      case "command":
        return "text-cyan-400"
      case "success":
        return "text-green-400"
      case "error":
        return "text-red-400"
      case "loading":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center terminal-transition-enter">
      {/* Terminal Window */}
      <div className="relative w-full max-w-3xl mx-4">
        <div className="relative bg-gray-900/98 rounded-lg shadow-2xl border border-gray-800 overflow-hidden backdrop-blur-sm">
          {/* Terminal Header */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: "0.1s" }} />
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
              </div>
              <div className="ml-4 flex items-center gap-2 text-gray-400">
                <Terminal className="w-4 h-4" />
                <span className="text-xs font-mono">Navigation Terminal</span>
              </div>
            </div>
            <div className="text-gray-400 text-xs font-mono uppercase tracking-wider">NEXUS@ARCHITECT:~</div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 h-80 overflow-y-auto font-mono text-sm">
            {/* Rendered lines */}
            {lines.map((line, index) => (
              <div key={index} className={`mb-2 ${getLineColor(line.type)} animate-fadeIn`}>
                {line.type === "loading" && (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {line.text}
                    <span className="animate-pulse">...</span>
                  </span>
                )}
                {line.type === "success" && (
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    {line.text}
                  </span>
                )}
                {(line.type === "command" || line.type === "output" || line.type === "error") && line.text}
              </div>
            ))}

            {/* Currently typing line */}
            {isTyping && currentText && (
              <div className={`mb-2 ${getLineColor(commandSequence[currentLineIndex]?.type || "output")}`}>
                {commandSequence[currentLineIndex]?.type === "loading" && (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {currentText}
                  </span>
                )}
                {commandSequence[currentLineIndex]?.type !== "loading" && currentText}
                {showCursor && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="font-mono">Navigation Progress</span>
              <span className="font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-green-500 to-cyan-500 transition-all duration-100 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-gray-800 px-6 py-2 border-t border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4 font-mono">
                <span className="text-green-400">● Connected</span>
                <span>Navigating to {targetPage}</span>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span className="text-cyan-400">LOADING...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
