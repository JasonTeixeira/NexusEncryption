"use client"

import { useEffect, useState } from "react"
import { useRealtime } from "@/hooks/use-realtime"
import { Wifi, WifiOff, AlertCircle } from "lucide-react"

export default function RealtimeStatus() {
  const { isConnected, error } = useRealtime("connection")
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null)
  const { data: heartbeatData } = useRealtime("heartbeat")

  useEffect(() => {
    if (heartbeatData?.type === "heartbeat") {
      setLastHeartbeat(new Date())
    }
  }, [heartbeatData])

  const getStatusColor = () => {
    if (error) return "text-red-400"
    if (isConnected) return "text-green-400"
    return "text-yellow-400"
  }

  const getStatusText = () => {
    if (error) return "Connection Error"
    if (isConnected) return "Live"
    return "Connecting..."
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {error ? (
        <AlertCircle className={`w-4 h-4 ${getStatusColor()}`} />
      ) : isConnected ? (
        <Wifi className={`w-4 h-4 ${getStatusColor()}`} />
      ) : (
        <WifiOff className={`w-4 h-4 ${getStatusColor()}`} />
      )}

      <span className={`font-mono ${getStatusColor()}`}>{getStatusText()}</span>

      {lastHeartbeat && <span className="text-xs text-gray-500">• {lastHeartbeat.toLocaleTimeString()}</span>}
    </div>
  )
}
