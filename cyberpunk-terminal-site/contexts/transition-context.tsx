"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import TerminalTransition from "@/components/terminal-transition"

interface TransitionContextType {
  navigateWithTransition: (href: string, targetPage: string) => void
  isTransitioning: boolean
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetPage, setTargetPage] = useState("")
  const router = useRouter()

  const navigateWithTransition = (href: string, targetPage: string) => {
    // Prevent multiple transitions
    if (isTransitioning) return

    setTargetPage(targetPage)
    setIsTransitioning(true)
    
    // Try to play transition sound if available, but don't fail if not
    try {
      // Dynamic import to avoid circular dependency
      import("@/contexts/sound-context").then(({ useSound }) => {
        const { playTransition } = useSound()
        playTransition()
      }).catch(() => {
        // Silently fail if sound context is not available
      })
    } catch (error) {
      // Silently fail if sound is not available
    }

    setTimeout(() => {
      // Ensure scroll position is reset before navigation
      const resetScroll = () => {
        window.scrollTo({ top: 0, behavior: "instant" })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }

      // Reset scroll before navigation
      resetScroll()

      // Navigate to new page
      router.push(href)

      // Additional scroll reset after navigation with multiple attempts
      setTimeout(resetScroll, 0)
      setTimeout(resetScroll, 50)
      setTimeout(resetScroll, 100)

      setIsTransitioning(false)
    }, 1000) // Slightly reduced for snappier feel
  }

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
      {isTransitioning && (
        <TerminalTransition targetPage={targetPage} onComplete={() => setIsTransitioning(false)} duration={1000} />
      )}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider")
  }
  return context
}
