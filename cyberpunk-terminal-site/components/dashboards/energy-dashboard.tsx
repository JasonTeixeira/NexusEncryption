"use client"

import { useState, useEffect } from "react"
import { useDashboardRealtime } from "@/hooks/use-dashboard-realtime"

interface EnergyMetrics {
  totalConsumption: number
  renewablePercentage: number
  carbonFootprint: number
  costSavings: number
  gridStatus: string
  batteryLevel: number
  solarGeneration: number
  windGeneration: number
  peakDemand: number
  efficiency: number
}

interface EnergySource {
  id: string
  name: string
  type: "solar" | "wind" | "hydro" | "nuclear" | "coal" | "gas"
  capacity: number
  currentOutput: number
  efficiency: number
  status: "online" | "offline" | "maintenance"
  location: string
}

export default function EnergyDashboard() {
  const [metrics, setMetrics] = useState<EnergyMetrics>({
    totalConsumption: 2847.5,
    renewablePercentage: 68.3,
    carbonFootprint: 1.2,
    costSavings: 45600,
    gridStatus: "stable",
    batteryLevel: 87,
    solarGeneration: 1245.8,
    windGeneration: 698.2,
    peakDemand: 3200,
    efficiency: 94.2,
  })

  const [energySources, setEnergySources] = useState<EnergySource[]>([
    {
      id: "solar-1",
      name: "Solar Farm Alpha",
      type: "solar",
      capacity: 1500,
      currentOutput: 1245.8,
      efficiency: 83.1,
      status: "online",
      location: "Nevada Desert",
    },
    {
      id: "wind-1",
      name: "Wind Farm Beta",
      type: "wind",
      capacity: 800,
      currentOutput: 698.2,
      efficiency: 87.3,
      status: "online",
      location: "Texas Plains",
    },
    {
      id: "hydro-1",
      name: "Hydro Plant Gamma",
      type: "hydro",
      capacity: 600,
      currentOutput: 542.1,
      efficiency: 90.4,
      status: "online",
      location: "Colorado River",
    },
    {
      id: "nuclear-1",
      name: "Nuclear Plant Delta",
      type: "nuclear",
      capacity: 2000,
      currentOutput: 1800,
      efficiency: 90.0,
      status: "online",
      location: "Arizona",
    },
  ])

  // Real-time data updates
  const { data: realtimeData } = useDashboardRealtime("energy")

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        totalConsumption: prev.totalConsumption + (Math.random() - 0.5) * 50,
        renewablePercentage: Math.max(0, Math.min(100, prev.renewablePercentage + (Math.random() - 0.5) * 2)),
        batteryLevel: Math.max(0, Math.min(100, prev.batteryLevel + (Math.random() - 0.5) * 3)),
        solarGeneration: Math.max(0, prev.solarGeneration + (Math.random() - 0.5) * 100),
        windGeneration: Math.max(0, prev.windGeneration + (Math.random() - 0.5) * 50),
        efficiency: Math.max(80, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 1)),
      }))

      setEnergySources((prev) =>
        prev.map((source) => ({
          ...source,
          currentOutput: Math.max(0, Math.min(source.capacity, source.currentOutput + (Math.random() - 0.5) * 50)),
          efficiency: Math.max(70, Math.min(100, source.efficiency + (Math.random() - 0.5) * 2)),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getSourceColor = (type: string) => {
    switch (type) {
      case "solar":
        return "text-yellow-400"
      case "wind":
        return "text-blue-400"
      case "hydro":
        return "text-cyan-400"
      case "nuclear":
        return "text-purple-400"
      case "coal":
        return "text-gray-400"
      case "gas":
        return "text-orange-400"
      default:
        return "text-green-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400"
      case "offline":
        return "text-red-400"
      case "maintenance":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Energy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1C1C24] border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Total Consumption</h3>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-green-400 mb-2">{metrics.totalConsumption.toFixed(1)} MW</div>
          <div className="text-xs text-gray-500">Real-time usage</div>
        </div>

        <div className="bg-[#1C1C24] border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Renewable Energy</h3>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 mb-2">{metrics.renewablePercentage.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Of total generation</div>
        </div>

        <div className="bg-[#1C1C24] border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Battery Storage</h3>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mb-2">{metrics.batteryLevel}%</div>
          <div className="text-xs text-gray-500">Grid storage level</div>
        </div>

        <div className="bg-[#1C1C24] border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Grid Efficiency</h3>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-2">{metrics.efficiency.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">System efficiency</div>
        </div>
      </div>

      {/* Energy Sources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1C1C24] border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-green-400 mb-4 cyber-text-glow">Energy Sources</h3>
          <div className="space-y-4">
            {energySources.map((source) => (
              <div key={source.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getSourceColor(source.type)} animate-pulse`} />
                    <span className="font-medium text-gray-200">{source.name}</span>
                  </div>
                  <span className={`text-sm ${getStatusColor(source.status)} font-medium`}>
                    {source.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Output: </span>
                    <span className="text-green-400">{source.currentOutput.toFixed(1)} MW</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Efficiency: </span>
                    <span className="text-cyan-400">{source.efficiency.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Capacity: </span>
                    <span className="text-gray-200">{source.capacity} MW</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Location: </span>
                    <span className="text-gray-200">{source.location}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Load</span>
                    <span>{((source.currentOutput / source.capacity) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getSourceColor(source.type).replace("text-", "bg-")}`}
                      style={{ width: `${(source.currentOutput / source.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1C1C24] border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-green-400 mb-4 cyber-text-glow">Energy Analytics</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Generation Mix</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">Solar</span>
                  <span className="text-gray-200">{metrics.solarGeneration.toFixed(1)} MW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-400">Wind</span>
                  <span className="text-gray-200">{metrics.windGeneration.toFixed(1)} MW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">Hydro</span>
                  <span className="text-gray-200">542.1 MW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-400">Nuclear</span>
                  <span className="text-gray-200">1800.0 MW</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Environmental Impact</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Carbon Footprint</span>
                  <span className="text-green-400">{metrics.carbonFootprint} tons CO₂/MWh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Cost Savings</span>
                  <span className="text-green-400">${metrics.costSavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Peak Demand</span>
                  <span className="text-yellow-400">{metrics.peakDemand} MW</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Grid Status</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 font-medium">STABLE</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">All systems operational</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Energy Flow */}
      <div className="bg-[#1C1C24] border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-green-400 mb-4 cyber-text-glow">Real-time Energy Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {(metrics.solarGeneration + metrics.windGeneration + 542.1).toFixed(1)} MW
            </div>
            <div className="text-sm text-gray-400">Renewable Generation</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{metrics.totalConsumption.toFixed(1)} MW</div>
            <div className="text-sm text-gray-400">Current Demand</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {(metrics.solarGeneration + metrics.windGeneration + 542.1 + 1800 - metrics.totalConsumption).toFixed(1)}{" "}
              MW
            </div>
            <div className="text-sm text-gray-400">Grid Balance</div>
          </div>
        </div>
      </div>
    </div>
  )
}
