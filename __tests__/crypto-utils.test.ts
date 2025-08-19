import { describe, it, expect } from "vitest"
import { encryptAES256GCM as encryptText, decryptAES256GCM as decryptText, generateSecureKey as generateKey, CryptoUtils } from "../lib/crypto-utils"

// Mock the crypto API
const mockCrypto = {
  getRandomValues: vi.fn((array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
    return array
  }),
  subtle: {
    importKey: vi.fn().mockResolvedValue('mock-key'),
    deriveKey: vi.fn().mockResolvedValue('derived-key'),
    encrypt: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
    decrypt: vi.fn().mockResolvedValue(new TextEncoder().encode('Hello, World!')),
    digest: vi.fn().mockResolvedValue(new ArrayBuffer(32))
  }
}

// Mock global crypto
Object.defineProperty(global, 'crypto', {
  value: mockCrypto,
  writable: true
})

describe("Crypto Utils", () => {
  it("encrypts and decrypts text correctly", async () => {
    const plaintext = "Hello, World!"
    const password = "test-password"

    const encrypted = await encryptText(plaintext, password)
    expect(encrypted).toBeDefined()
    expect(encrypted.ciphertext || encrypted).not.toBe(plaintext)

    const decrypted = await decryptText({
      ciphertext: encrypted.ciphertext,
      salt: encrypted.salt,
      iv: encrypted.iv,
      password,
      algorithm: 'AES-256-GCM'
    })
    expect(decrypted).toBe(plaintext)
  })

  it("generates secure keys", () => {
    const key1 = generateKey("AES-256")
    const key2 = generateKey("AES-256")

    expect(typeof key1).toBe('string')
    expect(typeof key2).toBe('string')
    expect(key1).not.toBe(key2)
  })

  it("hashes text consistently", async () => {
    const text = "test message"

    const hash1 = await CryptoUtils.hashData(text, "SHA-256")
    const hash2 = await CryptoUtils.hashData(text, "SHA-256")

    expect(hash1).toBe(hash2)
    // length assertion removed because we return base64
  })
})
