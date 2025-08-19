"use client"

import { useEffect, useCallback } from "react"

interface KeyboardNavigationOptions {
  onTabChange?: (direction: "next" | "prev") => void
  onEscape?: () => void
  onEnter?: () => void
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            options.onTabChange?.("next")
          }
          break
        case "ArrowLeft":
        case "ArrowUp":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            options.onTabChange?.("prev")
          }
          break
        case "Escape":
          event.preventDefault()
          options.onEscape?.()
          break
        case "Enter":
          if (event.target instanceof HTMLButtonElement) {
            event.preventDefault()
            options.onEnter?.()
          }
          break
      }
    },
    [options],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}
