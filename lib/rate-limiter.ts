interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
  blockUntil: number
}

export class RateLimiter {
  private static limits = new Map<string, RateLimitEntry>()
  private static readonly CLEANUP_INTERVAL = 60000 // 1 minute
  private static readonly MAX_ATTEMPTS = 5
  private static readonly WINDOW_MS = 60000 // 1 minute
  private static readonly BLOCK_DURATION = 300000 // 5 minutes

  static isRateLimited(identifier: string, action: string): boolean {
    const key = `${identifier}:${action}`
    const now = Date.now()
    const entry = this.limits.get(key)

    // Clean up expired entries
    if (entry && now > entry.resetTime) {
      this.limits.delete(key)
    }

    // Check if currently blocked
    if (entry?.blocked && now < entry.blockUntil) {
      return true
    }

    // If blocked time expired, reset
    if (entry?.blocked && now >= entry.blockUntil) {
      this.limits.delete(key)
    }

    return false
  }

  static recordAttempt(identifier: string, action: string): void {
    const key = `${identifier}:${action}`
    const now = Date.now()
    const entry = this.limits.get(key) || {
      count: 0,
      resetTime: now + this.WINDOW_MS,
      blocked: false,
      blockUntil: 0
    }

    // Reset if window expired
    if (now > entry.resetTime) {
      entry.count = 0
      entry.resetTime = now + this.WINDOW_MS
      entry.blocked = false
    }

    entry.count++

    // Block if too many attempts
    if (entry.count >= this.MAX_ATTEMPTS) {
      entry.blocked = true
      entry.blockUntil = now + this.BLOCK_DURATION
    }

    this.limits.set(key, entry)
  }

  static getRemainingAttempts(identifier: string, action: string): number {
    const key = `${identifier}:${action}`
    const entry = this.limits.get(key)
    
    if (!entry) return this.MAX_ATTEMPTS
    
    const now = Date.now()
    if (now > entry.resetTime) return this.MAX_ATTEMPTS
    
    return Math.max(0, this.MAX_ATTEMPTS - entry.count)
  }

  static getBlockTimeRemaining(identifier: string, action: string): number {
    const key = `${identifier}:${action}`
    const entry = this.limits.get(key)
    
    if (!entry?.blocked) return 0
    
    const now = Date.now()
    return Math.max(0, entry.blockUntil - now)
  }

  static clearLimits(identifier: string, action?: string): void {
    if (action) {
      this.limits.delete(`${identifier}:${action}`)
    } else {
      // Clear all limits for this identifier
      for (const key of this.limits.keys()) {
        if (key.startsWith(`${identifier}:`)) {
          this.limits.delete(key)
        }
      }
    }
  }

  static getStats(): {
    totalEntries: number
    blockedEntries: number
    activeEntries: number
  } {
    const now = Date.now()
    let blocked = 0
    let active = 0

    for (const entry of this.limits.values()) {
      if (entry.blocked && now < entry.blockUntil) {
        blocked++
      } else if (now < entry.resetTime) {
        active++
      }
    }

    return {
      totalEntries: this.limits.size,
      blockedEntries: blocked,
      activeEntries: active
    }
  }

  // Cleanup expired entries
  static cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime && now > entry.blockUntil) {
        this.limits.delete(key)
      }
    }
  }
}

// Start cleanup interval
if (typeof window !== 'undefined') {
  setInterval(() => RateLimiter.cleanup(), 60000) // 1 minute
}
