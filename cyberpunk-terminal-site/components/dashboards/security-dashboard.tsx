"use client"

import { useState, useEffect } from "react"
import { Shield, AlertTriangle, Eye, Lock, Zap, Globe, Server, Users } from "lucide-react"

interface SecurityData {
  threats: {
    blocked: number
    detected: number
    quarantined: number
    trend: number
  }
  firewall: {
    blocked: number
    allowed: number
    rules: number
    countries: number
  }
  authentication: {
    successful: number
    failed: number
    suspicious: number
    mfa: number
  }
  vulnerabilities: {
    critical: number
    high: number
    medium: number
    low: number
  }
  incidents: Array<{
    id: string
    type: "intrusion" | "malware" | "ddos" | "brute-force" | "suspicious"
    severity: "low" | "medium" | "high" | "critical"
    source: string
    target: string
    timestamp: string
    status: "active" | "investigating" | "resolved"
  }>
  geoThreats: Array<{
    country: string
    attempts: number
    blocked: number
  }>
}

const generateMockSecurityData = (): SecurityData => {
  return {
    threats: {
      blocked: Math.floor(Math.random() * 500 + 1200),
      detected: Math.floor(Math.random() * 100 + 50),
      quarantined: Math.floor(Math.random() * 20 + 5),
      trend: Math.random() * 30 - 10,
    },
    firewall: {
      blocked: Math.floor(Math.random() * 10000 + 5000),
      allowed: Math.floor(Math.random() * 50000 + 100000),
      rules: 247,
      countries: Math.floor(Math.random() * 20 + 45),
    },
    authentication: {
      successful: Math.floor(Math.random() * 5000 + 8000),
      failed: Math.floor(Math.random() * 200 + 50),
      suspicious: Math.floor(Math.random() * 30 + 10),
      mfa: Math.floor(Math.random() * 3000 + 6000),
    },
    vulnerabilities: {
      critical: Math.floor(Math.random() * 3 + 1),
      high: Math.floor(Math.random() * 8 + 2),
      medium: Math.floor(Math.random() * 15 + 5),
      low: Math.floor(Math.random() * 25 + 10),
    },
    incidents: [
      {
        id: "INC-2024-001",
        type: Math.random() > 0.5 ? "intrusion" : "brute-force",
        severity: Math.random() > 0.7 ? "high" : "medium",
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        target: "/admin/login",
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        status: Math.random() > 0.6 ? "resolved" : "investigating",
      },
      {
        id: "INC-2024-002",
        type: "ddos",
        severity: Math.random() > 0.8 ? "critical" : "high",
        source: "Multiple IPs",
        target: "api.example.com",
        timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
        status: "active",
      },
      {
        id: "INC-2024-003",
        type: "malware",
        severity: "medium",
        source: "email-attachment",
        target: "user@company.com",
        timestamp: new Date(Date.now() - Math.random() * 1800000).toISOString(),
        status: "resolved",
      },
    ],
    geoThreats: [
      {
        country: "CN",
        attempts: Math.floor(Math.random() * 1000 + 500),
        blocked: Math.floor(Math.random() * 800 + 400),
      },
      {
        country: "RU",
        attempts: Math.floor(Math.random() * 800 + 300),
        blocked: Math.floor(Math.random() * 600 + 250),
      },
      { country: "US", attempts: Math.floor(Math.random() * 200 + 50), blocked: Math.floor(Math.random() * 150 + 30) },
      { country: "BR", attempts: Math.floor(Math.random() * 300 + 100), blocked: Math.floor(Math.random() * 250 + 80) },
      {
        country: "IN",
        attempts: Math.floor(Math.random() * 400 + 150),
        blocked: Math.floor(Math.random() * 300 + 100),
      },
    ],
  }
}

export default function SecurityDashboard() {
  const [data, setData] = useState<SecurityData>(generateMockSecurityData())
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData(generateMockSecurityData())
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 border-red-400/30 bg-red-400/5"
      case "high":
        return "text-orange-400 border-orange-400/30 bg-orange-400/5"
      case "medium":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
      case "low":
        return "text-blue-400 border-blue-400/30 bg-blue-400/5"
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/5"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-red-400"
      case "investigating":
        return "text-yellow-400"
      case "resolved":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "intrusion":
        return <Eye className="w-4 h-4" />
      case "malware":
        return <Zap className="w-4 h-4" />
      case "ddos":
        return <Globe className="w-4 h-4" />
      case "brute-force":
        return <Lock className="w-4 h-4" />
      case "suspicious":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-400/10 rounded-lg border border-red-400/30">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-red-400 cyber-text-glow">Security Center</h1>
              <p className="text-gray-400">Threat detection and security monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? "bg-red-400 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-sm text-gray-400">{isLive ? "MONITORING" : "PAUSED"}</span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-4 py-2 bg-gray-800 border border-green-500/20 rounded text-sm hover:border-red-400/50 transition-colors"
            >
              {isLive ? "Pause" : "Resume"}
            </button>
          </div>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-6 h-6 text-red-400" />
            <span className={`text-sm font-mono ${data.threats.trend >= 0 ? "text-red-400" : "text-green-400"}`}>
              {data.threats.trend >= 0 ? "↗" : "↘"} {Math.abs(data.threats.trend).toFixed(1)}%
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-red-400">{data.threats.blocked.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Threats Blocked</div>
            <div className="text-xs text-gray-500">
              {data.threats.detected} detected • {data.threats.quarantined} quarantined
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Server className="w-6 h-6 text-orange-400" />
            <span className="text-sm text-gray-400">{data.firewall.rules} rules</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-orange-400">{data.firewall.blocked.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Firewall Blocks</div>
            <div className="text-xs text-gray-500">
              {data.firewall.allowed.toLocaleString()} allowed • {data.firewall.countries} countries
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-6 h-6 text-green-400" />
            <span className="text-sm text-gray-400">
              {((data.authentication.mfa / data.authentication.successful) * 100).toFixed(0)}% MFA
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-400">{data.authentication.successful.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Auth Success</div>
            <div className="text-xs text-gray-500">
              {data.authentication.failed} failed • {data.authentication.suspicious} suspicious
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <span className="text-sm text-gray-400">
              {data.vulnerabilities.critical +
                data.vulnerabilities.high +
                data.vulnerabilities.medium +
                data.vulnerabilities.low}{" "}
              total
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-yellow-400">{data.vulnerabilities.critical}</div>
            <div className="text-sm text-gray-400">Critical Vulns</div>
            <div className="text-xs text-gray-500">
              {data.vulnerabilities.high} high • {data.vulnerabilities.medium} medium • {data.vulnerabilities.low} low
            </div>
          </div>
        </div>
      </div>

      {/* Security Incidents and Geo Threats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Incidents */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">Security Incidents</h3>
          <div className="space-y-4">
            {data.incidents.map((incident) => (
              <div key={incident.id} className={`p-4 rounded border ${getSeverityColor(incident.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(incident.type)}
                    <span className="font-mono text-sm">{incident.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs uppercase font-mono px-2 py-1 rounded bg-black/20`}>
                      {incident.severity}
                    </span>
                    <span
                      className={`text-xs uppercase font-mono px-2 py-1 rounded bg-black/20 ${getStatusColor(incident.status)}`}
                    >
                      {incident.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm capitalize mb-1">{incident.type.replace("-", " ")} Attack</div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Source: {incident.source}</div>
                  <div>Target: {incident.target}</div>
                  <div>Time: {new Date(incident.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Threats */}
        <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-cyan-400 mb-6">Geographic Threats</h3>
          <div className="space-y-4">
            {data.geoThreats.map((threat) => (
              <div
                key={threat.country}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                    {threat.country}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{threat.attempts.toLocaleString()} attempts</div>
                    <div className="text-xs text-gray-500">{threat.blocked.toLocaleString()} blocked</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-red-400">
                    {((threat.blocked / threat.attempts) * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500">blocked</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threat Timeline */}
      <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-lg mb-8">
        <h3 className="text-lg font-bold text-cyan-400 mb-6">Threat Activity (24h)</h3>
        <div className="h-32 flex items-end justify-between gap-1">
          {Array.from({ length: 24 }, (_, i) => {
            const threats = Math.floor(Math.random() * 100 + 20)
            const blocked = Math.floor(threats * (Math.random() * 0.3 + 0.7))
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-full gap-1">
                  <div
                    className="w-full bg-red-400/20 border-t-2 border-red-400 transition-all duration-500"
                    style={{ height: `${(threats / 120) * 100}%`, minHeight: "4px" }}
                    title={`${threats} threats detected`}
                  />
                  <div
                    className="w-full bg-green-400/20 border-t-2 border-green-400 transition-all duration-500"
                    style={{ height: `${(blocked / 120) * 100}%`, minHeight: "2px" }}
                    title={`${blocked} threats blocked`}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{23 - i}:00</div>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400/20 border border-red-400" />
            <span className="text-gray-400">Threats Detected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400/20 border border-green-400" />
            <span className="text-gray-400">Threats Blocked</span>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-4 bg-gray-900/50 border border-green-500/20 rounded-lg font-mono text-sm">
        <div className="text-green-400 mb-2">$ security-monitor --real-time</div>
        <div className="space-y-1 text-gray-400">
          <div>[{new Date().toISOString()}] INFO: Security monitoring active</div>
          <div>
            [{new Date().toISOString()}] ALERT: {data.threats.blocked} threats blocked in last hour
          </div>
          <div>
            [{new Date().toISOString()}] INFO: {data.vulnerabilities.critical} critical vulnerabilities detected
          </div>
          <div className="text-red-400 animate-pulse">_</div>
        </div>
      </div>
    </div>
  )
}
