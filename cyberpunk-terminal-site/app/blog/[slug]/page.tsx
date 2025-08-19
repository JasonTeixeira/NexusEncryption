"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import CyberpunkTerminalMenu from "@/components/cyberpunk-terminal-menu"
import { useSoundContext } from "@/contexts/sound-context"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  tags: string[]
  status: "draft" | "published" | "archived"
  readTime: number
}

interface TerminalLine {
  type: "system" | "content" | "command" | "navigation"
  content: string
  delay?: number
}

export default function BlogPostTerminal() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isReading, setIsReading] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [autoScroll, setAutoScroll] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const { playCommand, playSuccess, playError, playTyping } = useSoundContext()

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
  }, [params.slug])

  useEffect(() => {
    if (terminalRef.current && !autoScroll) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  const fetchPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog?slug=${slug}`)
      const data = await response.json()

      if (data.post && data.post.status === "published") {
        setPost(data.post)
        initializeTerminal(data.post)
        fetchRelatedPosts(data.post.tags, data.post.id)
      } else {
        router.push("/blog")
      }
    } catch (error) {
      console.error("Failed to fetch post:", error)
      router.push("/blog")
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (tags: string[], currentPostId: string) => {
    try {
      const response = await fetch("/api/blog")
      const data = await response.json()
      const published = data.posts.filter(
        (p: BlogPost) => p.status === "published" && p.id !== currentPostId && p.tags.some((tag) => tags.includes(tag)),
      )
      setRelatedPosts(published.slice(0, 3))
    } catch (error) {
      console.error("Failed to fetch related posts:", error)
    }
  }

  const initializeTerminal = (post: BlogPost) => {
    const welcomeLines: TerminalLine[] = [
      { type: "system", content: "╔══════════════════════════════════════════════════════════════╗" },
      { type: "system", content: "║                    NEXUS BLOG READER v2.1                   ║" },
      { type: "system", content: "║                  Advanced Terminal Interface                 ║" },
      { type: "system", content: "╚══════════════════════════════════════════════════════════════╝" },
      { type: "system", content: "" },
      { type: "system", content: `Loading: "${post.title}"` },
      {
        type: "system",
        content: `Author: ${post.author} | Published: ${new Date(post.publishedAt).toLocaleDateString()}`,
      },
      { type: "system", content: `Read Time: ${post.readTime} minutes | Tags: ${post.tags.join(", ")}` },
      { type: "system", content: "" },
      { type: "system", content: 'Type "help" for reading commands.' },
      { type: "system", content: "" },
    ]
    setTerminalHistory(welcomeLines)
  }

  const typeText = async (text: string, delay = 20) => {
    const lines = text.split("\n")

    for (const line of lines) {
      let currentLine = ""
      for (const char of line) {
        currentLine += char
        setTerminalHistory((prev) => {
          const newHistory = [...prev]
          if (
            newHistory[newHistory.length - 1]?.type === "content" &&
            newHistory[newHistory.length - 1]?.content.endsWith("_")
          ) {
            newHistory[newHistory.length - 1] = { type: "content", content: currentLine + "_" }
          } else {
            newHistory.push({ type: "content", content: currentLine + "_" })
          }
          return newHistory
        })
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      setTerminalHistory((prev) => {
        const newHistory = [...prev]
        newHistory[newHistory.length - 1] = { type: "content", content: line }
        return newHistory
      })

      if (lines.indexOf(line) < lines.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }
  }

  const executeCommand = async (command: string) => {
    if (!post) return

    const cmd = command.trim().toLowerCase()
    const args = cmd.split(" ").slice(1)

    setTerminalHistory((prev) => [...prev, { type: "command", content: `reader@nexus:~$ ${command}` }])
    playCommand()

    switch (cmd.split(" ")[0]) {
      case "help":
        await typeText(`Reading Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
read                   - Start reading the article
read fast              - Read with faster typing speed
read slow              - Read with slower typing speed
info                   - Show article information
bookmark               - Bookmark this article
share                  - Get shareable link
related                - Show related articles
progress               - Show reading progress
auto-scroll on/off     - Toggle auto-scrolling
back                   - Return to blog list
clear                  - Clear terminal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        playSuccess()
        break

      case "read":
        setIsReading(true)
        const speed = args[0] === "fast" ? 10 : args[0] === "slow" ? 40 : 20

        await typeText(`\n═══════════════════════════════════════════════════════════════
${post.title.toUpperCase()}
═══════════════════════════════════════════════════════════════\n`)

        await typeText(post.content, speed)

        setReadingProgress(100)
        setIsReading(false)

        await typeText(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Article completed. Type "related" to see related posts or "back" to return.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        playSuccess()
        break

      case "info":
        await typeText(`Article Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title: ${post.title}
Author: ${post.author}
Published: ${new Date(post.publishedAt).toLocaleDateString()}
Read Time: ${post.readTime} minutes
Word Count: ~${post.content.split(" ").length} words
Tags: ${post.tags.join(", ")}
Status: ${bookmarked ? "Bookmarked ⭐" : "Not bookmarked"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        playSuccess()
        break

      case "bookmark":
        setBookmarked(!bookmarked)
        await typeText(bookmarked ? "Article removed from bookmarks." : "Article bookmarked! ⭐")
        playSuccess()
        break

      case "share":
        const shareUrl = `${window.location.origin}/blog/${post.slug}`
        await typeText(`Shareable link generated:
${shareUrl}

Link copied to clipboard!`)
        navigator.clipboard.writeText(shareUrl)
        playSuccess()
        break

      case "related":
        if (relatedPosts.length === 0) {
          await typeText("No related articles found.")
          playError()
        } else {
          let output = `Related Articles (${relatedPosts.length}):\n\n`
          relatedPosts.forEach((relatedPost, index) => {
            output += `[${index + 1}] ${relatedPost.title}\n`
            output += `    ${relatedPost.excerpt}\n`
            output += `    Read time: ${relatedPost.readTime}min | Tags: ${relatedPost.tags.join(", ")}\n\n`
          })
          output += 'Use "open <number>" to read a related article.'
          await typeText(output)
          playSuccess()
        }
        break

      case "open":
        if (args.length === 0) {
          await typeText("Usage: open <number>")
          playError()
        } else {
          const postIndex = Number.parseInt(args[0]) - 1
          if (postIndex >= 0 && postIndex < relatedPosts.length) {
            const relatedPost = relatedPosts[postIndex]
            await typeText(`Opening "${relatedPost.title}"...`)
            playSuccess()
            setTimeout(() => {
              window.location.href = `/blog/${relatedPost.slug}`
            }, 1000)
          } else {
            await typeText("Invalid article number.")
            playError()
          }
        }
        break

      case "progress":
        await typeText(`Reading Progress: ${readingProgress}%
${isReading ? "Currently reading..." : readingProgress === 100 ? "Article completed!" : "Not started"}`)
        playSuccess()
        break

      case "auto-scroll":
        if (args[0] === "on") {
          setAutoScroll(true)
          await typeText("Auto-scroll enabled.")
        } else if (args[0] === "off") {
          setAutoScroll(false)
          await typeText("Auto-scroll disabled.")
        } else {
          setAutoScroll(!autoScroll)
          await typeText(`Auto-scroll ${!autoScroll ? "enabled" : "disabled"}.`)
        }
        playSuccess()
        break

      case "back":
        await typeText("Returning to blog terminal...")
        playSuccess()
        setTimeout(() => {
          router.push("/blog")
        }, 1000)
        break

      case "clear":
        setTerminalHistory([])
        initializeTerminal(post)
        playSuccess()
        break

      case "":
        break

      default:
        await typeText(`Command not found: ${cmd.split(" ")[0]}. Type "help" for available commands.`)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400">
        <CyberpunkTerminalMenu currentPage="blog" />
        <div className="flex items-center justify-center h-96">
          <div className="font-mono animate-pulse">LOADING ARTICLE...</div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-green-400">
        <CyberpunkTerminalMenu currentPage="blog" />
        <div className="flex items-center justify-center h-96">
          <div className="font-mono text-red-400">ARTICLE NOT FOUND</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      <CyberpunkTerminalMenu currentPage="blog" />

      {/* CRT Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.03)_50%)] bg-[length:100%_4px]" />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Terminal Window */}
          <div className="bg-gray-950 border border-green-500/30 rounded-lg shadow-2xl shadow-green-500/20">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-green-500/30 rounded-t-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-green-400">READER@NEXUS:~</div>
              <div className="text-sm text-gray-500">Progress: {readingProgress}%</div>
            </div>

            {/* Terminal Content */}
            <div
              ref={terminalRef}
              className="h-96 overflow-y-auto p-4 bg-black/90 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-green-500/30"
              onClick={() => inputRef.current?.focus()}
            >
              {terminalHistory.map((line, index) => (
                <div
                  key={index}
                  className={`mb-1 ${
                    line.type === "command"
                      ? "text-green-400"
                      : line.type === "system"
                        ? "text-cyan-400"
                        : line.type === "navigation"
                          ? "text-yellow-400"
                          : "text-gray-300"
                  }`}
                >
                  {line.content}
                </div>
              ))}

              {/* Current Input Line */}
              <div className="flex items-center">
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

            {/* Status Bar */}
            <div className="px-4 py-2 bg-gray-900 border-t border-green-500/30 rounded-b-lg text-xs text-gray-400 flex justify-between">
              <span>{post.title}</span>
              <span>{bookmarked ? "⭐ Bookmarked" : 'Type "bookmark" to save'}</span>
              <span>Auto-scroll: {autoScroll ? "ON" : "OFF"}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => executeCommand("read")}
              className="p-3 bg-gray-950 border border-green-500/30 rounded hover:border-green-500/50 transition-colors text-sm"
              disabled={isReading}
            >
              START READING
            </button>
            <button
              onClick={() => executeCommand("info")}
              className="p-3 bg-gray-950 border border-green-500/30 rounded hover:border-green-500/50 transition-colors text-sm"
            >
              ARTICLE INFO
            </button>
            <button
              onClick={() => executeCommand("related")}
              className="p-3 bg-gray-950 border border-green-500/30 rounded hover:border-green-500/50 transition-colors text-sm"
            >
              RELATED
            </button>
            <button
              onClick={() => executeCommand("back")}
              className="p-3 bg-gray-950 border border-green-500/30 rounded hover:border-green-500/50 transition-colors text-sm"
            >
              BACK TO BLOG
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
