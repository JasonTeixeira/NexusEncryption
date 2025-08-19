"use client"

import { useState } from "react"
import CyberpunkSearch from "./cyberpunk-search"

export default function SearchCommand() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsSearchOpen(true)}
        className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm"
        title="Open search (Ctrl+K)"
      >
        search --help
      </button>
      <CyberpunkSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
