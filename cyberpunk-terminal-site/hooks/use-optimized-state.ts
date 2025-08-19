"use client"

import { useCallback, useRef, useState } from "react"

// Debounced state hook for performance optimization
export function useDebouncedState<T>(initialValue: T, delay = 300) {
  const [state, setState] = useState<T>(initialValue)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const debouncedSetState = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setState(value)
      }, delay)
    },
    [delay],
  )

  return [state, debouncedSetState] as const
}

// Throttled state hook for high-frequency updates
export function useThrottledState<T>(initialValue: T, delay = 100) {
  const [state, setState] = useState<T>(initialValue)
  const lastUpdate = useRef<number>(0)

  const throttledSetState = useCallback(
    (value: T | ((prev: T) => T)) => {
      const now = Date.now()
      if (now - lastUpdate.current >= delay) {
        setState(value)
        lastUpdate.current = now
      }
    },
    [delay],
  )

  return [state, throttledSetState] as const
}

// Optimized array state for large lists
export function useOptimizedArray<T>(initialValue: T[] = []) {
  const [array, setArray] = useState<T[]>(initialValue)

  const addItem = useCallback((item: T) => {
    setArray((prev) => [...prev, item])
  }, [])

  const removeItem = useCallback((index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateItem = useCallback((index: number, item: T) => {
    setArray((prev) => prev.map((existing, i) => (i === index ? item : existing)))
  }, [])

  const clearArray = useCallback(() => {
    setArray([])
  }, [])

  // Limit array size to prevent memory issues
  const addItemWithLimit = useCallback((item: T, maxSize = 1000) => {
    setArray((prev) => {
      const newArray = [...prev, item]
      return newArray.length > maxSize ? newArray.slice(-maxSize) : newArray
    })
  }, [])

  return {
    array,
    addItem,
    removeItem,
    updateItem,
    clearArray,
    addItemWithLimit,
    setArray,
  }
}
