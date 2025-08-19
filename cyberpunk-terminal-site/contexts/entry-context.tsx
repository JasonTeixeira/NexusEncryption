"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface EntryContextType {
  hasAccess: boolean
  grantAccess: () => void
}

const EntryContext = createContext<EntryContextType | undefined>(undefined)

export function EntryProvider({ children }: { children: React.ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false)

  const grantAccess = () => {
    setHasAccess(true)
  }

  return <EntryContext.Provider value={{ hasAccess, grantAccess }}>{children}</EntryContext.Provider>
}

export function useEntry() {
  const context = useContext(EntryContext)
  if (context === undefined) {
    throw new Error("useEntry must be used within an EntryProvider")
  }
  return context
}
