"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [showCursor, setShowCursor] = useState(true)
  const { login } = useAuth()

  useEffect(() => {
    const bootSequence = [
      "NEXUS ARCHITECT SECURITY TERMINAL v2.1.0",
      "Initializing secure connection...",
      "Loading authentication protocols...",
      "System ready. Please authenticate.",
      "",
      "Enter administrative credentials:",
    ]

    const timer = setTimeout(
      () => {
        if (currentStep < bootSequence.length) {
          setTerminalLines((prev) => [...prev, bootSequence[currentStep]])
          setCurrentStep((prev) => prev + 1)
        }
      },
      currentStep === 0 ? 500 : 300,
    )

    return () => clearTimeout(timer)
  }, [currentStep])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorTimer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTerminalLines((prev) => [...prev, "", `> auth --user ${email}`, "Verifying credentials..."])

    const success = await login(email, password)

    if (!success) {
      setError("ACCESS DENIED: Invalid credentials")
      setTerminalLines((prev) => [...prev, "ERROR: Authentication failed", "Please try again."])
    } else {
      setTerminalLines((prev) => [...prev, "ACCESS GRANTED: Welcome, Administrator", "Redirecting to control panel..."])
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Terminal Header */}
        <div className="bg-gray-800 px-4 py-2 rounded-t-lg border-b border-green-500/30">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-sm text-gray-400">NEXUS@ARCHITECT:~</span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="bg-black border-2 border-green-500/30 rounded-b-lg p-6 min-h-[600px] relative">
          {/* Boot sequence and terminal output */}
          <div className="space-y-1 mb-6">
            {terminalLines.map((line, index) => (
              <div key={index} className="text-green-400">
                {line}
              </div>
            ))}
          </div>

          {/* Authentication form - only show after boot sequence */}
          {currentStep >= 6 && (
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">username:</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border-none outline-none text-green-400 flex-1 font-mono"
                      placeholder="admin@nexusarchitect.dev"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="h-px bg-green-500/30 mt-1"></div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">password:</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent border-none outline-none text-green-400 flex-1 font-mono"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="h-px bg-green-500/30 mt-1"></div>
                </div>

                {error && <div className="text-red-400 mt-2">{error}</div>}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-transparent border border-green-500/50 text-green-400 px-6 py-2 hover:bg-green-500/10 transition-colors disabled:opacity-50"
                  >
                    {loading ? "AUTHENTICATING..." : "EXECUTE LOGIN"}
                  </button>
                </div>
              </form>

              {/* Demo credentials */}
              <div className="mt-8 text-xs text-gray-500 border-t border-green-500/20 pt-4">
                <div>DEMO CREDENTIALS:</div>
                <div>username: admin@nexusarchitect.dev</div>
                <div>password: admin123</div>
              </div>
            </div>
          )}

          {/* Cursor */}
          <div className="flex items-center mt-2">
            <span className="text-green-400">$ </span>
            <span className={`w-2 h-4 bg-green-400 ml-1 ${showCursor ? "opacity-100" : "opacity-0"}`}></span>
          </div>

          {/* Scanlines effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
