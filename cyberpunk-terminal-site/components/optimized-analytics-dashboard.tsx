"use client"
import { memo, useMemo } from "react"
import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useOptimizedFetch, usePerformanceMonitor } from "@/lib/performance-optimizer"

interface OptimizedAnalyticsDashboardProps {
  className?: string
}

const MetricCard = memo(({ title, value, loading }: { title: string; value: string | number; loading: boolean }) => (
  <Card className="bg-gray-950 border-green-500/30">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-mono text-gray-400">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="h-8 bg-gray-800 rounded animate-pulse"></div>
      ) : (
        <div className="text-2xl font-mono text-green-400">{value}</div>
      )}
    </CardContent>
  </Card>
))

MetricCard.displayName = "MetricCard"

const OptimizedAnalyticsDashboard = memo(({ className }: OptimizedAnalyticsDashboardProps) => {
  usePerformanceMonitor("OptimizedAnalyticsDashboard")

  const [timeRange, setTimeRange] = useState(30)

  const { data: summary, loading: summaryLoading } = useOptimizedFetch(
    `analytics-summary-${timeRange}`,
    () => fetch(`/api/analytics/summary?days=${timeRange}`).then((r) => r.json()),
    { staleTime: 2 * 60 * 1000 }, // 2 minutes cache
  )

  const { data: realTimeData, loading: realTimeLoading } = useOptimizedFetch(
    "analytics-realtime",
    () => fetch("/api/analytics/realtime").then((r) => r.json()),
    {
      refetchInterval: 60000, // 1 minute instead of 30 seconds
      staleTime: 30 * 1000, // 30 seconds cache
    },
  )

  const metrics = useMemo(() => {
    if (!summary?.summary) return null

    return {
      totalPageViews: summary.summary.totalPageViews?.toLocaleString() || "0",
      uniqueVisitors: summary.summary.uniqueVisitors?.toLocaleString() || "0",
      avgSessionDuration: Math.round(summary.summary.averageSessionDuration || 0) + "s",
      bounceRate: (summary.summary.bounceRate || 0).toFixed(1) + "%",
    }
  }, [summary])

  const isLoading = summaryLoading && !summary

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded font-mono text-sm border transition-colors ${
              timeRange === days
                ? "bg-green-500/20 border-green-500/50 text-green-400"
                : "bg-gray-900 border-gray-700 text-gray-400 hover:border-green-500/30"
            }`}
          >
            {days}d
          </button>
        ))}
      </div>

      {/* Key Metrics - Optimized with memoization */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Page Views" value={metrics?.totalPageViews || "0"} loading={isLoading} />
        <MetricCard title="Unique Visitors" value={metrics?.uniqueVisitors || "0"} loading={isLoading} />
        <MetricCard title="Avg Session Duration" value={metrics?.avgSessionDuration || "0s"} loading={isLoading} />
        <MetricCard title="Bounce Rate" value={metrics?.bounceRate || "0%"} loading={isLoading} />
      </div>

      {/* Real-time Data - Only show when available */}
      {realTimeData?.data && (
        <Card className="bg-gray-950 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-green-400">Real-time Activity</CardTitle>
            <Badge variant="outline" className="border-green-500/50 text-green-400 w-fit">
              {realTimeData.data.activeVisitors} active visitors
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {realTimeData.data.recentPageViews?.slice(0, 5).map((view: any, index: number) => (
                <div key={`${view.page}-${index}`} className="flex justify-between items-center text-sm font-mono">
                  <span className="text-gray-300">{view.page}</span>
                  <span className="text-gray-500">{new Date(view.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
})

OptimizedAnalyticsDashboard.displayName = "OptimizedAnalyticsDashboard"

export default OptimizedAnalyticsDashboard
