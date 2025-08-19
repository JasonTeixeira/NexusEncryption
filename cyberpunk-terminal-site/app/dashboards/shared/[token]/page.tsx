"use client"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { collaborationService } from "@/lib/collaboration-service"
import CyberpunkTerminalMenu from "@/components/cyberpunk-terminal-menu"
import AnalyticsDashboard from "@/components/dashboards/analytics-dashboard"
import PerformanceDashboard from "@/components/dashboards/performance-dashboard"
import SecurityDashboard from "@/components/dashboards/security-dashboard"
import IoTDashboard from "@/components/dashboards/iot-dashboard"
import DevOpsDashboard from "@/components/dashboards/devops-dashboard"

interface SharedDashboardPageProps {
  params: Promise<{ token: string }>
}

const dashboardComponents = {
  analytics: AnalyticsDashboard,
  performance: PerformanceDashboard,
  security: SecurityDashboard,
  "iot-devices": IoTDashboard,
  "devops-pipeline": DevOpsDashboard,
}

export default function SharedDashboardPage({ params }: SharedDashboardPageProps) {
  const { token } = use(params)
  const [dashboardInfo, setDashboardInfo] = useState<{ dashboardId: string; permissions: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const info = collaborationService.parseShareLink(token)
    if (info) {
      setDashboardInfo(info)
    }
    setIsLoading(false)
  }, [token])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading shared dashboard...</p>
        </div>
      </div>
    )
  }

  if (!dashboardInfo) {
    notFound()
  }

  const DashboardComponent = dashboardComponents[dashboardInfo.dashboardId as keyof typeof dashboardComponents]

  if (!DashboardComponent) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <CyberpunkTerminalMenu currentPage="dashboards" />

      {/* Shared Dashboard Header */}
      <div className="bg-[#1C1C24] border-b border-green-500/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C940]" />
              </div>
              <h1 className="text-2xl font-bold text-cyan-400 cyber-text-glow">
                Shared Dashboard - {dashboardInfo.dashboardId}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded text-xs font-mono ${
                  dashboardInfo.permissions === "edit"
                    ? "bg-green-400/20 text-green-400"
                    : "bg-blue-400/20 text-blue-400"
                }`}
              >
                {dashboardInfo.permissions.toUpperCase()} ACCESS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <DashboardComponent />
    </div>
  )
}
