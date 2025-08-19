"use client"

import { useState, useEffect, useRef } from "react"
import { mockDataService } from "@/lib/mock-data-service"

interface UseMockDataOptions {
  streamId: string
  autoStart?: boolean
  onError?: (error: Error) => void
}

export function useMockData<T = any>(options: UseMockDataOptions) {
  const { streamId, autoStart = true, onError } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isActive, setIsActive] = useState(autoStart)
  const [error, setError] = useState<Error | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!isActive) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const unsubscribe = mockDataService.subscribe(streamId, (newData: T) => {
        setData(newData)
        setIsLoading(false)
        setError(null)
      })

      unsubscribeRef.current = unsubscribe

      return () => {
        unsubscribe()
        unsubscribeRef.current = null
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error occurred")
      setError(error)
      setIsLoading(false)
      onError?.(error)
    }
  }, [streamId, isActive, onError])

  const pause = () => {
    setIsActive(false)
    mockDataService.pauseStream(streamId)
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }
  }

  const resume = () => {
    setIsActive(true)
    mockDataService.resumeStream(streamId)
  }

  const toggle = () => {
    if (isActive) {
      pause()
    } else {
      resume()
    }
  }

  const getStatus = () => {
    return mockDataService.getStreamStatus(streamId)
  }

  return {
    data,
    isLoading,
    isActive,
    error,
    pause,
    resume,
    toggle,
    getStatus,
  }
}

// Hook for managing multiple data streams
export function useMultipleMockData(streamIds: string[]) {
  const [streams, setStreams] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, Error>>({})
  const unsubscribesRef = useRef<Record<string, () => void>>({})

  useEffect(() => {
    setIsLoading(true)
    const newStreams: Record<string, any> = {}
    const newErrors: Record<string, Error> = {}
    const unsubscribes: Record<string, () => void> = {}

    streamIds.forEach((streamId) => {
      try {
        const unsubscribe = mockDataService.subscribe(streamId, (data) => {
          setStreams((prev) => ({ ...prev, [streamId]: data }))
        })
        unsubscribes[streamId] = unsubscribe
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error occurred")
        newErrors[streamId] = error
      }
    })

    unsubscribesRef.current = unsubscribes
    setErrors(newErrors)
    setIsLoading(false)

    return () => {
      Object.values(unsubscribes).forEach((unsubscribe) => unsubscribe())
    }
  }, [streamIds])

  const pauseAll = () => {
    streamIds.forEach((streamId) => mockDataService.pauseStream(streamId))
  }

  const resumeAll = () => {
    streamIds.forEach((streamId) => mockDataService.resumeStream(streamId))
  }

  const getAllStatuses = () => {
    return streamIds.reduce(
      (acc, streamId) => {
        acc[streamId] = mockDataService.getStreamStatus(streamId)
        return acc
      },
      {} as Record<string, any>,
    )
  }

  return {
    streams,
    isLoading,
    errors,
    pauseAll,
    resumeAll,
    getAllStatuses,
  }
}
