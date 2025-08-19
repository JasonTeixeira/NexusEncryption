"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, BarChart3 } from "lucide-react"

interface FinancialData {
  revenue: {
    total: number
    monthly: number
    growth: number
    recurring: number
  }
  expenses: {
    total: number
    operational: number
    marketing: number
    development: number
  }
  profit: {
    gross: number
    net: number
    margin: number
    ebitda: number
  }
  cashFlow: {
    operating: number
    investing: number
    financing: number
    free: number
  }
  metrics: {
    arr: number // Annual Recurring Revenue
    mrr: number // Monthly Recurring Revenue
    ltv: number // Customer Lifetime Value
    cac: number // Customer Acquisition Cost
  }
  monthlyData: Array<{
    month: string
    revenue: number
    expenses: number
    profit: number
  }>
  categories: Array<{
    name: string
    amount: number
    percentage: number
    trend: number
  }>
}

const generateMockFinancialData = (): FinancialData => {
  const baseRevenue = 425000
  const revenueVariation = Math.random() * 50000 - 25000

  return {
    revenue: {
      total: baseRevenue + revenueVariation,
      monthly: (baseRevenue + revenueVariation) / 12,
      growth: Math.random() * 30 + 5, // 5-35%
      recurring: (baseRevenue + revenueVariation) * 0.75,
    },
    expenses: {
      total: (baseRevenue + revenueVariation) * 0.65,
      operational: (baseRevenue + revenueVariation) * 0.35,
      marketing: (baseRevenue + revenueVariation) * 0.15,
      development: (baseRevenue + revenueVariation) * 0.15,
    },
    profit: {
      gross: (baseRevenue + revenueVariation) * 0.35,
      net: (baseRevenue + revenueVariation) * 0.22,
      margin: 22 + Math.random() * 8, // 22-30%
      ebitda: (baseRevenue + revenueVariation) * 0.28,
    },
    cashFlow: {
      operating: (baseRevenue + revenueVariation) * 0.25,
      investing: -(baseRevenue + revenueVariation) * 0.08,
      financing: -(baseRevenue + revenueVariation) * 0.05,
      free: (baseRevenue + revenueVariation) * 0.18,
    },
    metrics: {
      arr: baseRevenue + revenueVariation,
      mrr: (baseRevenue + revenueVariation) / 12,
      ltv: 2400 + Math.random() * 800, // $2400-3200
      cac: 180 + Math.random() * 120, // $180-300
    },
    monthlyData: [
      { month: "Jan", revenue: 32000 + Math.random() * 8000, expenses: 20000 + Math.random() * 5000, profit: 0 },
      { month: "Feb", revenue: 34000 + Math.random() * 8000, expenses: 21000 + Math.random() * 5000, profit: 0 },
      { month: "Mar", revenue: 36000 + Math.random() * 8000, expenses: 22000 + Math.random() * 5000, profit: 0 },
      { month: "Apr", revenue: 38000 + Math.random() * 8000, expenses: 23000 + Math.random() * 5000, profit: 0 },
      { month: "May", revenue: 35000 + Math.random() * 8000, expenses: 21500 + Math.random() * 5000, profit: 0 },
      { month: "Jun", revenue: 42000 + Math.random() * 8000, expenses: 25000 + Math.random() * 5000, profit: 0 },
    ].map((item) => ({ ...item, profit: item.revenue - item.expenses })),
    categories: [
      {
        name: "SaaS Subscriptions",
        amount: (baseRevenue + revenueVariation) * 0.6,
        percentage: 60,
        trend: Math.random() * 20 + 5,
      },
      {
        name: "Professional Services",
        amount: (baseRevenue + revenueVariation) * 0.25,
        percentage: 25,
        trend: Math.random() * 15 - 5,
      },
      {
        name: "Training & Support",
        amount: (baseRevenue + revenueVariation) * 0.1,
        percentage: 10,
        trend: Math.random() * 10 + 2,
      },
      {
        name: "Other Revenue",
        amount: (baseRevenue + revenueVariation) * 0.05,
        percentage: 5,
        trend: Math.random() * 8 - 2,
      },
    ],
  }
}

export default function FinancialDashboard() {
  const [data, setData] = useState<FinancialData>(generateMockFinancialData())
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData(generateMockFinancialData())
    }, 5000)

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
    return trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 cyber-text-glow">Financial Dashboard</h1>
              <p className="text-gray-400">Revenue tracking and financial performance</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-sm text-gray-400">{isLive ? "LIVE" : "PAUSED"}</span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-4 py-2 bg-gray-800 border border-green-500/20 rounded text-sm hover:border-yellow-400/50 transition-colors"
            >
              {isLive ? "Pause" : "Resume"}
            </button>
          </div>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-6 h-6 text-green-400" />
            <div className={`flex items-center gap-1 ${getTrendColor(data.revenue.growth)}`}>
              {getTrendIcon(data.revenue.growth)}
              <span className="text-sm font-mono">{data.revenue.growth.toFixed(1)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-400">{formatCurrency(data.revenue.total)}</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
            <div className="text-xs text-gray-500">
              {formatCurrency(data.revenue.monthly)}/mo •{" "}
              {((data.revenue.recurring / data.revenue.total) * 100).toFixed(0)}% recurring
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="w-6 h-6 text-red-400" />
            <span className="text-sm text-gray-400">
              {((data.expenses.total / data.revenue.total) * 100).toFixed(0)}% of revenue
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-red-400">{formatCurrency(data.expenses.total)}</div>
            <div className="text-sm text-gray-400">Total Expenses</div>
            <div className="text-xs text-gray-500">
              {formatCurrency(data.expenses.operational)} ops • {formatCurrency(data.expenses.marketing)} marketing
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <span className="text-sm text-gray-400">{data.profit.margin.toFixed(1)}% margin</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-cyan-400">{formatCurrency(data.profit.net)}</div>
            <div className="text-sm text-gray-400">Net Profit</div>
            <div className="text-xs text-gray-500">
              {formatCurrency(data.profit.gross)} gross • {formatCurrency(data.profit.ebitda)} EBITDA
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <span className="text-sm text-gray-400">{(data.metrics.ltv / data.metrics.cac).toFixed(1)}:1 LTV:CAC</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-400">{formatCurrency(data.cashFlow.free)}</div>
            <div className="text-sm text-gray-400">Free Cash Flow</div>
            <div className="text-xs text-gray-500">
              {formatCurrency(data.metrics.mrr)} MRR • {formatCurrency(data.metrics.ltv)} LTV
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown and Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Categories */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">Revenue Breakdown</h3>
          <div className="space-y-4">
            {data.categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{formatCurrency(category.amount)}</span>
                    <div className={`flex items-center gap-1 ${getTrendColor(category.trend)}`}>
                      {getTrendIcon(category.trend)}
                      <span className="text-xs">{category.trend.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">Monthly Performance</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {data.monthlyData.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-full gap-1">
                  <div
                    className="w-full bg-green-400/20 border-t-2 border-green-400 transition-all duration-500"
                    style={{ height: `${(month.revenue / 50000) * 100}%`, minHeight: "8px" }}
                    title={`Revenue: ${formatCurrency(month.revenue)}`}
                  />
                  <div
                    className="w-full bg-red-400/20 border-t-2 border-red-400 transition-all duration-500"
                    style={{ height: `${(month.expenses / 50000) * 100}%`, minHeight: "4px" }}
                    title={`Expenses: ${formatCurrency(month.expenses)}`}
                  />
                  <div
                    className="w-full bg-cyan-400/20 border-t-2 border-cyan-400 transition-all duration-500"
                    style={{ height: `${(month.profit / 50000) * 100}%`, minHeight: "2px" }}
                    title={`Profit: ${formatCurrency(month.profit)}`}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">{month.month}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400/20 border border-green-400" />
              <span className="text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400/20 border border-red-400" />
              <span className="text-gray-400">Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400/20 border border-cyan-400" />
              <span className="text-gray-400">Profit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Analysis */}
      <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg mb-8">
        <h3 className="text-lg font-bold text-cyan-400 mb-6">Cash Flow Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{formatCurrency(data.cashFlow.operating)}</div>
            <div className="text-sm text-gray-400 mt-1">Operating</div>
            <div className="text-xs text-gray-500">Cash from operations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{formatCurrency(data.cashFlow.investing)}</div>
            <div className="text-sm text-gray-400 mt-1">Investing</div>
            <div className="text-xs text-gray-500">Capital investments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{formatCurrency(data.cashFlow.financing)}</div>
            <div className="text-sm text-gray-400 mt-1">Financing</div>
            <div className="text-xs text-gray-500">Debt & equity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{formatCurrency(data.cashFlow.free)}</div>
            <div className="text-sm text-gray-400 mt-1">Free Cash Flow</div>
            <div className="text-xs text-gray-500">Available cash</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg mb-8">
        <h3 className="text-lg font-bold text-cyan-400 mb-6">Key Business Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{formatCurrency(data.metrics.arr)}</div>
            <div className="text-sm text-gray-400">ARR</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-cyan-400">{formatCurrency(data.metrics.mrr)}</div>
            <div className="text-sm text-gray-400">MRR</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">{formatCurrency(data.metrics.ltv)}</div>
            <div className="text-sm text-gray-400">LTV</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-400">{formatCurrency(data.metrics.cac)}</div>
            <div className="text-sm text-gray-400">CAC</div>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-4 bg-gray-900/50 border border-green-500/20 rounded-lg font-mono text-sm">
        <div className="text-green-400 mb-2">$ financial-report --live --format=json</div>
        <div className="space-y-1 text-gray-400">
          <div>[{new Date().toISOString()}] INFO: Financial data updated</div>
          <div>
            [{new Date().toISOString()}] INFO: Revenue: {formatCurrency(data.revenue.total)} | Profit Margin:{" "}
            {data.profit.margin.toFixed(1)}%
          </div>
          <div>
            [{new Date().toISOString()}] INFO: Cash Flow: {formatCurrency(data.cashFlow.free)} | LTV:CAC{" "}
            {(data.metrics.ltv / data.metrics.cac).toFixed(1)}:1
          </div>
          <div className="text-yellow-400 animate-pulse">_</div>
        </div>
      </div>
    </div>
  )
}
