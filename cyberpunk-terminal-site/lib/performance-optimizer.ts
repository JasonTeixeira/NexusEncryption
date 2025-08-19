"use client"

import { useState } from "react"

import { useCallback, useRef, useEffect } from "react"

// Request deduplication and caching
class RequestCache {
  private cache = new Map<string, { data: any; timestamp: number; promise?: Promise<any> }>()
  private readonly TTL = 5 * 60 * 1000 // 5 minutes

  async get<T>(key: string, fetcher: () => Promise<T>, ttl = this.TTL): Promise<T> {
    const cached = this.cache.get(key)
    const now = Date.now()

    // Return cached data if still valid
    if (cached && now - cached.timestamp < ttl) {
      return cached.data
    }

    // Return existing promise if request is in flight
    if (cached?.promise) {
      return cached.promise
    }

    // Make new request
    const promise = fetcher()
    this.cache.set(key, { data: null, timestamp: now, promise })

    try {
      const data = await promise
      this.cache.set(key, { data, timestamp: now })
      return data
    } catch (error) {
      this.cache.delete(key)
      throw error
    }
  }

  invalidate(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }
}

export const requestCache = new RequestCache()

// Optimized data fetching hook
export function useOptimizedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  } = {},
) {
  const { enabled = true, refetchInterval, staleTime = 5 * 60 * 1000 } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  const fetchData = useCallback(async () => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)
      const result = await requestCache.get(key, fetcher, staleTime)
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, enabled, staleTime])

  useEffect(() => {
    fetchData()

    if (refetchInterval) {
      intervalRef.current = setInterval(fetchData, refetchInterval)
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [fetchData, refetchInterval])

  return { data, loading, error, refetch: fetchData }
}

// Batch API requests
export class BatchRequestManager {
  private batches = new Map<string, { requests: any[]; timeout: NodeJS.Timeout }>()
  private readonly BATCH_DELAY = 50 // 50ms

  addRequest<T>(batchKey: string, request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const batch = this.batches.get(batchKey) || { requests: [], timeout: null as any }

      batch.requests.push({ request, resolve, reject })

      if (batch.timeout) {
        clearTimeout(batch.timeout)
      }

      batch.timeout = setTimeout(() => {
        this.executeBatch(batchKey)
      }, this.BATCH_DELAY)

      this.batches.set(batchKey, batch)
    })
  }

  private async executeBatch(batchKey: string) {
    const batch = this.batches.get(batchKey)
    if (!batch) return

    this.batches.delete(batchKey)

    try {
      const results = await Promise.allSettled(batch.requests.map(({ request }) => request()))

      batch.requests.forEach(({ resolve, reject }, index) => {
        const result = results[index]
        if (result.status === "fulfilled") {
          resolve(result.value)
        } else {
          reject(result.reason)
        }
      })
    } catch (error) {
      batch.requests.forEach(({ reject }) => reject(error))
    }
  }
}

export const batchManager = new BatchRequestManager()

// Performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const renderStart = useRef(performance.now())
  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current++
    const renderTime = performance.now() - renderStart.current

    if (renderTime > 16) {
      // Longer than 1 frame
      console.warn(`Slow render in ${componentName}: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`)
    }

    renderStart.current = performance.now()
  })
}
