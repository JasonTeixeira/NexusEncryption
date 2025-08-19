"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BarChart3,
  Activity,
  Shield,
  Monitor,
  DollarSign,
  TrendingUp,
  Cpu,
  GitBranch,
  Package,
  Users,
  ChevronDown,
  ExternalLink,
} from "lucide-react"

interface DashboardNavigationProps {
  currentDashboard: string
}

const dashboards = [
  { id: "analytics", name: "Web Analytics", icon: BarChart3, color: "cyan" },
  { id: "performance", name: "Performance", icon: Activity, color: "purple" },
  { id: "security", name: "Security Center", icon: Shield, color: "red" },
  { id: "system-monitoring", name: "System Monitor", icon: Monitor, color: "green" },
  { id: "financial", name: "Financial", icon: DollarSign, color: "yellow" },
  { id: "sales", name: "Sales", icon: TrendingUp, color: "pink" },
  { id: "iot-devices", name: "IoT Devices", icon: Cpu, color: "blue" },
  { id: "devops-pipeline", name: "DevOps Pipeline", icon: GitBranch, color: "orange" },
  { id: "ecommerce-inventory", name: "E-commerce", icon: Package, color: "emerald" },
  { id: "social-analytics", name: "Social Media", icon: Users, color: "pink" },
]

export default function DashboardNavigation({ currentDashboard }: DashboardNavigationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  const currentDash = dashboards.find((d) => d.id === currentDashboard)
  const otherDashboards = dashboards.filter((d) => d.id !== currentDashboard)

  const getColorClasses = (color: string) => {
    const colorMap = {
      cyan: "text-cyan-400 border-cyan-400/30 bg-cyan-400/5 hover:bg-cyan-400/10",
      purple: "text-purple-400 border-purple-400/30 bg-purple-400/5 hover:bg-purple-400/10",
      red: "text-red-400 border-red-400/30 bg-red-400/5 hover:bg-red-400/10",
      green: "text-green-400 border-green-400/30 bg-green-400/5 hover:bg-green-400/10",
      yellow: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5 hover:bg-yellow-400/10",
      pink: "text-pink-400 border-pink-400/30 bg-pink-400/5 hover:bg-pink-400/10",
      blue: "text-blue-400 border-blue-400/30 bg-blue-400/5 hover:bg-blue-400/10",
      orange: "text-orange-400 border-orange-400/30 bg-orange-400/5 hover:bg-orange-400/10",
      emerald: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5 hover:bg-emerald-400/10",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.cyan
  }

  return (
    <div className="flex items-center justify-between">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboards"
          className="flex items-center gap-2 px-3 py-2 rounded border border-green-500/20 text-gray-400 hover:text-green-400 hover:border-green-400/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">All Dashboards</span>
        </Link>

        <div className="text-gray-500">/</div>

        {currentDash && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded border ${getColorClasses(currentDash.color)}`}>
            <currentDash.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{currentDash.name}</span>
          </div>
        )}
      </div>

      {/* Dashboard Switcher */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded border border-green-500/20 text-gray-300 hover:text-green-400 hover:border-green-400/50 transition-colors"
        >
          <span className="text-sm">Switch Dashboard</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-green-500/20 rounded-lg shadow-xl z-50">
            <div className="p-2">
              <div className="text-xs text-gray-400 px-3 py-2 font-medium">Available Dashboards</div>
              {otherDashboards.map((dashboard) => (
                <Link
                  key={dashboard.id}
                  href={`/dashboards/${dashboard.id}`}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded transition-colors
                    hover:bg-gray-800 text-gray-300 hover:text-gray-100
                  `}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <dashboard.icon className={`w-4 h-4 text-${dashboard.color}-400`} />
                  <span className="text-sm">{dashboard.name}</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
