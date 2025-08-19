"use client"

import { useState, useEffect } from "react"
import { Monitor, Cpu, HardDrive, Wifi, Server, AlertTriangle, CheckCircle } from "lucide-react"

interface SystemData {
  cpu: {
    usage: number
    cores: number
    temperature: number
    processes: number
  }
  memory: {
    used: number
    total: number
    cached: number
    buffers: number
  }
  disk: {
    used: number
    total: number
    iops: number
    throughput: number
  }
  network: {
    inbound: number
    outbound: number
    connections: number
    packets: number
  }
  services: Array<{
    name: string
    status: "running" | "stopped" | "error"
    uptime: string
    memory: number
  }>
  alerts: Array<{
    level: "info" | "warning" | "critical"
    message: string
    timestamp: string
  }>
}

const generateMockSystemData = (): SystemData => {
  return {
    cpu: {
      usage: Math.random() * 40 + 20, // 20-60%
      cores: 8,
      temperature: Math.random() * 20 + 45, // 45-65°C
      processes: Math.floor(Math.random() * 50 + 150), // 150-200
    },
    memory: {
      used: Math.random() * 8 + 4, // 4-12 GB
      total: 16,
      cached: Math.random() * 2 + 1, // 1-3 GB
      buffers: Math.random() * 0.5 + 0.2, // 0.2-0.7 GB
    },
    disk: {
      used: Math.random() * 200 + 300, // 300-500 GB
      total: 1000,
      iops: Math.floor(Math.random() * 500 + 100), // 100-600
      throughput: Math.random() * 100 + 50, // 50-150 MB/s
    },
    network: {
      inbound: Math.random() * 50 + 10, // 10-60 Mbps
      outbound: Math.random() * 30 + 5, // 5-35 Mbps
      connections: Math.floor(Math.random() * 500 + 200), // 200-700
      packets: Math.floor(Math.random() * 10000 + 5000), // 5k-15k pps
    },
    services: [
      {
        name: "nginx",
        status: Math.random() > 0.1 ? "running" : "error",
        uptime: "15d 4h 23m",
        memory: Math.random() * 50 + 20,
      },
      {
        name: "postgresql",
        status: Math.random() > 0.05 ? "running" : "error",
        uptime: "15d 4h 20m",
        memory: Math.random() * 200 + 100,
      },
      {
        name: "redis",
        status: "running",
        uptime: "15d 4h 18m",
        memory: Math.random() * 100 + 50,
      },
      {
        name: "docker",
        status: "running",
        uptime: "15d 4h 25m",
        memory: Math.random() * 300 + 200,
      },
      {
        name: "prometheus",
        status: Math.random() > 0.15 ? "running" : "stopped",
        uptime: "2d 8h 15m",
        memory: Math.random() * 150 + 80,
      },
    ],
    alerts: [
      {
        level: Math.random() > 0.7 ? "warning" : "info",
        message: "High CPU usage detected on core 3",
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      },
      {
        level: "info",
        message: "Backup completed successfully",
        timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
      },
      {
        level: Math.random() > 0.9 ? "critical" : "warning",
        message: "Disk space usage above 80%",
        timestamp: new Date(Date.now() - Math.random() * 1800000).toISOString(),
      },
    ],
  }
}

export default function SystemMonitorDashboard() {
  const [data, setData] = useState<SystemData>(generateMockSystemData())
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData(generateMockSystemData())
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-400"
      case "stopped":
        return "text-yellow-400"
      case "error":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="w-4 h-4" />
      case "stopped":
      case "error":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getAlertColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-400 border-red-400/30 bg-red-400/5"
      case "warning":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
      case "info":
        return "text-blue-400 border-blue-400/30 bg-blue-400/5"
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/5"
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-400/10 rounded-lg border border-green-400/30">
              <Monitor className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-400 cyber-text-glow">System Monitor</h1>
              <p className="text-gray-400">Real-time server and infrastructure monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-sm text-gray-400">{isLive ? "MONITORING" : "PAUSED"}</span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-4 py-2 bg-gray-800 border border-green-500/20 rounded text-sm hover:border-green-400/50 transition-colors"
            >
              {isLive ? "Pause" : "Resume"}
            </button>
          </div>
        </div>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* CPU */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span className="text-sm text-gray-400">{data.cpu.cores} cores</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-cyan-400">{data.cpu.usage.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">CPU Usage</div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-cyan-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${data.cpu.usage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {data.cpu.temperature.toFixed(1)}°C • {data.cpu.processes} processes
            </div>
          </div>
        </div>

        {/* Memory */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Server className="w-6 h-6 text-green-400" />
            <span className="text-sm text-gray-400">{data.memory.total}GB total</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-400">{data.memory.used.toFixed(1)}GB</div>
            <div className="text-sm text-gray-400">Memory Used</div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(data.memory.used / data.memory.total) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {data.memory.cached.toFixed(1)}GB cached • {data.memory.buffers.toFixed(1)}GB buffers
            </div>
          </div>
        </div>

        {/* Disk */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <HardDrive className="w-6 h-6 text-yellow-400" />
            <span className="text-sm text-gray-400">{data.disk.total}GB total</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-yellow-400">{data.disk.used.toFixed(0)}GB</div>
            <div className="text-sm text-gray-400">Disk Used</div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(data.disk.used / data.disk.total) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {data.disk.iops} IOPS • {data.disk.throughput.toFixed(0)} MB/s
            </div>
          </div>
        </div>

        {/* Network */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Wifi className="w-6 h-6 text-purple-400" />
            <span className="text-sm text-gray-400">{data.network.connections} conn</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-400">{data.network.inbound.toFixed(1)}Mbps</div>
            <div className="text-sm text-gray-400">Network In</div>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">In</div>
                <div className="w-full bg-gray-800 rounded-full h-1">
                  <div
                    className="bg-purple-400 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${(data.network.inbound / 100) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Out</div>
                <div className="w-full bg-gray-800 rounded-full h-1">
                  <div
                    className="bg-pink-400 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${(data.network.outbound / 100) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {data.network.outbound.toFixed(1)}Mbps out • {data.network.packets.toLocaleString()} pps
            </div>
          </div>
        </div>
      </div>

      {/* Services and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Services Status */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">Service Status</h3>
          <div className="space-y-4">
            {data.services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                  </div>
                  <div>
                    <div className="font-mono text-sm">{service.name}</div>
                    <div className="text-xs text-gray-500">Uptime: {service.uptime}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">{service.memory.toFixed(0)}MB</div>
                  <div className="text-xs text-gray-500">Memory</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">Recent Alerts</h3>
          <div className="space-y-3">
            {data.alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded border ${getAlertColor(alert.level)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{alert.message}</div>
                    <div className="text-xs opacity-75 mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                  </div>
                  <div className="text-xs uppercase font-mono px-2 py-1 rounded bg-black/20">{alert.level}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Usage Chart */}
      <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg mb-8">
        <h3 className="text-lg font-bold text-cyan-400 mb-6">Resource Usage Timeline</h3>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-sm text-gray-400 mb-2">CPU Usage</div>
            <div className="h-16 flex items-end justify-between gap-1">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cyan-400/20 border-t-2 border-cyan-400 transition-all duration-500"
                  style={{
                    height: `${Math.random() * 80 + 20}%`,
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-2">Memory Usage</div>
            <div className="h-16 flex items-end justify-between gap-1">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-green-400/20 border-t-2 border-green-400 transition-all duration-500"
                  style={{
                    height: `${Math.random() * 60 + 40}%`,
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-2">Network I/O</div>
            <div className="h-16 flex items-end justify-between gap-1">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-purple-400/20 border-t-2 border-purple-400 transition-all duration-500"
                  style={{
                    height: `${Math.random() * 70 + 30}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-4 bg-gray-900/50 border border-green-500/20 rounded-lg font-mono text-sm">
        <div className="text-green-400 mb-2">$ htop --live-monitoring</div>
        <div className="space-y-1 text-gray-400">
          <div>[{new Date().toISOString()}] INFO: System monitoring active</div>
          <div>
            [{new Date().toISOString()}] INFO: CPU: {data.cpu.usage.toFixed(1)}% | MEM: {data.memory.used.toFixed(1)}GB
            | DISK: {((data.disk.used / data.disk.total) * 100).toFixed(1)}%
          </div>
          <div>
            [{new Date().toISOString()}] INFO: Network: ↓{data.network.inbound.toFixed(1)}Mbps ↑
            {data.network.outbound.toFixed(1)}Mbps
          </div>
          <div className="text-green-400 animate-pulse">_</div>
        </div>
      </div>
    </div>
  )
}
