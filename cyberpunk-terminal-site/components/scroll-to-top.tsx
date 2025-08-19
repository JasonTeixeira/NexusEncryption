"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    const scrollToTop = () => {
      // Disable smooth scrolling temporarily for instant positioning
      const html = document.documentElement
      const body = document.body

      // Store original scroll behavior
      const originalHtmlBehavior = html.style.scrollBehavior
      const originalBodyBehavior = body.style.scrollBehavior

      // Set to auto for instant scroll
      html.style.scrollBehavior = "auto"
      body.style.scrollBehavior = "auto"

      // Multiple scroll methods for maximum compatibility
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
      html.scrollTop = 0
      body.scrollTop = 0

      // Scroll any potential scroll containers
      const mainElement = document.getElementById("main-content")
      if (mainElement) {
        mainElement.scrollTop = 0
      }

      // Restore original scroll behavior after a brief delay
      setTimeout(() => {
        html.style.scrollBehavior = originalHtmlBehavior
        body.style.scrollBehavior = originalBodyBehavior
      }, 100)
    }

    // Execute immediately
    scrollToTop()

    // Additional fallback attempts with progressive delays
    const timeouts = [
      setTimeout(scrollToTop, 0),
      setTimeout(scrollToTop, 10),
      setTimeout(scrollToTop, 50),
      setTimeout(scrollToTop, 100),
    ]

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [pathname])

  return null
}
