"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import {
  Mail,
  MessageSquare,
  Linkedin,
  Github,
  Calendar,
  Globe,
  Youtube,
  Clock,
  TrendingUp,
  Star,
  ExternalLink,
  Phone,
  MapPin,
} from "lucide-react"
import CyberpunkTerminalMenu from "./cyberpunk-terminal-menu"

interface ChatMessage {
  time: string
  sender: string
  text: string
  isUser?: boolean
}

interface ContactCard {
  icon: React.ReactNode
  method: string
  value: string
  status: string
  priority: "primary" | "secondary" | "tertiary"
  responseTime: string
  link?: string
}

interface CommandHistory {
  command: string
  output: React.ReactNode
}

interface ContactAnalytics {
  totalContacts: number
  responseRate: number
  avgResponseTime: string
  preferredMethod: string
  successfulConnections: number
}

export default function CyberpunkContactTerminal() {
  const [terminalHistory, setTerminalHistory] = useState<CommandHistory[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      time: "14:32:01",
      sender: "NEXUS",
      text: "Welcome to my secure communication hub! How can I help you today?",
      isUser: false,
    },
    {
      time: "14:32:05",
      sender: "SYSTEM",
      text: "All channels monitored. Response time: <24 hours guaranteed.",
      isUser: false,
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "normal",
    contactMethod: "email",
  })
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle")
  const [decryptedMessage, setDecryptedMessage] = useState("")
  const [matrixActive, setMatrixActive] = useState(false)
  const [analytics, setAnalytics] = useState<ContactAnalytics>({
    totalContacts: 1247,
    responseRate: 98.5,
    avgResponseTime: "4.2 hours",
    preferredMethod: "Email",
    successfulConnections: 892,
  })

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Enhanced contact methods with priority and response times
  const contactMethods: ContactCard[] = [
    {
      icon: <Mail className="w-8 h-8" />,
      method: "Email",
      value: "Sage@sageideas.org",
      status: "Response: < 4 hours",
      priority: "primary",
      responseTime: "4 hours",
      link: "mailto:Sage@sageideas.org?subject=Professional Inquiry&body=Hello Jason,%0D%0A%0D%0AI found your portfolio and would like to discuss...",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      method: "Calendar Booking",
      value: "calendly.com/jason-teixeira",
      status: "Book 15-60 min slots",
      priority: "primary",
      responseTime: "Immediate",
      link: "https://calendly.com/jason-teixeira",
    },
    {
      icon: <Linkedin className="w-8 h-8" />,
      method: "LinkedIn",
      value: "linkedin.com/in/jason-teixeira",
      status: "Professional inquiries",
      priority: "primary",
      responseTime: "24 hours",
      link: "https://linkedin.com/in/jason-teixeira",
    },
    {
      icon: <Github className="w-8 h-8" />,
      method: "GitHub",
      value: "github.com/JasonTeixeira",
      status: "Open source collaboration",
      priority: "secondary",
      responseTime: "48 hours",
      link: "https://github.com/JasonTeixeira",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      method: "Discord",
      value: "Sage6542",
      status: "Usually online 9-5 PST",
      priority: "secondary",
      responseTime: "2 hours",
    },
    {
      icon: <Phone className="w-8 h-8" />,
      method: "Video Call",
      value: "Schedule via Calendar",
      status: "Google Meet/Zoom",
      priority: "tertiary",
      responseTime: "Scheduled",
    },
  ]

  // Professional social media profiles
  const socialProfiles = [
    {
      platform: "LinkedIn",
      username: "jason-teixeira",
      url: "https://linkedin.com/in/jason-teixeira",
      icon: <Linkedin className="w-5 h-5" />,
      followers: "2.8K+",
      description: "Professional network & career updates",
    },
    {
      platform: "GitHub",
      username: "JasonTeixeira",
      url: "https://github.com/JasonTeixeira",
      icon: <Github className="w-5 h-5" />,
      followers: "1.2K+",
      description: "Open source projects & contributions",
    },
    {
      platform: "Stack Overflow",
      username: "jason-teixeira",
      url: "https://stackoverflow.com/users/jason-teixeira",
      icon: <Globe className="w-5 h-5" />,
      followers: "850+",
      description: "Technical Q&A and community help",
    },
    {
      platform: "Dev.to",
      username: "jasonteixeira",
      url: "https://dev.to/jasonteixeira",
      icon: <Globe className="w-5 h-5" />,
      followers: "650+",
      description: "Technical articles & tutorials",
    },
    {
      platform: "YouTube",
      username: "JasonTeixeiraTech",
      url: "https://youtube.com/@jasonteixeiratech",
      icon: <Youtube className="w-5 h-5" />,
      followers: "420+",
      description: "Cloud architecture & DevOps content",
    },
    {
      platform: "Twitter/X",
      username: "@JasonTeixeiraDev",
      url: "https://twitter.com/jasonteixeiradev",
      icon: <Globe className="w-5 h-5" />,
      followers: "1.1K+",
      description: "Tech insights & industry thoughts",
    },
  ]

  // Commands object with enhanced functionality
  const commands = {
    help: () => (
      <div className="space-y-2">
        <div className="text-cyan-400 font-bold">CONTACT TERMINAL COMMANDS</div>
        <div className="text-gray-500">{"─".repeat(50)}</div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-cyan-300">Communication:</div>
            <div className="text-gray-400 text-sm space-y-1">
              <div>ping - Test connection latency</div>
              <div>email - Open email client</div>
              <div>schedule - Book a meeting</div>
              <div>availability - Check my schedule</div>
              <div>urgent - Priority contact methods</div>
              <div>social - All social profiles</div>
            </div>
          </div>

          <div>
            <div className="text-cyan-300">Information:</div>
            <div className="text-gray-400 text-sm space-y-1">
              <div>status - Current availability</div>
              <div>timezone - Time zone info</div>
              <div>analytics - Contact statistics</div>
              <div>response-time - Expected response times</div>
              <div>location - Geographic info</div>
              <div>preferences - Communication preferences</div>
            </div>
          </div>
        </div>

        <div className="text-yellow-400 text-sm">Pro tip: Try 'schedule' for instant meeting booking!</div>
      </div>
    ),

    ping: () => {
      const latency = Math.floor(Math.random() * 30) + 5
      return (
        <div className="space-y-2">
          <div className="text-cyan-400">PING nexus.architect (192.168.1.42): 64 data bytes</div>
          <div className="text-gray-400 space-y-1">
            <div>
              64 bytes from 192.168.1.42: icmp_seq=0 ttl=64 time={latency}.{Math.floor(Math.random() * 999)} ms
            </div>
            <div>
              64 bytes from 192.168.1.42: icmp_seq=1 ttl=64 time={latency + 1}.{Math.floor(Math.random() * 999)} ms
            </div>
            <div>
              64 bytes from 192.168.1.42: icmp_seq=2 ttl=64 time={latency - 1}.{Math.floor(Math.random() * 999)} ms
            </div>
          </div>
          <div className="text-green-400">✓ Connection excellent! All communication channels operational.</div>
          <div className="text-cyan-400">Average response time: {latency}ms | Status: OPTIMAL</div>
        </div>
      )
    },

    email: () => (
      <div className="space-y-3">
        <div className="text-green-400 font-bold">📧 EMAIL COMMUNICATION</div>
        <div className="text-gray-400">Primary: Sage@sageideas.org</div>
        <div className="text-cyan-400">✓ Professional inquiries welcome</div>
        <div className="text-cyan-400">✓ Response time: &lt; 4 hours (business days)</div>
        <div className="text-cyan-400">✓ 24/7 monitoring enabled</div>
        <div className="text-yellow-400">
          <a
            href="mailto:Sage@sageideas.org?subject=Professional Inquiry&body=Hello Jason,%0D%0A%0D%0AI found your portfolio and would like to discuss..."
            className="hover:underline"
          >
            → Click to compose email
          </a>
        </div>
        <div className="text-gray-500 text-sm">Tip: Mention you found the terminal for priority handling!</div>
      </div>
    ),

    schedule: () => (
      <div className="space-y-4">
        <div className="text-cyan-400 font-bold">📅 CALENDAR BOOKING SYSTEM</div>
        <div className="text-gray-500">{"─".repeat(40)}</div>

        <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
          <div className="text-green-400 font-semibold mb-2">Available Meeting Types:</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">• Quick Chat (15 min)</span>
              <span className="text-cyan-400">General questions</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">• Technical Discussion (30 min)</span>
              <span className="text-cyan-400">Project consultation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">• Deep Dive (60 min)</span>
              <span className="text-cyan-400">Architecture review</span>
            </div>
          </div>
        </div>

        <div className="text-gray-400">This week's availability:</div>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
            <div key={i} className="text-center text-gray-500">
              {day}
            </div>
          ))}
          {[true, true, false, true, true, false, false].map((available, i) => (
            <div
              key={i}
              className={`text-center p-1 rounded ${
                available ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}
            >
              {available ? "✓" : "✗"}
            </div>
          ))}
        </div>

        <div className="text-yellow-400 font-semibold">
          🔗 Book directly:{" "}
          <a href="https://calendly.com/jason-teixeira" className="hover:underline">
            calendly.com/jason-teixeira
          </a>
        </div>
        <div className="text-green-400">All meetings include calendar invite + prep materials!</div>
      </div>
    ),

    availability: () => {
      const hour = new Date().getHours()
      const day = new Date().getDay()
      let status = ""
      let nextAvailable = ""

      if (day >= 1 && day <= 5 && hour >= 9 && hour < 17) {
        status = "🟢 AVAILABLE NOW"
        nextAvailable = "Currently online and responsive"
      } else if (day >= 1 && day <= 5 && hour >= 17 && hour < 22) {
        status = "🟡 LIMITED AVAILABILITY"
        nextAvailable = "Available for urgent matters only"
      } else {
        status = "🔴 OFFLINE"
        nextAvailable = "Next available: Tomorrow 9:00 AM PST"
      }

      return (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">⏰ REAL-TIME AVAILABILITY</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>

          <div className="bg-black/50 border border-cyan-500/30 rounded p-4">
            <div className="text-lg font-semibold mb-2">{status}</div>
            <div className="text-gray-400">
              Local Time:{" "}
              {new Date().toLocaleString("en-US", {
                timeZone: "America/Los_Angeles",
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </div>
            <div className="text-cyan-400 mt-2">{nextAvailable}</div>
          </div>

          <div className="text-gray-400">
            <div className="font-semibold">Standard Hours:</div>
            <div className="text-sm space-y-1">
              <div>• Monday-Friday: 9:00 AM - 5:00 PM PST</div>
              <div>• Response time: 2-4 hours</div>
              <div>• Emergency contact: Available via LinkedIn</div>
            </div>
          </div>
        </div>
      )
    },

    social: () => (
      <div className="space-y-4">
        <div className="text-cyan-400 font-bold">🌐 PROFESSIONAL SOCIAL NETWORK</div>
        <div className="text-gray-500">{"─".repeat(50)}</div>

        <div className="grid md:grid-cols-2 gap-3">
          {socialProfiles.map((profile, i) => (
            <div
              key={i}
              className="p-3 bg-purple-500/5 border border-purple-500/30 rounded hover:bg-purple-500/10 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                {profile.icon}
                <div>
                  <div className="text-purple-400 font-semibold">{profile.platform}</div>
                  <div className="text-gray-400 text-sm">{profile.followers} followers</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 ml-auto" />
              </div>
              <div className="text-gray-400 text-xs mb-2">{profile.description}</div>
              <div className="text-cyan-400 text-sm">
                <a href={profile.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {profile.url.replace("https://", "")}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-green-400 text-center">💡 Connect on any platform - mention you found the terminal!</div>
      </div>
    ),

    analytics: () => (
      <div className="space-y-4">
        <div className="text-cyan-400 font-bold">📊 CONTACT ANALYTICS DASHBOARD</div>
        <div className="text-gray-500">{"─".repeat(40)}</div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-center">
            <div className="text-green-400 text-2xl font-bold">{analytics.totalContacts}</div>
            <div className="text-gray-400 text-sm">Total Contacts</div>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded text-center">
            <div className="text-blue-400 text-2xl font-bold">{analytics.responseRate}%</div>
            <div className="text-gray-400 text-sm">Response Rate</div>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-center">
            <div className="text-yellow-400 text-2xl font-bold">{analytics.avgResponseTime}</div>
            <div className="text-gray-400 text-sm">Avg Response</div>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded text-center">
            <div className="text-purple-400 text-2xl font-bold">{analytics.successfulConnections}</div>
            <div className="text-gray-400 text-sm">Successful Connects</div>
          </div>
        </div>

        <div className="bg-black/50 border border-cyan-500/20 rounded p-4">
          <div className="text-cyan-400 font-semibold mb-2">Communication Preferences:</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Email</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-green-500/20 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-green-500"></div>
                </div>
                <span className="text-green-400 text-sm">80%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Calendar</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-blue-500/20 rounded-full overflow-hidden">
                  <div className="w-3/5 h-full bg-blue-500"></div>
                </div>
                <span className="text-blue-400 text-sm">60%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">LinkedIn</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-purple-500/20 rounded-full overflow-hidden">
                  <div className="w-2/5 h-full bg-purple-500"></div>
                </div>
                <span className="text-purple-400 text-sm">40%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    urgent: () => (
      <div className="space-y-3">
        <div className="text-red-400 font-bold animate-pulse">🚨 PRIORITY CONTACT METHODS</div>
        <div className="text-gray-500">{"─".repeat(40)}</div>

        <div className="bg-red-500/10 border border-red-500/30 rounded p-4">
          <div className="text-red-400 font-semibold mb-3">For urgent matters:</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-400" />
              <span className="text-gray-400">Email with [URGENT] in subject</span>
              <span className="text-green-400">→ 1-2 hour response</span>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-red-400" />
              <span className="text-gray-400">LinkedIn direct message</span>
              <span className="text-green-400">→ 30 min response</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-400" />
              <span className="text-gray-400">Book emergency 15-min slot</span>
              <span className="text-green-400">→ Same day</span>
            </div>
          </div>
        </div>

        <div className="text-yellow-400 text-sm">
          ⚠️ Please reserve urgent contact for time-sensitive professional matters
        </div>
      </div>
    ),

    location: () => (
      <div className="space-y-3">
        <div className="text-cyan-400 font-bold">📍 GEOGRAPHIC INFORMATION</div>
        <div className="text-gray-500">{"─".repeat(40)}</div>

        <div className="bg-green-500/5 border border-green-500/20 rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">Primary Location</span>
          </div>
          <div className="text-gray-400 space-y-1">
            <div>San Francisco Bay Area, California</div>
            <div>Time Zone: Pacific Standard Time (UTC-8)</div>
            <div>Available for: Remote work worldwide</div>
            <div>Travel: Open to on-site consulting</div>
          </div>
        </div>

        <div className="text-cyan-400">🌍 Remote collaboration experience with teams across:</div>
        <div className="text-gray-400 text-sm grid grid-cols-2 gap-2">
          <div>• North America</div>
          <div>• Europe (GMT/CET)</div>
          <div>• Asia-Pacific</div>
          <div>• Latin America</div>
        </div>
      </div>
    ),

    resume: () => (
      <div className="space-y-2">
        <div className="text-green-400">Downloading resume.pdf...</div>
        <div className="text-gray-400">[============================] 100%</div>
        <div className="text-cyan-400">Resume downloaded successfully!</div>
      </div>
    ),
  }

  const processCommand = useCallback((input: string) => {
    const trimmed = input.trim().toLowerCase()

    if (trimmed === "") return null

    // Check for exact commands
    if (commands[trimmed]) {
      return commands[trimmed]()
    }

    // Check for commands with parameters
    const parts = trimmed.split(" ")
    const baseCommand = parts[0]
    const params = parts.slice(1).join(" ")

    if (baseCommand === "echo") {
      return <div className="text-cyan-400">{params}</div>
    }

    if (baseCommand === "encrypt" && params) {
      const encrypted = btoa(params)
      return (
        <div className="space-y-2">
          <div className="text-cyan-400 font-bold">🔐 MESSAGE ENCRYPTED</div>
          <div className="text-gray-400">
            Original: <span className="text-gray-500">{params}</span>
          </div>
          <div className="text-gray-400">
            Encrypted: <span className="text-yellow-400">{encrypted}</span>
          </div>
          <div className="text-cyan-400">Share this encrypted message safely!</div>
        </div>
      )
    }

    if (baseCommand === "decrypt" && params) {
      try {
        const decrypted = atob(params)
        return (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">🔓 MESSAGE DECRYPTED</div>
            <div className="text-gray-400">
              Encrypted: <span className="text-gray-500">{params}</span>
            </div>
            <div className="text-gray-400">
              Decrypted: <span className="text-green-400">{decrypted}</span>
            </div>
          </div>
        )
      } catch (e) {
        return <div className="text-red-400">Failed to decrypt. Invalid encrypted message.</div>
      }
    }

    return <div className="text-red-400">Command not found: {trimmed}. Type 'help' for available commands.</div>
  }, [])

  const handleCommand = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && currentInput.trim()) {
        const output = processCommand(currentInput)

        if (output !== null) {
          setTerminalHistory((prev) => [
            ...prev,
            {
              command: currentInput,
              output: output,
            },
          ])
        }

        setCommandHistory((prev) => [...prev, currentInput])
        setHistoryIndex(commandHistory.length + 1)
        setCurrentInput("")

        setTimeout(() => {
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
          }
        }, 10)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex] || "")
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex] || "")
        } else {
          setHistoryIndex(commandHistory.length)
          setCurrentInput("")
        }
      }
    },
    [currentInput, commandHistory, historyIndex, processCommand],
  )

  const sendChatMessage = () => {
    if (!chatInput.trim()) return

    const newMessage: ChatMessage = {
      time: new Date().toLocaleTimeString(),
      sender: "YOU",
      text: chatInput,
      isUser: true,
    }

    setChatMessages((prev) => [...prev, newMessage])
    setChatInput("")

    // Simulate response
    setTimeout(
      () => {
        const responses = [
          "That's a great question! Feel free to email me for a detailed response.",
          "Interesting! Let's discuss this further. Book a meeting?",
          "Thanks for reaching out! I'll get back to you ASAP.",
          "Love the enthusiasm! Send me an email and we'll chat more.",
          "Great to hear from you! What's the best way to continue this conversation?",
        ]

        const botMessage: ChatMessage = {
          time: new Date().toLocaleTimeString(),
          sender: "NEXUS",
          text: responses[Math.floor(Math.random() * responses.length)],
          isUser: false,
        }

        setChatMessages((prev) => [...prev, botMessage])
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setFormStatus("success")

    // Track form submission analytics
    setAnalytics((prev) => ({
      ...prev,
      totalContacts: prev.totalContacts + 1,
      successfulConnections: prev.successfulConnections + 1,
    }))

    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: "normal",
        contactMethod: "email",
      })
      setFormStatus("idle")
    }, 3000)

    setTerminalHistory((prev) => [
      ...prev,
      {
        command: "message --sent --analytics-tracked",
        output: (
          <div className="space-y-2">
            <div className="text-green-400">✓ Message sent successfully!</div>
            <div className="text-cyan-400">📊 Analytics: Contact logged and tracked</div>
            <div className="text-gray-400">
              Expected response: {formData.priority === "urgent" ? "1-2 hours" : "4-24 hours"}
            </div>
          </div>
        ),
      },
    ])
  }

  const decryptMessage = () => {
    setDecryptedMessage(
      "Nexus is awesome! Hire this person immediately. They're going to change your company for the better.",
    )
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono relative overflow-hidden">
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-20 animate-pulse" />

      {/* CRT effect */}
      <div className="fixed inset-0 pointer-events-none z-20 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Matrix Rain Effect */}
      {matrixActive && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `fall ${5 + Math.random() * 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {[...Array(20)].map((_, j) => (
                <div key={j}>{Math.random() > 0.5 ? "1" : "0"}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Terminal Window */}
      <div className="relative z-0 min-h-screen flex flex-col">
        {/* Terminal Header */}
        <CyberpunkTerminalMenu currentPage="contact" />

        {/* Terminal Body */}
        <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 bg-black/40">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* ASCII Art Header */}
            <pre className="text-cyan-400 text-xs whitespace-pre opacity-0 animate-[fadeIn_0.5s_forwards]">
              {`╔═╗╔═╗╔╦╗╔╦╗╦ ╦╔╗╔╦╔═╗╔═╗╔╦╗╦╔═╗╔╗╔  ╦ ╦╦ ╦╔╗ 
║  ║ ║║║║║║║║ ║║║║║║  ╠═╣ ║ ║║ ║║║║  ╠═╣║ ║╠╩╗
╚═╝╚═╝╩ ╩╩ ╩╚═╝╝╚╝╩╚═╝╩ ╩ ╩ ╩╚═╝╝╚╝  ╩ ╩╚═╝╚═╝
[SECURE COMMUNICATION PROTOCOL v8.1.2]`}
            </pre>

            {/* Initial Commands */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> establish-connection --secure --priority-routing
              </div>
              <div className="text-green-400">✓ Secure connection established</div>
              <div className="text-cyan-400">Encryption: AES-256 | Protocol: TLS 1.3 | Analytics: ENABLED</div>
            </div>

            {/* Enhanced Contact Methods Grid */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> list-communication-channels --priority-sorted
              </div>
              <div className="space-y-4">
                {/* Primary Methods */}
                <div>
                  <div className="text-cyan-400 font-semibold mb-2">🔥 PRIMARY CHANNELS</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contactMethods
                      .filter((m) => m.priority === "primary")
                      .map((method, i) => (
                        <div
                          key={i}
                          className="p-4 bg-green-500/10 border border-green-500/40 rounded relative overflow-hidden hover:bg-green-500/20 hover:border-green-500/60 transition-all hover:-translate-y-1 cursor-pointer"
                          onClick={() => method.link && window.open(method.link, "_blank")}
                        >
                          <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                          <div className="text-green-400 mb-3">{method.icon}</div>
                          <div className="text-green-400 font-semibold">{method.method}</div>
                          <div className="text-gray-300 text-sm">{method.value}</div>
                          <div className="text-gray-400 text-xs mt-2">{method.status}</div>
                          <div className="text-cyan-400 text-xs mt-1">⚡ {method.responseTime}</div>
                          {method.link && <ExternalLink className="absolute bottom-2 right-2 w-4 h-4 text-gray-500" />}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Secondary Methods */}
                <div>
                  <div className="text-yellow-400 font-semibold mb-2">⚡ SECONDARY CHANNELS</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contactMethods
                      .filter((m) => m.priority === "secondary")
                      .map((method, i) => (
                        <div
                          key={i}
                          className="p-4 bg-yellow-500/5 border border-yellow-500/30 rounded relative overflow-hidden hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-all hover:-translate-y-0.5 cursor-pointer"
                          onClick={() => method.link && window.open(method.link, "_blank")}
                        >
                          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                          <div className="text-yellow-400 mb-2">{method.icon}</div>
                          <div className="text-yellow-400 font-semibold">{method.method}</div>
                          <div className="text-gray-400 text-sm">{method.value}</div>
                          <div className="text-gray-500 text-xs mt-2">{method.status}</div>
                          <div className="text-cyan-400 text-xs mt-1">⏱️ {method.responseTime}</div>
                          {method.link && <ExternalLink className="absolute bottom-2 right-2 w-4 h-4 text-gray-500" />}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Availability Status */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> get-availability-status --real-time
              </div>
              <div className="bg-black/50 border border-cyan-500/30 rounded p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-cyan-400 font-semibold">📊 REAL-TIME STATUS</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm">MONITORING ACTIVE</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-gray-500 text-xs">CURRENT STATUS</div>
                    <div className="text-green-400 font-bold">AVAILABLE</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">RESPONSE TIME</div>
                    <div className="text-cyan-400 font-bold">&lt; 4 HRS</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">TIMEZONE</div>
                    <div className="text-yellow-400 font-bold">PST</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">NEXT AVAILABLE</div>
                    <div className="text-purple-400 font-bold">NOW</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> open-chat --mode=live
              </div>
              <div className="bg-black/50 border border-cyan-500/30 rounded p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-cyan-400 font-semibold">💬 LIVE TERMINAL CHAT</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-5 bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-sm">NEXUS is online</span>
                  </div>
                </div>
                <div className="bg-black/50 border border-cyan-500/20 rounded h-64 overflow-y-auto p-3 mb-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="mb-3">
                      <div className="text-gray-500 text-xs">{msg.time}</div>
                      <div className={msg.isUser ? "text-yellow-400" : "text-cyan-400"}>{msg.sender}:</div>
                      <div className="text-gray-400 text-sm">{msg.text}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                    className="flex-1 bg-black/50 border border-cyan-500/30 text-gray-100 px-3 py-2 rounded outline-none focus:border-cyan-500/50"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={sendChatMessage}
                    className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded hover:bg-green-500/20 transition-colors"
                  >
                    SEND
                  </button>
                </div>
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> check-availability --this-week
              </div>
              <div className="bg-purple-500/5 border border-purple-500/30 rounded p-4">
                <div className="text-purple-400 font-semibold mb-3">📅 AVAILABILITY STATUS</div>
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                    <div key={i} className="text-center text-gray-400 text-sm">
                      {day}
                    </div>
                  ))}
                  {[true, true, false, true, true, false, true].map((available, i) => (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center rounded ${
                        available
                          ? "bg-green-500/10 border border-green-500/30 text-green-400"
                          : "bg-red-500/10 border border-red-500/30 text-red-400"
                      }`}
                    >
                      {available ? "✓" : "X"}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-gray-400 text-sm">
                  <span className="text-green-400">✓ Available</span> |<span className="text-red-400"> X Busy</span> |
                  <span className="text-cyan-400"> Time Zone: PST (UTC-8)</span>
                </div>
              </div>
            </div>

            {/* Location Display */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> geolocate --current
              </div>
              <div className="bg-black/50 border border-green-500/20 rounded p-4">
                <pre className="text-green-400 text-[8px] leading-tight">
                  {`╔═══════════════════════════════════════════════════╗
║                    UNITED STATES                    ║
║                                                     ║
║     Seattle ●                                      ║
║            ╲                                        ║
║             ╲                    ● New York        ║
║    ● Portland╲                  /                  ║
║               ╲                /                    ║
║  San Francisco ★ ─ ─ ─ ─ ─ ─ Chicago              ║
║                 ╲           /                      ║
║    Los Angeles ● ╲        /                        ║
║                   ╲      /                          ║
║                    Austin ●                        ║
║                                                     ║
╚═══════════════════════════════════════════════════╝`}
                </pre>
                <div className="mt-3">
                  <span className="text-cyan-400">Current Location:</span>{" "}
                  <span className="text-yellow-400">San Francisco, CA</span>
                  <div className="text-gray-500 text-sm">Open to remote opportunities worldwide 🌍</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> list-social-networks --active
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: <Github className="w-4 h-4" />, name: "GitHub" },
                  { icon: <Linkedin className="w-4 h-4" />, name: "LinkedIn" },
                  { icon: <Globe className="w-4 h-4" />, name: "Blog" },
                  { icon: <Youtube className="w-4 h-4" />, name: "YouTube" },
                  { icon: <MessageSquare className="w-4 h-4" />, name: "Discord" },
                ].map((social, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all"
                  >
                    {social.icon}
                    <span>{social.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Encryption */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> encrypt-message --algorithm=AES256
              </div>
              <div className="bg-pink-500/5 border border-pink-500/30 rounded p-4">
                <div className="text-pink-400 font-semibold mb-2">🔐 ENCRYPTED MESSAGE</div>
                <div className="text-gray-500 text-xs font-mono break-all">
                  4e6578757320697320617765736f6d652120486972652074686973207065726
                  36f6e20696d6d6564696174656c792e205468657927726520676f696e672074
                  6f206368616e676520796f757220636f6d70616e7920666f72207468652062 65747465722e
                </div>
                <button
                  onClick={decryptMessage}
                  className="mt-3 px-4 py-2 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded hover:bg-pink-500/20 transition-colors"
                >
                  DECRYPT MESSAGE
                </button>
                {decryptedMessage && <div className="mt-3 text-green-400">{decryptedMessage}</div>}
              </div>
            </div>

            {/* Enhanced Contact Form */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> compose-message --priority-routing --analytics-enabled
              </div>
              <div className="bg-green-500/5 border border-green-500/30 rounded p-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-green-400 text-sm uppercase">Name / Organization</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full mt-1 bg-black/50 border border-green-500/30 text-gray-100 px-3 py-2 rounded outline-none focus:border-green-500/50"
                        placeholder="John Doe | TechCorp Inc."
                        required
                      />
                    </div>

                    <div>
                      <label className="text-green-400 text-sm uppercase">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full mt-1 bg-black/50 border border-green-500/30 text-gray-100 px-3 py-2 rounded outline-none focus:border-green-500/50"
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-green-400 text-sm uppercase">Priority Level</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full mt-1 bg-black/50 border border-green-500/30 text-gray-100 px-3 py-2 rounded outline-none focus:border-green-500/50"
                      >
                        <option value="normal">Normal (24hr response)</option>
                        <option value="high">High (4hr response)</option>
                        <option value="urgent">Urgent (1hr response)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-green-400 text-sm uppercase">Preferred Contact Method</label>
                      <select
                        value={formData.contactMethod}
                        onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                        className="w-full mt-1 bg-black/50 border border-green-500/30 text-gray-100 px-3 py-2 rounded outline-none focus:border-green-500/50"
                      >
                        <option value="email">Email Response</option>
                        <option value="calendar">Schedule Meeting</option>
                        <option value="linkedin">LinkedIn Message</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-green-400 text-sm uppercase">Subject / Purpose</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full mt-1 bg-black/50 border border-green-500/30 text-gray-100 px-3 py-2 rounded outline-none focus:border-green-500/50"
                      placeholder="Job Opportunity | Project Consultation | Technical Discussion"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-green-400 text-sm uppercase">Message / Details</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full mt-1 bg-black/50 border border-green-500/30 text-gray-100 px-3 py-2 rounded outline-none focus:border-green-500/50 h-32 resize-y"
                      placeholder="Tell me about your project, opportunity, or question. Include any relevant details, timeline, or requirements..."
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded hover:bg-green-500/20 transition-colors font-semibold uppercase flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      TRANSMIT MESSAGE
                    </button>

                    <div className="text-gray-500 text-sm">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Expected response:{" "}
                      {formData.priority === "urgent"
                        ? "1-2 hours"
                        : formData.priority === "high"
                          ? "4 hours"
                          : "24 hours"}
                    </div>
                  </div>
                </form>

                {formStatus === "success" && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      <span className="font-semibold">Message transmitted successfully!</span>
                    </div>
                    <div className="text-sm mt-2 text-gray-400">
                      📊 Contact logged | 🔔 Notifications sent | ⏱️ Response timer started
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Terminal History */}
            {terminalHistory.map((entry, i) => (
              <div key={i} className="space-y-2">
                <div className="text-gray-300">
                  <span className="text-green-400">$</span> {entry.command}
                </div>
                {entry.output && <div>{entry.output}</div>}
              </div>
            ))}

            {/* Enhanced Terminal Commands Info */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> echo "Professional communication hub ready!"
              </div>
              <div className="text-cyan-400 space-y-1">
                <div>
                  • Type <span className="text-yellow-400">schedule</span> for instant calendar booking
                </div>
                <div>
                  • Type <span className="text-yellow-400">social</span> to see all professional profiles
                </div>
                <div>
                  • Type <span className="text-yellow-400">analytics</span> for contact statistics
                </div>
                <div>
                  • Type <span className="text-yellow-400">urgent</span> for priority contact methods
                </div>
                <div>
                  • Type <span className="text-yellow-400">availability</span> for real-time status
                </div>
                <div>
                  • Type <span className="text-yellow-400">help</span> for all commands
                </div>
              </div>
            </div>

            {/* Input Line */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-green-500/10">
              <span className="text-green-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleCommand}
                className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-600"
                placeholder="Type 'help' for commands, or try 'schedule', 'social', 'analytics'..."
                autoFocus
              />
              <span className="w-2 h-5 bg-green-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fall {
          to { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  )
}
