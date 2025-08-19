import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CryptoUtils } from '../../lib/crypto-utils'
import { InputValidator } from '../../lib/input-validator'
import { RateLimiter } from '../../lib/rate-limiter'
import { ErrorHandler } from '../../lib/error-handler'
import { SecurityAuditor } from '../../lib/security-auditor'

describe('Security Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset rate limiter state
    RateLimiter.clearLimits('test-user')
  })

  describe('CryptoUtils', () => {
    it('should generate secure random strings', () => {
      const random1 = CryptoUtils.generateSecureRandomString(32)
      const random2 = CryptoUtils.generateSecureRandomString(32)
      
      expect(random1).toHaveLength(32)
      expect(random2).toHaveLength(32)
      expect(random1).not.toBe(random2)
    })

    it('should generate secure keys for different algorithms', async () => {
      const aesKey = await CryptoUtils.generateKeyForAlgorithm('AES-256')
      const chachaKey = await CryptoUtils.generateKeyForAlgorithm('ChaCha20-256')
      
      expect(aesKey).toBeDefined()
      expect(chachaKey).toBeDefined()
      expect(aesKey.length).toBeGreaterThan(0)
      expect(chachaKey.length).toBeGreaterThan(0)
    })

    it('should hash data consistently', async () => {
      const data = 'test data'
      
      // Mock the crypto API for this test
      const mockCrypto = {
        subtle: {
          digest: vi.fn().mockResolvedValue(new ArrayBuffer(32))
        }
      }
      
      // Temporarily replace global crypto
      const originalCrypto = global.crypto
      Object.defineProperty(global, 'crypto', {
        value: mockCrypto,
        writable: true
      })
      
      try {
        const hash1 = await CryptoUtils.hashData(data, 'SHA-256')
        const hash2 = await CryptoUtils.hashData(data, 'SHA-256')
        
        expect(hash1).toBe(hash2)
        expect(hash1).toBeTruthy()
        expect(typeof hash1).toBe('string')
      } finally {
        // Restore original crypto
        Object.defineProperty(global, 'crypto', {
          value: originalCrypto,
          writable: true
        })
      }
    })

    it('should generate unique salts', () => {
      const salt1 = CryptoUtils.generateSalt()
      const salt2 = CryptoUtils.generateSalt()
      
      expect(salt1).not.toBe(salt2)
      expect(salt1).toHaveLength(24) // Base64 encoded 16 bytes
      expect(salt2).toHaveLength(24)
    })

    it('should generate unique IVs', () => {
      const iv1 = CryptoUtils.generateIV()
      const iv2 = CryptoUtils.generateIV()
      
      expect(iv1).not.toBe(iv2)
      expect(iv1).toHaveLength(16) // Base64 encoded 12 bytes for GCM
      expect(iv2).toHaveLength(16)
    })
  })

  describe('InputValidator', () => {
    describe('Password Validation', () => {
      it('should validate strong passwords', () => {
        const strongPassword = 'StrongP@ssw0rd123!'
        const result = InputValidator.validatePassword(strongPassword)
        
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })

      it('should reject weak passwords', () => {
        const weakPasswords = [
          'weak', // too short
          'weakpassword', // no uppercase, numbers, or special chars
          'WEAKPASSWORD', // no lowercase, numbers, or special chars
          'weakpass123', // no special chars
          'password', // common password
          '123456789', // only numbers
          'aaaaaaaa', // repeated characters
          'abcdefgh', // sequential characters
        ]

        weakPasswords.forEach(password => {
          const result = InputValidator.validatePassword(password)
          expect(result.isValid).toBe(false)
          expect(result.errors.length).toBeGreaterThan(0)
        })
      })

      it('should reject passwords that are too long', () => {
        const longPassword = 'a'.repeat(129)
        const result = InputValidator.validatePassword(longPassword)
        
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain('Password must be less than 128 characters')
        expect(result.sanitizedValue).toHaveLength(128)
      })
    })

    describe('Encryption Key Validation', () => {
      it('should validate strong encryption keys', () => {
        const strongKey = 'MyS3cur3K3y!@#$%^&*()_+{}|:<>?[]\\;\'",./<>?'
        const result = InputValidator.validateEncryptionKey(strongKey)
        
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })

      it('should reject weak encryption keys', () => {
        const weakKeys = [
          'short', // too short
          'abcdefghijklmnop', // only letters
          '1234567890123456', // only numbers
          'aaaaaaaaaaaaaaaa', // repeated patterns
        ]

        weakKeys.forEach(key => {
          const result = InputValidator.validateEncryptionKey(key)
          expect(result.isValid).toBe(false)
          expect(result.errors.length).toBeGreaterThan(0)
        })
      })
    })

    describe('Text Input Validation', () => {
      it('should detect XSS patterns', () => {
        const xssInputs = [
          '<script>alert("xss")</script>',
          'javascript:alert("xss")',
          '<iframe src="malicious.com"></iframe>',
          '<img src="x" onerror="alert(\'xss\')">',
        ]

        xssInputs.forEach(input => {
          const result = InputValidator.validateTextInput(input)
          expect(result.isValid).toBe(false)
          expect(result.errors).toContain('Input contains potentially dangerous content')
        })
      })

      it('should detect SQL injection patterns', () => {
        const sqlInputs = [
          "'; DROP TABLE users; --",
          '1 OR 1=1',
          'UNION SELECT * FROM users',
          '/* malicious comment */',
        ]

        sqlInputs.forEach(input => {
          const result = InputValidator.validateTextInput(input)
          expect(result.isValid).toBe(false)
          expect(result.errors).toContain('Input contains potentially dangerous patterns')
        })
      })

      it('should sanitize dangerous content', () => {
        const dangerousInput = '<script>alert("xss")</script>Hello World'
        const result = InputValidator.validateTextInput(dangerousInput)
        
        expect(result.isValid).toBe(false)
        expect(result.sanitizedValue).not.toContain('<script>')
        expect(result.sanitizedValue).toContain('Hello World')
      })
    })

    describe('File Name Validation', () => {
      it('should reject dangerous file extensions', () => {
        const dangerousFiles = [
          'malicious.exe',
          'script.bat',
          'virus.cmd',
          'payload.js',
        ]

        dangerousFiles.forEach(filename => {
          const result = InputValidator.validateFileName(filename)
          expect(result.isValid).toBe(false)
          expect(result.errors).toContain('File type not allowed')
        })
      })

      it('should reject path traversal attempts', () => {
        const traversalFiles = [
          '../../../etc/passwd',
          '..\\windows\\system32\\config',
          'file/with/path',
          'file\\with\\path',
        ]

        traversalFiles.forEach(filename => {
          const result = InputValidator.validateFileName(filename)
          expect(result.isValid).toBe(false)
          expect(result.errors).toContain('Invalid filename')
        })
      })

      it('should sanitize dangerous characters', () => {
        const dangerousFilename = 'file<with>"dangerous"|chars?*'
        const result = InputValidator.validateFileName(dangerousFilename)
        
        expect(result.sanitizedValue).not.toMatch(/[<>:"|?*]/)
        expect(result.sanitizedValue).toContain('filewithdangerouschars')
      })
    })

    describe('URL Validation', () => {
      it('should validate secure URLs', () => {
        const validUrls = [
          'https://example.com',
          'https://api.example.com/path',
          'https://subdomain.example.com:8080',
        ]

        validUrls.forEach(url => {
          const result = InputValidator.validateUrl(url)
          expect(result.isValid).toBe(true)
        })
      })

      it('should reject dangerous protocols', () => {
        const dangerousUrls = [
          'ftp://example.com',
          'file:///etc/passwd',
          'javascript:alert("xss")',
        ]

        dangerousUrls.forEach(url => {
          const result = InputValidator.validateUrl(url)
          expect(result.isValid).toBe(false)
          expect(result.errors).toContain('Only HTTP and HTTPS protocols are allowed')
        })
      })

      it('should reject localhost URLs', () => {
        const localhostUrls = [
          'http://localhost',
          'https://127.0.0.1',
          'http://192.168.1.1',
          'https://10.0.0.1',
        ]

        localhostUrls.forEach(url => {
          const result = InputValidator.validateUrl(url)
          expect(result.isValid).toBe(false)
          expect(result.errors).toContain('Local or private network URLs are not allowed')
        })
      })
    })
  })

  describe('RateLimiter', () => {
    it('should allow requests within limits', () => {
      const identifier = 'test-user'
      const action = 'login'
      
      // First 5 attempts should be allowed
      for (let i = 0; i < 5; i++) {
        expect(RateLimiter.isRateLimited(identifier, action)).toBe(false)
        RateLimiter.recordAttempt(identifier, action)
      }
    })

    it('should block requests after limit exceeded', () => {
      const identifier = 'test-user'
      const action = 'login'
      
      // Exceed the limit
      for (let i = 0; i < 6; i++) {
        RateLimiter.recordAttempt(identifier, action)
      }
      
      // Should be rate limited
      expect(RateLimiter.isRateLimited(identifier, action)).toBe(true)
    })

    it('should track remaining attempts correctly', () => {
      const identifier = 'test-user'
      const action = 'login'
      
      expect(RateLimiter.getRemainingAttempts(identifier, action)).toBe(5)
      
      RateLimiter.recordAttempt(identifier, action)
      expect(RateLimiter.getRemainingAttempts(identifier, action)).toBe(4)
      
      RateLimiter.recordAttempt(identifier, action)
      expect(RateLimiter.getRemainingAttempts(identifier, action)).toBe(3)
    })

    it('should clear limits correctly', () => {
      const identifier = 'test-user'
      const action = 'login'
      
      RateLimiter.recordAttempt(identifier, action)
      expect(RateLimiter.getRemainingAttempts(identifier, action)).toBe(4)
      
      RateLimiter.clearLimits(identifier, action)
      expect(RateLimiter.getRemainingAttempts(identifier, action)).toBe(5)
    })

    it('should provide accurate statistics', () => {
      const identifier = 'test-user'
      const action = 'login'
      
      RateLimiter.recordAttempt(identifier, action)
      RateLimiter.recordAttempt(identifier, action)
      
      const stats = RateLimiter.getStats()
      expect(stats.totalEntries).toBeGreaterThan(0)
      expect(stats.activeEntries).toBeGreaterThan(0)
    })
  })

  describe('ErrorHandler', () => {
    it('should handle errors with proper severity classification', () => {
      const authError = new Error('Authentication failed')
      const cryptoError = new Error('Encryption key invalid')
      const validationError = new Error('Input validation failed')
      
      ErrorHandler.handleError(authError, { action: 'login' })
      ErrorHandler.handleError(cryptoError, { action: 'encrypt' })
      ErrorHandler.handleError(validationError, { action: 'validate' })
      
      const errors = ErrorHandler.getErrors()
      expect(errors.length).toBeGreaterThanOrEqual(3)
      
      const criticalErrors = ErrorHandler.getErrors('critical')
      const highErrors = ErrorHandler.getErrors('high')
      const mediumErrors = ErrorHandler.getErrors('medium')
      
      expect(criticalErrors.length).toBeGreaterThan(0)
      expect(highErrors.length).toBeGreaterThan(0)
      expect(mediumErrors.length).toBeGreaterThan(0)
    })

    it('should handle security violations', () => {
      ErrorHandler.handleSecurityViolation({
        type: 'brute_force',
        description: 'Multiple failed login attempts',
        severity: 'high',
        context: { userId: 'test-user' }
      })
      
      const allErrors = ErrorHandler.getErrors()
      expect(allErrors.some(error => error.message && error.message.includes('Security Violation'))).toBe(true)
    })

    it('should provide error statistics', () => {
      const stats = ErrorHandler.getErrorStats()
      expect(stats).toHaveProperty('total')
      expect(stats).toHaveProperty('bySeverity')
      expect(stats).toHaveProperty('recentErrors')
    })
  })

  describe('SecurityAuditor', () => {
    it('should run comprehensive security audit', async () => {
      const auditResult = await SecurityAuditor.runFullAudit()
      
      expect(auditResult).toHaveProperty('timestamp')
      expect(auditResult).toHaveProperty('score')
      expect(auditResult).toHaveProperty('issues')
      expect(auditResult).toHaveProperty('recommendations')
      expect(auditResult).toHaveProperty('passed')
      
      expect(typeof auditResult.score).toBe('number')
      expect(Array.isArray(auditResult.issues)).toBe(true)
      expect(Array.isArray(auditResult.recommendations)).toBe(true)
      expect(typeof auditResult.passed).toBe('boolean')
    })

    it('should check dependencies for vulnerabilities', async () => {
      const issues = await SecurityAuditor.checkDependencies()
      expect(Array.isArray(issues)).toBe(true)
    })

    it('should check crypto implementation', async () => {
      const issues = await SecurityAuditor.checkCryptoImplementation()
      expect(Array.isArray(issues)).toBe(true)
    })

    it('should generate security report', () => {
      const report = SecurityAuditor.generateSecurityReport()
      expect(typeof report).toBe('string')
      expect(report).toContain('Security Audit Report')
      expect(report).toContain('Executive Summary')
      expect(report).toContain('Key Findings')
      expect(report).toContain('Recommendations')
    })
  })
})
