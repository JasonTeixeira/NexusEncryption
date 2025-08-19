"use client"

import { useState, useEffect } from "react"
import { Cpu, Thermometer, Zap, Wifi, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"

interface IoTDevice {
  id: string
  name: string
  type: "sensor" | "actuator" | "gateway" | "controller"
  status: "online" | "offline" | "warning" | "error"
  location: string
  lastSeen: string
  battery?: number
  temperature?: number
  humidity?: number
  power?: number
  signal?: number
}

export default function IoTDashboard() {
  const [devices, setDevices] = useState<IoTDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null)
  const [totalDevices, setTotalDevices] = useState(0)
  const [onlineDevices, setOnlineDevices] = useState(0)
  const [alerts, setAlerts] = useState(0)

  useEffect(() => {
    // Generate mock IoT devices
    const generateDevices = (): IoTDevice[] => {
      const deviceTypes = ["sensor", "actuator", "gateway", "controller"] as const
      const locations = [
        "Building A",
        "Building B",
        "Warehouse",
        "Parking Lot",
        "Server Room",
        "Office Floor 1",
        "Office Floor 2",
      ]
      const statuses = ["online", "offline", "warning", "error"] as const

      return Array.from({ length: 24 }, (_, i) => ({
        id: `device-${i + 1}`,
        name: `IoT Device ${i + 1}`,
        type: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        lastSeen: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
        battery: Math.floor(Math.random() * 100),
        temperature: Math.floor(Math.random() * 40) + 15,
        humidity: Math.floor(Math.random() * 60) + 30,
        power: Math.random() * 100,
        signal: Math.floor(Math.random() * 100),
      }))
    }

    const updateDevices = () => {
      const newDevices = generateDevices()
      setDevices(newDevices)
      setTotalDevices(newDevices.length)
      setOnlineDevices(newDevices.filter((d) => d.status === "online").length)
      setAlerts(newDevices.filter((d) => d.status === "warning" || d.status === "error").length)
    }

    updateDevices()
    const interval = setInterval(updateDevices, 3000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "offline":
        return <XCircle className="w-4 h-4 text-gray-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400 border-green-400/30 bg-green-400/5"
      case "offline":
        return "text-gray-400 border-gray-400/30 bg-gray-400/5"
      case "warning":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
      case "error":
        return "text-red-400 border-red-400/30 bg-red-400/5"
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/5"
    }
  }

  return (
    <div className="p-6 bg-gray-950 text-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C940]" />
          </div>
          <h1 className="text-2xl font-bold text-blue-400 cyber-text-glow">IoT DEVICE MANAGEMENT</h1>
        </div>

        <div className="text-gray-400 text-sm mb-6">
          <div>$ iot-manager --status --real-time</div>
          <div className="text-blue-400">iot@nexus:~/devices$ monitoring {totalDevices} devices across 7 locations</div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-blue-400/5 border border-blue-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Cpu className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-blue-400 font-mono">TOTAL</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{totalDevices}</div>
          <div className="text-sm text-gray-400">Connected Devices</div>
        </div>

        <div className="p-4 bg-green-400/5 border border-green-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span className="text-xs text-green-400 font-mono">ONLINE</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{onlineDevices}</div>
          <div className="text-sm text-gray-400">Active Devices</div>
        </div>

        <div className="p-4 bg-red-400/5 border border-red-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <span className="text-xs text-red-400 font-mono">ALERTS</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{alerts}</div>
          <div className="text-sm text-gray-400">Require Attention</div>
        </div>

        <div className="p-4 bg-purple-400/5 border border-purple-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Wifi className="w-6 h-6 text-purple-400" />
            <span className="text-xs text-purple-400 font-mono">UPTIME</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">98.7%</div>
          <div className="text-sm text-gray-400">Network Uptime</div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device List */}
        <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">Device Status</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {devices.map((device) => (
              <div
                key={device.id}
                className={`p-3 rounded border cursor-pointer transition-all hover:scale-[1.02] ${getStatusColor(device.status)}`}
                onClick={() => setSelectedDevice(device)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(device.status)}
                    <span className="font-mono text-sm">{device.name}</span>
                  </div>
                  <span className="text-xs font-mono">{device.type.toUpperCase()}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {device.location} • Last seen: {device.lastSeen}
                </div>
                {device.battery && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs">
                      <span>Battery</span>
                      <span>{device.battery}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                      <div
                        className={`h-1 rounded-full ${device.battery > 20 ? "bg-green-400" : "bg-red-400"}`}
                        style={{ width: `${device.battery}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Device Details */}
        <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">Device Details</h3>
          {selectedDevice ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(selectedDevice.status)}
                <div>
                  <h4 className="font-bold text-lg">{selectedDevice.name}</h4>
                  <p className="text-gray-400 text-sm">{selectedDevice.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedDevice.temperature && (
                  <div className="p-3 bg-orange-400/5 border border-orange-400/30 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-orange-400">Temperature</span>
                    </div>
                    <div className="text-xl font-bold">{selectedDevice.temperature}°C</div>
                  </div>
                )}

                {selectedDevice.power && (
                  <div className="p-3 bg-yellow-400/5 border border-yellow-400/30 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">Power</span>
                    </div>
                    <div className="text-xl font-bold">{selectedDevice.power.toFixed(1)}W</div>
                  </div>
                )}

                {selectedDevice.signal && (
                  <div className="p-3 bg-purple-400/5 border border-purple-400/30 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Wifi className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-400">Signal</span>
                    </div>
                    <div className="text-xl font-bold">{selectedDevice.signal}%</div>
                  </div>
                )}

                {selectedDevice.humidity && (
                  <div className="p-3 bg-cyan-400/5 border border-cyan-400/30 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 bg-cyan-400 rounded-full" />
                      <span className="text-sm text-cyan-400">Humidity</span>
                    </div>
                    <div className="text-xl font-bold">{selectedDevice.humidity}%</div>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-gray-800/50 rounded border border-gray-600/30">
                <h5 className="font-bold text-green-400 mb-2">Device Information</h5>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Device ID:</span>
                    <span className="text-green-400">{selectedDevice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-green-400">{selectedDevice.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={selectedDevice.status === "online" ? "text-green-400" : "text-red-400"}>
                      {selectedDevice.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Seen:</span>
                    <span className="text-green-400">{selectedDevice.lastSeen}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a device to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
