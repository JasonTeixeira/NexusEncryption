"use client"

import { useEntry } from "@/contexts/entry-context"
import TerminalEntry from "@/components/terminal-entry"
import CyberpunkAboutTerminal from "@/components/cyberpunk-about-terminal"
import { MatrixRain } from "@/components/advanced-effects"

export default function AboutPage() {
  const { hasAccess, grantAccess } = useEntry()

  if (!hasAccess) {
    return <TerminalEntry onAccessGranted={grantAccess} siteName="ABOUT - NEXUS ARCHITECT" />
  }

  return (
    <div className="relative">
      {/* Matrix Rain Effect on ALL pages */}
      <MatrixRain intensity={0.3} />
      <CyberpunkAboutTerminal />
    </div>
  )
}
