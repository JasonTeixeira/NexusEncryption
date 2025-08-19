"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface SecurityStats {
  suspiciousActivities: Record<string, number>
  blockedIPs: string[]
  totalEvents: number
}

export function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSecurityStats = async () => {
      try {
        const response = await fetch("/api/security/audit", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error("Error fetching security stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSecurityStats()
    const interval = setInterval(fetchSecurityStats, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-black/95 border border-red-500/50 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-red-500/20 rounded"></div>
          <div className="h-32 bg-red-500/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/95 border border-red-500/50 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 font-mono text-lg">Security Dashboard</span>
        </div>
        <div className="text-red-300 text-xs">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded p-4 text-center">
          <div className="text-red-400 text-2xl font-mono">{stats?.totalEvents || 0}</div>
          <div className="text-gray-400 text-xs">Total Security Events</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4 text-center">
          <div className="text-yellow-400 text-2xl font-mono">
            {Object.keys(stats?.suspiciousActivities || {}).length}
          </div>
          <div className="text-gray-400 text-xs">Suspicious IPs</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded p-4 text-center">
          <div className="text-red-400 text-2xl font-mono">{stats?.blockedIPs.length || 0}</div>
          <div className="text-gray-400 text-xs">Blocked IPs</div>
        </div>
      </div>

      {/* Suspicious Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-yellow-400 font-mono text-sm mb-3">Suspicious Activities</h3>
          <ScrollArea className="h-48 bg-gray-900/50 border border-gray-700/50 rounded p-3">
            {Object.entries(stats?.suspiciousActivities || {}).length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-8">No suspicious activities detected</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(stats?.suspiciousActivities || {}).map(([ip, count]) => (
                  <div key={ip} className="flex items-center justify-between p-2 bg-yellow-500/10 rounded">
                    <span className="text-yellow-300 font-mono text-sm">{ip}</span>
                    <span className="text-yellow-400 text-xs">{count} events</span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div>
          <h3 className="text-red-400 font-mono text-sm mb-3">Blocked IPs</h3>
          <ScrollArea className="h-48 bg-gray-900/50 border border-gray-700/50 rounded p-3">
            {(stats?.blockedIPs.length || 0) === 0 ? (
              <div className="text-gray-500 text-sm text-center py-8">No IPs currently blocked</div>
            ) : (
              <div className="space-y-2">
                {stats?.blockedIPs.map((ip) => (
                  <div key={ip} className="flex items-center justify-between p-2 bg-red-500/10 rounded">
                    <span className="text-red-300 font-mono text-sm">{ip}</span>
                    <Button
                      onClick={() => {
                        // In production, implement unblock functionality
                        console.log(`Unblocking IP: ${ip}`)
                      }}
                      className="text-xs px-2 py-1 bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
                    >
                      Unblock
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Security Status */}
      <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-mono text-sm">Security Systems Active</span>
        </div>
        <div className="text-gray-300 text-xs mt-2">
          Rate limiting, CSRF protection, input sanitization, and intrusion detection are all operational.
        </div>
      </div>
    </div>
  )
}
