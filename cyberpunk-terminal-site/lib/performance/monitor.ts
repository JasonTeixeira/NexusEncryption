// Performance monitoring utilities
export interface PerformanceMetric {
  name: string
  value: number
  rating: "good" | "needs-improvement" | "poor"
  timestamp: number
  url: string
  connection?: string
  deviceMemory?: number
}

export interface WebVitalsMetric {
  id: string
  name: "CLS" | "FID" | "FCP" | "LCP" | "TTFB" | "INP"
  value: number
  rating: "good" | "needs-improvement" | "poor"
  delta: number
  navigationType: string
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private observers: PerformanceObserver[] = []
  private isInitialized = false

  constructor() {
    if (typeof window !== "undefined") {
      this.initialize()
    }
  }

  private initialize() {
    if (this.isInitialized) return
    this.isInitialized = true

    // Monitor navigation timing
    this.observeNavigationTiming()

    // Monitor resource timing
    this.observeResourceTiming()

    // Monitor long tasks
    this.observeLongTasks()

    // Monitor layout shifts
    this.observeLayoutShifts()

    // Monitor largest contentful paint
    this.observeLCP()

    // Monitor first input delay
    this.observeFID()

    // Monitor interaction to next paint
    this.observeINP()

    // Send metrics periodically
    this.startMetricReporting()
  }

  private observeNavigationTiming() {
    if ("performance" in window && "getEntriesByType" in performance) {
      const navigationEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[]

      navigationEntries.forEach((entry) => {
        this.recordMetric("TTFB", entry.responseStart - entry.requestStart)
        this.recordMetric("DOM_LOAD", entry.domContentLoadedEventEnd - entry.navigationStart)
        this.recordMetric("WINDOW_LOAD", entry.loadEventEnd - entry.navigationStart)
        this.recordMetric("DNS_LOOKUP", entry.domainLookupEnd - entry.domainLookupStart)
        this.recordMetric("TCP_CONNECT", entry.connectEnd - entry.connectStart)
      })
    }
  }

  private observeResourceTiming() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "resource") {
            const resourceEntry = entry as PerformanceResourceTiming
            this.recordMetric(`RESOURCE_${resourceEntry.initiatorType.toUpperCase()}`, resourceEntry.duration)
          }
        })
      })

      observer.observe({ entryTypes: ["resource"] })
      this.observers.push(observer)
    }
  }

  private observeLongTasks() {
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.recordMetric("LONG_TASK", entry.duration)
          })
        })

        observer.observe({ entryTypes: ["longtask"] })
        this.observers.push(observer)
      } catch (e) {
        // Long task observer not supported
      }
    }
  }

  private observeLayoutShifts() {
    if ("PerformanceObserver" in window) {
      let clsValue = 0

      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "layout-shift" && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        })

        this.recordMetric("CLS", clsValue)
      })

      observer.observe({ entryTypes: ["layout-shift"] })
      this.observers.push(observer)
    }
  }

  private observeLCP() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.recordMetric("LCP", lastEntry.startTime)
      })

      observer.observe({ entryTypes: ["largest-contentful-paint"] })
      this.observers.push(observer)
    }
  }

  private observeFID() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric("FID", (entry as any).processingStart - entry.startTime)
        })
      })

      observer.observe({ entryTypes: ["first-input"] })
      this.observers.push(observer)
    }
  }

  private observeINP() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "event") {
            this.recordMetric("INP", entry.duration)
          }
        })
      })

      try {
        observer.observe({ entryTypes: ["event"] })
        this.observers.push(observer)
      } catch (e) {
        // Event timing not supported
      }
    }
  }

  private recordMetric(name: string, value: number) {
    const rating = this.getRating(name, value)
    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      timestamp: Date.now(),
      url: window.location.href,
      connection: (navigator as any).connection?.effectiveType,
      deviceMemory: (navigator as any).deviceMemory,
    }

    this.metrics.push(metric)

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
  }

  private getRating(name: string, value: number): "good" | "needs-improvement" | "poor" {
    const thresholds: Record<string, [number, number]> = {
      LCP: [2500, 4000],
      FID: [100, 300],
      CLS: [0.1, 0.25],
      TTFB: [800, 1800],
      FCP: [1800, 3000],
      INP: [200, 500],
    }

    const [good, poor] = thresholds[name] || [1000, 3000]

    if (value <= good) return "good"
    if (value <= poor) return "needs-improvement"
    return "poor"
  }

  private startMetricReporting() {
    // Send metrics every 30 seconds
    setInterval(() => {
      this.sendMetrics()
    }, 30000)

    // Send metrics on page unload
    window.addEventListener("beforeunload", () => {
      this.sendMetrics(true)
    })

    // Send metrics on visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.sendMetrics(true)
      }
    })
  }

  private async sendMetrics(useBeacon = false) {
    if (this.metrics.length === 0) return

    const metricsToSend = [...this.metrics]
    this.metrics = []

    const payload = {
      event_type: "performance_metrics",
      page_path: window.location.pathname,
      metadata: {
        metrics: metricsToSend,
        user_agent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        connection: (navigator as any).connection?.effectiveType,
        device_memory: (navigator as any).deviceMemory,
      },
    }

    try {
      if (useBeacon && "sendBeacon" in navigator) {
        navigator.sendBeacon("/api/analytics", JSON.stringify(payload))
      } else {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
    } catch (error) {
      console.error("Failed to send performance metrics:", error)
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  public destroy() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
    this.metrics = []
    this.isInitialized = false
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Web Vitals integration
export function reportWebVitals(metric: WebVitalsMetric) {
  // Send to analytics
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_type: "web_vitals",
      page_path: window.location.pathname,
      metadata: {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        navigation_type: metric.navigationType,
      },
    }),
  }).catch((error) => {
    console.error("Failed to send web vitals:", error)
  })
}
