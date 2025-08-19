"use client"

import { useEntry } from "@/contexts/entry-context"
import TerminalEntry from "@/components/terminal-entry"
import CyberpunkHomeTerminal from "@/components/cyberpunk-home-terminal"
import { MatrixRain } from "@/components/advanced-effects"

export default function HomePage() {
  const { hasAccess, grantAccess } = useEntry()

  if (!hasAccess) {
    return <TerminalEntry onAccessGranted={grantAccess} siteName="NEXUS ARCHITECT" />
  }

  return (
    <div className="relative">
      {/* Matrix Rain Effect on ALL pages */}
      <MatrixRain intensity={0.3} />
      <CyberpunkHomeTerminal />
    </div>
  )
}
