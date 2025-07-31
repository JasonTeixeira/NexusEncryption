"use client"

import { motion } from "framer-motion"
import { RefreshCw, Download, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HeaderStats } from "@/lib/dashboard-data"

interface DashboardHeaderProps {
  data: HeaderStats
  onRefresh: () => void
  isRefreshing: boolean
}

export default function DashboardHeader({ data, onRefresh, isRefreshing }: DashboardHeaderProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <motion.header
      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 p-8 bg-black/40 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            NEXURAL
          </h1>
          <p className="text-sm text-gray-400 font-mono uppercase tracking-wider mt-1">DASHBOARD</p>
        </div>
      </div>

      {/* Header Stats */}
      <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary font-mono">{formatPercent(data.totalPnlPercent)}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Total Return</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary font-mono">
            {((data.totalTrades / data.activeBots) * 0.82).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Bot Win Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary font-mono">69%</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Signal Win Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary font-mono">3.1</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Avg Return</div>
        </div>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Account Balance</div>
          <div className="text-2xl font-bold text-primary font-mono">{formatCurrency(data.totalValue)}</div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="bg-black/50 border border-primary/30 text-white hover:bg-primary/10 hover:border-primary transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="bg-black/50 border border-primary/30 text-white hover:bg-primary/10 hover:border-primary transition-all duration-300">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-black/50 border border-primary/30 text-white hover:bg-primary/10 hover:border-primary transition-all duration-300">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
