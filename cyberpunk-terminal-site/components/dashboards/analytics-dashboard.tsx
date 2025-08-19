"use client"

import { useState, useEffect } from "react"
import { BarChart3, Users, Eye, Clock, TrendingUp, Globe, Smartphone, Monitor } from "lucide-react"

interface AnalyticsData {
  visitors: {
    total: number
    unique: number
    returning: number
    trend: number
  }
  pageViews: {
    total: number
    perSession: number
    trend: number
  }
  sessions: {
    total: number
    avgDuration: string
    bounceRate: number
    trend: number
  }
  devices: {
    desktop: number
    mobile: number
    tablet: number
  }
  topPages: Array<{
    path: string
    views: number
    uniqueViews: number
    avgTime: string
  }>
  realTimeUsers: number
  conversionRate: number
}

const generateMockAnalytics = (): AnalyticsData => {
  const baseVisitors = 12847
  const variation = Math.random() * 200 - 100

  return {
    visitors: {
      total: Math.floor(baseVisitors + variation),
      unique: Math.floor((baseVisitors + variation) * 0.73),
      returning: Math.floor((baseVisitors + variation) * 0.27),
      trend: Math.random() * 20 - 5,
    },
    pageViews: {
      total: Math.floor((baseVisitors + variation) * 2.4),
      perSession: Math.random() * 1.5 + 2.1,
      trend: Math.random() * 15 - 3,
    },
    sessions: {
      total: Math.floor((baseVisitors + variation) * 0.85),
      avgDuration: `${Math.floor(Math.random() * 2 + 2)}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0")}`,
      bounceRate: Math.random() * 20 + 35,
      trend: Math.random() * 10 - 5,
    },
    devices: {
      desktop: Math.random() * 20 + 45,
      mobile: Math.random() * 20 + 35,
      tablet: Math.random() * 10 + 8,
    },
    topPages: [
      {
        path: "/",
        views: Math.floor(Math.random() * 5000 + 8000),
        uniqueViews: Math.floor(Math.random() * 3000 + 5000),
        avgTime: "3:24",
      },
      {
        path: "/projects",
        views: Math.floor(Math.random() * 3000 + 4000),
        uniqueViews: Math.floor(Math.random() * 2000 + 2500),
        avgTime: "4:12",
      },
      {
        path: "/blog",
        views: Math.floor(Math.random() * 2000 + 3000),
        uniqueViews: Math.floor(Math.random() * 1500 + 2000),
        avgTime: "5:48",
      },
      {
        path: "/about",
        views: Math.floor(Math.random() * 1500 + 2000),
        uniqueViews: Math.floor(Math.random() * 1000 + 1500),
        avgTime: "2:36",
      },
      {
        path: "/contact",
        views: Math.floor(Math.random() * 1000 + 1500),
        uniqueViews: Math.floor(Math.random() * 800 + 1000),
        avgTime: "1:52",
      },
    ],
    realTimeUsers: Math.floor(Math.random() * 50 + 25),
    conversionRate: Math.random() * 5 + 12,
  }
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>(generateMockAnalytics())
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData(generateMockAnalytics())
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? "text-green-400" : "text-red-400"
  }

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? "↗" : "↘"
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-400/10 rounded-lg border border-cyan-400/30">
              <BarChart3 className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 cyber-text-glow">Web Analytics</h1>
              <p className="text-gray-400">Real-time website performance metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-sm text-gray-400">{isLive ? "LIVE" : "PAUSED"}</span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-4 py-2 bg-gray-800 border border-green-500/20 rounded text-sm hover:border-cyan-400/50 transition-colors"
            >
              {isLive ? "Pause" : "Resume"}
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-6 h-6 text-cyan-400" />
            <span className={`text-sm font-mono ${getTrendColor(data.visitors.trend)}`}>
              {getTrendIcon(data.visitors.trend)} {Math.abs(data.visitors.trend).toFixed(1)}%
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-cyan-400">{formatNumber(data.visitors.total)}</div>
            <div className="text-sm text-gray-400">Total Visitors</div>
            <div className="text-xs text-gray-500">
              {formatNumber(data.visitors.unique)} unique • {formatNumber(data.visitors.returning)} returning
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-6 h-6 text-green-400" />
            <span className={`text-sm font-mono ${getTrendColor(data.pageViews.trend)}`}>
              {getTrendIcon(data.pageViews.trend)} {Math.abs(data.pageViews.trend).toFixed(1)}%
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-400">{formatNumber(data.pageViews.total)}</div>
            <div className="text-sm text-gray-400">Page Views</div>
            <div className="text-xs text-gray-500">{data.pageViews.perSession.toFixed(1)} per session</div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-6 h-6 text-yellow-400" />
            <span className={`text-sm font-mono ${getTrendColor(data.sessions.trend)}`}>
              {getTrendIcon(data.sessions.trend)} {Math.abs(data.sessions.trend).toFixed(1)}%
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-yellow-400">{data.sessions.avgDuration}</div>
            <div className="text-sm text-gray-400">Avg Session</div>
            <div className="text-xs text-gray-500">{data.sessions.bounceRate.toFixed(1)}% bounce rate</div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-xs text-gray-500">LIVE</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-400">{data.realTimeUsers}</div>
            <div className="text-sm text-gray-400">Active Users</div>
            <div className="text-xs text-gray-500">{data.conversionRate.toFixed(1)}% conversion</div>
          </div>
        </div>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Breakdown */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">Device Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-blue-400" />
                <span>Desktop</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${data.devices.desktop}%` }}
                  />
                </div>
                <span className="text-sm font-mono w-12 text-right">{data.devices.desktop.toFixed(1)}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-green-400" />
                <span>Mobile</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${data.devices.mobile}%` }}
                  />
                </div>
                <span className="text-sm font-mono w-12 text-right">{data.devices.mobile.toFixed(1)}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-yellow-400" />
                <span>Tablet</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${data.devices.tablet}%` }}
                  />
                </div>
                <span className="text-sm font-mono w-12 text-right">{data.devices.tablet.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">Top Pages</h3>
          <div className="space-y-4">
            {data.topPages.map((page, index) => (
              <div
                key={page.path}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-700/50"
              >
                <div className="flex-1">
                  <div className="font-mono text-sm text-cyan-400">{page.path}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatNumber(page.views)} views • {formatNumber(page.uniqueViews)} unique • {page.avgTime} avg
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="mt-8 p-4 bg-gray-900/50 border border-green-500/20 rounded-lg font-mono text-sm">
        <div className="text-green-400 mb-2">$ tail -f /var/log/analytics.log</div>
        <div className="space-y-1 text-gray-400">
          <div>[{new Date().toISOString()}] INFO: Analytics data refreshed</div>
          <div>
            [{new Date().toISOString()}] INFO: {data.realTimeUsers} active users detected
          </div>
          <div>
            [{new Date().toISOString()}] INFO: Conversion rate: {data.conversionRate.toFixed(2)}%
          </div>
          <div className="text-cyan-400 animate-pulse">_</div>
        </div>
      </div>
    </div>
  )
}
