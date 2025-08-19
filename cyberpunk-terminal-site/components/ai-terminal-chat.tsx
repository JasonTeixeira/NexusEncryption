"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Zap } from "lucide-react"
import { useAIChat } from "@/hooks/use-ai-chat"
import { useSound } from "@/contexts/sound-context"
import { AIChatMessage } from "./ai-chat-message"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  type?: "text" | "error" | "system"
}

export function AITerminalChat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "NEXUS AI Assistant initialized. I'm here to help you explore Jason's technical expertise, projects, and cloud architecture experience. Type 'help' for available commands.",
      role: "assistant",
      timestamp: new Date(),
      type: "system",
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { sendMessage, isLoading } = useAIChat()
  const { playCommand, playSuccess, playError } = useSound()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    playCommand()

    try {
      const response = await sendMessage(input.trim())

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: "assistant",
        timestamp: new Date(),
        type: response.type || "text",
      }

      setMessages((prev) => [...prev, assistantMessage])
      playSuccess()
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error ? error.message : "An error occurred. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        type: "error",
      }

      setMessages((prev) => [...prev, errorMessage])
      playError()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const quickCommands = [
    { label: "Projects", command: "show me your projects" },
    { label: "Skills", command: "what are your technical skills?" },
    { label: "Dashboards", command: "tell me about your dashboard capabilities" },
    { label: "Experience", command: "what's your cloud architecture experience?" },
  ]

  return (
    <div className="flex flex-col h-full bg-black/40">
      {/* Messages Area - matching main terminal styling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-cyan-400/50">
        {messages.map((message) => (
          <AIChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400/70">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
            <span className="text-sm font-mono">NEXUS is processing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Commands - updated styling to match terminal */}
      <div className="px-4 py-2 border-t border-cyan-400/20">
        <div className="flex flex-wrap gap-2 mb-2">
          {quickCommands.map((cmd) => (
            <button
              key={cmd.label}
              onClick={() => setInput(cmd.command)}
              className="px-2 py-1 text-xs bg-cyan-400/10 hover:bg-cyan-400/20 
                         border border-cyan-400/30 hover:border-cyan-400/50 
                         text-cyan-400 rounded transition-colors font-mono"
            >
              {cmd.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-cyan-400/20">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-mono" aria-hidden="true">
            $
          </span>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about projects, skills, or technical expertise..."
            disabled={isLoading}
            className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-600 
                       focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900
                       disabled:opacity-50 font-mono"
            autoFocus
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-cyan-400/10 hover:bg-cyan-400/20 
                       border border-cyan-400/30 hover:border-cyan-400/50 
                       text-cyan-400 rounded transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {isLoading ? <Zap className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  )
}
