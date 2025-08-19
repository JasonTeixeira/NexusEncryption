"use client"

import { useState, useEffect } from "react"
import { Activity, Zap, Clock, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { apiClient } from "@/lib/api/client"

interface PerformanceStats {
  avg_response_time: number
  total_requests: number
  error_rate: number
  uptime_percentage: number
  page_views: number
  unique_visitors: number
  bounce_rate: number
  avg_session_duration: number
}

interface WebVitalsData {
  lcp: { value: number; rating: string }
  fid: { value: number; rating: string }
  cls: { value: number; rating: string }
  ttfb: { value: number; rating: string }
}

export default function PerformanceDashboard() {
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const [webVitals, setWebVitals] = useState<WebVitalsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("24h")

  useEffect(() => {
    loadPerformanceData()

    // Refresh data every 30 seconds
    const interval = setInterval(loadPerformanceData, 30000)
    return () => clearInterval(interval)
  }, [timeRange])

  const loadPerformanceData = async () => {
    try {
      setIsLoading(true)

      // Get analytics data
      const endDate = new Date()
      const startDate = new Date()

      switch (timeRange) {
        case "1h":
          startDate.setHours(endDate.getHours() - 1)
          break
        case "24h":
          startDate.setDate(endDate.getDate() - 1)
          break
        case "7d":
          startDate.setDate(endDate.getDate() - 7)
          break
        case "30d":
          startDate.setDate(endDate.getDate() - 30)
          break
      }

      const { data: analyticsData } = await apiClient.getAnalytics({
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        limit: 1000,
      })

      if (analyticsData) {
        processAnalyticsData(analyticsData)
      }
    } catch (error) {
      console.error("Failed to load performance data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const processAnalyticsData = (data: any[]) => {
    // Process performance metrics
    const performanceMetrics = data.filter((item) => item.event_type === "performance_metrics")
    const webVitalsMetrics = data.filter((item) => item.event_type === "web_vitals")
    const pageViews = data.filter((item) => item.event_type === "page_view")

    // Calculate stats
    const totalRequests = performanceMetrics.length
    const avgResponseTime =
      performanceMetrics.reduce((sum, item) => {
        const ttfb = item.metadata?.metrics?.find((m: any) => m.name === "TTFB")
        return sum + (ttfb?.value || 0)
      }, 0) / Math.max(totalRequests, 1)

    const errorEvents = data.filter((item) => item.event_type === "error")
    const errorRate = (errorEvents.length / Math.max(totalRequests, 1)) * 100

    const uniqueVisitors = new Set(pageViews.map((item) => item.session_id)).size

    setStats({
      avg_response_time: Math.round(avgResponseTime),
      total_requests: totalRequests,
      error_rate: Math.round(errorRate * 100) / 100,
      uptime_percentage: Math.max(0, 100 - errorRate),
      page_views: pageViews.length,
      unique_visitors: uniqueVisitors,
      bounce_rate: 0, // Calculate based on session data
      avg_session_duration: 0, // Calculate based on session data
    })

    // Process Web Vitals
    const latestVitals = webVitalsMetrics.reduce((acc: any, item) => {
      const metricName = item.metadata?.metric_name
      if (metricName && (!acc[metricName] || item.created_at > acc[metricName].created_at)) {
        acc[metricName] = {
          value: item.metadata.metric_value,
          rating: item.metadata.metric_rating,
          created_at: item.created_at,
        }
      }
      return acc
    }, {})

    setWebVitals({
      lcp: latestVitals.LCP || { value: 0, rating: "good" },
      fid: latestVitals.FID || { value: 0, rating: "good" },
      cls: latestVitals.CLS || { value: 0, rating: "good" },
      ttfb: latestVitals.TTFB || { value: 0, rating: "good" },
    })
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
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

  const getRatingIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-400" />
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  if (isLoading && !stats) {
    return (
      <div className="bg-black border-2 border-cyan-500 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-cyan-400">Loading performance data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Performance Dashboard</h2>
          <p className="text-gray-400">Real-time monitoring and Web Vitals</p>
        </div>

        <div className="flex items-center gap-2">
          {["1h", "24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                timeRange === range
                  ? "bg-cyan-500 text-black"
                  : "bg-black border border-cyan-500/30 text-cyan-400 hover:border-cyan-400/50"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black border-2 border-cyan-500/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-gray-400">Avg Response</span>
            </div>
            {getRatingIcon(stats?.avg_response_time || 0, 0)}
          </div>
          <div className="text-2xl font-bold text-white">{stats?.avg_response_time || 0}ms</div>
          <div className="text-xs text-gray-500 mt-1">Server response time</div>
        </div>

        <div className="bg-black border-2 border-cyan-500/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Uptime</span>
            </div>
            {getRatingIcon(stats?.uptime_percentage || 0, 0)}
          </div>
          <div className="text-2xl font-bold text-white">{stats?.uptime_percentage?.toFixed(2) || 0}%</div>
          <div className="text-xs text-gray-500 mt-1">System availability</div>
        </div>

        <div className="bg-black border-2 border-cyan-500/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Page Views</span>
            </div>
            {getRatingIcon(stats?.page_views || 0, 0)}
          </div>
          <div className="text-2xl font-bold text-white">{stats?.page_views?.toLocaleString() || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Total page views</div>
        </div>

        <div className="bg-black border-2 border-cyan-500/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Error Rate</span>
            </div>
            {getRatingIcon(stats?.error_rate || 0, 0)}
          </div>
          <div className="text-2xl font-bold text-white">{stats?.error_rate?.toFixed(2) || 0}%</div>
          <div className="text-xs text-gray-500 mt-1">Request error rate</div>
        </div>
      </div>

      {/* Web Vitals */}
      {webVitals && (
        <div className="bg-black border-2 border-cyan-500/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Core Web Vitals</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Largest Contentful Paint</div>
              <div className={`text-2xl font-bold ${getRatingColor(webVitals.lcp.rating)}`}>
                {webVitals.lcp.value.toFixed(0)}ms
              </div>
              <div className="text-xs text-gray-500 mt-1 capitalize">{webVitals.lcp.rating}</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">First Input Delay</div>
              <div className={`text-2xl font-bold ${getRatingColor(webVitals.fid.rating)}`}>
                {webVitals.fid.value.toFixed(0)}ms
              </div>
              <div className="text-xs text-gray-500 mt-1 capitalize">{webVitals.fid.rating}</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Cumulative Layout Shift</div>
              <div className={`text-2xl font-bold ${getRatingColor(webVitals.cls.rating)}`}>
                {webVitals.cls.value.toFixed(3)}
              </div>
              <div className="text-xs text-gray-500 mt-1 capitalize">{webVitals.cls.rating}</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Time to First Byte</div>
              <div className={`text-2xl font-bold ${getRatingColor(webVitals.ttfb.rating)}`}>
                {webVitals.ttfb.value.toFixed(0)}ms
              </div>
              <div className="text-xs text-gray-500 mt-1 capitalize">{webVitals.ttfb.rating}</div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tips */}
      <div className="bg-black border-2 border-cyan-500/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Performance Insights</h3>

        <div className="space-y-3">
          {stats?.avg_response_time && stats.avg_response_time > 1000 && (
            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <div>
                <div className="text-yellow-400 font-medium">Slow Response Time</div>
                <div className="text-sm text-gray-400">Consider optimizing database queries and enabling caching</div>
              </div>
            </div>
          )}

          {webVitals?.lcp.rating === "poor" && (
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
              <div>
                <div className="text-red-400 font-medium">Poor LCP Score</div>
                <div className="text-sm text-gray-400">Optimize images and reduce server response times</div>
              </div>
            </div>
          )}

          {stats?.error_rate && stats.error_rate > 5 && (
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
              <div>
                <div className="text-red-400 font-medium">High Error Rate</div>
                <div className="text-sm text-gray-400">Review error logs and implement better error handling</div>
              </div>
            </div>
          )}

          {(!stats?.error_rate || stats.error_rate < 1) &&
            stats?.avg_response_time &&
            stats.avg_response_time < 500 && (
              <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-green-400 font-medium">Excellent Performance</div>
                  <div className="text-sm text-gray-400">Your site is performing well across all metrics</div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
