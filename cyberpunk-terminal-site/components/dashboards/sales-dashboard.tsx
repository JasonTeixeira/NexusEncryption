"use client"

import { useState, useEffect } from "react"
import { Target, Users, ShoppingCart, TrendingUp, Phone, Mail, Calendar, Award } from "lucide-react"

interface SalesData {
  pipeline: {
    total: number
    qualified: number
    proposal: number
    negotiation: number
    closed: number
  }
  conversion: {
    leadToCustomer: number
    proposalToClose: number
    averageDealSize: number
    salesCycle: number
  }
  performance: {
    quota: number
    achieved: number
    deals: number
    revenue: number
  }
  team: Array<{
    name: string
    deals: number
    revenue: number
    quota: number
    conversion: number
  }>
  activities: Array<{
    type: "call" | "email" | "meeting" | "demo"
    count: number
    trend: number
  }>
  forecast: Array<{
    month: string
    target: number
    pipeline: number
    closed: number
  }>
}

const generateMockSalesData = (): SalesData => {
  return {
    pipeline: {
      total: Math.floor(Math.random() * 500000 + 1200000),
      qualified: Math.floor(Math.random() * 200000 + 400000),
      proposal: Math.floor(Math.random() * 150000 + 300000),
      negotiation: Math.floor(Math.random() * 100000 + 200000),
      closed: Math.floor(Math.random() * 80000 + 150000),
    },
    conversion: {
      leadToCustomer: Math.random() * 10 + 15, // 15-25%
      proposalToClose: Math.random() * 20 + 60, // 60-80%
      averageDealSize: Math.random() * 5000 + 12000, // $12k-17k
      salesCycle: Math.random() * 20 + 45, // 45-65 days
    },
    performance: {
      quota: 250000,
      achieved: Math.random() * 50000 + 180000, // $180k-230k
      deals: Math.floor(Math.random() * 5 + 12), // 12-17 deals
      revenue: Math.random() * 50000 + 180000,
    },
    team: [
      {
        name: "Sarah Chen",
        deals: Math.floor(Math.random() * 3 + 4),
        revenue: Math.random() * 20000 + 45000,
        quota: 60000,
        conversion: Math.random() * 10 + 20,
      },
      {
        name: "Mike Rodriguez",
        deals: Math.floor(Math.random() * 2 + 3),
        revenue: Math.random() * 15000 + 38000,
        quota: 55000,
        conversion: Math.random() * 8 + 18,
      },
      {
        name: "Emily Johnson",
        deals: Math.floor(Math.random() * 4 + 5),
        revenue: Math.random() * 25000 + 52000,
        quota: 65000,
        conversion: Math.random() * 12 + 22,
      },
      {
        name: "David Kim",
        deals: Math.floor(Math.random() * 2 + 2),
        revenue: Math.random() * 18000 + 35000,
        quota: 50000,
        conversion: Math.random() * 9 + 16,
      },
    ],
    activities: [
      {
        type: "call",
        count: Math.floor(Math.random() * 50 + 120),
        trend: Math.random() * 20 - 5,
      },
      {
        type: "email",
        count: Math.floor(Math.random() * 100 + 200),
        trend: Math.random() * 15 + 5,
      },
      {
        type: "meeting",
        count: Math.floor(Math.random() * 20 + 35),
        trend: Math.random() * 25 - 10,
      },
      {
        type: "demo",
        count: Math.floor(Math.random() * 15 + 25),
        trend: Math.random() * 30 + 10,
      },
    ],
    forecast: [
      { month: "Jan", target: 200000, pipeline: 180000 + Math.random() * 40000, closed: 0 },
      { month: "Feb", target: 220000, pipeline: 200000 + Math.random() * 50000, closed: 0 },
      { month: "Mar", target: 240000, pipeline: 220000 + Math.random() * 60000, closed: 0 },
      { month: "Apr", target: 250000, pipeline: 240000 + Math.random() * 70000, closed: 0 },
      { month: "May", target: 260000, pipeline: 250000 + Math.random() * 80000, closed: 0 },
      { month: "Jun", target: 280000, pipeline: 270000 + Math.random() * 90000, closed: 0 },
    ].map((item) => ({ ...item, closed: item.pipeline * (Math.random() * 0.3 + 0.6) })),
  }
}

export default function SalesDashboard() {
  const [data, setData] = useState<SalesData>(generateMockSalesData())
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData(generateMockSalesData())
    }, 4000)

    return () => clearInterval(interval)
  }, [isLive])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toFixed(0)}`
  }

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? "text-green-400" : "text-red-400"
  }

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? "↗" : "↘"
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="w-4 h-4" />
      case "email":
        return <Mail className="w-4 h-4" />
      case "meeting":
        return <Calendar className="w-4 h-4" />
      case "demo":
        return <Award className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-400/10 rounded-lg border border-pink-400/30">
              <Target className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-pink-400 cyber-text-glow">Sales Dashboard</h1>
              <p className="text-gray-400">Sales performance and pipeline tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-sm text-gray-400">{isLive ? "LIVE" : "PAUSED"}</span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-4 py-2 bg-gray-800 border border-green-500/20 rounded text-sm hover:border-pink-400/50 transition-colors"
            >
              {isLive ? "Pause" : "Resume"}
            </button>
          </div>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-6 h-6 text-green-400" />
            <span className="text-sm text-gray-400">
              {((data.performance.achieved / data.performance.quota) * 100).toFixed(0)}% of quota
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-400">{formatCurrency(data.performance.achieved)}</div>
            <div className="text-sm text-gray-400">Revenue Achieved</div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((data.performance.achieved / data.performance.quota) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">{data.performance.deals} deals closed</div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="w-6 h-6 text-cyan-400" />
            <span className="text-sm text-gray-400">{data.conversion.salesCycle.toFixed(0)} day cycle</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-cyan-400">{formatCurrency(data.pipeline.total)}</div>
            <div className="text-sm text-gray-400">Total Pipeline</div>
            <div className="text-xs text-gray-500">
              {formatCurrency(data.conversion.averageDealSize)} avg deal • {data.conversion.proposalToClose.toFixed(0)}%
              close rate
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-6 h-6 text-yellow-400" />
            <span className="text-sm text-gray-400">{data.conversion.leadToCustomer.toFixed(1)}% conversion</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-yellow-400">{formatCurrency(data.pipeline.qualified)}</div>
            <div className="text-sm text-gray-400">Qualified Leads</div>
            <div className="text-xs text-gray-500">
              {formatCurrency(data.pipeline.proposal)} in proposal • {formatCurrency(data.pipeline.negotiation)}{" "}
              negotiating
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <span className="text-sm text-gray-400">This month</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-400">{formatCurrency(data.pipeline.closed)}</div>
            <div className="text-sm text-gray-400">Closed Won</div>
            <div className="text-xs text-gray-500">
              {((data.pipeline.closed / data.pipeline.total) * 100).toFixed(1)}% of pipeline
            </div>
          </div>
        </div>
      </div>

      {/* Sales Team Performance and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Team Performance */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">Team Performance</h3>
          <div className="space-y-4">
            {data.team.map((member) => (
              <div
                key={member.name}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-700/50"
              >
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {member.deals} deals • {member.conversion.toFixed(1)}% conversion
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-purple-400 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((member.revenue / member.quota) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-bold">{formatCurrency(member.revenue)}</div>
                  <div className="text-xs text-gray-500">of {formatCurrency(member.quota)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Activities */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">Sales Activities</h3>
          <div className="space-y-4">
            {data.activities.map((activity) => (
              <div key={activity.type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded">{getActivityIcon(activity.type)}</div>
                  <div>
                    <div className="font-medium capitalize">{activity.type}s</div>
                    <div className="text-xs text-gray-500">This week</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{activity.count}</div>
                  <div className={`text-xs ${getTrendColor(activity.trend)}`}>
                    {getTrendIcon(activity.trend)} {Math.abs(activity.trend).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Forecast */}
      <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg mb-8">
        <h3 className="text-lg font-bold text-cyan-400 mb-6">Sales Forecast</h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {data.forecast.map((month) => (
            <div key={month.month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col justify-end h-full gap-1">
                <div
                  className="w-full bg-gray-600/20 border-t-2 border-gray-600 transition-all duration-500"
                  style={{ height: `${(month.target / 300000) * 100}%`, minHeight: "8px" }}
                  title={`Target: ${formatCurrency(month.target)}`}
                />
                <div
                  className="w-full bg-yellow-400/20 border-t-2 border-yellow-400 transition-all duration-500"
                  style={{ height: `${(month.pipeline / 300000) * 100}%`, minHeight: "6px" }}
                  title={`Pipeline: ${formatCurrency(month.pipeline)}`}
                />
                <div
                  className="w-full bg-green-400/20 border-t-2 border-green-400 transition-all duration-500"
                  style={{ height: `${(month.closed / 300000) * 100}%`, minHeight: "4px" }}
                  title={`Closed: ${formatCurrency(month.closed)}`}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">{month.month}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-600/20 border border-gray-600" />
            <span className="text-gray-400">Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400/20 border border-yellow-400" />
            <span className="text-gray-400">Pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400/20 border border-green-400" />
            <span className="text-gray-400">Closed</span>
          </div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg mb-8">
        <h3 className="text-lg font-bold text-cyan-400 mb-6">Pipeline Stages</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{formatCurrency(data.pipeline.total)}</div>
            <div className="text-sm text-gray-400">Total Pipeline</div>
            <div className="text-xs text-gray-500">100%</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-cyan-400">{formatCurrency(data.pipeline.qualified)}</div>
            <div className="text-sm text-gray-400">Qualified</div>
            <div className="text-xs text-gray-500">
              {((data.pipeline.qualified / data.pipeline.total) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">{formatCurrency(data.pipeline.proposal)}</div>
            <div className="text-sm text-gray-400">Proposal</div>
            <div className="text-xs text-gray-500">
              {((data.pipeline.proposal / data.pipeline.total) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-400">{formatCurrency(data.pipeline.negotiation)}</div>
            <div className="text-sm text-gray-400">Negotiation</div>
            <div className="text-xs text-gray-500">
              {((data.pipeline.negotiation / data.pipeline.total) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{formatCurrency(data.pipeline.closed)}</div>
            <div className="text-sm text-gray-400">Closed Won</div>
            <div className="text-xs text-gray-500">
              {((data.pipeline.closed / data.pipeline.total) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-4 bg-gray-900/50 border border-green-500/20 rounded-lg font-mono text-sm">
        <div className="text-green-400 mb-2">$ sales-report --pipeline --team</div>
        <div className="space-y-1 text-gray-400">
          <div>[{new Date().toISOString()}] INFO: Sales data synchronized</div>
          <div>
            [{new Date().toISOString()}] INFO: Pipeline: {formatCurrency(data.pipeline.total)} | Quota Achievement:{" "}
            {((data.performance.achieved / data.performance.quota) * 100).toFixed(0)}%
          </div>
          <div>
            [{new Date().toISOString()}] INFO: Avg Deal Size: {formatCurrency(data.conversion.averageDealSize)} | Sales
            Cycle: {data.conversion.salesCycle.toFixed(0)} days
          </div>
          <div className="text-pink-400 animate-pulse">_</div>
        </div>
      </div>
    </div>
  )
}
