"use client"

import { useEntry } from "@/contexts/entry-context"
import TerminalEntry from "@/components/terminal-entry"
import CyberpunkTerminalMenu from "@/components/cyberpunk-terminal-menu"
import BlogPostModal from "@/components/blog-post-modal"
import { MatrixRain } from "@/components/advanced-effects"
import { useState, useEffect, useRef } from "react"
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

interface TerminalLine {
  type: "command" | "output" | "system"
  content: React.ReactNode
  timestamp?: string
}

export default function BlogPage() {
  const { hasAccess, grantAccess } = useEntry()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentInput, setCurrentInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [blogStats] = useState({
    totalPosts: 42,
    totalViews: "127K",
    totalLikes: "8.4K",
    subscribers: 847,
    drafts: 3,
    categories: 8,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const { playCommand, playSuccess, playError, playTyping } = useSoundContext()

  const mockPosts: BlogPost[] = [
    {
      id: "post-001",
      title: "Building a 10,000 Node Kubernetes Cluster: Lessons from the Edge",
      slug: "kubernetes-at-scale",
      excerpt: "How we scaled Kubernetes beyond its limits and lived to tell the tale. Includes war stories, performance hacks, and why you probably shouldn't try this at home.",
      content: "# Building a 10,000 Node Kubernetes Cluster...",
      author: "NEXUS ARCHITECT",
      publishedAt: "2024-01-15",
      date: "2024-01-15",
      tags: ["kubernetes", "devops", "architecture"],
      status: "published",
      readTime: 12,
      category: "Cloud Native",
      views: 42728,
      likes: 847,
      comments: 127,
    },
    {
      id: "post-002",
      title: "The Day I Accidentally Deleted Production (And How I Recovered)",
      slug: "production-disaster-recovery",
      excerpt: "A cautionary tale of rm -rf gone wrong, the importance of backups, and how infrastructure as code saved my career.",
      content: "# The Day I Accidentally Deleted Production...",
      author: "NEXUS ARCHITECT",
      publishedAt: "2024-01-10",
      date: "2024-01-10",
      tags: ["devops", "disaster-recovery", "lessons-learned"],
      status: "published",
      readTime: 8,
      category: "War Stories",
      views: 89472,
      likes: 2847,
      comments: 342,
    },
    {
      id: "post-003",
      title: "eBPF: The Future of Observability Without Instrumentation",
      slug: "ebpf-observability-future",
      excerpt: "Deep dive into eBPF and how it's revolutionizing system observability. No more agents, no more overhead, just pure kernel magic.",
      content: "# eBPF: The Future of Observability...",
      author: "NEXUS ARCHITECT",
      publishedAt: "2024-01-05",
      date: "2024-01-05",
      tags: ["ebpf", "observability", "performance", "linux"],
      status: "published",
      readTime: 15,
      category: "Technology",
      views: 31284,
      likes: 627,
      comments: 89,
    }
  ]

  const categories = [
    { name: "Cloud Native", icon: "☁️", count: 18 },
    { name: "DevOps", icon: "⚙️", count: 15 },
    { name: "Architecture", icon: "🏗️", count: 12 },
    { name: "Security", icon: "🔒", count: 8 },
    { name: "War Stories", icon: "⚔️", count: 6 },
    { name: "Infrastructure", icon: "🔧", count: 14 },
    { name: "Technology", icon: "💡", count: 11 },
    { name: "AI & Automation", icon: "🤖", count: 2 },
  ]

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setPosts(mockPosts)
      setFilteredPosts(mockPosts.filter((post) => post.status === "published"))
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const executeCommand = async (command: string) => {
    const cmd = command.trim().toLowerCase()
    const args = cmd.split(" ").slice(1)
    const baseCmd = cmd.split(" ")[0]

    setTerminalHistory((prev) => [...prev, { type: "command", content: `$ ${command}` }])
    setCommandHistory((prev) => [...prev, command])
    playCommand()

    switch (baseCmd) {
      case "help":
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: (
              <div className="text-cyan-300 text-sm">
                • Type <span className="text-yellow-400">list</span> to see all posts
                <br />• Type <span className="text-yellow-400">read [post-id]</span> to read a post
                <br />• Type <span className="text-yellow-400">search [term]</span> to search posts
                <br />• Type <span className="text-yellow-400">subscribe</span> to join newsletter
                <br />• Type <span className="text-yellow-400">stats</span> for blog analytics
                <br />• Try <span className="text-yellow-400">matrix</span> for fun!
              </div>
            ),
          },
        ])
        playSuccess()
        break

      case "list":
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: <div className="text-green-400">Displaying all blog posts below...</div>,
          },
        ])
        playSuccess()
        break

      case "clear":
        setTerminalHistory([])
        playSuccess()
        break

      case "read":
        const postId = args[0]
        const post = posts.find((p) => p.id === postId)
        if (post) {
          setSelectedPost(post)
          setIsModalOpen(true)
          playSuccess()
        } else {
          setTerminalHistory((prev) => [
            ...prev,
            {
              type: "output",
              content: <div className="text-red-400">Post not found: {postId}. Type "list" to see all posts.</div>,
            },
          ])
          playError()
        }
        break

      case "search":
        const searchTerm = args.join(" ").toLowerCase()
        const searchResults = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
        )
        setFilteredPosts(searchResults)
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: <div className="text-green-400">Displaying search results for "{searchTerm}" below...</div>,
          },
        ])
        playSuccess()
        break

      case "subscribe":
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: <div className="text-green-400">You have been subscribed to the Nexus Architect Newsletter.</div>,
          },
        ])
        playSuccess()
        break

      case "stats":
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: (
              <div className="text-green-400">
                <h2>Blog Analytics</h2>
                <ul className="list-disc pl-5">
                  <li>Total Posts: {blogStats.totalPosts}</li>
                  <li>Total Views: {blogStats.totalViews}</li>
                  <li>Total Likes: {blogStats.totalLikes}</li>
                  <li>Subscribers: {blogStats.subscribers}</li>
                  <li>Drafts: {blogStats.drafts}</li>
                  <li>Categories: {blogStats.categories}</li>
                </ul>
              </div>
            ),
          },
        ])
        playSuccess()
        break

      case "":
        break

      default:
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: "output",
            content: (
              <div className="text-red-400">Command not found: {baseCmd}. Type "help" for available commands.</div>
            ),
          },
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
        setHistoryIndex(-1)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value)
    playTyping()
  }

  if (!hasAccess) {
    return <TerminalEntry onAccessGranted={grantAccess} siteName="BLOG - NEXUS ARCHITECT" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative">
        <MatrixRain intensity={0.3} />
        <CyberpunkTerminalMenu currentPage="blog" />
        <div className="flex items-center justify-center h-96">
          <div className="font-mono animate-pulse">INITIALIZING BLOG TERMINAL...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono relative overflow-hidden">
      {/* Matrix Rain Effect on ALL pages */}
      <MatrixRain intensity={0.3} />
      
      <CyberpunkTerminalMenu currentPage="blog" />

      <div className="fixed inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-20 animate-pulse" />
      <div className="fixed inset-0 pointer-events-none z-20 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      <div className="relative z-0 min-h-screen flex flex-col">
        <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 bg-black/40">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* ASCII Art Header */}
            <pre className="text-cyan-400 text-xs whitespace-pre opacity-0 animate-[fadeIn_0.5s_forwards]">
              {`██████╗ ██╗      ██████╗  ██████╗     ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
██╔══██╗██║     ██╔═══██╗██╔════╝     ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
██████╔╝██║     ██║   ██║██║  ███╗       ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
██╔══██╗██║     ██║   ██║██║   ██║       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
██████╔╝███████╗╚██████╔╝╚██████╔╝       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝        ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝`}
            </pre>

            {/* Blog Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded relative opacity-0 animate-[slideIn_0.5s_forwards_0.5s]">
              <div className="absolute -top-3 left-4 bg-gray-950 px-2 text-purple-400 text-xs">BLOG METRICS</div>
              {[
                { label: "Total Posts", value: blogStats.totalPosts, color: "cyan" },
                { label: "Total Views", value: blogStats.totalViews, color: "green" },
                { label: "Total Likes", value: blogStats.totalLikes, color: "red" },
                { label: "Subscribers", value: blogStats.subscribers, color: "purple" },
                { label: "Drafts", value: blogStats.drafts, color: "yellow" },
                { label: "Categories", value: blogStats.categories, color: "pink" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-3 bg-black/50 border border-purple-500/10 relative overflow-hidden"
                >
                  <div className={`text-${stat.color}-400 text-2xl font-bold`}>{stat.value}</div>
                  <div className="text-gray-500 text-xs uppercase">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4 opacity-0 animate-[fadeIn_0.5s_forwards_0.9s]">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => executeCommand(`read ${post.id}`)}
                  className="p-4 bg-gradient-to-r from-green-500/[0.02] to-cyan-500/[0.02] border border-green-500/20 hover:border-green-500 hover:bg-green-500/[0.05] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-cyan-300 font-semibold text-lg group-hover:text-cyan-200 transition-colors">
                        {post.title}
                      </h2>
                      <div className="flex gap-4 text-xs text-gray-500 mt-2">
                        <span className="text-yellow-400">📅 {post.date}</span>
                        <span className="text-green-400">⏱ {post.readTime} min</span>
                        <span className="text-pink-400">📁 {post.category}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-3 leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-all"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-4 text-xs">
                          <span className="text-cyan-400">👁 {post.views.toLocaleString()}</span>
                          <span className="text-red-400">❤ {post.likes}</span>
                          <span className="text-green-400">💬 {post.comments}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-600 text-xs ml-4">[{post.id}]</div>
                  </div>
                </article>
              ))}
            </div>

            {/* Terminal History */}
            {terminalHistory.map((entry, i) => (
              <div key={i} className={entry.type === "command" ? "text-gray-300" : "text-gray-400"}>
                {entry.content}
              </div>
            ))}

            {/* Input Line */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-green-500/10">
              <span className="text-green-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-600"
                placeholder="Type 'help' for commands, or try 'list', 'read post-001', 'search kubernetes'..."
                autoFocus
              />
              <span className="w-2 h-5 bg-green-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {selectedPost && (
        <BlogPostModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedPost(null)
          }}
        />
      )}
    </div>
  )
}