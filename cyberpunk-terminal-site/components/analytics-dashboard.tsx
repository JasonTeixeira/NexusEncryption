"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AnalyticsSummary } from "@/lib/analytics"

interface AnalyticsDashboardProps {
  className?: string
}

export default function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [realTimeData, setRealTimeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(30)

  useEffect(() => {
    fetchAnalytics()
    fetchRealTimeData()

    // Update real-time data every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000)
    return () => clearInterval(interval)
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/summary?days=${timeRange}`)
      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch("/api/analytics/realtime")
      const data = await response.json()
      setRealTimeData(data.data)
    } catch (error) {
      console.error("Failed to fetch real-time data:", error)
    }
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-950 border-green-500/30">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-800 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded font-mono text-sm border ${
              timeRange === days
                ? "bg-green-500/20 border-green-500/50 text-green-400"
                : "bg-gray-900 border-gray-700 text-gray-400 hover:border-green-500/30"
            }`}
          >
            {days}d
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-950 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-gray-400">Total Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-green-400">{summary.totalPageViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-950 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-gray-400">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-green-400">{summary.uniqueVisitors.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-950 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-gray-400">Avg Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-green-400">{Math.round(summary.averageSessionDuration)}s</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-950 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-gray-400">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono text-green-400">{summary.bounceRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Data */}
      {realTimeData && (
        <Card className="bg-gray-950 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-green-400">Real-time Activity</CardTitle>
            <CardDescription className="text-gray-400 font-mono">
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                {realTimeData.activeVisitors} active visitors
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {realTimeData.recentPageViews.slice(0, 5).map((view: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm font-mono">
                  <span className="text-gray-300">{view.page}</span>
                  <span className="text-gray-500">{new Date(view.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-950 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-green-400">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.topPages.map((page, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-mono text-gray-300">{page.page}</span>
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    {page.views}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-950 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-green-400">Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.topCountries.map((country, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-mono text-gray-300">{country.country}</span>
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    {country.visitors}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-gray-950 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-green-400">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-mono text-green-400">
                {Math.round(summary.performanceMetrics.averageLoadTime)}ms
              </div>
              <div className="text-sm text-gray-400 font-mono">Avg Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-green-400">
                {Math.round(summary.performanceMetrics.averageFCP)}ms
              </div>
              <div className="text-sm text-gray-400 font-mono">First Contentful Paint</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-green-400">
                {Math.round(summary.performanceMetrics.averageLCP)}ms
              </div>
              <div className="text-sm text-gray-400 font-mono">Largest Contentful Paint</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-green-400">
                {summary.performanceMetrics.errorRate.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-400 font-mono">Error Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Stats Chart */}
      <Card className="bg-gray-950 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-green-400">Daily Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {summary.dailyStats.slice(-7).map((day, index) => (
              <div key={index} className="flex justify-between items-center text-sm font-mono">
                <span className="text-gray-300">{new Date(day.date).toLocaleDateString()}</span>
                <div className="flex gap-4">
                  <span className="text-green-400">{day.pageViews} views</span>
                  <span className="text-cyan-400">{day.uniqueVisitors} visitors</span>
                  <span className="text-yellow-400">{Math.round(day.averageSessionDuration)}s avg</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
