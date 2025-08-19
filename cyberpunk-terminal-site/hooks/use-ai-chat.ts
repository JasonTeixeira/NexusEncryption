"use client"

import type React from "react"
import { useState, useCallback } from "react"

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export function useAIChat() {
  const [isMinimized, setIsMinimized] = useState(true)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `NEXUS AI Assistant initialized. I'm here to help you explore Jason's technical expertise, projects, and cloud architecture experience. Type 'help' for available commands.

Ready to discuss cloud architecture, dashboard development, and technical capabilities!`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
    setInput(e.target.value)
  }, [])

  const sendMessage = useCallback(
    async (message: string): Promise<{ content: string; type?: string }> => {
      if (!message.trim()) {
        throw new Error("Message cannot be empty")
      }

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message.trim(),
            context: messages.slice(-5), // Send last 5 messages for context
          }),
        })

        if (!response.ok) {
          throw new Error(`AI API error: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        return {
          content: data.content,
          type: data.type || "text",
        }
      } catch (error) {
        console.error("AI Chat error:", error)
        // Fallback response if AI fails
        return {
          content:
            "I'm experiencing some technical difficulties right now, but I'd love to tell you about Jason's cloud architecture expertise and dashboard development skills. Try asking about his projects or technical stack!",
          type: "text",
        }
      }
    },
    [messages],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: input.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      // Add to command history
      if (!commandHistory.includes(input.trim())) {
        setCommandHistory((prev) => [...prev.slice(-19), input.trim()])
      }
      setHistoryIndex(-1)
      setInput("")

      try {
        const response = await sendMessage(input.trim())
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.content,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        setError(err as Error)
        // Add error message to chat
        const errorMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again or ask about Jason's technical expertise!",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [input, isLoading, commandHistory, sendMessage],
  )

  const toggleMinimized = () => setIsMinimized(!isMinimized)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        handleInputChange({
          target: { value: commandHistory[commandHistory.length - 1 - newIndex] },
        })
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        handleInputChange({
          target: { value: commandHistory[commandHistory.length - 1 - newIndex] },
        })
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        handleInputChange({ target: { value: "" } })
      }
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `NEXUS AI Assistant initialized. I'm here to help you explore Jason's technical expertise, projects, and cloud architecture experience. Type 'help' for available commands.

Ready to discuss cloud architecture, dashboard development, and technical capabilities!`,
        timestamp: new Date(),
      },
    ])
  }

  const reload = clearChat
  const stop = () => setIsLoading(false)

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    isLoading,
    error,
    isMinimized,
    toggleMinimized,
    commandHistory,
    clearChat,
    stop,
    reload,
    sendMessage,
  }
}
