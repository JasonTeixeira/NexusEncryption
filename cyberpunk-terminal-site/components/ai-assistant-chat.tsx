"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  type?: "text" | "error" | "system"
}

interface AIAssistantChatProps {
  context?: {
    currentPage?: string
    userProfile?: {
      skills: string[]
      experience: string
      goals: string[]
    }
  }
}

export function AIAssistantChat({ context }: AIAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "NEXUS AI Assistant initialized. How can I help you with your cloud engineering journey?",
      sender: "assistant",
      timestamp: new Date(),
      type: "system",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          context,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "assistant",
        timestamp: new Date(data.timestamp),
        type: data.type,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Connection error. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
        type: "error",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
        >
          <span className="mr-2">🤖</span>
          NEXUS AI
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-black/95 border border-cyan-500/50 rounded-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-cyan-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-cyan-400 font-mono text-sm">NEXUS AI Assistant</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400"
          />
          <button
            onClick={() => setMessages([messages[0]])}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400"
          />
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-2 rounded text-xs font-mono ${
                  message.sender === "user"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : message.type === "error"
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : message.type === "system"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-50 mt-1">{message.timestamp.toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-500/20 text-gray-300 border border-gray-500/30 p-2 rounded text-xs font-mono">
                <div className="flex items-center space-x-1">
                  <span>NEXUS is thinking</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-cyan-500/30">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask NEXUS anything..."
            className="bg-black/50 border-cyan-500/30 text-cyan-300 placeholder-cyan-500/50 text-xs font-mono"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 px-3"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  )
}
