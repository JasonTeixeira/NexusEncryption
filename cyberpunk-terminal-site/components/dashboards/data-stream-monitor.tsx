"use client"

import { useState, useEffect } from "react"
import { mockDataService } from "@/lib/mock-data-service"
import { Activity, Pause, Play, Zap, Database, Shield, DollarSign, Target, BarChart3 } from "lucide-react"

interface StreamInfo {
  id: string
  type: string
  isActive: boolean
  subscribers: number
  lastUpdate: number
}

export default function DataStreamMonitor() {
  const [streams, setStreams] = useState<StreamInfo[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)

  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      const allStreams = mockDataService.getAllStreams()
      setStreams(allStreams)
    }, 1000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const getStreamIcon = (type: string) => {
    switch (type) {
      case "analytics":
        return <BarChart3 className="w-4 h-4" />
      case "system":
        return <Activity className="w-4 h-4" />
      case "security":
        return <Shield className="w-4 h-4" />
      case "financial":
        return <DollarSign className="w-4 h-4" />
      case "sales":
        return <Target className="w-4 h-4" />
      case "performance":
        return <Zap className="w-4 h-4" />
      case "iot":
        return <Database className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getStreamColor = (type: string) => {
    const colors = {
      analytics: "text-cyan-400",
      system: "text-green-400",
      security: "text-red-400",
      financial: "text-yellow-400",
      sales: "text-pink-400",
      performance: "text-purple-400",
      iot: "text-blue-400",
    }
    return colors[type as keyof typeof colors] || "text-gray-400"
  }

  const toggleStream = (streamId: string, isActive: boolean) => {
    if (isActive) {
      mockDataService.pauseStream(streamId)
    } else {
      mockDataService.resumeStream(streamId)
    }
  }

  const formatLastUpdate = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-cyan-400">Data Stream Monitor</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-sm text-gray-400">{isMonitoring ? "MONITORING" : "PAUSED"}</span>
          </div>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="px-3 py-1 bg-gray-800 border border-green-500/20 rounded text-sm hover:border-cyan-400/50 transition-colors"
          >
            {isMonitoring ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      {streams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div className="text-sm">No active data streams</div>
        </div>
      ) : (
        <div className="space-y-3">
          {streams.map((stream) => (
            <div
              key={stream.id}
              className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-700/50"
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1 ${getStreamColor(stream.type)}`}>
                  {getStreamIcon(stream.type)}
                </div>
                <div>
                  <div className="font-mono text-sm">{stream.id}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {stream.type} • {stream.subscribers} subscriber{stream.subscribers !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`text-xs ${stream.isActive ? "text-green-400" : "text-gray-400"}`}>
                    {stream.isActive ? "ACTIVE" : "PAUSED"}
                  </div>
                  <div className="text-xs text-gray-500">{formatLastUpdate(stream.lastUpdate)}</div>
                </div>

                <button
                  onClick={() => toggleStream(stream.id, stream.isActive)}
                  className={`p-2 rounded border transition-colors ${
                    stream.isActive
                      ? "border-red-400/30 text-red-400 hover:bg-red-400/10"
                      : "border-green-400/30 text-green-400 hover:bg-green-400/10"
                  }`}
                >
                  {stream.isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Data streams update at different intervals based on type</div>
          <div>• Analytics: 3s, System: 2s, Security: 3s, Financial: 5s, Sales: 4s</div>
          <div>• Streams automatically pause when no subscribers are active</div>
        </div>
      </div>
    </div>
  )
}
