export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
}

export class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private maxSize = 1000
  private defaultTTL: number = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    // Clean expired entries if cache is getting full
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      hits: 0,
    }

    this.cache.set(key, entry)
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    entry.hits++
    return entry.data as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  private cleanup(): void {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())

    // Remove expired entries
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }

    // If still too many entries, remove least recently used
    if (this.cache.size >= this.maxSize) {
      const sortedEntries = entries.filter(([key]) => this.cache.has(key)).sort((a, b) => a[1].hits - b[1].hits)

      const toRemove = Math.floor(this.maxSize * 0.2) // Remove 20%
      for (let i = 0; i < toRemove && i < sortedEntries.length; i++) {
        this.cache.delete(sortedEntries[i][0])
      }
    }
  }

  getStats(): {
    size: number
    maxSize: number
    hitRate: number
    memoryUsage: string
  } {
    const entries = Array.from(this.cache.values())
    const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0)
    const totalRequests = entries.length > 0 ? totalHits + entries.length : 0

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
      memoryUsage: `${Math.round((this.cache.size / this.maxSize) * 100)}%`,
    }
  }
}

export const cacheManager = new CacheManager()
