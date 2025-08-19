'use client'

import { useEffect } from 'react'
import { Logger } from '@/lib/logger'

export default function GlobalErrorListener() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      Logger.logError('window.onerror', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack || String(event.error),
      })
    }

    const onUnhandled = (event: PromiseRejectionEvent) => {
      Logger.logError('unhandledrejection', {
        reason: (event.reason && (event.reason.stack || event.reason.message)) || String(event.reason),
      })
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onUnhandled)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onUnhandled)
    }
  }, [])

  return null
}
