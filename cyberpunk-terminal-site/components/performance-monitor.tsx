"use client"

import { useEffect, useRef, useState } from "react"

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  renderTime: number
  componentCount: number
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    componentCount: 0,
  })

  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const renderStartTime = useRef(0)

  useEffect(() => {
    let animationId: number

    const measurePerformance = () => {
      const now = performance.now()
      frameCount.current++

      // Calculate FPS every second
      if (now - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current))
        frameCount.current = 0
        lastTime.current = now

        // Get memory usage if available
        const memoryInfo = (performance as any).memory
        const memoryUsage = memoryInfo ? Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) : 0

        setMetrics((prev) => ({
          ...prev,
          fps,
          memoryUsage,
          renderTime: now - renderStartTime.current,
        }))
      }

      renderStartTime.current = now
      animationId = requestAnimationFrame(measurePerformance)
    }

    animationId = requestAnimationFrame(measurePerformance)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return metrics
}

export default function PerformanceMonitor({ visible = false }: { visible?: boolean }) {
  const metrics = usePerformanceMonitor()

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 border border-green-500/30 rounded p-3 text-xs font-mono text-green-400 z-50">
      <div className="space-y-1">
        <div>FPS: {metrics.fps}</div>
        <div>Memory: {metrics.memoryUsage}MB</div>
        <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
      </div>
    </div>
  )
}
