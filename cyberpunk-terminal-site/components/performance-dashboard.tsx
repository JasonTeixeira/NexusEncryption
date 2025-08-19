"use client"

import { useState, useEffect } from "react"
import { Activity, Clock, Users, Zap, TrendingUp } from "lucide-react"

interface PerformanceMetric {
  name: string
  count: number
  average: number
  min: number
  max: number
  p50: number
  p95: number
  p99: number
}

interface PerformanceData {
  metrics: any[]
  aggregated: PerformanceMetric[]
}

export default function PerformanceDashboard() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [timeframe, setTimeframe] = useState("24h")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceData()
  }, [timeframe])

  const fetchPerformanceData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/analytics/performance?timeframe=${timeframe}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Failed to fetch performance data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMetricByName = (name: string): PerformanceMetric | undefined => {
    return data?.aggregated.find((m) => m.name === name)
  }

  const formatMs = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getPerformanceScore = () => {
    const loadTime = getMetricByName("loadTime")?.average || 0
    const fcp = getMetricByName("firstContentfulPaint")?.average || 0
    const lcp = getMetricByName("largestContentfulPaint")?.average || 0
    const cls = getMetricByName("cumulativeLayoutShift")?.average || 0

    let score = 100

    // Deduct points for slow metrics
    if (loadTime > 3000) score -= 20
    else if (loadTime > 1500) score -= 10

    if (fcp > 2500) score -= 15
    else if (fcp > 1800) score -= 8

    if (lcp > 4000) score -= 15
    else if (lcp > 2500) score -= 8

    if (cls > 0.25) score -= 20
    else if (cls > 0.1) score -= 10

    return Math.max(0, score)
  }

  if (isLoading) {
    return (
      <div className="bg-black border border-cyan-500/30 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const performanceScore = getPerformanceScore()
  const loadTime = getMetricByName("loadTime")
  const fcp = getMetricByName("firstContentfulPaint")
  const lcp = getMetricByName("largestContentfulPaint")
  const cls = getMetricByName("cumulativeLayoutShift")
  const sessionDuration = getMetricByName("sessionDuration")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Performance Monitor
        </h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-1 text-sm"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* Performance Score */}
      <div className="bg-black border border-cyan-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Performance Score</h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-cyan-400">{performanceScore}</div>
              <div className="text-gray-400">
                {performanceScore >= 90 && <span className="text-green-400">Excellent</span>}
                {performanceScore >= 70 && performanceScore < 90 && <span className="text-yellow-400">Good</span>}
                {performanceScore >= 50 && performanceScore < 70 && <span className="text-orange-400">Needs Work</span>}
                {performanceScore < 50 && <span className="text-red-400">Poor</span>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <TrendingUp className="w-8 h-8 text-cyan-400 mb-2" />
            <div className="text-sm text-gray-400">Based on Core Web Vitals</div>
          </div>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-medium text-white">Load Time</h4>
          </div>
          <div className="text-2xl font-bold text-cyan-400">{loadTime ? formatMs(loadTime.average) : "N/A"}</div>
          <div className="text-xs text-gray-400 mt-1">P95: {loadTime ? formatMs(loadTime.p95) : "N/A"}</div>
        </div>

        <div className="bg-black border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-green-400" />
            <h4 className="text-sm font-medium text-white">First Contentful Paint</h4>
          </div>
          <div className="text-2xl font-bold text-green-400">{fcp ? formatMs(fcp.average) : "N/A"}</div>
          <div className="text-xs text-gray-400 mt-1">P95: {fcp ? formatMs(fcp.p95) : "N/A"}</div>
        </div>

        <div className="bg-black border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <h4 className="text-sm font-medium text-white">Largest Contentful Paint</h4>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{lcp ? formatMs(lcp.average) : "N/A"}</div>
          <div className="text-xs text-gray-400 mt-1">P95: {lcp ? formatMs(lcp.p95) : "N/A"}</div>
        </div>

        <div className="bg-black border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-medium text-white">Session Duration</h4>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {sessionDuration ? formatMs(sessionDuration.average) : "N/A"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Avg: {sessionDuration ? formatMs(sessionDuration.average) : "N/A"}
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-black border border-cyan-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Detailed Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-gray-400">Metric</th>
                <th className="text-right py-2 text-gray-400">Count</th>
                <th className="text-right py-2 text-gray-400">Average</th>
                <th className="text-right py-2 text-gray-400">P50</th>
                <th className="text-right py-2 text-gray-400">P95</th>
                <th className="text-right py-2 text-gray-400">P99</th>
              </tr>
            </thead>
            <tbody>
              {data?.aggregated.map((metric) => (
                <tr key={metric.name} className="border-b border-gray-800">
                  <td className="py-2 text-white font-mono text-xs">{metric.name}</td>
                  <td className="py-2 text-right text-gray-300">{metric.count}</td>
                  <td className="py-2 text-right text-cyan-400">
                    {metric.name.includes("Time") || metric.name.includes("Paint")
                      ? formatMs(metric.average)
                      : metric.average.toFixed(2)}
                  </td>
                  <td className="py-2 text-right text-gray-300">
                    {metric.name.includes("Time") || metric.name.includes("Paint")
                      ? formatMs(metric.p50)
                      : metric.p50.toFixed(2)}
                  </td>
                  <td className="py-2 text-right text-gray-300">
                    {metric.name.includes("Time") || metric.name.includes("Paint")
                      ? formatMs(metric.p95)
                      : metric.p95.toFixed(2)}
                  </td>
                  <td className="py-2 text-right text-gray-300">
                    {metric.name.includes("Time") || metric.name.includes("Paint")
                      ? formatMs(metric.p99)
                      : metric.p99.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
