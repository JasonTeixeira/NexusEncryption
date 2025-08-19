"use client"

import { useState, useCallback } from "react"
import { EnterpriseManager } from "../lib/enterprise-manager"

interface UseClipboardOptions {
  successMessage?: string
  errorMessage?: string
  resetDelay?: number
}

export const useClipboard = ({
  successMessage = "Copied to clipboard!",
  errorMessage = "Failed to copy to clipboard",
  resetDelay = 2000,
}: UseClipboardOptions = {}) => {
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setError(null)

        EnterpriseManager.logActivity("clipboard_copy", `Data copied to clipboard (${text.length} characters)`)

        setTimeout(() => setIsCopied(false), resetDelay)
        return true
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : errorMessage
        setError(errorMsg)
        EnterpriseManager.handleError("Clipboard copy failed", err)

        setTimeout(() => setError(null), resetDelay)
        return false
      }
    },
    [errorMessage, resetDelay],
  )

  return {
    copyToClipboard,
    isCopied,
    error,
    reset: () => {
      setIsCopied(false)
      setError(null)
    },
  }
}
