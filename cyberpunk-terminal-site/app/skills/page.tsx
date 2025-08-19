"use client"

import { useEntry } from "@/contexts/entry-context"
import TerminalEntry from "@/components/terminal-entry"
import CyberpunkSkillsTerminal from "@/components/cyberpunk-skills-terminal"
import { MatrixRain } from "@/components/advanced-effects"

export default function SkillsPage() {
  const { hasAccess, grantAccess } = useEntry()

  if (!hasAccess) {
    return <TerminalEntry onAccessGranted={grantAccess} siteName="SKILLS - NEXUS ARCHITECT" />
  }

  return (
    <div className="relative">
      {/* Matrix Rain Effect on ALL pages */}
      <MatrixRain intensity={0.3} />
      <CyberpunkSkillsTerminal />
    </div>
  )
}