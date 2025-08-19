"use client"

import { useState } from "react"
import { Copy, Check, Terminal, User, AlertTriangle, Info } from "lucide-react"
import { useSound } from "@/contexts/sound-context"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  type?: "text" | "error" | "system"
}

interface AIChatMessageProps {
  message: Message
}

export function AIChatMessage({ message }: AIChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const { playSuccess } = useSound()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      playSuccess()
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getMessageIcon = () => {
    if (message.role === "user") {
      return <User className="w-4 h-4 text-cyan-400" />
    }

    switch (message.type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "system":
        return <Info className="w-4 h-4 text-green-400" />
      default:
        return <Terminal className="w-4 h-4 text-green-400" />
    }
  }

  const getMessageStyles = () => {
    if (message.role === "user") {
      return "bg-cyan-500/10 border-cyan-500/30 text-gray-300"
    }

    switch (message.type) {
      case "error":
        return "bg-red-500/10 border-red-500/30 text-gray-300"
      case "system":
        return "bg-green-500/10 border-green-500/30 text-gray-300"
      default:
        return "bg-green-500/5 border-green-500/20 text-gray-300"
    }
  }

  const getHeaderStyles = () => {
    if (message.role === "user") {
      return "text-cyan-400"
    }

    switch (message.type) {
      case "error":
        return "text-red-400"
      case "system":
        return "text-green-400"
      default:
        return "text-green-400"
    }
  }

  return (
    <div className="flex items-start gap-2">
      {message.role === "user" && (
        <div className="text-cyan-400 font-mono text-sm" aria-label="User input">
          <span className="text-cyan-400">user@nexus</span>
          <span className="text-gray-500">:</span>
          <span className="text-cyan-400">~$</span> {message.content}
        </div>
      )}

      {message.role === "assistant" && (
        <div className="text-gray-300 font-mono text-sm" role="status">
          <div className="flex items-center gap-2 mb-1">
            {getMessageIcon()}
            <span className={`font-mono text-xs ${getHeaderStyles()}`}>
              [{formatTimestamp(message.timestamp)}] NEXUS:
            </span>
            <button
              onClick={copyToClipboard}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white ml-auto"
              aria-label="Copy message"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="pl-6 leading-relaxed whitespace-pre-wrap">{message.content}</div>
        </div>
      )}
    </div>
  )
}
