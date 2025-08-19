"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, Copy, BookOpen, Clock, Tag, Eye, Heart, MessageCircle } from "lucide-react"
import { useSoundContext } from "@/contexts/sound-context"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  date: string
  tags: string[]
  status: "draft" | "published" | "archived"
  readTime: number
  category: string
  views: number
  likes: number
  comments: number
}

interface BlogPostModalProps {
  post: BlogPost
  isOpen: boolean
  onClose: () => void
}

export default function BlogPostModal({ post, isOpen, onClose }: BlogPostModalProps) {
  const [activeTab, setActiveTab] = useState<"read" | "info" | "terminal">("read")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isReading, setIsReading] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)
  const [liked, setLiked] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { playCommand, playSuccess, playError, playTyping } = useSoundContext()

  useEffect(() => {
    if (isOpen) {
      setActiveTab("read")
      setTerminalHistory([
        "╔══════════════════════════════════════════════════════════════╗",
        "║                    NEXUS BLOG READER v2.1                   ║",
        "║                  Advanced Terminal Interface                 ║",
        "╚══════════════════════════════════════════════════════════════╝",
        "",
        `Loading: "${post.title}"`,
        `Author: ${post.author} | Published: ${new Date(post.publishedAt).toLocaleDateString()}`,
        `Read Time: ${post.readTime} minutes | Category: ${post.category}`,
        "",
        'Type "help" for reading commands.',
        "",
      ])
      setReadingProgress(0)
      setIsReading(false)
    }
  }, [isOpen, post])

  const executeCommand = async (command: string) => {
    const cmd = command.trim().toLowerCase()
    const args = cmd.split(" ").slice(1)

    setTerminalHistory((prev) => [...prev, `reader@nexus:~$ ${command}`])
    playCommand()

    switch (cmd.split(" ")[0]) {
      case "help":
        setTerminalHistory((prev) => [
          ...prev,
          "Reading Commands:",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "read                   - Start reading the article",
          "read fast              - Read with faster typing speed",
          "read slow              - Read with slower typing speed",
          "info                   - Show article information",
          "bookmark               - Bookmark this article",
          "like                   - Like this article",
          "share                  - Get shareable link",
          "progress               - Show reading progress",
          "clear                  - Clear terminal",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        ])
        playSuccess()
        break

      case "read":
        setIsReading(true)
        setActiveTab("read")

        // Simulate reading progress
        let progress = 0
        const interval = setInterval(() => {
          progress += 2
          setReadingProgress(progress)
          if (progress >= 100) {
            clearInterval(interval)
            setIsReading(false)
            setTerminalHistory((prev) => [
              ...prev,
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
              "Article completed. Reading session finished.",
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            ])
            playSuccess()
          }
        }, 100)

        setTerminalHistory((prev) => [
          ...prev,
          "",
          `═══════════════════════════════════════════════════════════════`,
          `${post.title.toUpperCase()}`,
          `═══════════════════════════════════════════════════════════════`,
          "",
          "Starting reading session...",
        ])
        break

      case "info":
        setTerminalHistory((prev) => [
          ...prev,
          "Article Information:",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          `Title: ${post.title}`,
          `Author: ${post.author}`,
          `Published: ${new Date(post.publishedAt).toLocaleDateString()}`,
          `Read Time: ${post.readTime} minutes`,
          `Category: ${post.category}`,
          `Word Count: ~${post.content.split(" ").length} words`,
          `Tags: ${post.tags.join(", ")}`,
          `Views: ${post.views.toLocaleString()}`,
          `Likes: ${post.likes}`,
          `Comments: ${post.comments}`,
          `Status: ${bookmarked ? "Bookmarked ⭐" : "Not bookmarked"}`,
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        ])
        setActiveTab("info")
        playSuccess()
        break

      case "bookmark":
        setBookmarked(!bookmarked)
        setTerminalHistory((prev) => [
          ...prev,
          bookmarked ? "Article removed from bookmarks." : "Article bookmarked! ⭐",
        ])
        playSuccess()
        break

      case "like":
        setLiked(!liked)
        setTerminalHistory((prev) => [...prev, liked ? "Like removed." : "Article liked! ❤️"])
        playSuccess()
        break

      case "share":
        const shareUrl = `${window.location.origin}/blog/${post.slug}`
        setTerminalHistory((prev) => [...prev, "Shareable link generated:", shareUrl, "", "Link copied to clipboard!"])
        navigator.clipboard.writeText(shareUrl)
        playSuccess()
        break

      case "progress":
        setTerminalHistory((prev) => [
          ...prev,
          `Reading Progress: ${readingProgress}%`,
          isReading ? "Currently reading..." : readingProgress === 100 ? "Article completed!" : "Not started",
        ])
        playSuccess()
        break

      case "clear":
        setTerminalHistory([])
        playSuccess()
        break

      case "":
        break

      default:
        setTerminalHistory((prev) => [
          ...prev,
          `Command not found: ${cmd.split(" ")[0]}. Type "help" for available commands.`,
        ])
        playError()
        break
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (currentInput.trim()) {
        executeCommand(currentInput)
        setCurrentInput("")
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value)
    playTyping()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    playSuccess()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-full max-h-[95vh] bg-gray-950 border border-green-500/30 rounded-lg shadow-2xl shadow-green-500/20 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-green-500/30">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-green-400 font-mono text-sm">BLOG_READER@NEXUS:~/{post.slug}</div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-400 font-mono">
              Progress: {readingProgress}% | {post.readTime}min read
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition-colors p-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-green-500/20 bg-gray-900">
          {[
            { id: "read", label: "READ ARTICLE", icon: BookOpen },
            { id: "info", label: "ARTICLE INFO", icon: Eye },
            { id: "terminal", label: "TERMINAL", icon: MessageCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-6 py-3 font-mono text-sm transition-colors border-r border-green-500/20 ${
                activeTab === id
                  ? "bg-green-500/20 text-green-400 border-b-2 border-green-500"
                  : "text-gray-400 hover:text-green-400 hover:bg-green-500/10"
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "read" && (
            <div className="h-full overflow-y-auto p-6 bg-black/90">
              <div className="max-w-4xl mx-auto">
                {/* Article Header */}
                <div className="mb-8 pb-6 border-b border-green-500/20">
                  <h1 className="text-3xl font-bold text-green-400 mb-4 font-mono">{post.title}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>{post.readTime} min read</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye size={16} />
                      <span>{post.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart size={16} className={liked ? "text-red-400 fill-current" : ""} />
                      <span>{post.likes + (liked ? 1 : 0)} likes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tag size={16} />
                      <span>{post.category}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Article Content */}
                <div
                  ref={contentRef}
                  className="prose prose-invert prose-green max-w-none"
                  style={{
                    color: "#d1d5db",
                    fontFamily:
                      'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                  }}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>
                </div>

                {/* Reading Progress Bar */}
                {isReading && (
                  <div className="fixed bottom-4 left-4 right-4 bg-gray-900 border border-green-500/30 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400 font-mono text-sm">Reading Progress</span>
                      <span className="text-green-400 font-mono text-sm">{readingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${readingProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "info" && (
            <div className="h-full overflow-y-auto p-6 bg-black/90">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Article Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Views", value: post.views.toLocaleString(), color: "cyan" },
                    { label: "Likes", value: post.likes + (liked ? 1 : 0), color: "red" },
                    { label: "Comments", value: post.comments, color: "green" },
                    { label: "Read Time", value: `${post.readTime}m`, color: "yellow" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-900 border border-green-500/20 p-4 rounded">
                      <div className={`text-${stat.color}-400 text-2xl font-bold font-mono`}>{stat.value}</div>
                      <div className="text-gray-400 text-sm font-mono">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Article Details */}
                <div className="bg-gray-900 border border-green-500/20 p-6 rounded">
                  <h3 className="text-green-400 font-mono text-lg mb-4">Article Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                    <div>
                      <span className="text-gray-400">Title:</span>
                      <div className="text-green-400">{post.title}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Author:</span>
                      <div className="text-green-400">{post.author}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Published:</span>
                      <div className="text-green-400">{new Date(post.publishedAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Category:</span>
                      <div className="text-green-400">{post.category}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Word Count:</span>
                      <div className="text-green-400">~{post.content.split(" ").length} words</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <div className="text-green-400">{bookmarked ? "Bookmarked ⭐" : "Not bookmarked"}</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-gray-900 border border-green-500/20 p-6 rounded">
                  <h3 className="text-green-400 font-mono text-lg mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-900 border border-green-500/20 p-6 rounded">
                  <h3 className="text-green-400 font-mono text-lg mb-4">Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setBookmarked(!bookmarked)}
                      className={`px-4 py-2 border rounded font-mono text-sm transition-colors ${
                        bookmarked
                          ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                          : "bg-gray-800 border-gray-600 text-gray-400 hover:border-yellow-500/30"
                      }`}
                    >
                      {bookmarked ? "⭐ BOOKMARKED" : "BOOKMARK"}
                    </button>
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`px-4 py-2 border rounded font-mono text-sm transition-colors ${
                        liked
                          ? "bg-red-500/20 border-red-500/30 text-red-400"
                          : "bg-gray-800 border-gray-600 text-gray-400 hover:border-red-500/30"
                      }`}
                    >
                      {liked ? "❤️ LIKED" : "LIKE"}
                    </button>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/blog/${post.slug}`)}
                      className="px-4 py-2 bg-gray-800 border border-gray-600 text-gray-400 hover:border-green-500/30 rounded font-mono text-sm transition-colors"
                    >
                      <Copy size={16} className="inline mr-2" />
                      COPY LINK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "terminal" && (
            <div className="h-full flex flex-col bg-black/90">
              {/* Terminal Content */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                {terminalHistory.map((line, i) => (
                  <div
                    key={i}
                    className={`mb-1 ${
                      line.startsWith("reader@nexus")
                        ? "text-green-400"
                        : line.startsWith("╔") ||
                            line.startsWith("║") ||
                            line.startsWith("╚") ||
                            line.startsWith("═") ||
                            line.startsWith("━")
                          ? "text-cyan-400"
                          : "text-gray-300"
                    }`}
                  >
                    {line}
                  </div>
                ))}

                {/* Current Input Line */}
                <div className="flex items-center mt-4">
                  <span className="text-green-400 mr-2">reader@nexus:~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-green-400 caret-green-400"
                    disabled={isReading}
                    autoFocus
                  />
                  <span className="animate-pulse text-green-400">_</span>
                </div>
              </div>

              {/* Terminal Status Bar */}
              <div className="px-4 py-2 bg-gray-900 border-t border-green-500/30 text-xs text-gray-400 flex justify-between font-mono">
                <span>{post.title}</span>
                <span>{bookmarked ? "⭐ Bookmarked" : 'Type "bookmark" to save'}</span>
                <span>Progress: {readingProgress}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="px-6 py-4 bg-gray-900 border-t border-green-500/30">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={() => executeCommand("read")}
                className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded font-mono text-sm hover:bg-green-500/30 transition-colors"
                disabled={isReading}
              >
                START READING
              </button>
              <button
                onClick={() => executeCommand("info")}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded font-mono text-sm hover:bg-cyan-500/30 transition-colors"
              >
                ARTICLE INFO
              </button>
              <button
                onClick={() => executeCommand("bookmark")}
                className={`px-4 py-2 border rounded font-mono text-sm transition-colors ${
                  bookmarked
                    ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                    : "bg-gray-800 border-gray-600 text-gray-400 hover:border-yellow-500/30"
                }`}
              >
                {bookmarked ? "⭐ BOOKMARKED" : "BOOKMARK"}
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded font-mono text-sm hover:bg-red-500/30 transition-colors"
            >
              CLOSE READER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
