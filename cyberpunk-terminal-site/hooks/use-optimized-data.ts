"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { performanceCache } from "@/lib/performance-cache"

interface UseOptimizedDataOptions {
  refreshInterval?: number
  staleTime?: number
  retryAttempts?: number
  retryDelay?: number
}

export function useOptimizedData<T>(key: string, fetcher: () => Promise<T>, options: UseOptimizedDataOptions = {}) {
  const {
    refreshInterval = 30000, // 30 seconds
    staleTime = 300000, // 5 minutes
    retryAttempts = 3,
    retryDelay = 1000,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const retryCountRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout>()

  const fetchData = useCallback(async () => {
    try {
      const result = await performanceCache.get(key, fetcher, staleTime)
      setData(result)
      setError(null)
      setLastUpdated(new Date())
      retryCountRef.current = 0
    } catch (err) {
      setError(err as Error)

      // Retry logic
      if (retryCountRef.current < retryAttempts) {
        retryCountRef.current++
        setTimeout(fetchData, retryDelay * retryCountRef.current)
      }
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, staleTime, retryAttempts, retryDelay])

  const refresh = useCallback(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()

    // Set up refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    isStale: lastUpdated ? Date.now() - lastUpdated.getTime() > staleTime : false,
  }
}
