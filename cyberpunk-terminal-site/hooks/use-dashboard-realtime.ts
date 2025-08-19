"use client"

import { useEffect, useState } from "react"
import { useRealtime } from "./use-realtime"

interface DashboardMetrics {
  [key: string]: any
}

export function useDashboardRealtime(dashboardType: string, refreshInterval = 3000) {
  const [metrics, setMetrics] = useState<DashboardMetrics>({})
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const { data, isConnected, broadcast, notify } = useRealtime(`dashboard:${dashboardType}`, null, {
    type: dashboardType,
  })

  // Handle real-time updates
  useEffect(() => {
    if (data) {
      setMetrics(data)
      setLastUpdate(new Date())
    }
  }, [data])

  // Fallback polling for when WebSocket is not available
  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/dashboards/${dashboardType}`)
          if (response.ok) {
            const newData = await response.json()
            setMetrics(newData)
            setLastUpdate(new Date())
          }
        } catch (error) {
          console.error(`Failed to fetch ${dashboardType} data:`, error)
        }
      }, refreshInterval)

      return () => clearInterval(interval)
    }
  }, [dashboardType, refreshInterval, isConnected])

  // Broadcast metric update
  const updateMetrics = (newMetrics: Partial<DashboardMetrics>) => {
    const updatedMetrics = { ...metrics, ...newMetrics }
    setMetrics(updatedMetrics)
    broadcast(updatedMetrics)
  }

  // Send alert notification
  const sendAlert = (type: "info" | "warning" | "error" | "success", message: string, data?: any) => {
    notify(type, `[${dashboardType.toUpperCase()}] ${message}`, data)
  }

  return {
    metrics,
    lastUpdate,
    isConnected,
    updateMetrics,
    sendAlert,
  }
}
