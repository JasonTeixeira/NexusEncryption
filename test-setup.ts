import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock crypto API for consistent testing
Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: vi.fn((array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    }),
    subtle: {
      generateKey: vi.fn(),
      deriveKey: vi.fn(),
      encrypt: vi.fn(),
      decrypt: vi.fn(),
      importKey: vi.fn(),
      exportKey: vi.fn(),
      digest: vi.fn()
    }
  },
  writable: true
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
})

// Mock fetch
global.fetch = vi.fn()

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(),
    readText: vi.fn()
  },
  writable: true
})

// Mock service worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn(),
    getRegistration: vi.fn(),
    getRegistrations: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  },
  writable: true
})

// Mock notifications
global.Notification = class Notification {
  constructor(title: string, options?: NotificationOptions) {
    this.title = title
    this.options = options
  }
  
  title: string
  options?: NotificationOptions
  
  static permission = 'granted'
  static requestPermission = vi.fn().mockResolvedValue('granted')
} as any

Object.defineProperty(Notification, 'permission', {
  value: 'granted',
  writable: true
})

Object.defineProperty(Notification, 'requestPermission', {
  value: vi.fn().mockResolvedValue('granted'),
  writable: true
})

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => [])
  },
  writable: true
})

// Mock console methods to reduce noise in tests
const originalConsole = { ...console }
beforeAll(() => {
  console.warn = vi.fn()
  console.error = vi.fn()
})

afterAll(() => {
  console.warn = originalConsole.warn
  console.error = originalConsole.error
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
})

// Global test utilities
global.testUtils = {
  mockCrypto: {
    generateKey: (algorithm: string, extractable: boolean, keyUsages: string[]) => {
      return Promise.resolve({
        type: 'secret',
        extractable,
        algorithm: { name: algorithm },
        usages: keyUsages
      })
    },
    deriveKey: (algorithm: any, baseKey: any, derivedKeyAlgorithm: any, extractable: boolean, keyUsages: string[]) => {
      return Promise.resolve({
        type: 'secret',
        extractable,
        algorithm: derivedKeyAlgorithm,
        usages: keyUsages
      })
    },
    encrypt: (algorithm: any, key: any, data: any) => {
      return Promise.resolve(new ArrayBuffer(32))
    },
    decrypt: (algorithm: any, key: any, data: any) => {
      return Promise.resolve(new TextEncoder().encode('decrypted data'))
    },
    importKey: (format: string, keyData: any, algorithm: any, extractable: boolean, keyUsages: string[]) => {
      return Promise.resolve({
        type: 'secret',
        extractable,
        algorithm,
        usages: keyUsages
      })
    },
    exportKey: (format: string, key: any) => {
      return Promise.resolve(new ArrayBuffer(32))
    },
    digest: (algorithm: string, data: any) => {
      return Promise.resolve(new ArrayBuffer(32))
    }
  },
  mockStorage: {
    localStorage: localStorageMock,
    sessionStorage: sessionStorageMock
  },
  mockFetch: (response: any, status = 200) => {
    return vi.mocked(fetch).mockResolvedValueOnce({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      headers: new Headers(),
      clone: () => ({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
        headers: new Headers()
      })
    } as Response)
  }
}

// Type declarations for global test utilities
declare global {
  var testUtils: {
    mockCrypto: {
      generateKey: (algorithm: string, extractable: boolean, keyUsages: string[]) => Promise<any>
      deriveKey: (algorithm: any, baseKey: any, derivedKeyAlgorithm: any, extractable: boolean, keyUsages: string[]) => Promise<any>
      encrypt: (algorithm: any, key: any, data: any) => Promise<ArrayBuffer>
      decrypt: (algorithm: any, key: any, data: any) => Promise<Uint8Array>
      importKey: (format: string, keyData: any, algorithm: any, extractable: boolean, keyUsages: string[]) => Promise<any>
      exportKey: (format: string, key: any) => Promise<ArrayBuffer>
      digest: (algorithm: string, data: any) => Promise<ArrayBuffer>
    }
    mockStorage: {
      localStorage: typeof localStorageMock
      sessionStorage: typeof sessionStorageMock
    }
    mockFetch: (response: any, status?: number) => void
  }
}
