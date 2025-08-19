import { LRUCache } from "lru-cache"

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class PerformanceCache {
  private cache: LRUCache<string, CacheEntry<any>>
  private metrics: Map<string, { hits: number; misses: number; avgResponseTime: number }>

  constructor() {
    this.cache = new LRUCache({
      max: 1000,
      ttl: 1000 * 60 * 5, // 5 minutes default
    })
    this.metrics = new Map()
  }

  async get<T>(key: string, fetcher: () => Promise<T>, ttl = 300000): Promise<T> {
    const start = performance.now()
    const cached = this.cache.get(key)

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      this.updateMetrics(key, "hit", performance.now() - start)
      return cached.data
    }

    try {
      const data = await fetcher()
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
      })
      this.updateMetrics(key, "miss", performance.now() - start)
      return data
    } catch (error) {
      // Return stale data if available during errors
      if (cached) {
        this.updateMetrics(key, "stale", performance.now() - start)
        return cached.data
      }
      throw error
    }
  }

  private updateMetrics(key: string, type: "hit" | "miss" | "stale", responseTime: number) {
    const current = this.metrics.get(key) || { hits: 0, misses: 0, avgResponseTime: 0 }

    if (type === "hit") current.hits++
    else current.misses++

    current.avgResponseTime = (current.avgResponseTime + responseTime) / 2
    this.metrics.set(key, current)
  }

  getMetrics() {
    return Object.fromEntries(this.metrics.entries())
  }

  clear() {
    this.cache.clear()
    this.metrics.clear()
  }
}

export const performanceCache = new PerformanceCache()
