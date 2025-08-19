"use client"

import { useState, useEffect } from "react"
import { Activity, Zap, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface PerformanceData {
  coreWebVitals: {
    lcp: number // Largest Contentful Paint
    fid: number // First Input Delay
    cls: number // Cumulative Layout Shift
    fcp: number // First Contentful Paint
    ttfb: number // Time to First Byte
  }
  pageSpeed: {
    desktop: number
    mobile: number
  }
  uptime: {
    current: number
    last24h: number
    last7d: number
    last30d: number
  }
  errors: {
    total: number
    js: number
    network: number
    server: number
  }
  loadTimes: Array<{
    timestamp: string
    value: number
  }>
}

const generateMockPerformance = (): PerformanceData => {
  return {
    coreWebVitals: {
      lcp: Math.random() * 1000 + 1200, // 1.2-2.2s
      fid: Math.random() * 50 + 10, // 10-60ms
      cls: Math.random() * 0.1 + 0.05, // 0.05-0.15
      fcp: Math.random() * 800 + 600, // 0.6-1.4s
      ttfb: Math.random() * 200 + 100, // 100-300ms
    },
    pageSpeed: {
      desktop: Math.random() * 20 + 75, // 75-95
      mobile: Math.random() * 25 + 60, // 60-85
    },
    uptime: {
      current: 99.97,
      last24h: Math.random() * 0.5 + 99.5,
      last7d: Math.random() * 1 + 99,
      last30d: Math.random() * 2 + 98,
    },
    errors: {
      total: Math.floor(Math.random() * 50 + 10),
      js: Math.floor(Math.random() * 20 + 5),
      network: Math.floor(Math.random() * 15 + 3),
      server: Math.floor(Math.random() * 10 + 2),
    },
    loadTimes: Array.from({ length: 24 }, (_, i) => ({
      timestamp: `${23 - i}:00`,
      value: Math.random() * 1000 + 800,
    })).reverse(),
  }
}

export default function PerformanceDashboard() {
  const [data, setData] = useState<PerformanceData>(generateMockPerformance())
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData(generateMockPerformance())
    }, 4000)

    return () => clearInterval(interval)
  }, [isLive])

  const getVitalStatus = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
      ttfb: { good: 200, poor: 500 },
    }

    const threshold = thresholds[metric as keyof typeof thresholds]
    if (!threshold) return "good"

    if (value <= threshold.good) return "good"
    if (value <= threshold.poor) return "needs-improvement"
    return "poor"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-400"
      case "needs-improvement":
        return "text-yellow-400"
      case "poor":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="w-4 h-4" />
      case "needs-improvement":
        return <AlertTriangle className="w-4 h-4" />
      case "poor":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-400/10 rounded-lg border border-purple-400/30">
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-400 cyber-text-glow">Performance Monitor</h1>
              <p className="text-gray-400">Core Web Vitals and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-sm text-gray-400">{isLive ? "MONITORING" : "PAUSED"}</span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-4 py-2 bg-gray-800 border border-green-500/20 rounded text-sm hover:border-purple-400/50 transition-colors"
            >
              {isLive ? "Pause" : "Resume"}
            </button>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-cyan-400 mb-6">Core Web Vitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-400">LCP</div>
              <div
                className={`flex items-center gap-1 ${getStatusColor(getVitalStatus("lcp", data.coreWebVitals.lcp))}`}
              >
                {getStatusIcon(getVitalStatus("lcp", data.coreWebVitals.lcp))}
              </div>
            </div>
            <div className="text-2xl font-bold text-cyan-400">{(data.coreWebVitals.lcp / 1000).toFixed(2)}s</div>
            <div className="text-xs text-gray-500 mt-1">Largest Contentful Paint</div>
          </div>

          <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-400">FID</div>
              <div
                className={`flex items-center gap-1 ${getStatusColor(getVitalStatus("fid", data.coreWebVitals.fid))}`}
              >
                {getStatusIcon(getVitalStatus("fid", data.coreWebVitals.fid))}
              </div>
            </div>
            <div className="text-2xl font-bold text-green-400">{data.coreWebVitals.fid.toFixed(0)}ms</div>
            <div className="text-xs text-gray-500 mt-1">First Input Delay</div>
          </div>

          <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-400">CLS</div>
              <div
                className={`flex items-center gap-1 ${getStatusColor(getVitalStatus("cls", data.coreWebVitals.cls))}`}
              >
                {getStatusIcon(getVitalStatus("cls", data.coreWebVitals.cls))}
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{data.coreWebVitals.cls.toFixed(3)}</div>
            <div className="text-xs text-gray-500 mt-1">Cumulative Layout Shift</div>
          </div>

          <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-400">FCP</div>
              <div
                className={`flex items-center gap-1 ${getStatusColor(getVitalStatus("fcp", data.coreWebVitals.fcp))}`}
              >
                {getStatusIcon(getVitalStatus("fcp", data.coreWebVitals.fcp))}
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-400">{(data.coreWebVitals.fcp / 1000).toFixed(2)}s</div>
            <div className="text-xs text-gray-500 mt-1">First Contentful Paint</div>
          </div>

          <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-400">TTFB</div>
              <div
                className={`flex items-center gap-1 ${getStatusColor(getVitalStatus("ttfb", data.coreWebVitals.ttfb))}`}
              >
                {getStatusIcon(getVitalStatus("ttfb", data.coreWebVitals.ttfb))}
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-400">{data.coreWebVitals.ttfb.toFixed(0)}ms</div>
            <div className="text-xs text-gray-500 mt-1">Time to First Byte</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Page Speed Scores */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">PageSpeed Insights</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  Desktop
                </span>
                <span className="text-2xl font-bold text-blue-400">{data.pageSpeed.desktop.toFixed(0)}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className="bg-blue-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${data.pageSpeed.desktop}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  Mobile
                </span>
                <span className="text-2xl font-bold text-green-400">{data.pageSpeed.mobile.toFixed(0)}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className="bg-green-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${data.pageSpeed.mobile}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Uptime */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">Uptime Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Current</span>
              <span className="text-2xl font-bold text-green-400">{data.uptime.current}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last 24h</span>
              <span className="font-mono text-green-400">{data.uptime.last24h.toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last 7d</span>
              <span className="font-mono text-green-400">{data.uptime.last7d.toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last 30d</span>
              <span className="font-mono text-yellow-400">{data.uptime.last30d.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Load Time Chart */}
      <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg mb-8">
        <h3 className="text-lg font-bold text-cyan-400 mb-6">Load Time Trend (24h)</h3>
        <div className="h-32 flex items-end justify-between gap-1">
          {data.loadTimes.map((point, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-cyan-400/20 border-t-2 border-cyan-400 transition-all duration-500"
                style={{
                  height: `${(point.value / 2000) * 100}%`,
                  minHeight: "4px",
                }}
              />
              <div className="text-xs text-gray-500 mt-1 rotate-45 origin-left">{point.timestamp}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Summary */}
      <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
        <h3 className="text-lg font-bold text-cyan-400 mb-6">Error Summary (Last 24h)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{data.errors.total}</div>
            <div className="text-sm text-gray-400">Total Errors</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">{data.errors.js}</div>
            <div className="text-sm text-gray-400">JavaScript</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-400">{data.errors.network}</div>
            <div className="text-sm text-gray-400">Network</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-400">{data.errors.server}</div>
            <div className="text-sm text-gray-400">Server</div>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="mt-8 p-4 bg-gray-900/50 border border-green-500/20 rounded-lg font-mono text-sm">
        <div className="text-green-400 mb-2">$ performance-monitor --live</div>
        <div className="space-y-1 text-gray-400">
          <div>[{new Date().toISOString()}] INFO: Performance metrics updated</div>
          <div>
            [{new Date().toISOString()}] INFO: LCP: {(data.coreWebVitals.lcp / 1000).toFixed(2)}s
          </div>
          <div>
            [{new Date().toISOString()}] INFO: Uptime: {data.uptime.current}%
          </div>
          <div className="text-purple-400 animate-pulse">_</div>
        </div>
      </div>
    </div>
  )
}
