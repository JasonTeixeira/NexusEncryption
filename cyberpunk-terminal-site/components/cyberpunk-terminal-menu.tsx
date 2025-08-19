"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useTransition } from "@/contexts/transition-context"
import { useSound } from "@/contexts/sound-context"
import { Volume2, VolumeX, Menu, X } from "lucide-react"
import CyberpunkSearch from "@/components/search/cyberpunk-search"

interface MenuProps {
  currentPage?: string
}

export default function CyberpunkTerminalMenu({ currentPage = "home" }: MenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { navigateWithTransition, isTransitioning } = useTransition()
  const { isMuted, toggleMute, playHover, playNavigation } = useSound()

  const menuItems = [
    { name: "home", href: "/", label: "home" },
    { name: "about", href: "/about", label: "about" },
    { name: "projects", href: "/projects", label: "projects" },
    { name: "skills", href: "/skills", label: "skills" },
    { name: "blog", href: "/blog", label: "blog" },
    { name: "dashboards", href: "/dashboards", label: "dashboards" },
    { name: "contact", href: "/contact", label: "contact" },
  ]

  const handleNavigation = (e: React.MouseEvent, item: (typeof menuItems)[0]) => {
    e.preventDefault()
    if (isTransitioning || currentPage === item.name) return

    playNavigation()
    setMobileMenuOpen(false) // Close mobile menu on navigation
    navigateWithTransition(item.href, item.label)
  }

  const handleHover = (itemName: string) => {
    if (hoveredItem !== itemName) {
      playHover()
      setHoveredItem(itemName)
    }
  }

  const toggleMobileMenu = () => {
    playHover()
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      {/* Terminal Header with Menu */}
      <div className="bg-[#1C1C24] px-4 py-3 flex items-center justify-between border-b border-green-500/20">
        {/* Terminal Controls (Red, Yellow, Green dots) */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C940]" />
          </div>
        </div>

        {/* Desktop Terminal Menu */}
        <nav className="hidden md:flex gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavigation(e, item)}
              className={`
                relative text-sm transition-colors duration-300 cursor-pointer
                ${currentPage === item.name ? "text-cyan-400" : "text-gray-500 hover:text-cyan-400"}
                ${isTransitioning ? "pointer-events-none opacity-50" : ""}
              `}
              onMouseEnter={() => handleHover(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* $ prefix */}
              <span className="text-green-400 mr-1">$</span>
              {item.name}
              {/* Blinking cursor for active item */}
              {currentPage === item.name && <span className="animate-pulse ml-0.5">_</span>}
              {isTransitioning && hoveredItem === item.name && (
                <span className="ml-1 text-yellow-400 animate-spin">⟳</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button and Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <CyberpunkSearch />
          </div>

          {/* Added mobile hamburger menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-500 hover:text-cyan-400 transition-colors duration-300 p-2 -m-2 touch-manipulation"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleMute}
            className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 p-2 -m-2 touch-manipulation"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="hidden sm:block text-gray-500 text-xs uppercase tracking-wider">NEXUS@ARCHITECT:~</div>
        </div>
      </div>

      {/* Added mobile terminal menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Mobile Terminal Header */}
            <div className="bg-[#1C1C24] px-4 py-3 flex items-center justify-between border-b border-green-500/20">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C940]" />
                </div>
                <span className="text-gray-400 text-sm font-mono ml-2">Mobile Terminal</span>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 p-2 -m-2 touch-manipulation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Terminal Body */}
            <div className="flex-1 p-6 font-mono">
              <div className="mb-6">
                <CyberpunkSearch />
              </div>

              <div className="space-y-1 mb-6">
                <div className="text-green-400 text-sm">$ ls -la /navigation</div>
                <div className="text-gray-400 text-sm">total {menuItems.length}</div>
                <div className="text-gray-400 text-sm">drwxr-xr-x 2 nexus architect 4096 Dec 8 2024 .</div>
              </div>

              {/* Mobile Navigation Items */}
              <nav className="space-y-4">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item)}
                    className={`
                      block p-4 rounded border border-green-500/20 bg-green-500/5 
                      transition-all duration-300 touch-manipulation
                      ${
                        currentPage === item.name
                          ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
                          : "text-gray-300 hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-400"
                      }
                      ${isTransitioning ? "pointer-events-none opacity-50" : ""}
                      active:scale-95 active:bg-cyan-400/20
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-green-400">$</span>
                        <span className="font-mono text-lg">{item.name}</span>
                        {currentPage === item.name && <span className="animate-pulse text-cyan-400">_</span>}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">
                        {item.name === "home" && "~/"}
                        {item.name === "about" && "~/about"}
                        {item.name === "projects" && "~/projects"}
                        {item.name === "skills" && "~/skills"}
                        {item.name === "blog" && "~/blog"}
                        {item.name === "dashboards" && "~/dashboards"}
                        {item.name === "contact" && "~/contact"}
                      </div>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Mobile Terminal Footer */}
              <div className="mt-8 pt-6 border-t border-green-500/20">
                <div className="text-gray-500 text-sm space-y-1">
                  <div>$ whoami</div>
                  <div className="text-cyan-400">nexus@architect</div>
                  <div className="mt-2">$ pwd</div>
                  <div className="text-cyan-400">/var/www/nexus-architect/{currentPage}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for additional effects */}
      <style jsx>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  )
}
