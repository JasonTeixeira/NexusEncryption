"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AccessibilityContextType {
  highContrast: boolean
  reducedMotion: boolean
  screenReaderMode: boolean
  fontSize: "normal" | "large" | "extra-large"
  toggleHighContrast: () => void
  toggleReducedMotion: () => void
  toggleScreenReaderMode: () => void
  setFontSize: (size: "normal" | "large" | "extra-large") => void
  announceToScreenReader: (message: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [screenReaderMode, setScreenReaderMode] = useState(false)
  const [fontSize, setFontSize] = useState<"normal" | "large" | "extra-large">("normal")

  // Detect user preferences
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReducedMotion(prefersReducedMotion)

    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia("(prefers-contrast: high)").matches
    setHighContrast(prefersHighContrast)

    // Load saved preferences
    const savedHighContrast = localStorage.getItem("accessibility-high-contrast") === "true"
    const savedReducedMotion = localStorage.getItem("accessibility-reduced-motion") === "true"
    const savedScreenReaderMode = localStorage.getItem("accessibility-screen-reader") === "true"
    const savedFontSize = localStorage.getItem("accessibility-font-size") as "normal" | "large" | "extra-large"

    if (savedHighContrast) setHighContrast(true)
    if (savedReducedMotion) setReducedMotion(true)
    if (savedScreenReaderMode) setScreenReaderMode(true)
    if (savedFontSize) setFontSize(savedFontSize)
  }, [])

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement

    if (highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    if (reducedMotion) {
      root.classList.add("reduced-motion")
    } else {
      root.classList.remove("reduced-motion")
    }

    if (screenReaderMode) {
      root.classList.add("screen-reader-mode")
    } else {
      root.classList.remove("screen-reader-mode")
    }

    root.classList.remove("font-normal", "font-large", "font-extra-large")
    root.classList.add(`font-${fontSize}`)
  }, [highContrast, reducedMotion, screenReaderMode, fontSize])

  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem("accessibility-high-contrast", newValue.toString())
  }

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    localStorage.setItem("accessibility-reduced-motion", newValue.toString())
  }

  const toggleScreenReaderMode = () => {
    const newValue = !screenReaderMode
    setScreenReaderMode(newValue)
    localStorage.setItem("accessibility-screen-reader", newValue.toString())
  }

  const handleSetFontSize = (size: "normal" | "large" | "extra-large") => {
    setFontSize(size)
    localStorage.setItem("accessibility-font-size", size)
  }

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = message
    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  const value: AccessibilityContextType = {
    highContrast,
    reducedMotion,
    screenReaderMode,
    fontSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReaderMode,
    setFontSize: handleSetFontSize,
    announceToScreenReader,
  }

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
