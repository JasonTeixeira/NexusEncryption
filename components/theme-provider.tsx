'use client'

import * as React from 'react'

export function ThemeProvider({ children, ..._props }: { children: React.ReactNode; [key: string]: unknown }) {
  return <>{children}</>
}
