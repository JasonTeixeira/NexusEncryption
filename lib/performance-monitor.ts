export interface PerformanceMetric {
  id: string
  name: string
  startTime: number
  endTime?: number
  duration?: number
  metadata?: Record<string, any>
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private activeMetrics: Map<string, PerformanceMetric> = new Map()

  startMetric(name: string, metadata?: Record<string, any>): string {
    const id = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const metric: PerformanceMetric = {
      id,
      name,
      startTime: performance.now(),
      metadata,
    }

    this.activeMetrics.set(id, metric)
    return id
  }

  endMetric(id: string): PerformanceMetric | null {
    const metric = this.activeMetrics.get(id)
    if (!metric) return null

    metric.endTime = performance.now()
    metric.duration = metric.endTime - metric.startTime

    this.activeMetrics.delete(id)
    this.metrics.push(metric)

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    return metric
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name)
    }
    return this.metrics
  }

  getAverageTime(name: string): number {
    const metrics = this.getMetrics(name).filter((m) => m.duration !== undefined)
    if (metrics.length === 0) return 0

    const total = metrics.reduce((sum, m) => sum + (m.duration || 0), 0)
    return total / metrics.length
  }

  getPerformanceReport(): {
    totalOperations: number
    averageEncryptionTime: number
    averageDecryptionTime: number
    averageKeyGenTime: number
    slowestOperations: PerformanceMetric[]
  } {
    const encryptionMetrics = this.getMetrics("encryption")
    const decryptionMetrics = this.getMetrics("decryption")
    const keyGenMetrics = this.getMetrics("key-generation")

    const allMetrics = this.metrics.filter((m) => m.duration !== undefined)
    const slowestOperations = allMetrics.sort((a, b) => (b.duration || 0) - (a.duration || 0)).slice(0, 10)

    return {
      totalOperations: this.metrics.length,
      averageEncryptionTime: this.getAverageTime("encryption"),
      averageDecryptionTime: this.getAverageTime("decryption"),
      averageKeyGenTime: this.getAverageTime("key-generation"),
      slowestOperations,
    }
  }

  clear(): void {
    this.metrics = []
    this.activeMetrics.clear()
  }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Static methods for easier usage
export class PerformanceMonitorStatic {
  private static instance = new PerformanceMonitor()

  static startTiming(name: string, metadata?: Record<string, any>): () => void {
    const id = this.instance.startMetric(name, metadata)
    return () => this.instance.endMetric(id)
  }

  static observeWebVitals(): void {
    // Web Vitals observation implementation
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.instance.startMetric(entry.name)
            this.instance.endMetric(this.instance.startMetric(entry.name))
          }
        })
        observer.observe({ entryTypes: ["measure", "navigation"] })
      } catch (error) {
        console.warn("Performance observation not supported:", error)
      }
    }
  }

  static getAllMetrics(): Record<string, { average: number; count: number }> {
    const metrics = this.instance.getMetrics()
    const grouped: Record<string, { total: number; count: number }> = {}

    metrics.forEach((metric) => {
      if (metric.duration) {
        if (!grouped[metric.name]) {
          grouped[metric.name] = { total: 0, count: 0 }
        }
        grouped[metric.name].total += metric.duration
        grouped[metric.name].count += 1
      }
    })

    const result: Record<string, { average: number; count: number }> = {}
    Object.keys(grouped).forEach((key) => {
      result[key] = {
        average: grouped[key].total / grouped[key].count,
        count: grouped[key].count,
      }
    })

    return result
  }

  static cleanup(): void {
    this.instance.clear()
  }
}

// Export static methods for backward compatibility
export const { startTiming, observeWebVitals, getAllMetrics, cleanup } = PerformanceMonitorStatic

export const performanceMonitor = new PerformanceMonitor()
