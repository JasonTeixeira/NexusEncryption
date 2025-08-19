type JsonValue = any

let secureSet: (key: string, value: string) => Promise<void>
let secureGet: (key: string) => Promise<string | null>
let secureRemove: (key: string) => Promise<void>

const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__

if (isTauri) {
  // Use Tauri Keychain commands
  const init = async () => {
    const { invoke } = await import('@tauri-apps/api/tauri')

    secureSet = async (key, value) => {
      await invoke('keychain_set', { key, value })
    }

    secureGet = async (key) => {
      const res = (await invoke('keychain_get', { key })) as string | null
      return res ?? null
    }

    secureRemove = async (key) => {
      await invoke('keychain_delete', { key })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  init()
} else {
  secureSet = async (key, value) => {
    localStorage.setItem(key, value)
  }
  secureGet = async (key) => {
    const v = localStorage.getItem(key)
    return v === null ? null : v
  }
  secureRemove = async (key) => {
    localStorage.removeItem(key)
  }
}

export const SecureStore = {
  async setJSON(key: string, value: JsonValue): Promise<void> {
    await secureSet(key, JSON.stringify(value))
  },
  async getJSON<T = JsonValue>(key: string): Promise<T | null> {
    const txt = await secureGet(key)
    if (txt == null) return null
    try {
      return JSON.parse(txt) as T
    } catch (_) {
      return null
    }
  },
  async remove(key: string): Promise<void> {
    await secureRemove(key)
  },
}
