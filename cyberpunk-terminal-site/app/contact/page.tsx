"use client"

import { useEntry } from "@/contexts/entry-context"
import TerminalEntry from "@/components/terminal-entry"
import CyberpunkContactTerminal from "@/components/cyberpunk-contact-terminal"
import { MatrixRain } from "@/components/advanced-effects"

export default function ContactPage() {
  const { hasAccess, grantAccess } = useEntry()

  if (!hasAccess) {
    return <TerminalEntry onAccessGranted={grantAccess} siteName="CONTACT - NEXUS ARCHITECT" />
  }

  return (
    <div className="relative">
      {/* Matrix Rain Effect on ALL pages */}
      <MatrixRain intensity={0.3} />
      <CyberpunkContactTerminal />
    </div>
  )
}