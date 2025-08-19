'use client'

import { useEffect, useState } from 'react'

export default function TauriUpdater() {
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    // Only run in Tauri
    const isTauri = typeof (window as any).__TAURI__ !== 'undefined'
    if (!isTauri) return

    ;(async () => {
      try {
        const { checkUpdate, installUpdate } = (window as any).__TAURI__.updater
        const { shouldUpdate, manifest } = await checkUpdate()
        if (shouldUpdate) {
          setStatus(`Downloading ${manifest?.version}...`)
          await installUpdate()
          setStatus('Update installed. Restarting...')
        }
      } catch (err) {
        console.warn('Updater error', err)
      }
    })()
  }, [])

  if (!status) return null
  return null
}


