"use client"

import { notFound } from "next/navigation"
import CyberpunkTerminalMenu from "@/components/cyberpunk-terminal-menu"
import DashboardNavigation from "@/components/dashboard-navigation"
import AnalyticsDashboard from "@/components/dashboards/analytics-dashboard"
import PerformanceDashboard from "@/components/dashboards/performance-dashboard"
import SecurityDashboard from "@/components/dashboards/security-dashboard"
import SystemMonitorDashboard from "@/components/dashboards/system-monitor-dashboard"
import FinancialDashboard from "@/components/dashboards/financial-dashboard"
import SalesDashboard from "@/components/dashboards/sales-dashboard"
import IoTDashboard from "@/components/dashboards/iot-dashboard"
import DevOpsDashboard from "@/components/dashboards/devops-dashboard"
import EcommerceDashboard from "@/components/dashboards/ecommerce-dashboard"
import SocialAnalyticsDashboard from "@/components/dashboards/social-analytics-dashboard"
import RealtimeStatus from "@/components/realtime-status"
import RealtimeNotifications from "@/components/realtime-notifications"
import EnergyDashboard from "@/components/dashboards/energy-dashboard"

interface DashboardPageProps {
  params: { id: string }
}

const dashboardComponents = {
  analytics: AnalyticsDashboard,
  performance: PerformanceDashboard,
  security: SecurityDashboard,
  "system-monitoring": SystemMonitorDashboard,
  financial: FinancialDashboard,
  sales: SalesDashboard,
  "iot-devices": IoTDashboard,
  "devops-pipeline": DevOpsDashboard,
  "ecommerce-inventory": EcommerceDashboard,
  "social-analytics": SocialAnalyticsDashboard,
  energy: EnergyDashboard,
}

const dashboardTitles = {
  analytics: "Web Analytics Dashboard",
  performance: "Performance Metrics Dashboard",
  security: "Security Center Dashboard",
  "system-monitoring": "System Monitor Dashboard",
  financial: "Financial Dashboard",
  sales: "Sales Dashboard",
  "iot-devices": "IoT Device Management",
  "devops-pipeline": "DevOps CI/CD Pipeline",
  "ecommerce-inventory": "E-commerce Inventory Dashboard",
  "social-analytics": "Social Media Analytics Dashboard",
  energy: "Energy Management Dashboard",
}

export default function DashboardDetailPage({ params }: DashboardPageProps) {
  const { id } = params

  const DashboardComponent = dashboardComponents[id as keyof typeof dashboardComponents]
  const dashboardTitle = dashboardTitles[id as keyof typeof dashboardTitles]

  if (!DashboardComponent) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <CyberpunkTerminalMenu currentPage="dashboards" />

      {/* Dashboard Header with Navigation */}
      <div className="bg-[#1C1C24] border-b border-green-500/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C940]" />
              </div>
              <h1 className="text-2xl font-bold text-cyan-400 cyber-text-glow">{dashboardTitle}</h1>
            </div>

            <RealtimeStatus />
          </div>

          <DashboardNavigation currentDashboard={id} />
        </div>
      </div>

      {/* Dashboard Content */}
      <DashboardComponent />

      {/* Real-time Notifications */}
      <RealtimeNotifications />
    </div>
  )
}
