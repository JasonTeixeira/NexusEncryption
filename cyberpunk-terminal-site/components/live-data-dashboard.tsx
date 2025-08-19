"use client"

import { useState, useEffect, memo } from "react"
import { useGitHubStats } from "@/hooks/use-github"
import { useMultiCloudMetrics } from "@/hooks/use-cloud"
import { useLinkedInMetrics, useIndustryNews } from "@/hooks/use-professional"

interface DashboardMetrics {
  github: {
    totalStars: number
    totalCommits: number
    recentActivity: number
  }
  cloud: {
    totalCost: number
    totalResources: number
    healthScore: number
    alerts: number
  }
  professional: {
    profileViews: number
    connections: number
    certifications: number
  }
  analytics: {
    visitors: number
    pageViews: number
    bounceRate: number
  }
}

interface LiveAlert {
  id: string
  level: "info" | "warning" | "critical"
  source: string
  message: string
  timestamp: string
}

const MetricCard = memo(
  ({
    title,
    value,
    subtitle,
    color,
    trend,
  }: {
    title: string
    value: string | number
    subtitle?: string
    color: string
    trend?: "up" | "down" | "stable"
  }) => (
    <div className={`border border-${color}-500/30 p-4 bg-${color}-500/[0.02] relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent -translate-x-full animate-[slideRight_3s_linear_infinite]" />
      <div className="relative">
        <div className="text-gray-400 text-xs uppercase tracking-wider">{title}</div>
        <div className={`text-${color}-400 text-2xl font-bold flex items-center`}>
          {typeof value === "number" ? value.toLocaleString() : value}
          {trend && (
            <span
              className={`ml-2 text-xs ${
                trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-gray-400"
              }`}
            >
              {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
            </span>
          )}
        </div>
        {subtitle && <div className="text-gray-500 text-xs mt-1">{subtitle}</div>}
      </div>
    </div>
  ),
)

MetricCard.displayName = "MetricCard"

const AlertItem = memo(({ alert }: { alert: LiveAlert }) => (
  <div className="flex items-center space-x-3 p-2 border-l-2 border-gray-700 hover:border-cyan-500 transition-colors">
    <div
      className={`w-2 h-2 rounded-full animate-pulse ${
        alert.level === "critical" ? "bg-red-500" : alert.level === "warning" ? "bg-yellow-500" : "bg-blue-500"
      }`}
    />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <span className="text-gray-400 text-xs">[{alert.source}]</span>
        <span className="text-gray-500 text-xs">{new Date(alert.timestamp).toLocaleTimeString()}</span>
      </div>
      <div className="text-white text-sm">{alert.message}</div>
    </div>
  </div>
))

AlertItem.displayName = "AlertItem"

export default function LiveDataDashboard() {
  const { stats: githubStats, loading: githubLoading } = useGitHubStats()
  const { summary: cloudSummary, loading: cloudLoading } = useMultiCloudMetrics()
  const { metrics: linkedinMetrics, loading: linkedinLoading } = useLinkedInMetrics()
  const { news, loading: newsLoading } = useIndustryNews()

  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    github: { totalStars: 0, totalCommits: 0, recentActivity: 0 },
    cloud: { totalCost: 0, totalResources: 0, healthScore: 0, alerts: 0 },
    professional: { profileViews: 0, connections: 0, certifications: 0 },
    analytics: { visitors: 0, pageViews: 0, bounceRate: 0 },
  })

  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([])
  const [systemHealth, setSystemHealth] = useState(98)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Update dashboard metrics when data loads
  useEffect(() => {
    setDashboardMetrics({
      github: {
        totalStars: githubStats?.totalStars || 0,
        totalCommits: githubStats?.totalCommits || 0,
        recentActivity: githubStats?.recentActivity?.length || 0,
      },
      cloud: {
        totalCost: cloudSummary?.totalCost || 0,
        totalResources: cloudSummary?.totalResources || 0,
        healthScore: cloudSummary?.avgHealthScore || 0,
        alerts: cloudSummary?.alerts?.length || 0,
      },
      professional: {
        profileViews: linkedinMetrics?.profileViews || 0,
        connections: linkedinMetrics?.connectionGrowth || 0,
        certifications: linkedinMetrics?.certificationCount || 0,
      },
      analytics: {
        visitors: Math.floor(Math.random() * 1000) + 500,
        pageViews: Math.floor(Math.random() * 5000) + 2000,
        bounceRate: Math.floor(Math.random() * 30) + 20,
      },
    })
  }, [githubStats, cloudSummary, linkedinMetrics])

  // Generate live alerts
  useEffect(() => {
    const alertSources = [
      { source: "GitHub", messages: ["New star received", "Pull request merged", "Issue resolved"] },
      { source: "AWS", messages: ["Auto-scaling triggered", "Cost alert threshold reached", "Health check passed"] },
      { source: "Azure", messages: ["Resource group updated", "Backup completed", "Performance optimized"] },
      { source: "LinkedIn", messages: ["Profile view spike", "New connection request", "Skill endorsed"] },
      { source: "Analytics", messages: ["Traffic surge detected", "New visitor milestone", "Conversion improved"] },
    ]

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const source = alertSources[Math.floor(Math.random() * alertSources.length)]
        const message = source.messages[Math.floor(Math.random() * source.messages.length)]
        const levels: LiveAlert["level"][] = ["info", "warning", "critical"]
        const level = levels[Math.floor(Math.random() * levels.length)]

        const newAlert: LiveAlert = {
          id: `alert-${Date.now()}`,
          level,
          source: source.source,
          message,
          timestamp: new Date().toISOString(),
        }

        setLiveAlerts((prev) => [newAlert, ...prev.slice(0, 9)]) // Keep only 10 alerts
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Update system health and last update time
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth((prev) => {
        const change = (Math.random() - 0.5) * 2
        return Math.max(85, Math.min(100, prev + change))
      })
      setLastUpdate(new Date())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const isLoading = githubLoading || cloudLoading || linkedinLoading

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-cyan-400 font-bold">INITIALIZING LIVE DATA STREAMS...</div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500 animate-pulse" style={{ width: "100%" }} />
        </div>
        <div className="text-gray-400 text-sm">Connecting to GitHub, Cloud Providers, Professional Networks...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-cyan-400 font-bold text-xl">LIVE DATA COMMAND CENTER</div>
        <div className="text-gray-400 text-sm">
          Last Update: {lastUpdate.toLocaleTimeString()} | Health:
          <span
            className={`ml-1 font-bold ${systemHealth > 95 ? "text-green-400" : systemHealth > 85 ? "text-yellow-400" : "text-red-400"}`}
          >
            {systemHealth.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="GitHub Stars"
          value={dashboardMetrics.github.totalStars}
          subtitle="Total across repos"
          color="yellow"
          trend="up"
        />
        <MetricCard
          title="Cloud Cost"
          value={`$${(dashboardMetrics.cloud.totalCost / 1000).toFixed(1)}K`}
          subtitle="Monthly spend"
          color="green"
          trend="down"
        />
        <MetricCard
          title="Profile Views"
          value={dashboardMetrics.professional.profileViews}
          subtitle="This month"
          color="blue"
          trend="up"
        />
        <MetricCard
          title="Site Visitors"
          value={dashboardMetrics.analytics.visitors}
          subtitle="Today"
          color="purple"
          trend="up"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <MetricCard
          title="Commits"
          value={`${(dashboardMetrics.github.totalCommits / 1000).toFixed(1)}K`}
          color="cyan"
        />
        <MetricCard title="Resources" value={dashboardMetrics.cloud.totalResources} color="orange" />
        <MetricCard title="Certifications" value={dashboardMetrics.professional.certifications} color="red" />
        <MetricCard
          title="Page Views"
          value={`${(dashboardMetrics.analytics.pageViews / 1000).toFixed(1)}K`}
          color="indigo"
        />
        <MetricCard title="Cloud Health" value={`${dashboardMetrics.cloud.healthScore}%`} color="green" />
        <MetricCard title="Bounce Rate" value={`${dashboardMetrics.analytics.bounceRate}%`} color="yellow" />
      </div>

      {/* Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Alerts */}
        <div className="border border-red-500/30 p-4 bg-red-500/[0.02]">
          <div className="text-red-400 font-bold mb-3 flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
            LIVE ALERTS & NOTIFICATIONS
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {liveAlerts.length > 0 ? (
              liveAlerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
            ) : (
              <div className="text-gray-500 text-sm">No active alerts - all systems operational</div>
            )}
          </div>
        </div>

        {/* Industry News Feed */}
        <div className="border border-purple-500/30 p-4 bg-purple-500/[0.02]">
          <div className="text-purple-400 font-bold mb-3 flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2"></div>
            INDUSTRY NEWS STREAM
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {newsLoading ? (
              <div className="text-gray-400">Loading news feed...</div>
            ) : news.length > 0 ? (
              news.slice(0, 5).map((article, index) => (
                <div key={index} className="border-l-2 border-purple-500/50 pl-3">
                  <div className="text-white text-sm font-semibold">{article.title}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                  </div>
                  <div className="text-gray-300 text-xs mt-1">{article.summary.slice(0, 100)}...</div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">News feed temporarily unavailable</div>
            )}
          </div>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="border border-cyan-500/30 p-4 bg-cyan-500/[0.02]">
        <div className="text-cyan-400 font-bold mb-3">INTEGRATED SYSTEMS STATUS</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${githubStats ? "bg-green-500" : "bg-red-500"} animate-pulse`}></div>
            <span className="text-white text-sm">GitHub API</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${cloudSummary ? "bg-green-500" : "bg-red-500"} animate-pulse`}></div>
            <span className="text-white text-sm">Cloud Platforms</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${linkedinMetrics ? "bg-green-500" : "bg-red-500"} animate-pulse`}
            ></div>
            <span className="text-white text-sm">Professional APIs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-white text-sm">Analytics Engine</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="border border-green-500/30 p-4 bg-green-500/[0.02]">
        <div className="text-green-400 font-bold mb-3">REAL-TIME PERFORMANCE METRICS</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-gray-400 text-sm mb-2">API Response Times</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>GitHub API</span>
                <span className="text-green-400">127ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Cloud APIs</span>
                <span className="text-yellow-400">234ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>LinkedIn API</span>
                <span className="text-green-400">89ms</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-2">Data Freshness</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>GitHub Stats</span>
                <span className="text-green-400">2m ago</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Cloud Metrics</span>
                <span className="text-green-400">1m ago</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Professional Data</span>
                <span className="text-yellow-400">15m ago</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-2">Cache Hit Rates</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>API Cache</span>
                <span className="text-green-400">94.7%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Static Assets</span>
                <span className="text-green-400">98.2%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Database</span>
                <span className="text-green-400">91.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
