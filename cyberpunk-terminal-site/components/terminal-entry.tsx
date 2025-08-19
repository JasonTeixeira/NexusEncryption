"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Terminal, Lock, Unlock, AlertCircle, Command, Smartphone } from "lucide-react"
import { useSound } from "@/contexts/sound-context"
import MobileTerminalKeyboard from "./mobile-terminal-keyboard"

interface TerminalEntryProps {
  onAccessGranted: () => void
  siteName?: string
}

export default function TerminalEntry({ onAccessGranted, siteName = "NEXUS ARCHITECT" }: TerminalEntryProps) {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [terminalLines, setTerminalLines] = useState<
    Array<{ type: "command" | "output" | "error" | "success" | "info"; text: string }>
  >([])
  const [showCursor, setShowCursor] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileKeyboard, setShowMobileKeyboard] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const { playTyping, playCommand, playSuccess, playError, playBootSequence } = useSound()

  const validCommands = ["enter", "open", "start", "access", "connect", "login", "init", "run"]

  // Added mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const bootSequence = async () => {
      playBootSequence()
      await delay(500)
      addLine("info", "> System initialized...")
      await delay(300)
      addLine("info", "> Security protocols enabled...")
      await delay(300)
      addLine("info", "> Terminal ready...")
      await delay(500)
      addLine("info", "═══════════════════════════════════════════════════")
      addLine("success", `Welcome to ${siteName} Terminal Gateway v2.4.1`)
      addLine("info", "═══════════════════════════════════════════════════")
      await delay(300)
      addLine("info", " ")
      addLine("info", "Access restricted. Authentication required.")
      addLine("info", " ")

      // Show mobile-specific instructions
      if (isMobile) {
        await delay(500)
        addLine("info", "📱 Mobile device detected. Tap the terminal to show keyboard.")
      }
    }
    bootSequence()

    const hintTimer = setTimeout(() => {
      setShowHint(true)
    }, 15000)

    return () => clearTimeout(hintTimer)
  }, [siteName, playBootSequence, isMobile])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Modified click handler for mobile
  useEffect(() => {
    const handleClick = () => {
      if (isMobile) {
        setShowMobileKeyboard(true)
      } else {
        inputRef.current?.focus()
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [isMobile])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines])

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const addLine = (type: "command" | "output" | "error" | "success" | "info", text: string) => {
    setTerminalLines((prev) => [...prev, { type, text }])
  }

  const processCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()

    if (!trimmedCmd) return

    playCommand()

    setCommandHistory((prev) => [...prev, cmd])
    setHistoryIndex(commandHistory.length + 1)
    setAttempts((prev) => prev + 1)

    addLine("command", `$ ${cmd}`)

    setIsProcessing(true)
    await delay(300)

    if (validCommands.includes(trimmedCmd) || trimmedCmd === "open site" || trimmedCmd === "enter site") {
      playSuccess()
      addLine("success", "✓ Access granted!")
      await delay(200)
      addLine("info", "Initializing main interface...")
      await delay(500)
      addLine("info", "[████████████████████████] 100%")
      await delay(500)
      addLine("success", "Welcome to " + siteName)
      setAccessGranted(true)
      setShowMobileKeyboard(false) // Hide mobile keyboard on success
      await delay(1000)
      onAccessGranted()
    } else if (trimmedCmd === "sudo enter" || trimmedCmd === "sudo open") {
      playSuccess()
      addLine("success", "✓ Superuser access granted!")
      addLine("info", "Welcome, Administrator")
      setAccessGranted(true)
      setShowMobileKeyboard(false)
      await delay(1000)
      onAccessGranted()
    } else if (trimmedCmd === "hack") {
      playError()
      addLine("error", "⚠ Nice try! But this system is protected.")
      addLine("info", 'Just type "enter" like a normal person 😄')
    } else if (trimmedCmd === "help" || trimmedCmd === "?") {
      addLine("info", "Available commands:")
      addLine("output", "  enter    - Enter the website")
      addLine("output", "  open     - Open the main site")
      addLine("output", "  start    - Start the application")
      addLine("output", "  connect  - Connect to the server")
      addLine("output", "  help     - Show this help message")
      addLine("output", "  clear    - Clear the terminal")
      addLine("output", "  about    - About this terminal")
    } else if (trimmedCmd === "clear" || trimmedCmd === "cls") {
      setTerminalLines([])
      addLine("info", "Terminal cleared.")
    } else if (trimmedCmd === "about") {
      addLine("info", "═══════════════════════════════════════")
      addLine("info", siteName + " Terminal Gateway")
      addLine("info", "Version 2.4.1")
      addLine("info", "Created with React & TypeScript")
      addLine("info", "═══════════════════════════════════════")
    } else if (trimmedCmd === "ls" || trimmedCmd === "dir") {
      addLine("output", "home/    about/    projects/    skills/    contact/")
    } else if (trimmedCmd === "whoami") {
      addLine("output", "guest@nexus-architect")
    } else if (trimmedCmd === "pwd") {
      addLine("output", "/var/www/nexus-architect/gateway")
    } else if (trimmedCmd === "date") {
      addLine("output", new Date().toString())
    } else if (trimmedCmd === "exit" || trimmedCmd === "quit") {
      playError()
      addLine("error", "Cannot exit. You must enter the site or close the browser.")
    } else {
      playError()
      addLine("error", `Command not found: ${cmd}`)
      addLine("info", 'Type "help" for available commands')

      if (attempts >= 3 && !showHint) {
        await delay(500)
        addLine("info", '💡 Hint: Try typing "enter" or "open"')
      }
    }

    setIsProcessing(false)
    setInput("")
  }

  // Added mobile keyboard handlers
  const handleMobileKeyPress = (key: string) => {
    if (key === "Backspace") {
      setInput((prev) => prev.slice(0, -1))
    } else {
      setInput((prev) => prev + key)
      playTyping()
    }
  }

  const handleMobileCommand = (command: string) => {
    setInput(command)
    processCommand(command)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isProcessing) {
      processCommand(input)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex] || "")
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex] || "")
      } else {
        setHistoryIndex(commandHistory.length)
        setInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      const possibleCommands = validCommands.filter((cmd) => cmd.startsWith(input.toLowerCase()))
      if (possibleCommands.length === 1) {
        setInput(possibleCommands[0])
      }
    } else {
      if (e.key.length === 1) {
        playTyping()
      }
    }
  }

  const getLineColor = (type: string) => {
    switch (type) {
      case "command":
        return "text-cyan-400"
      case "success":
        return "text-green-400"
      case "error":
        return "text-red-400"
      case "info":
        return "text-gray-400"
      case "output":
        return "text-gray-300"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="relative bg-gray-900/90 backdrop-blur-md rounded-lg border border-gray-800 shadow-2xl overflow-hidden">
          <div className="bg-gray-800/80 px-4 py-3 flex items-center justify-between border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <Terminal className="w-4 h-4" />
                <span className="text-xs font-mono">Terminal Gateway</span>
                {/* Added mobile indicator */}
                {isMobile && <Smartphone className="w-3 h-3 text-cyan-400" />}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {accessGranted ? (
                <Unlock className="w-4 h-4 text-green-400" />
              ) : (
                <Lock className="w-4 h-4 text-yellow-400" />
              )}
              <span className="text-xs font-mono text-gray-400 uppercase hidden sm:block">
                NEXUS@ARCHITECT:~/gateway
              </span>
            </div>
          </div>

          <div
            ref={terminalRef}
            className={`overflow-y-auto p-4 sm:p-6 font-mono text-sm ${isMobile ? "h-[50vh] pb-20" : "h-[400px]"}`}
            onClick={() => {
              if (isMobile) {
                setShowMobileKeyboard(true)
              } else {
                inputRef.current?.focus()
              }
            }}
          >
            {terminalLines.map((line, index) => (
              <div
                key={index}
                className={`mb-1 ${getLineColor(line.type)} animate-fadeIn`}
                style={{ animationDelay: `${index * 0.01}s` }}
              >
                {line.text}
              </div>
            ))}

            {/* Modified input line for mobile */}
            <div className="flex items-center mt-2">
              <span className="text-green-400 mr-2">$</span>
              {!isMobile ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isProcessing || accessGranted}
                  className="flex-1 bg-transparent outline-none text-cyan-400 font-mono"
                  placeholder=""
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              ) : (
                <div className="flex-1 text-cyan-400 font-mono">
                  {input}
                  {showCursor && !accessGranted && <span className="animate-pulse">_</span>}
                </div>
              )}
              {!isMobile && showCursor && !accessGranted && <span className="inline-block w-2 h-5 bg-cyan-400 ml-1" />}
            </div>
          </div>

          <div className="bg-gray-800/80 px-4 sm:px-6 py-4 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Command className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400 font-mono">
                    {isMobile ? "Tap to show keyboard" : "Type command to continue"}
                  </span>
                </div>
                {showHint && (
                  <div className="flex items-center gap-2 text-yellow-400 animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    <span className="text-xs font-mono">Try: "enter" or "open"</span>
                  </div>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-6 text-xs text-gray-500 font-mono">
                <span>TAB: autocomplete</span>
                <span>↑↓: history</span>
                <span>?: help</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700/30">
              <p className="text-center text-sm text-gray-400">
                To open the site, type
                <span className="mx-2 px-2 py-1 bg-gray-800 text-cyan-400 rounded font-mono">enter</span>
                or
                <span className="mx-2 px-2 py-1 bg-gray-800 text-cyan-400 rounded font-mono">open</span>
                and press ENTER
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600 font-mono">SECURE TERMINAL • AUTHENTICATION REQUIRED • v2.4.1</p>
        </div>
      </div>

      {/* Added mobile terminal keyboard */}
      {isMobile && (
        <MobileTerminalKeyboard
          visible={showMobileKeyboard && !accessGranted}
          onKeyPress={handleMobileKeyPress}
          onCommand={handleMobileCommand}
          suggestions={validCommands}
        />
      )}
    </div>
  )
}
