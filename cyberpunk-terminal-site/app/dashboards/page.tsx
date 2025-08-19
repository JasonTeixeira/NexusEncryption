"use client"

import { useEntry } from "@/contexts/entry-context"
import TerminalEntry from "@/components/terminal-entry"
import CyberpunkDashboardsTerminal from "@/components/cyberpunk-dashboards-terminal"
import CyberpunkTerminalMenu from "@/components/cyberpunk-terminal-menu"
import { MatrixRain } from "@/components/advanced-effects"

export default function DashboardsPage() {
  const { hasAccess, grantAccess } = useEntry()

  if (!hasAccess) {
    return <TerminalEntry onAccessGranted={grantAccess} siteName="DASHBOARDS - NEXUS ARCHITECT" />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono relative">
      {/* Matrix Rain Effect on ALL pages */}
      <MatrixRain intensity={0.3} />
      <CyberpunkTerminalMenu currentPage="dashboards" />
      <CyberpunkDashboardsTerminal />
    </div>
  )
}