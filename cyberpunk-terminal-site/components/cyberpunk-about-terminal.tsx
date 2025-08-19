"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronRight, Cloud, Code, Trophy, Download, ExternalLink, Target } from "lucide-react"
import CyberpunkTerminalMenu from "./cyberpunk-terminal-menu"

interface TimelineItem {
  date: string
  title: string
  company: string
  description: string[]
}

interface Certification {
  name: string
  issuer: string
  validUntil: string
}

interface SkillCategory {
  name: string
  icon: React.ReactNode
  skills: { name: string; level: number }[]
}

export default function CyberpunkAboutTerminal() {
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ type: "command" | "output"; content: React.ReactNode }>
  >([])
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [typingText, setTypingText] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fullText = "Cloud Architect | Infrastructure Engineer | Security Specialist"

  // Timeline data
  const timeline: TimelineItem[] = [
    {
      date: "2020 - PRESENT",
      title: "Lead Cloud Architect",
      company: "TechCorp Global",
      description: [
        "Architected multi-cloud infrastructure serving 100M+ users",
        "Reduced infrastructure costs by 65% through optimization",
        "Led team of 15 engineers across 3 continents",
        "Implemented zero-trust security architecture",
      ],
    },
    {
      date: "2017 - 2020",
      title: "Senior DevOps Engineer",
      company: "CloudScale Inc",
      description: [
        "Built CI/CD pipelines reducing deployment time by 80%",
        "Migrated 200+ applications to Kubernetes",
        "Achieved 99.99% uptime across all services",
        "Automated infrastructure provisioning with Terraform",
      ],
    },
    {
      date: "2015 - 2017",
      title: "Infrastructure Engineer",
      company: "StartupXYZ",
      description: [
        "Scaled infrastructure from 0 to 1M users",
        "Implemented monitoring and alerting systems",
        "Managed AWS infrastructure and costs",
        "Built disaster recovery procedures",
      ],
    },
  ]

  // Certifications data
  const certifications: Certification[] = [
    { name: "AWS Solutions Architect Professional", issuer: "Amazon Web Services", validUntil: "2023-2026" },
    { name: "Google Cloud Professional Architect", issuer: "Google Cloud", validUntil: "2023-2025" },
    { name: "Certified Kubernetes Administrator", issuer: "CNCF", validUntil: "2024-2026" },
    { name: "HashiCorp Terraform Associate", issuer: "HashiCorp", validUntil: "2024-2026" },
    { name: "AWS Security Specialty", issuer: "Amazon Web Services", validUntil: "2023-2026" },
    { name: "Azure Solutions Architect Expert", issuer: "Microsoft", validUntil: "2024-2026" },
  ]

  // Skills data
  const skillCategories: SkillCategory[] = [
    {
      name: "Cloud Platforms",
      icon: <Cloud className="w-4 h-4" />,
      skills: [
        { name: "AWS", level: 95 },
        { name: "Google Cloud", level: 80 },
        { name: "Azure", level: 70 },
      ],
    },
    {
      name: "Core Technologies",
      icon: <Target className="w-4 h-4" />,
      skills: [
        { name: "Kubernetes", level: 92 },
        { name: "Terraform", level: 95 },
        { name: "Docker", level: 90 },
        { name: "Service Mesh", level: 85 },
      ],
    },
    {
      name: "Programming",
      icon: <Code className="w-4 h-4" />,
      skills: [
        { name: "Python", level: 90 },
        { name: "Go", level: 75 },
        { name: "JavaScript", level: 85 },
        { name: "Bash", level: 95 },
      ],
    },
  ]

  // Commands
  const commands = {
    help: {
      execute: () => (
        <div className="space-y-2">
          <div className="text-cyan-400 font-bold">About Page Commands:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-cyan-300">story</span> - My journey into tech
            </div>
            <div>
              <span className="text-cyan-300">philosophy</span> - Engineering philosophy
            </div>
            <div>
              <span className="text-cyan-300">mentor</span> - Get career advice
            </div>
            <div>
              <span className="text-cyan-300">skills</span> - View detailed skills
            </div>
            <div>
              <span className="text-cyan-300">experience</span> - Work experience
            </div>
            <div>
              <span className="text-cyan-300">education</span> - Academic background
            </div>
            <div>
              <span className="text-cyan-300">certs</span> - List certifications
            </div>
            <div>
              <span className="text-cyan-300">achievements</span> - Notable accomplishments
            </div>
            <div>
              <span className="text-cyan-300">social</span> - Social media links
            </div>
            <div>
              <span className="text-cyan-300">resume</span> - Download resume
            </div>
            <div>
              <span className="text-cyan-300">joke</span> - Random tech joke
            </div>
            <div>
              <span className="text-cyan-300">inspire</span> - Motivational quote
            </div>
            <div>
              <span className="text-cyan-300">podcast</span> - Favorite podcasts
            </div>
            <div>
              <span className="text-cyan-300">books</span> - Reading list
            </div>
            <div>
              <span className="text-cyan-300">clear</span> - Clear terminal
            </div>
          </div>
          <div className="text-yellow-400 text-sm">Hidden commands exist... try 'hack personality' or 'sudo'</div>
        </div>
      ),
    },
    story: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">📖 MY JOURNEY INTO TECH</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>
          <div className="space-y-3">
            <div>
              <div className="text-cyan-300">Chapter 1: The Beginning</div>
              <div className="text-gray-400 text-sm">
                It started with a Commodore 64 and a dream. At age 8, I wrote my first program - a simple calculator
                that couldn't handle division by zero (some lessons you learn the hard way).
              </div>
            </div>
            <div>
              <div className="text-cyan-300">Chapter 2: The Awakening</div>
              <div className="text-gray-400 text-sm">
                High school brought Linux, and suddenly the world made sense. I spent nights recompiling kernels,
                breaking systems, and learning that <span className="text-red-400">sudo rm -rf /</span> is not a
                productivity hack.
              </div>
            </div>
            <div>
              <div className="text-cyan-300">Chapter 3: The Education</div>
              <div className="text-gray-400 text-sm">
                MIT taught me theory, but the real education came from building things that broke in production at 3 AM.
                Stanford refined my thinking, but nothing teaches architecture like a system failing at scale.
              </div>
            </div>
            <div>
              <div className="text-cyan-300">Chapter 4: The Cloud Era</div>
              <div className="text-gray-400 text-sm">
                Joined a startup right as AWS was taking off. We migrated from a server under the CEO's desk to the
                cloud. That server is probably still running somewhere, forgotten but faithful.
              </div>
            </div>
            <div>
              <div className="text-cyan-300">Chapter 5: The Present</div>
              <div className="text-gray-400 text-sm">
                Now I architect systems that serve millions, save millions, and occasionally keep me up at night. But I
                wouldn't have it any other way.
              </div>
            </div>
          </div>
          <div className="text-green-400">The journey continues...</div>
        </div>
      ),
    },
    philosophy: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">🧠 ENGINEERING PHILOSOPHY</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>
          <div className="space-y-3">
            <div>
              <div className="text-cyan-300">1. Simplicity is the Ultimate Sophistication</div>
              <div className="text-gray-400 text-sm italic">
                "Any fool can write code that a computer can understand. Good programmers write code that humans can
                understand."
              </div>
            </div>
            <div>
              <div className="text-cyan-300">2. Automate Everything</div>
              <div className="text-gray-400 text-sm">
                If you do it twice, script it.
                <br />
                If you script it twice, automate it.
                <br />
                If you automate it twice, open-source it.
              </div>
            </div>
            <div>
              <div className="text-cyan-300">3. Fail Fast, Learn Faster</div>
              <div className="text-gray-400 text-sm">
                Every outage is a learning opportunity.
                <br />
                Every bug is a missing test.
                <br />
                Every incident is tomorrow's runbook.
              </div>
            </div>
            <div>
              <div className="text-cyan-300">4. Security is Not Optional</div>
              <div className="text-gray-400 text-sm">
                Security isn't a feature, it's a foundation.
                <br />
                Trust nothing, verify everything.
                <br />
                Assume breach, prepare response.
              </div>
            </div>
          </div>
          <div className="text-yellow-400">
            Remember: <span className="text-green-400">Perfect is the enemy of good, but good enough rarely is.</span>
          </div>
        </div>
      ),
    },
    mentor: {
      execute: () => {
        const advice = [
          "Master the fundamentals. Frameworks come and go, but TCP/IP is forever.",
          "Learn in public. Your mistakes today are someone else's solution tomorrow.",
          "Read the documentation. Then read the source code. Then read between the lines.",
          "Contribute to open source. The best way to learn is to teach.",
          "Build things. Break things. Fix things. Repeat.",
          "Network with humans, not just computers. Your next job comes from people, not portals.",
          "Embrace the impostor syndrome. If you feel like you know everything, you've stopped learning.",
          "Write documentation like you're explaining to your past self.",
          "Learn to say 'I don't know' - it's the beginning of wisdom.",
          "The best code is code you don't have to write.",
        ]

        const randomAdvice = advice[Math.floor(Math.random() * advice.length)]

        return (
          <div className="space-y-3">
            <div className="text-cyan-400 font-bold">🎯 CAREER ADVICE</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>
            <div className="text-green-400 text-lg italic">"{randomAdvice}"</div>
            <div className="text-cyan-300">Want specific advice? Try:</div>
            <div className="text-gray-400 text-sm space-y-1">
              <div>
                • <span className="text-yellow-400">mentor --junior</span> - Advice for junior developers
              </div>
              <div>
                • <span className="text-yellow-400">mentor --senior</span> - Leveling up to senior
              </div>
              <div>
                • <span className="text-yellow-400">mentor --architect</span> - Path to architecture
              </div>
              <div>
                • <span className="text-yellow-400">mentor --interview</span> - Interview tips
              </div>
            </div>
          </div>
        )
      },
    },
    joke: {
      execute: () => {
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs!",
          "There are only 10 types of people in the world: those who understand binary and those who don't.",
          "Why did the developer go broke? Because he used up all his cache!",
          "A QA engineer walks into a bar. Orders 0 beers. Orders 99999999 beers. Orders -1 beers. Orders a lizard.",
          "How many programmers does it take to change a light bulb? None. It's a hardware problem.",
          "Why do Java developers wear glasses? Because they don't C#!",
          "I would tell you a joke about UDP, but you might not get it.",
          "There's no place like 127.0.0.1",
          "My code doesn't have bugs. It just develops random features.",
        ]

        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]

        return (
          <div className="space-y-2">
            <div className="text-yellow-400 font-bold">😄 TECH HUMOR</div>
            <div className="text-green-400">{randomJoke}</div>
            <div className="text-gray-500 text-sm">Type 'joke' for another one!</div>
          </div>
        )
      },
    },
    inspire: {
      execute: () => {
        const quotes = [
          "The best time to plant a tree was 20 years ago. The second best time is now.",
          "Code is like humor. When you have to explain it, it's bad.",
          "First, solve the problem. Then, write the code.",
          "Experience is the name everyone gives to their mistakes.",
          "The only way to do great work is to love what you do.",
          "In real open source, you have the right to control your own destiny.",
          "Talk is cheap. Show me the code.",
          "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
        ]

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

        return (
          <div className="space-y-2">
            <div className="text-purple-400 font-bold">✨ INSPIRATION</div>
            <div className="text-cyan-300 text-lg italic">"{randomQuote}"</div>
          </div>
        )
      },
    },
    social: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">🌐 CONNECT WITH ME</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400">GitHub:</span>
              <span className="text-green-400">github.com/nexus-architect</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400">LinkedIn:</span>
              <span className="text-green-400">linkedin.com/in/nexus-architect</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400">Twitter:</span>
              <span className="text-green-400">@nexus_architect</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400">Blog:</span>
              <span className="text-green-400">nexus-architect.dev</span>
            </div>
          </div>
        </div>
      ),
    },
    resume: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">📄 DOWNLOAD RESUME</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Resume_NexusArchitect_2025.pdf</span>
            </div>
            <div className="text-gray-400 text-sm">Size: 142KB | Format: PDF | Updated: Jan 2025</div>
            <div className="text-yellow-400">Download initiated...</div>
          </div>
        </div>
      ),
    },
    podcast: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">🎧 FAVORITE TECH PODCASTS</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>
          <div className="space-y-2 text-gray-400">
            <div>
              • <span className="text-green-400">Kubernetes Podcast from Google</span>
            </div>
            <div>
              • <span className="text-green-400">AWS Podcast</span>
            </div>
            <div>
              • <span className="text-green-400">The Changelog</span>
            </div>
            <div>
              • <span className="text-green-400">Software Engineering Daily</span>
            </div>
            <div>
              • <span className="text-green-400">DevOps Paradox</span>
            </div>
            <div>
              • <span className="text-green-400">Command Line Heroes</span>
            </div>
            <div>
              • <span className="text-green-400">The Stack Overflow Podcast</span>
            </div>
          </div>
        </div>
      ),
    },
    books: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">📚 RECOMMENDED READING</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>
          <div className="space-y-2">
            <div className="text-yellow-400">Technical:</div>
            <div className="text-gray-400 text-sm space-y-1 pl-4">
              <div>• Designing Data-Intensive Applications - Martin Kleppmann</div>
              <div>• Site Reliability Engineering - Google</div>
              <div>• The Phoenix Project - Gene Kim</div>
              <div>• Clean Code - Robert C. Martin</div>
            </div>
            <div className="text-yellow-400 mt-2">Leadership:</div>
            <div className="text-gray-400 text-sm space-y-1 pl-4">
              <div>• Staff Engineer - Will Larson</div>
              <div>• The Manager's Path - Camille Fournier</div>
              <div>• Accelerate - Nicole Forsgren</div>
            </div>
          </div>
        </div>
      ),
    },
    "hack personality": {
      execute: () => (
        <div className="space-y-3">
          <div className="text-red-400 font-bold animate-pulse">⚠️ ATTEMPTING PERSONALITY HACK...</div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-yellow-500 animate-pulse"
              style={{ width: "100%" }}
            />
          </div>
          <div className="text-red-400">ACCESS DENIED</div>
          <div className="text-green-400">Nice try! My personality is secured with:</div>
          <div className="text-gray-400 text-sm space-y-1">
            <div>• 2048-bit encryption of emotions</div>
            <div>• Firewall blocking negative vibes</div>
            <div>• Rate limiting on bad jokes</div>
            <div>• DDoS protection against small talk</div>
          </div>
          <div className="text-yellow-400">Security Alert: Intrusion attempt logged to /dev/null</div>
        </div>
      ),
    },
    sudo: {
      execute: () => (
        <div className="space-y-2">
          <div className="text-red-400">[sudo] password for nexus:</div>
          <div className="text-gray-400">*********</div>
          <div className="text-red-400">Sorry, try again.</div>
          <div className="text-yellow-400">Hint: The password is not 'password123' 😄</div>
        </div>
      ),
    },
    clear: {
      execute: () => {
        setTerminalHistory([])
        return null
      },
    },
  }

  const processCommand = useCallback((input: string) => {
    const trimmed = input.trim().toLowerCase()

    if (commands[trimmed]) {
      return commands[trimmed].execute()
    }

    return <div className="text-red-400">Command not found: {trimmed}. Type 'help' for available commands.</div>
  }, [])

  const handleCommand = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && currentInput.trim()) {
        const newHistory = [
          ...terminalHistory,
          {
            type: "command" as const,
            content: (
              <>
                <span className="text-green-400">$</span> {currentInput}
              </>
            ),
          },
          { type: "output" as const, content: processCommand(currentInput) },
        ].filter((item) => item.content !== null)

        setTerminalHistory(newHistory)
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
    [currentInput, terminalHistory, commandHistory, historyIndex, processCommand],
  )

  // Typing animation effect
  useEffect(() => {
    if (typingText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypingText(fullText.slice(0, typingText.length + 1))
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [typingText, fullText])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono relative overflow-hidden">
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-20 animate-pulse" />

      {/* CRT effect */}
      <div className="fixed inset-0 pointer-events-none z-20 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Terminal Window */}
      <div className="relative z-0 min-h-screen flex flex-col">
        {/* Terminal Header */}
        <CyberpunkTerminalMenu currentPage="about" />

        {/* Terminal Body */}
        <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 bg-black/40">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* ASCII Art Header */}
            <pre className="text-cyan-400 text-xs whitespace-pre opacity-0 animate-[fadeIn_0.5s_forwards]">
              {`╔═╗╦ ╦╔═╗╔╦╗╔═╗╔╦╗  ╔═╗╦═╗╔═╗╔═╗╦╦  ╔═╗
╚═╗╚╦╝╚═╗ ║ ║╣ ║║║  ╠═╝╠╦╝║ ║╠╣ ║║  ║╣ 
╚═╝ ╩ ╚═╝ ╩ ╚═╝╩ ╩  ╩  ╩╚═╚═╝╚  ╩╩═╝╚═╝
[HUMAN INTERFACE DOCUMENTATION v4.2.0]`}
            </pre>

            {/* Initial Command */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> whoami --verbose
              </div>
              <div className="text-green-400">Loading system profile...</div>
            </div>

            {/* ASCII Portrait */}
            <div className="flex justify-center">
              <pre className="text-green-400 text-[10px] leading-tight opacity-0 animate-[fadeIn_1s_forwards_1s]">
                {`╔═══════════════════╗
║  ┌─────────────┐  ║
║  │   ███████   │  ║
║  │  ████▓▓████ │  ║
║  │ ████▓▓▓████ │  ║
║  │ ███▓▓▓▓▓███ │  ║
║  │ ███▓░░░▓███ │  ║
║  │ ███▓░░░▓███ │  ║
║  │ ████▓░▓████ │  ║
║  │  ████▓████  │  ║
║  │   ███████   │  ║
║  └─────────────┘  ║
║  [IDENTITY::NEXUS] ║
╚═══════════════════╝`}
              </pre>
            </div>

            {/* System Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-black/50 border border-green-500/20 rounded">
              {[
                { label: "Experience", value: "10+ Years" },
                { label: "Projects", value: "200+" },
                { label: "Languages", value: "8" },
                { label: "Clouds", value: "3" },
                { label: "Certifications", value: "12" },
                { label: "Coffee/Day", value: "∞" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-gray-500 text-xs uppercase">{item.label}</div>
                  <div className="text-cyan-400 text-2xl font-bold">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Biography Section */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> cat /home/nexus/biography.md
              </div>
              <div className="border border-green-500/30 p-4 bg-green-500/5 relative">
                <div className="absolute -top-3 left-4 bg-gray-950 px-2 text-green-400 text-xs">BIOGRAPHY.md</div>
                <div className="space-y-3">
                  <div className="text-cyan-400 font-bold border-r-2 border-green-400 pr-2 inline-block">
                    {typingText}
                  </div>
                  <p className="text-gray-400">
                    I architect the future of cloud infrastructure, one deployment at a time. With over a decade of
                    experience transforming legacy systems into cloud-native powerhouses, I specialize in building
                    resilient, scalable, and secure infrastructure that powers modern applications.
                  </p>
                  <p className="text-gray-400">
                    My philosophy:{" "}
                    <span className="text-cyan-300">
                      "Infrastructure should be invisible when it works, and resilient when it doesn't."
                    </span>
                  </p>
                  <p className="text-gray-400">
                    I thrive in chaos, automate everything, and believe that the best code is no code. When I'm not
                    optimizing cloud costs or implementing zero-trust architectures, you'll find me contributing to open
                    source, mentoring junior engineers, or experimenting with emerging technologies.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values Matrix */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> get-values --core
              </div>
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded">
                {[
                  {
                    title: "🚀 Innovation",
                    items: ["Early adopter of emerging tech", "Continuous experimentation", "Challenge status quo"],
                  },
                  {
                    title: "🔒 Security First",
                    items: ["Zero-trust advocate", "Defense in depth", "Compliance automation"],
                  },
                  {
                    title: "⚡ Performance",
                    items: ["Obsessed with optimization", "Sub-second response times", "Resource efficiency"],
                  },
                  {
                    title: "🤝 Collaboration",
                    items: ["Open source contributor", "Knowledge sharing", "Team multiplier"],
                  },
                ].map((quadrant, i) => (
                  <div key={i} className="p-3 bg-black/30 border border-purple-500/10 rounded">
                    <div className="text-purple-400 font-semibold mb-2 text-sm uppercase">{quadrant.title}</div>
                    <ul className="space-y-1">
                      {quadrant.items.map((item, j) => (
                        <li key={j} className="text-gray-400 text-sm flex items-center">
                          <ChevronRight className="w-3 h-3 text-purple-400 mr-1" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> analyze-skills --detailed
              </div>
              <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded space-y-4">
                {skillCategories.map((category, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-3 text-sm uppercase">
                      {category.icon}
                      {category.name}
                    </div>
                    <div className="space-y-2">
                      {category.skills.map((skill, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <span className="text-gray-400 w-24 text-sm">{skill.name}</span>
                          <div className="flex-1 h-2 bg-green-500/10 border border-green-500/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-1000 relative"
                              style={{ width: `${skill.level}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                            </div>
                          </div>
                          <span className="text-green-400 text-sm w-10">{skill.level}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> git log --career --oneline --graph
              </div>
              <div className="pl-8 border-l-2 border-green-500/30 space-y-6">
                {timeline.map((item, i) => (
                  <div
                    key={i}
                    className="relative opacity-0 animate-[slideIn_0.5s_forwards] "
                    style={{ animationDelay: `${3.7 + i * 0.2}s` }}
                  >
                    <div className="absolute -left-10 top-2 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <div className="text-gray-500 text-xs">{item.date}</div>
                    <div className="text-cyan-400 font-semibold">{item.title}</div>
                    <div className="text-yellow-400 text-sm">{item.company}</div>
                    <div className="text-gray-400 text-sm mt-2 space-y-1">
                      {item.description.map((desc, j) => (
                        <div key={j}>• {desc}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> ls -la /achievements/certifications/
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="p-3 bg-yellow-500/5 border border-yellow-500/30 rounded hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-all hover:-translate-y-0.5 relative"
                  >
                    <Trophy className="absolute top-2 right-2 w-5 h-5 text-yellow-400" />
                    <div className="text-yellow-400 font-semibold text-sm">{cert.name}</div>
                    <div className="text-gray-500 text-xs mt-1">{cert.issuer}</div>
                    <div className="text-green-400 text-xs mt-2">Valid: {cert.validUntil}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> achievement list --unlocked
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "10K+ GitHub Stars",
                  "Speaker at KubeCon",
                  "$2M+ Cost Savings",
                  "Zero Security Breaches",
                  "99.99% Uptime Master",
                  "Open Source Hero",
                  "Automation Wizard",
                  "Cloud Cost Optimizer",
                  "Chaos Engineering Pioneer",
                  "Terraform Guru",
                ].map((achievement, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 bg-pink-500/10 border border-pink-500 text-pink-400 text-sm rounded relative overflow-hidden"
                  >
                    <Trophy className="inline w-3 h-3 mr-1" />
                    {achievement}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent -translate-x-full animate-[slideRight_3s_infinite]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> cat /var/log/education.log
              </div>
              <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded space-y-3">
                <div>
                  <div className="text-cyan-400 font-semibold">📚 Master of Science - Computer Science</div>
                  <div className="text-cyan-300 text-sm">Stanford University | 2011-2013</div>
                  <div className="text-gray-500 text-sm">Specialization: Distributed Systems & Cloud Computing</div>
                </div>
                <div>
                  <div className="text-cyan-400 font-semibold">📚 Bachelor of Science - Software Engineering</div>
                  <div className="text-cyan-300 text-sm">MIT | 2007-2011</div>
                  <div className="text-gray-500 text-sm">Minor: Mathematics | GPA: 3.9/4.0</div>
                </div>
              </div>
            </div>

            {/* Fun Stats */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> generate-fun-stats
              </div>
              <div className="space-y-3">
                {[
                  { label: "Coffee Consumed (Lifetime)", value: "∞ cups", percent: 100 },
                  { label: "Bugs Fixed", value: "42,847", percent: 85 },
                  { label: "Late Night Deployments", value: "Too Many", percent: 60 },
                  { label: "Vim Mastery", value: "Can Exit!", percent: 95 },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
                    <div className="relative h-5 bg-green-500/10 border border-green-500/30 rounded overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500"
                        style={{ width: `${stat.percent}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                        {stat.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Focus */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> tail -f /interests/current.log
              </div>
              <div className="p-4 bg-pink-500/5 border border-pink-500/20 rounded">
                <div className="text-yellow-400 font-semibold mb-2">🔥 Currently Exploring:</div>
                <div className="text-gray-400 text-sm space-y-1">
                  {[
                    "eBPF for observability without instrumentation",
                    "WebAssembly at the edge",
                    "GitOps with ArgoCD and Flux",
                    "Service Mesh patterns with Istio/Linkerd",
                    "FinOps and cloud cost optimization",
                    "Platform Engineering and developer experience",
                  ].map((item, i) => (
                    <div key={i}>
                      • <span className="text-cyan-300">{item.split(" ")[0]}</span> {item.slice(item.indexOf(" "))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Personality Test */}
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> personality-test --mbti
              </div>
              <div className="text-center py-4">
                <div className="text-cyan-400 text-2xl font-bold animate-pulse">INTJ-A / ARCHITECT</div>
                <div className="text-gray-500 text-sm mt-2">Strategic | Independent | Decisive | Innovative</div>
                <div className="text-green-400 mt-3 italic">
                  "One person with a vision is worth a thousand with just an opinion."
                </div>
              </div>
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
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleCommand}
                className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-600"
                placeholder="Type 'help' for commands, or try 'story', 'philosophy', 'mentor'..."
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
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          to { transform: translateX(200%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
