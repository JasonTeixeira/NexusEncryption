'use client'

import { useEffect } from 'react'

export default function TauriLinkHandler() {
  useEffect(() => {
    const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__
    if (!isTauri) return

    let shellOpen: ((url: string) => Promise<void>) | null = null

    import('@tauri-apps/api/shell')
      .then(({ open }) => {
        shellOpen = open
      })
      .catch(() => {})

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a') as HTMLAnchorElement | null
      if (!anchor || !shellOpen) return

      const href = anchor.getAttribute('href') || ''
      if (/^https?:\/\//i.test(href)) {
        e.preventDefault()
        shellOpen(href)
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
