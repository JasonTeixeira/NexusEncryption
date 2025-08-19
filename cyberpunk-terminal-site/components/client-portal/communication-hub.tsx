"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import type { Message } from "@/lib/client-portal"

interface CommunicationHubProps {
  projectId: string
}

export function CommunicationHub({ projectId }: CommunicationHubProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/client-portal/messages?projectId=${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        })
        const data = await response.json()
        setMessages(data.messages || [])
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [projectId])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return

    setSending(true)

    try {
      const response = await fetch("/api/client-portal/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          projectId,
          content: newMessage,
          type: "text",
        }),
      })

      const data = await response.json()
      setMessages((prev) => [...prev, data.message])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="bg-black/95 border border-cyan-500/50 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-cyan-500/20 rounded"></div>
          <div className="h-32 bg-cyan-500/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/95 border border-cyan-500/50 rounded-lg p-6 flex flex-col h-96">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
        <span className="text-cyan-400 font-mono text-lg">Project Communication</span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 mb-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400 text-sm font-mono">{message.senderName}</span>
                <span className="text-gray-500 text-xs">{message.timestamp.toLocaleString()}</span>
              </div>
              <div className="bg-gray-900/50 border border-gray-700/50 rounded p-3">
                <div className="text-gray-300 text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500 text-sm">No messages yet</div>
              <div className="text-gray-600 text-xs mt-1">Start a conversation with your project team</div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="flex space-x-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 bg-black/50 border-cyan-500/30 text-cyan-300 placeholder-cyan-500/50 text-sm resize-none"
          rows={2}
          disabled={sending}
        />
        <Button
          onClick={sendMessage}
          disabled={sending || !newMessage.trim()}
          className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 px-4"
        >
          {sending ? "..." : "Send"}
        </Button>
      </div>
    </div>
  )
}
