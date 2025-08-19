export const Logger = {
  async logError(message: string, details?: unknown) {
    try {
      const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__
      if (!isTauri) {
        console.error('[NexusCipher]', message, details)
        return
      }
      const { BaseDirectory, createDir, readTextFile, writeTextFile } = await import('@tauri-apps/api/fs')
      try {
        await createDir('logs', { dir: BaseDirectory.App, recursive: true })
      } catch (_) {}

      const logPath = 'logs/app.log'
      const prev = await readTextFile(logPath, { dir: BaseDirectory.App }).catch(() => '')
      const line = `${new Date().toISOString()} ERROR ${message} ${details ? JSON.stringify(details) : ''}`
      const next = prev ? `${prev}\n${line}` : line
      await writeTextFile(logPath, next, { dir: BaseDirectory.App })
    } catch (_) {
      // swallow
    }
  },
}
