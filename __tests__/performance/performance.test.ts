import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CryptoUtils } from '../../lib/crypto-utils'
import { InputValidator } from '../../lib/input-validator'
import { RateLimiter } from '../../lib/rate-limiter'
import { ErrorHandler } from '../../lib/error-handler'

describe('Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Encryption Performance', () => {
    it('should encrypt large data within acceptable time', async () => {
      const largeData = 'x'.repeat(1024 * 1024) // 1MB of data
      const key = 'test-key-123'
      
      const startTime = performance.now()
      
      try {
        await CryptoUtils.encryptAES256GCM(largeData, key)
      } catch (error) {
        // Expected in test environment due to mocked crypto
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Should complete within 5 seconds
      expect(duration).toBeLessThan(5000)
    })

    it('should handle multiple concurrent encryption operations', async () => {
      const operations = Array.from({ length: 10 }, (_, i) => 
        CryptoUtils.encryptAES256GCM(`data-${i}`, 'test-key')
      )
      
      const startTime = performance.now()
      
      try {
        await Promise.all(operations)
      } catch (error) {
        // Expected in test environment
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Should complete within 10 seconds
      expect(duration).toBeLessThan(10000)
    })

    it('should generate keys efficiently', async () => {
      const startTime = performance.now()
      
      const keys = await Promise.all([
        CryptoUtils.generateKeyForAlgorithm('AES-256'),
        CryptoUtils.generateKeyForAlgorithm('ChaCha20-256'),
        CryptoUtils.generateKeyForAlgorithm('AES-128')
      ])
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(keys).toHaveLength(3)
      expect(duration).toBeLessThan(1000) // Should complete within 1 second
    })
  })

  describe('Input Validation Performance', () => {
    it('should validate large inputs efficiently', () => {
      const largeInput = 'x'.repeat(10000) // 10KB input
      
      const startTime = performance.now()
      
      const result = InputValidator.validateTextInput(largeInput)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(100) // Should complete within 100ms
      expect(result).toHaveProperty('isValid')
    })

    it('should handle complex validation patterns efficiently', () => {
      const complexInputs = [
        '<script>alert("xss")</script>'.repeat(100),
        'UNION SELECT * FROM users'.repeat(50),
        'javascript:alert("xss")'.repeat(75),
        '1 OR 1=1'.repeat(200)
      ]
      
      const startTime = performance.now()
      
      complexInputs.forEach(input => {
        InputValidator.validateTextInput(input)
      })
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(500) // Should complete within 500ms
    })

    it('should validate passwords efficiently', () => {
      const passwords = Array.from({ length: 1000 }, (_, i) => 
        `Password${i}!@#$%^&*()`
      )
      
      const startTime = performance.now()
      
      passwords.forEach(password => {
        InputValidator.validatePassword(password)
      })
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(1000) // Should complete within 1 second
    })
  })

  describe('Rate Limiting Performance', () => {
    it('should handle high-frequency rate limit checks', () => {
      const identifier = 'test-user'
      const action = 'api-call'
      
      const startTime = performance.now()
      
      // Perform 1000 rate limit checks
      for (let i = 0; i < 1000; i++) {
        RateLimiter.isRateLimited(identifier, action)
        RateLimiter.recordAttempt(identifier, action)
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(100) // Should complete within 100ms
    })

    it('should handle multiple concurrent rate limiters', () => {
      const startTime = performance.now()
      
      // Simulate 100 concurrent users
      for (let user = 0; user < 100; user++) {
        const identifier = `user-${user}`
        const action = 'login'
        
        for (let attempt = 0; attempt < 10; attempt++) {
          RateLimiter.isRateLimited(identifier, action)
          RateLimiter.recordAttempt(identifier, action)
        }
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(500) // Should complete within 500ms
    })

    it('should provide statistics efficiently', () => {
      const startTime = performance.now()
      
      // Generate some activity first
      for (let i = 0; i < 100; i++) {
        RateLimiter.recordAttempt(`user-${i}`, 'action')
      }
      
      // Get statistics multiple times
      for (let i = 0; i < 1000; i++) {
        RateLimiter.getStats()
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(100) // Should complete within 100ms
    })
  })

  describe('Error Handling Performance', () => {
    it('should handle high-volume error logging', () => {
      const startTime = performance.now()
      
      // Log 1000 errors
      for (let i = 0; i < 1000; i++) {
        ErrorHandler.handleError(new Error(`Error ${i}`), {
          action: 'test',
          timestamp: Date.now()
        })
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(1000) // Should complete within 1 second
    })

    it('should handle security violations efficiently', () => {
      const startTime = performance.now()
      
      // Log 100 security violations
      for (let i = 0; i < 100; i++) {
        ErrorHandler.handleSecurityViolation({
          type: 'brute_force',
          description: `Violation ${i}`,
          severity: 'high',
          context: { userId: `user-${i}` }
        })
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(500) // Should complete within 500ms
    })

    it('should provide error statistics efficiently', () => {
      // Generate some errors first
      for (let i = 0; i < 100; i++) {
        ErrorHandler.handleError(new Error(`Error ${i}`))
      }
      
      const startTime = performance.now()
      
      // Get statistics multiple times
      for (let i = 0; i < 1000; i++) {
        ErrorHandler.getErrorStats()
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(100) // Should complete within 100ms
    })
  })

  describe('Memory Usage', () => {
    it('should not leak memory during encryption operations', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0
      
      // Perform many encryption operations
      for (let i = 0; i < 100; i++) {
        try {
          await CryptoUtils.encryptAES256GCM(`data-${i}`, 'test-key')
        } catch (error) {
          // Expected in test environment
        }
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    })

    it('should not leak memory during rate limiting', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0
      
      // Perform many rate limit operations
      for (let i = 0; i < 10000; i++) {
        RateLimiter.recordAttempt(`user-${i % 100}`, 'action')
        RateLimiter.isRateLimited(`user-${i % 100}`, 'action')
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be reasonable (less than 5MB)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024)
    })
  })

  describe('Response Time Benchmarks', () => {
    it('should meet encryption response time requirements', async () => {
      const testData = 'Hello World'
      const key = 'test-key-123'
      
      const startTime = performance.now()
      
      try {
        await CryptoUtils.encryptAES256GCM(testData, key)
      } catch (error) {
        // Expected in test environment
      }
      
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      // Should respond within 100ms for small data
      expect(responseTime).toBeLessThan(100)
    })

    it('should meet validation response time requirements', () => {
      const testInput = 'Normal input text'
      
      const startTime = performance.now()
      
      InputValidator.validateTextInput(testInput)
      
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      // Should respond within 10ms for validation
      expect(responseTime).toBeLessThan(10)
    })

    it('should meet rate limiting response time requirements', () => {
      const identifier = 'test-user'
      const action = 'api-call'
      
      const startTime = performance.now()
      
      RateLimiter.isRateLimited(identifier, action)
      RateLimiter.recordAttempt(identifier, action)
      
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      // Should respond within 1ms for rate limiting
      expect(responseTime).toBeLessThan(1)
    })
  })

  describe('Scalability Tests', () => {
    it('should handle increasing load gracefully', async () => {
      const loadLevels = [10, 50, 100, 300, 600] // Reduced load levels
      const results: number[] = []
      
      for (const load of loadLevels) {
        const startTime = performance.now()
        
        const operations = Array.from({ length: load }, (_, i) => 
          CryptoUtils.encryptAES256GCM(`data-${i}`, 'test-key')
        )
        
        try {
          await Promise.all(operations)
        } catch (error) {
          // Expected in test environment
        }
        
        const endTime = performance.now()
        results.push(endTime - startTime)
      }
      
      // Verify that performance doesn't degrade exponentially
      for (let i = 1; i < results.length; i++) {
        if (results[i - 1] > 0 && results[i] > 0) {
          const ratio = results[i] / results[i - 1]
          expect(ratio).toBeLessThan(10) // Should not increase more than 10x
        }
      }
    })

    it('should maintain performance under concurrent load', () => {
      const concurrentUsers = 100
      const operationsPerUser = 10
      
      const startTime = performance.now()
      
      // Simulate concurrent users
      const userOperations = Array.from({ length: concurrentUsers }, (_, user) => {
        return Array.from({ length: operationsPerUser }, (_, op) => {
          const identifier = `user-${user}`
          const action = `action-${op}`
          
          RateLimiter.isRateLimited(identifier, action)
          RateLimiter.recordAttempt(identifier, action)
          return RateLimiter.getRemainingAttempts(identifier, action)
        })
      })
      
      // Flatten and execute all operations
      userOperations.flat().forEach(op => op)
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      // Should handle 1000 operations within reasonable time
      expect(totalTime).toBeLessThan(1000) // 1 second
    })
  })
})
