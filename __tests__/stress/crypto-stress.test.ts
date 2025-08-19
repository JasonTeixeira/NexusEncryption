import { describe, it, expect } from 'vitest'
import { CryptoUtils } from '../../lib/crypto-utils'

function randomString(len: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[];:\"|,.<>/?'
  let out = ''
  for (let i = 0; i < len; i++) out += chars.charAt(Math.floor(Math.random() * chars.length))
  return out
}

describe('Heavy Load Stress - Crypto', () => {
  it('performs 2000 encrypt/decrypt operations in batches under threshold', async () => {
    const operations = 2000
    const batchSize = 100
    const batches = Math.ceil(operations / batchSize)

    const key = 'K'.repeat(64)
    const start = Date.now()

    for (let b = 0; b < batches; b++) {
      const tasks: Promise<void>[] = []
      for (let i = 0; i < batchSize; i++) {
        const msg = randomString(64 + Math.floor(Math.random() * 4096))
        tasks.push(
          (async () => {
            const enc = await CryptoUtils.encryptAES256GCM(msg, key)
            const dec = await CryptoUtils.decryptAES256GCM({
              ciphertext: enc.ciphertext,
              salt: enc.salt,
              iv: enc.iv,
              password: key,
              algorithm: 'AES-256-GCM'
            })
            expect(dec).toBe(msg)
          })()
        )
      }
      await Promise.all(tasks)
    }

    const elapsedMs = Date.now() - start
    // Very generous threshold to avoid flakiness on CI
    expect(elapsedMs).toBeLessThan(60000)
  }, 120000)
})


