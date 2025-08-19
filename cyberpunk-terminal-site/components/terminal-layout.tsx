"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { MatrixRain, ParticleField, NeuralNetwork, CyberGrid } from "./advanced-effects"
import { useAccessibility } from "./accessibility-provider"

interface TerminalLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showEffects?: boolean
}

export default function TerminalLayout({ 
  children, 
  title = "NEXUS ARCHITECT", 
  subtitle = "TERMINAL GATEWAY",
  showEffects = true 
}: TerminalLayoutProps) {
  const pathname = usePathname()
  const { reducedMotion } = useAccessibility()
  const [currentTime, setCurrentTime] = useState("")
  const [systemLoad, setSystemLoad] = useState(Math.random() * 100)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate system load changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => Math.max(10, Math.min(95, prev + (Math.random() - 0.5) * 10)))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'HOME'
      case '/about': return 'ABOUT'
      case '/projects': return 'PROJECTS'
      case '/skills': return 'SKILLS'
      case '/contact': return 'CONTACT'
      case '/dashboards': return 'DASHBOARDS'
      case '/blog': return 'BLOG'
      case '/admin': return 'ADMIN'
      default: return pathname.toUpperCase().replace('/', '')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-green-400 font-mono relative overflow-hidden">
      {/* Advanced Background Effects */}
      {showEffects && !reducedMotion && (
        <>
          <MatrixRain intensity={0.2} />
          <ParticleField count={25} />
          <NeuralNetwork />
          <CyberGrid />
        </>
      )}

      {/* Terminal Window Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Terminal Header Bar */}
        <div className="bg-gray-900/95 backdrop-blur-sm border-b border-green-500/30 px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Terminal Controls */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-4 text-gray-400 text-sm">
                <span className="text-green-400">➤</span> Terminal Gateway
              </div>
            </div>

            {/* System Info */}
            <div className="flex items-center space-x-6 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400">🔒</span>
                <span>NEXUS@ARCHITECT:~/{getPageTitle()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">⚡</span>
                <span>CPU: {systemLoad.toFixed(1)}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">🕒</span>
                <span>{currentTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Content Area */}
        <div 
          ref={terminalRef}
          className="flex-1 bg-black/40 glass-card terminal-glow scan-lines overflow-hidden"
        >
          {/* Terminal Prompt Header */}
          <div className="border-b border-green-500/20 bg-gray-900/50 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-green-400 text-lg font-bold cyber-gradient-text">
                  {title}
                </div>
                <div className="text-gray-400 text-sm">
                  {subtitle} • v2.4.1
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Session: ACTIVE</span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>

          {/* Page Navigation Breadcrumb */}
          <div className="px-6 py-2 bg-gray-900/30 border-b border-green-500/10">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="text-green-400">$</span>
              <span>cd /nexus/architect/{getPageTitle().toLowerCase()}</span>
              <span className="text-cyan-400 animate-pulse">|</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </div>

          {/* Terminal Status Bar */}
          <div className="border-t border-green-500/20 bg-gray-900/50 px-6 py-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>SECURE TERMINAL • AUTHENTICATION REQUIRED • v2.4.1</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>TAB: autocomplete</span>
                <span>↑↓: history</span>
                <span>?: help</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Line Effect */}
      {!reducedMotion && (
        <div className="fixed inset-0 pointer-events-none z-20">
          <div className="scan-lines opacity-30"></div>
        </div>
      )}
    </div>
  )
}
