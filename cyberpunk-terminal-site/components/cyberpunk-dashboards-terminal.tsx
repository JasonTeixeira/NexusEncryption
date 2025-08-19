"use client"

import type React from "react"

import { useState } from "react"
import { useSound } from "@/contexts/sound-context"
import { useAccessibility } from "@/components/accessibility-provider"
import {
  Search,
  Grid,
  List,
  Monitor,
  BarChart3,
  Shield,
  Cpu,
  DollarSign,
  Activity,
  Zap,
  Database,
  Globe,
  TrendingUp,
  GitBranch,
  Package,
  Users,
} from "lucide-react"
import DataStreamMonitor from "@/components/dashboards/data-stream-monitor"

interface DashboardType {
  id: string
  name: string
  category: string
  description: string
  icon: React.ReactNode
  color: string
  metrics: {
    primary: string
    secondary: string
    trend: string
  }
  status: "live" | "demo" | "coming-soon"
}

const dashboardTypes: DashboardType[] = [
  {
    id: "analytics",
    name: "Web Analytics",
    category: "Analytics",
    description: "Real-time website traffic and user behavior analysis",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "cyan",
    metrics: { primary: "127K", secondary: "8.4K", trend: "+12%" },
    status: "live",
  },
  {
    id: "system-monitoring",
    name: "System Monitor",
    category: "Infrastructure",
    description: "Server performance and infrastructure monitoring",
    icon: <Monitor className="w-6 h-6" />,
    color: "green",
    metrics: { primary: "99.9%", secondary: "2.1ms", trend: "+0.2%" },
    status: "live",
  },
  {
    id: "security",
    name: "Security Center",
    category: "Security",
    description: "Threat detection and security incident monitoring",
    icon: <Shield className="w-6 h-6" />,
    color: "red",
    metrics: { primary: "847", secondary: "12", trend: "-5%" },
    status: "live",
  },
  {
    id: "financial",
    name: "Financial Dashboard",
    category: "Business",
    description: "Revenue tracking and financial performance metrics",
    icon: <DollarSign className="w-6 h-6" />,
    color: "yellow",
    metrics: { primary: "$42.8K", secondary: "$8.2K", trend: "+18%" },
    status: "demo",
  },
  {
    id: "performance",
    name: "Performance Metrics",
    category: "Performance",
    description: "Application performance and Core Web Vitals tracking",
    icon: <Activity className="w-6 h-6" />,
    color: "purple",
    metrics: { primary: "0.8s", secondary: "95", trend: "+3%" },
    status: "live",
  },
  {
    id: "iot",
    name: "IoT Dashboard",
    category: "IoT",
    description: "Internet of Things device monitoring and control",
    icon: <Cpu className="w-6 h-6" />,
    color: "blue",
    metrics: { primary: "1,247", secondary: "98.2%", trend: "+0.8%" },
    status: "demo",
  },
  {
    id: "energy",
    name: "Energy Monitor",
    category: "Utilities",
    description: "Power consumption and energy efficiency tracking",
    icon: <Zap className="w-6 h-6" />,
    color: "orange",
    metrics: { primary: "2.4kW", secondary: "87%", trend: "-12%" },
    status: "demo",
  },
  {
    id: "database",
    name: "Database Monitor",
    category: "Infrastructure",
    description: "Database performance and query optimization metrics",
    icon: <Database className="w-6 h-6" />,
    color: "indigo",
    metrics: { primary: "1.2ms", secondary: "99.8%", trend: "+0.1%" },
    status: "live",
  },
  {
    id: "network",
    name: "Network Monitor",
    category: "Infrastructure",
    description: "Network traffic and connectivity monitoring",
    icon: <Globe className="w-6 h-6" />,
    color: "teal",
    metrics: { primary: "847GB", secondary: "12ms", trend: "+5%" },
    status: "live",
  },
  {
    id: "sales",
    name: "Sales Dashboard",
    category: "Business",
    description: "Sales performance and conversion tracking",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "pink",
    metrics: { primary: "342", secondary: "24.8%", trend: "+22%" },
    status: "demo",
  },
  {
    id: "iot-devices",
    name: "IoT Device Management",
    category: "IoT",
    description: "Internet of Things device monitoring and control system",
    icon: <Cpu className="w-6 h-6" />,
    color: "blue",
    metrics: { primary: "1,247", secondary: "98.2%", trend: "+0.8%" },
    status: "live",
  },
  {
    id: "devops-pipeline",
    name: "DevOps CI/CD Pipeline",
    category: "DevOps",
    description: "Continuous integration and deployment pipeline monitoring",
    icon: <GitBranch className="w-6 h-6" />,
    color: "orange",
    metrics: { primary: "94%", secondary: "8m 32s", trend: "+2%" },
    status: "live",
  },
  {
    id: "ecommerce-inventory",
    name: "E-commerce Inventory",
    category: "E-commerce",
    description: "Product inventory and order management dashboard",
    icon: <Package className="w-6 h-6" />,
    color: "emerald",
    metrics: { primary: "2,847", secondary: "156", trend: "+15%" },
    status: "demo",
  },
  {
    id: "social-analytics",
    name: "Social Media Analytics",
    category: "Marketing",
    description: "Social media engagement and performance tracking",
    icon: <Users className="w-6 h-6" />,
    color: "pink",
    metrics: { primary: "847K", secondary: "12.4%", trend: "+8%" },
    status: "demo",
  },
]

export default function CyberpunkDashboardsTerminal() {
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDataMonitor, setShowDataMonitor] = useState(false)

  const { playCommand, playSuccess, playError } = useSound()
  const { settings } = useAccessibility() || {}
  const safeSettings = settings || {
    highContrast: false,
    fontSize: "normal",
    screenReaderMode: false,
    soundEnabled: true,
  }

  const categories = ["all", ...Array.from(new Set(dashboardTypes.map((d) => d.category)))]

  const filteredDashboards = dashboardTypes.filter((dashboard) => {
    const matchesCategory = selectedCategory === "all" || dashboard.category === selectedCategory
    const matchesSearch =
      dashboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dashboard.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    playCommand()

    if (trimmedCmd === "help") {
      setOutput([
        "Available dashboard commands:",
        "  list                 - Show all dashboards",
        "  filter [category]    - Filter by category",
        "  search [term]        - Search dashboards",
        "  view [grid|list]     - Change view mode",
        "  demo [dashboard-id]  - Launch dashboard demo",
        "  open [dashboard-id]  - Open full dashboard page",
        "  monitor              - Toggle data stream monitor",
        "  streams              - Show active data streams",
        "  clear                - Clear terminal output",
        "  help                 - Show this help message",
      ])
      playSuccess()
    } else if (trimmedCmd.startsWith("open ")) {
      const dashboardId = trimmedCmd.replace("open ", "")
      const dashboard = dashboardTypes.find((d) => d.id === dashboardId)
      if (dashboard) {
        setOutput([`Opening ${dashboard.name}...`, "Redirecting to full dashboard view..."])
        setTimeout(() => {
          window.location.href = `/dashboards/${dashboardId}`
        }, 1000)
        playSuccess()
      } else {
        setOutput([`Dashboard not found: ${dashboardId}`])
        playError()
      }
    } else if (trimmedCmd === "monitor") {
      setShowDataMonitor(!showDataMonitor)
      setOutput([`Data stream monitor ${showDataMonitor ? "hidden" : "shown"}`])
      playSuccess()
    } else if (trimmedCmd === "streams") {
      // This would show stream info - integrated with the monitor
      setShowDataMonitor(true)
      setOutput(["Data stream monitor activated"])
      playSuccess()
    } else if (trimmedCmd === "list") {
      setOutput([
        `Found ${filteredDashboards.length} dashboards:`,
        ...filteredDashboards.map((d) => `  ${d.id.padEnd(20)} - ${d.name} (${d.status})`),
      ])
      playSuccess()
    } else if (trimmedCmd.startsWith("filter ")) {
      const category = trimmedCmd.replace("filter ", "")
      if (categories.includes(category)) {
        setSelectedCategory(category)
        setOutput([`Filtered to category: ${category}`])
        playSuccess()
      } else {
        setOutput([`Unknown category: ${category}`, `Available: ${categories.join(", ")}`])
        playError()
      }
    } else if (trimmedCmd.startsWith("search ")) {
      const term = trimmedCmd.replace("search ", "")
      setSearchTerm(term)
      setOutput([`Searching for: ${term}`])
      playSuccess()
    } else if (trimmedCmd === "view grid" || trimmedCmd === "view list") {
      const mode = trimmedCmd.split(" ")[1] as "grid" | "list"
      setViewMode(mode)
      setOutput([`View mode changed to: ${mode}`])
      playSuccess()
    } else if (trimmedCmd === "clear") {
      setOutput([])
      playSuccess()
    } else if (trimmedCmd.startsWith("demo ")) {
      const dashboardId = trimmedCmd.replace("demo ", "")
      const dashboard = dashboardTypes.find((d) => d.id === dashboardId)
      if (dashboard) {
        setIsLoading(true)
        setOutput([`Launching ${dashboard.name} demo...`, "Initializing mock data streams..."])
        setTimeout(() => {
          setOutput((prev) => [...prev, `${dashboard.name} demo ready!`, "Real-time data stream activated"])
          setIsLoading(false)
          playSuccess()
        }, 2000)
      } else {
        setOutput([`Dashboard not found: ${dashboardId}`])
        playError()
      }
    } else if (trimmedCmd === "") {
      // Empty command, do nothing
    } else {
      setOutput([`Command not found: ${trimmedCmd}`, "Type 'help' for available commands"])
      playError()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (command.trim()) {
      handleCommand(command)
      setCommand("")
    }
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      cyan: "border-cyan-400/30 bg-cyan-400/5 text-cyan-400",
      green: "border-green-400/30 bg-green-400/5 text-green-400",
      red: "border-red-400/30 bg-red-400/5 text-red-400",
      yellow: "border-yellow-400/30 bg-yellow-400/5 text-yellow-400",
      purple: "border-purple-400/30 bg-purple-400/5 text-purple-400",
      blue: "border-blue-400/30 bg-blue-400/5 text-blue-400",
      orange: "border-orange-400/30 bg-orange-400/5 text-orange-400",
      indigo: "border-indigo-400/30 bg-indigo-400/5 text-indigo-400",
      teal: "border-teal-400/30 bg-teal-400/5 text-teal-400",
      pink: "border-pink-400/30 bg-pink-400/5 text-pink-400",
      emerald: "border-emerald-400/30 bg-emerald-400/5 text-emerald-400",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.cyan
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Terminal Header */}
      <div className="bg-[#1C1C24] border-b border-green-500/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C940]" />
            </div>
            <h1 className="text-2xl font-bold text-cyan-400 cyber-text-glow">DASHBOARD SHOWCASE</h1>
          </div>

          <div className="text-gray-400 text-sm mb-6">
            <div>$ cd /var/www/nexus-architect/dashboards</div>
            <div className="text-cyan-400">nexus@architect:~/dashboards$ _</div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded border transition-colors ${
                    viewMode === "grid"
                      ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
                      : "border-green-500/20 text-gray-400 hover:text-cyan-400"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded border transition-colors ${
                    viewMode === "list"
                      ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
                      : "border-green-500/20 text-gray-400 hover:text-cyan-400"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDataMonitor(!showDataMonitor)}
                  className={`p-2 rounded border transition-colors ${
                    showDataMonitor
                      ? "border-purple-400/50 bg-purple-400/10 text-purple-400"
                      : "border-green-500/20 text-gray-400 hover:text-purple-400"
                  }`}
                  title="Toggle Data Stream Monitor"
                >
                  <Database className="w-4 h-4" />
                </button>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-900 border border-green-500/20 rounded px-3 py-2 text-sm text-gray-300 focus:border-cyan-400/50 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search dashboards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900 border border-green-500/20 rounded px-3 py-2 text-sm text-gray-300 focus:border-cyan-400/50 focus:outline-none w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Stream Monitor Section */}
      {showDataMonitor && (
        <div className="max-w-7xl mx-auto p-6">
          <DataStreamMonitor />
        </div>
      )}

      {/* Dashboard Grid/List */}
      <div className="max-w-7xl mx-auto p-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className={`
                  relative p-6 rounded-lg border transition-all duration-300 cursor-pointer
                  hover:scale-105 hover:shadow-lg hover:shadow-${dashboard.color}-400/20
                  ${getColorClasses(dashboard.color)}
                  ${isLoading ? "animate-pulse" : ""}
                `}
                onClick={() => (window.location.href = `/dashboards/${dashboard.id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded bg-${dashboard.color}-400/10`}>{dashboard.icon}</div>
                  <div
                    className={`
                    px-2 py-1 rounded text-xs font-mono
                    ${
                      dashboard.status === "live"
                        ? "bg-green-400/20 text-green-400"
                        : dashboard.status === "demo"
                          ? "bg-yellow-400/20 text-yellow-400"
                          : "bg-gray-400/20 text-gray-400"
                    }
                  `}
                  >
                    {dashboard.status.toUpperCase()}
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2">{dashboard.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{dashboard.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Primary</span>
                    <span className="font-mono font-bold">{dashboard.metrics.primary}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Secondary</span>
                    <span className="font-mono">{dashboard.metrics.secondary}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Trend</span>
                    <span
                      className={`font-mono text-sm ${
                        dashboard.metrics.trend.startsWith("+") ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {dashboard.metrics.trend}
                    </span>
                  </div>
                </div>

                {/* Glitch effect overlay */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className={`
                  flex items-center justify-between p-4 rounded-lg border transition-all duration-300 cursor-pointer
                  hover:shadow-lg hover:shadow-${dashboard.color}-400/20
                  ${getColorClasses(dashboard.color)}
                `}
                onClick={() => (window.location.href = `/dashboards/${dashboard.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded bg-${dashboard.color}-400/10`}>{dashboard.icon}</div>
                  <div>
                    <h3 className="font-bold">{dashboard.name}</h3>
                    <p className="text-gray-400 text-sm">{dashboard.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-mono font-bold">{dashboard.metrics.primary}</div>
                    <div className="text-xs text-gray-500">{dashboard.metrics.secondary}</div>
                  </div>
                  <div
                    className={`
                    px-2 py-1 rounded text-xs font-mono
                    ${
                      dashboard.status === "live"
                        ? "bg-green-400/20 text-green-400"
                        : dashboard.status === "demo"
                          ? "bg-yellow-400/20 text-yellow-400"
                          : "bg-gray-400/20 text-gray-400"
                    }
                  `}
                  >
                    {dashboard.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terminal Command Interface */}
      <div className="bg-[#1C1C24] border-t border-green-500/20 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Terminal Output */}
          {output.length > 0 && (
            <div className="mb-4 p-4 bg-gray-900/50 rounded border border-green-500/20 font-mono text-sm">
              {output.map((line, index) => (
                <div key={index} className="text-green-400 animate-terminalFadeIn">
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Command Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-green-400 font-mono">$</span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Type 'help' for commands, 'monitor' for data streams, or 'demo analytics'..."
              className="flex-1 bg-transparent border-none outline-none text-gray-300 font-mono placeholder-gray-500"
              autoFocus
            />
            <span className="text-green-400 animate-pulse">_</span>
          </form>

          <div className="mt-4 text-xs text-gray-500 font-mono">
            Tip: Use 'monitor' to view data streams, 'demo [dashboard-id]' to launch demos, or click dashboard cards
          </div>
        </div>
      </div>
    </div>
  )
}
