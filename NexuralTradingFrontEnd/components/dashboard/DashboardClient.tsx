"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import DashboardHeader from "./DashboardHeader"
import DashboardStats from "./DashboardStats"
import PerformanceOverview from "./PerformanceOverview"
import BotPerformanceTable from "./BotPerformanceTable"
import TradeHistoryTable from "./TradeHistoryTable"
import PortfolioAllocation from "./PortfolioAllocation"
import MarketInsights from "./MarketInsights"
import { generateDashboardData } from "@/lib/dashboard-data"
import type { DashboardData } from "@/lib/dashboard-data"
import { Skeleton } from "@/components/ui/skeleton"

// Loading Skeleton Component
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8 relative">
    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
    <div className="relative max-w-screen-2xl mx-auto">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
      {/* Main Content Skeleton */}
      <ResizablePanelGroup direction="horizontal" className="min-h-[800px]">
        <ResizablePanel defaultSize={75}>
          <div className="flex flex-col h-full gap-6 pr-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="flex-grow w-full" />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25}>
          <div className="flex flex-col h-full gap-6 pl-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="flex-grow w-full" />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  </div>
)

export default function DashboardClient() {
  const [timeframe, setTimeframe] = useState("30d")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      const data = generateDashboardData(timeframe)
      setDashboardData(data)
      setIsLoading(false)
    }, 1200) // Simulate a slightly longer fetch
    return () => clearTimeout(timer)
  }, [timeframe])

  if (isLoading || !dashboardData) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8 relative font-sans">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-0"></div>

      <div className="relative max-w-screen-2xl mx-auto z-10">
        <DashboardHeader
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          lastUpdated={dashboardData.lastUpdated}
        />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <DashboardStats data={dashboardData.stats} />
        </motion.div>

        <ResizablePanelGroup direction="horizontal" className="min-h-[800px] w-full mt-8">
          <ResizablePanel defaultSize={70} minSize={50}>
            <motion.div
              className="flex flex-col h-full gap-6 pr-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <PerformanceOverview data={dashboardData.overview} timeframe={timeframe} />
              <BotPerformanceTable data={dashboardData.bots} />
            </motion.div>
          </ResizablePanel>

          <ResizableHandle withHandle className="mx-3" />

          <ResizablePanel defaultSize={30} minSize={25}>
            <motion.div
              className="flex flex-col h-full gap-6 pl-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <PortfolioAllocation data={dashboardData.allocation} />
              <TradeHistoryTable data={dashboardData.trades} />
              <MarketInsights data={dashboardData.insights} />
            </motion.div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
