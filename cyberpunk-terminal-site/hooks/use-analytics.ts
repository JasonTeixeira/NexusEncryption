"use client"

import { useEffect } from "react"

// Generate a session ID for analytics tracking
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("analytics_session_id")
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem("analytics_session_id", sessionId)
  }
  return sessionId
}

export function useAnalytics() {
  useEffect(() => {
    // Track page view on mount
    trackPageView()

    // Track performance metrics
    trackPerformanceMetrics()

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        trackEvent("interaction", { type: "page_hidden" })
      } else {
        trackEvent("interaction", { type: "page_visible" })
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const trackPageView = async () => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pageview",
          page: window.location.pathname,
          sessionId: getSessionId(),
          data: {
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        }),
      })
    } catch (error) {
      console.error("Failed to track page view:", error)
    }
  }

  const trackEvent = async (type: string, data: Record<string, any>) => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          page: window.location.pathname,
          sessionId: getSessionId(),
          data,
        }),
      })
    } catch (error) {
      console.error("Failed to track event:", error)
    }
  }

  const trackPerformanceMetrics = () => {
    // Wait for page load to complete
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType("paint")

        const metrics = {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstContentfulPaint: paint.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0,
          largestContentfulPaint: 0, // Would need LCP observer
          cumulativeLayoutShift: 0, // Would need CLS observer
          firstInputDelay: 0, // Would need FID observer
        }

        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "performance",
            page: window.location.pathname,
            sessionId: getSessionId(),
            data: { metrics },
          }),
        }).catch((error) => {
          console.error("Failed to track performance:", error)
        })
      }, 1000)
    })
  }

  return { trackEvent }
}
