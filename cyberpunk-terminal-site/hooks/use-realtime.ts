"use client"

import { useEffect, useRef, useState } from "react"
import { realtimeService } from "@/lib/realtime-service"

export function useRealtime<T = any>(channel: string, initialData?: T, filters?: Record<string, any>) {
  const [data, setData] = useState<T | undefined>(initialData)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<string | null>(null)

  useEffect(() => {
    const handleData = (newData: T) => {
      setData(newData)
      setError(null)
    }

    const handleError = (err: any) => {
      setError(err.message || "Realtime connection error")
      setIsConnected(false)
    }

    const handleConnect = () => {
      setIsConnected(true)
      setError(null)
    }

    // Subscribe to the channel
    subscriptionRef.current = realtimeService.subscribe(channel, handleData, filters)

    // Listen for connection events
    const connectSub = realtimeService.subscribe("connection", (event) => {
      if (event.type === "connected") {
        handleConnect()
      } else if (event.type === "error") {
        handleError(event)
      }
    })

    return () => {
      if (subscriptionRef.current) {
        realtimeService.unsubscribe(subscriptionRef.current)
      }
      realtimeService.unsubscribe(connectSub)
    }
  }, [channel, filters])

  const broadcast = (data: any) => {
    realtimeService.broadcast(channel, data, filters)
  }

  const notify = (type: "info" | "warning" | "error" | "success", message: string, data?: any) => {
    realtimeService.notify(type, message, data)
  }

  return {
    data,
    isConnected,
    error,
    broadcast,
    notify,
  }
}
