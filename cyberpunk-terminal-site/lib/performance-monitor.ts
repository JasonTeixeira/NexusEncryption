interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  url?: string
  userAgent?: string
  sessionId?: string
}

interface PageLoadMetrics {
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
}

class PerformanceMonitor {
  private sessionId: string
  private metrics: PerformanceMetric[] = []
  private isEnabled = true

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeMonitoring()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeMonitoring() {
    if (typeof window === "undefined") return

    // Monitor page load performance
    window.addEventListener("load", () => {
      this.collectPageLoadMetrics()
    })

    // Monitor navigation performance
    this.observeNavigation()

    // Monitor Core Web Vitals
    this.observeWebVitals()

    // Monitor user interactions
    this.observeUserInteractions()

    // Send metrics periodically
    setInterval(() => {
      this.sendMetrics()
    }, 30000) // Send every 30 seconds
  }

  private collectPageLoadMetrics() {
    if (!window.performance) return

    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType("paint")

    const metrics: PageLoadMetrics = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstContentfulPaint: paint.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0,
      largestContentfulPaint: 0, // Will be set by observer
      cumulativeLayoutShift: 0, // Will be set by observer
      firstInputDelay: 0, // Will be set by observer
      timeToInteractive: navigation.domInteractive - navigation.navigationStart,
    }

    Object.entries(metrics).forEach(([name, value]) => {
      this.recordMetric(name, value)
    })
  }

  private observeWebVitals() {
    if (typeof window === "undefined") return

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordMetric("largestContentfulPaint", lastEntry.startTime)
    }).observe({ entryTypes: ["largest-contentful-paint"] })

    // Cumulative Layout Shift
    let clsValue = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      this.recordMetric("cumulativeLayoutShift", clsValue)
    }).observe({ entryTypes: ["layout-shift"] })

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric("firstInputDelay", (entry as any).processingStart - entry.startTime)
      }
    }).observe({ entryTypes: ["first-input"] })
  }

  private observeNavigation() {
    if (typeof window === "undefined") return

    let navigationStartTime = performance.now()

    // Monitor route changes (for SPA navigation)
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = (...args) => {
      navigationStartTime = performance.now()
      return originalPushState.apply(history, args)
    }

    history.replaceState = (...args) => {
      navigationStartTime = performance.now()
      return originalReplaceState.apply(history, args)
    }

    window.addEventListener("popstate", () => {
      navigationStartTime = performance.now()
    })

    // Record navigation completion
    const recordNavigationEnd = () => {
      const navigationTime = performance.now() - navigationStartTime
      this.recordMetric("navigationTime", navigationTime)
    }

    // Use MutationObserver to detect when page content changes
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(recordNavigationEnd, 100)
    })

    let timeoutId: NodeJS.Timeout
    observer.observe(document.body, { childList: true, subtree: true })
  }

  private observeUserInteractions() {
    if (typeof window === "undefined") return

    let interactionCount = 0
    const sessionStartTime = Date.now()

    const trackInteraction = (type: string) => {
      interactionCount++
      this.recordMetric(`interaction_${type}`, 1)
    }

    // Track clicks
    document.addEventListener("click", () => trackInteraction("click"))

    // Track scroll depth
    let maxScrollDepth = 0
    window.addEventListener("scroll", () => {
      const scrollDepth = (window.scrollY + window.innerHeight) / document.body.scrollHeight
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        this.recordMetric("scrollDepth", Math.round(scrollDepth * 100))
      }
    })

    // Track session duration
    setInterval(() => {
      const sessionDuration = Date.now() - sessionStartTime
      this.recordMetric("sessionDuration", sessionDuration)
    }, 10000) // Update every 10 seconds

    // Track page visibility
    document.addEventListener("visibilitychange", () => {
      this.recordMetric("pageVisibility", document.hidden ? 0 : 1)
    })
  }

  public recordMetric(name: string, value: number, url?: string) {
    if (!this.isEnabled) return

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: url || window.location.pathname,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
    }

    this.metrics.push(metric)

    // Keep only last 100 metrics in memory
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
  }

  public async sendMetrics() {
    if (this.metrics.length === 0) return

    try {
      await fetch("/api/analytics/performance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metrics: this.metrics,
          sessionId: this.sessionId,
        }),
      })

      // Clear sent metrics
      this.metrics = []
    } catch (error) {
      console.warn("Failed to send performance metrics:", error)
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  public enable() {
    this.isEnabled = true
  }

  public disable() {
    this.isEnabled = false
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const recordMetric = (name: string, value: number, url?: string) => {
    performanceMonitor.recordMetric(name, value, url)
  }

  const getMetrics = () => {
    return performanceMonitor.getMetrics()
  }

  return {
    recordMetric,
    getMetrics,
    enable: () => performanceMonitor.enable(),
    disable: () => performanceMonitor.disable(),
  }
}
