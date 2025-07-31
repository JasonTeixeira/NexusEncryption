"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { DashboardData, BotPerformance } from "@/lib/dashboard-data"
import { getDashboardData } from "@/lib/dashboard-data"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import PerformanceSection from "@/components/dashboard/PerformanceSection"
import BotSelector from "@/components/dashboard/BotSelector"
import BotShowcase from "@/components/dashboard/BotShowcase"
import SignalsSection from "@/components/dashboard/SignalsSection"
import TradeHistorySection from "@/components/dashboard/TradeHistorySection"
import LoadingOverlay from "@/components/dashboard/LoadingOverlay"
import FloatingActions from "@/components/dashboard/FloatingActions"
import { Skeleton } from "@/components/ui/skeleton"

type ViewMode = "bots" | "signals" | "combined"

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-black pt-32 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-screen-2xl mx-auto">
        <Skeleton className="h-20 w-full rounded-lg bg-black border border-primary/30 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg bg-black border border-primary/30" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[500px] rounded-lg bg-black border border-primary/30" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[500px] rounded-lg bg-black border border-primary/30" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [selectedBot, setSelectedBot] = useState<BotPerformance | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("bots")
  const [timeframe, setTimeframe] = useState("1M")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      // Simulate loading time for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const result = await getDashboardData()
      setData(result)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const handleSelectBot = (bot: BotPerformance | null) => {
    setSelectedBot(bot)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    const result = await getDashboardData()
    setData(result)
    setIsRefreshing(false)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    setSelectedBot(null) // Reset selection when changing modes
  }

  if (isLoading || !data) {
    return (
      <>
        <LoadingOverlay />
        <DashboardSkeleton />
      </>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-black via-transparent to-black z-0" />

      {/* Main Content Container with proper spacing */}
      <div className="relative z-10 pt-32 pb-16">
        <motion.div
          className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Dashboard Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <DashboardHeader data={data.headerStats} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
          </motion.div>

          {/* Performance Toggle */}
          <motion.div variants={itemVariants} className="flex justify-center mb-16">
            <div className="flex gap-1 bg-black/40 backdrop-blur-sm p-1 rounded-xl border border-primary/20">
              {[
                { key: "bots", label: "Bot Performance" },
                { key: "signals", label: "Signal Performance" },
                { key: "combined", label: "Combined View" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleViewModeChange(key as ViewMode)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    viewMode === key
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "text-gray-400 hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Performance Chart - Takes 2 columns */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <PerformanceSection
                data={selectedBot ? selectedBot.performanceHistory : data.performanceOverview}
                selectedBot={selectedBot}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                viewMode={viewMode}
              />
            </motion.div>

            {/* Bot/Signal Selector - Takes 1 column */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <BotSelector
                bots={data.botPerformance}
                selectedBot={selectedBot}
                onSelectBot={handleSelectBot}
                viewMode={viewMode}
              />
            </motion.div>
          </div>

          {/* Content Sections based on view mode */}
          <AnimatePresence mode="wait">
            {viewMode === "bots" && (
              <motion.div
                key="bots"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mb-16"
              >
                <BotShowcase bots={data.botPerformance} />
              </motion.div>
            )}

            {viewMode === "signals" && (
              <motion.div
                key="signals"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mb-16"
              >
                <SignalsSection />
              </motion.div>
            )}

            {viewMode === "combined" && (
              <motion.div
                key="combined"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-16 mb-16"
              >
                <BotShowcase bots={data.botPerformance.slice(0, 3)} />
                <SignalsSection />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trade History Section */}
          <motion.div variants={itemVariants}>
            <TradeHistorySection trades={data.recentTrades} selectedBot={selectedBot} />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActions onRefresh={handleRefresh} />
    </div>
  )
}
