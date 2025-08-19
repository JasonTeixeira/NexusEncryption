"use client"

import { useEntry } from "@/contexts/entry-context"
import TerminalEntry from "@/components/terminal-entry"
import CyberpunkProjectsTerminal from "@/components/cyberpunk-projects-terminal"
import { MatrixRain } from "@/components/advanced-effects"

export default function ProjectsPage() {
  const { hasAccess, grantAccess } = useEntry()

  if (!hasAccess) {
    return <TerminalEntry onAccessGranted={grantAccess} siteName="PROJECTS - NEXUS ARCHITECT" />
  }

  return (
    <div className="relative">
      {/* Matrix Rain Effect on ALL pages */}
      <MatrixRain intensity={0.3} />
      <CyberpunkProjectsTerminal />
    </div>
  )
}
