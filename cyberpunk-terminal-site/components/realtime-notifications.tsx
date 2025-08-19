"use client"

import { useEffect, useState } from "react"
import { useRealtime } from "@/hooks/use-realtime"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

interface Notification {
  id: string
  type: "info" | "warning" | "error" | "success"
  message: string
  data?: any
  timestamp: string
}

export default function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { data } = useRealtime("notifications")

  useEffect(() => {
    if (data) {
      const notification: Notification = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      }

      setNotifications((prev) => [notification, ...prev.slice(0, 4)]) // Keep only 5 notifications

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      }, 5000)
    }
  }, [data])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getColorClasses = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-400/30 bg-green-400/5"
      case "warning":
        return "border-yellow-400/30 bg-yellow-400/5"
      case "error":
        return "border-red-400/30 bg-red-400/5"
      default:
        return "border-blue-400/30 bg-blue-400/5"
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            p-4 rounded-lg border backdrop-blur-sm max-w-sm
            animate-slideInRight
            ${getColorClasses(notification.type)}
          `}
        >
          <div className="flex items-start gap-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-100 font-medium">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
