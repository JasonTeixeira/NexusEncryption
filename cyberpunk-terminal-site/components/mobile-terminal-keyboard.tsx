"use client"

import { useState } from "react"
import { useSound } from "@/contexts/sound-context"

interface MobileTerminalKeyboardProps {
  onKeyPress: (key: string) => void
  onCommand: (command: string) => void
  suggestions?: string[]
  visible?: boolean
}

export default function MobileTerminalKeyboard({
  onKeyPress,
  onCommand,
  suggestions = [],
  visible = true,
}: MobileTerminalKeyboardProps) {
  const [currentInput, setCurrentInput] = useState("")
  const { playTyping, playCommand } = useSound()

  const commonCommands = ["help", "clear", "ls", "pwd", "whoami", "date", "enter", "open", "start"]

  const handleKeyPress = (key: string) => {
    playTyping()

    if (key === "BACKSPACE") {
      const newInput = currentInput.slice(0, -1)
      setCurrentInput(newInput)
      onKeyPress("Backspace")
    } else if (key === "ENTER") {
      playCommand()
      onCommand(currentInput)
      setCurrentInput("")
    } else if (key === "CLEAR") {
      setCurrentInput("")
    } else {
      const newInput = currentInput + key
      setCurrentInput(newInput)
      onKeyPress(key)
    }
  }

  const handleSuggestionTap = (suggestion: string) => {
    playCommand()
    setCurrentInput(suggestion)
    onCommand(suggestion)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-green-500/20 p-4 z-40">
      {/* Current Input Display */}
      <div className="mb-4 p-3 bg-black/50 rounded border border-green-500/20 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-green-400">$</span>
          <span className="text-cyan-400">{currentInput}</span>
          <span className="animate-pulse text-cyan-400">_</span>
        </div>
      </div>

      {/* Command Suggestions */}
      {(suggestions.length > 0 || commonCommands.length > 0) && (
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Quick Commands</div>
          <div className="flex flex-wrap gap-2">
            {(suggestions.length > 0 ? suggestions : commonCommands).slice(0, 6).map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleSuggestionTap(cmd)}
                className="px-3 py-2 bg-green-500/10 border border-green-500/20 rounded text-sm font-mono text-green-400 hover:bg-green-500/20 active:bg-green-500/30 transition-all duration-200 touch-manipulation"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Virtual Keyboard */}
      <div className="space-y-2">
        {/* First Row */}
        <div className="flex gap-1">
          {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="flex-1 h-10 bg-gray-800 border border-gray-600 rounded text-white font-mono text-sm hover:bg-gray-700 active:bg-gray-600 transition-all duration-150 touch-manipulation"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Second Row */}
        <div className="flex gap-1">
          {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="flex-1 h-10 bg-gray-800 border border-gray-600 rounded text-white font-mono text-sm hover:bg-gray-700 active:bg-gray-600 transition-all duration-150 touch-manipulation"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Third Row */}
        <div className="flex gap-1">
          {["z", "x", "c", "v", "b", "n", "m"].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="flex-1 h-10 bg-gray-800 border border-gray-600 rounded text-white font-mono text-sm hover:bg-gray-700 active:bg-gray-600 transition-all duration-150 touch-manipulation"
            >
              {key}
            </button>
          ))}
          <button
            onClick={() => handleKeyPress("BACKSPACE")}
            className="flex-1 h-10 bg-red-800/50 border border-red-600/50 rounded text-red-400 font-mono text-xs hover:bg-red-700/50 active:bg-red-600/50 transition-all duration-150 touch-manipulation"
          >
            ⌫
          </button>
        </div>

        {/* Fourth Row */}
        <div className="flex gap-1">
          <button
            onClick={() => handleKeyPress(" ")}
            className="flex-1 h-10 bg-gray-800 border border-gray-600 rounded text-white font-mono text-sm hover:bg-gray-700 active:bg-gray-600 transition-all duration-150 touch-manipulation"
          >
            SPACE
          </button>
          <button
            onClick={() => handleKeyPress("CLEAR")}
            className="px-4 h-10 bg-yellow-800/50 border border-yellow-600/50 rounded text-yellow-400 font-mono text-xs hover:bg-yellow-700/50 active:bg-yellow-600/50 transition-all duration-150 touch-manipulation"
          >
            CLR
          </button>
          <button
            onClick={() => handleKeyPress("ENTER")}
            className="px-6 h-10 bg-green-800/50 border border-green-600/50 rounded text-green-400 font-mono text-sm hover:bg-green-700/50 active:bg-green-600/50 transition-all duration-150 touch-manipulation"
          >
            ↵
          </button>
        </div>
      </div>
    </div>
  )
}
