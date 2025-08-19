"use client"

import type React from "react"

import { useEffect } from "react"
import { performanceMonitor } from "@/lib/performance-monitor"

export default function PerformanceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.enable()

    // Record initial page load
    performanceMonitor.recordMetric("pageView", 1)

    return () => {
      // Send any remaining metrics before unmounting
      performanceMonitor.sendMetrics()
    }
  }, [])

  return <>{children}</>
}
