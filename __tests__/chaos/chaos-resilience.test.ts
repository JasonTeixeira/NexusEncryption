import { describe, it, expect } from 'vitest'
import { RateLimiter } from '../../lib/rate-limiter'
import { CryptoUtils } from '../../lib/crypto-utils'

describe('Chaos/Resilience', () => {
  it('survives random failures in hashing with retries', async () => {
    const original = CryptoUtils.hashData
    let calls = 0
    // Inject random failure (30%)
    // @ts-expect-error override for chaos
    CryptoUtils.hashData = async (data: string) => {
      calls++
      if (Math.random() < 0.3) throw new Error('Chaos: hash failure')
      return original.call(CryptoUtils, data)
    }

    const inputs = Array.from({ length: 200 }, (_, i) => `payload-${i}`)
    const out: string[] = []

    for (const s of inputs) {
      let attempt = 0
      for (;;) {
        try {
          out.push(await CryptoUtils.hashData(s))
          break
        } catch (e) {
          attempt++
          if (attempt > 5) throw e
        }
      }
    }

    expect(out.length).toBe(inputs.length)
    // restore
    // @ts-expect-error
    CryptoUtils.hashData = original
  })

  it('rate limiter resists burst chaos traffic', () => {
    const id = 'k'
    let allowed = 0
    for (let i = 0; i < 500; i++) {
      if (!RateLimiter.isRateLimited(id, 'test')) {
        RateLimiter.recordAttempt(id, 'test')
        allowed++
      }
    }
    expect(allowed).toBeLessThanOrEqual(5)
  })
})


