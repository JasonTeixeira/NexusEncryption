import crypto from "crypto"
import type { NextRequest } from "next/server"

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export class SecurityService {
  // Rate limiting
  static checkRateLimit(identifier: string, maxRequests = 100, windowMs = 60000): boolean {
    const now = Date.now()
    const key = `rate_limit:${identifier}`
    const current = rateLimitStore.get(key)

    if (!current || now > current.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (current.count >= maxRequests) {
      return false
    }

    current.count++
    return true
  }

  // Data encryption
  static encrypt(text: string, key?: string): string {
    const secretKey = key || process.env.ENCRYPTION_KEY || "default-secret-key-change-in-production"
    const algorithm = "aes-256-gcm"
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(algorithm, secretKey)

    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    return `${iv.toString("hex")}:${encrypted}`
  }

  static decrypt(encryptedText: string, key?: string): string {
    const secretKey = key || process.env.ENCRYPTION_KEY || "default-secret-key-change-in-production"
    const algorithm = "aes-256-gcm"
    const [ivHex, encrypted] = encryptedText.split(":")
    const iv = Buffer.from(ivHex, "hex")
    const decipher = crypto.createDecipher(algorithm, secretKey)

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  }

  // CSRF token generation and validation
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  static validateCSRFToken(token: string, sessionToken: string): boolean {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken))
  }

  // Input sanitization
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove event handlers
      .trim()
  }

  // SQL injection prevention (for raw queries)
  static escapeSQL(input: string): string {
    return input.replace(/'/g, "''").replace(/;/g, "\\;").replace(/--/g, "\\--")
  }

  // Password strength validation
  static validatePasswordStrength(password: string): {
    isValid: boolean
    score: number
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) score += 1
    else feedback.push("Password must be at least 8 characters long")

    if (/[a-z]/.test(password)) score += 1
    else feedback.push("Password must contain lowercase letters")

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push("Password must contain uppercase letters")

    if (/\d/.test(password)) score += 1
    else feedback.push("Password must contain numbers")

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
    else feedback.push("Password must contain special characters")

    if (password.length >= 12) score += 1

    return {
      isValid: score >= 4,
      score,
      feedback,
    }
  }

  // Generate secure random tokens
  static generateSecureToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex")
  }

  // Hash sensitive data
  static hashData(data: string, salt?: string): string {
    const actualSalt = salt || crypto.randomBytes(16).toString("hex")
    const hash = crypto.pbkdf2Sync(data, actualSalt, 10000, 64, "sha512")
    return `${actualSalt}:${hash.toString("hex")}`
  }

  static verifyHash(data: string, hashedData: string): boolean {
    const [salt, hash] = hashedData.split(":")
    const verifyHash = crypto.pbkdf2Sync(data, salt, 10000, 64, "sha512")
    return hash === verifyHash.toString("hex")
  }

  // IP address validation and geolocation
  static isValidIP(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }

  static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")
    const remoteAddr = request.headers.get("remote-addr")

    if (forwarded) {
      return forwarded.split(",")[0].trim()
    }
    if (realIP) {
      return realIP
    }
    if (remoteAddr) {
      return remoteAddr
    }

    return "unknown"
  }

  // Security headers
  static getSecurityHeaders(): Record<string, string> {
    return {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; media-src 'self'; object-src 'none'; frame-src 'none';",
    }
  }
}

// Security monitoring
export class SecurityMonitor {
  private static suspiciousActivities: Map<string, number> = new Map()
  private static blockedIPs: Set<string> = new Set()

  static logSecurityEvent(event: {
    type: "login_attempt" | "rate_limit_exceeded" | "suspicious_activity" | "data_breach_attempt"
    ip: string
    userAgent?: string
    details?: any
    severity: "low" | "medium" | "high" | "critical"
  }) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      ...event,
    }

    // In production, send to security monitoring service
    console.log("SECURITY EVENT:", logEntry)

    // Track suspicious activities
    if (event.severity === "high" || event.severity === "critical") {
      const count = this.suspiciousActivities.get(event.ip) || 0
      this.suspiciousActivities.set(event.ip, count + 1)

      if (count >= 5) {
        this.blockedIPs.add(event.ip)
        console.log(`IP ${event.ip} has been blocked due to suspicious activity`)
      }
    }
  }

  static isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip)
  }

  static unblockIP(ip: string) {
    this.blockedIPs.delete(ip)
    this.suspiciousActivities.delete(ip)
  }

  static getSecurityStats() {
    return {
      suspiciousActivities: Object.fromEntries(this.suspiciousActivities),
      blockedIPs: Array.from(this.blockedIPs),
      totalEvents: this.suspiciousActivities.size,
    }
  }
}

// Two-Factor Authentication
export class TwoFactorAuth {
  static generateSecret(): string {
    return crypto.randomBytes(20).toString("base32")
  }

  static generateTOTP(secret: string, window = 0): string {
    const epoch = Math.round(Date.now() / 1000.0)
    const time = Math.floor(epoch / 30) + window

    const hmac = crypto.createHmac("sha1", Buffer.from(secret, "base32"))
    hmac.update(Buffer.from(time.toString(16).padStart(16, "0"), "hex"))
    const hash = hmac.digest()

    const offset = hash[hash.length - 1] & 0xf
    const code =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff)

    return (code % 1000000).toString().padStart(6, "0")
  }

  static verifyTOTP(token: string, secret: string): boolean {
    // Check current window and ±1 window for clock drift
    for (let window = -1; window <= 1; window++) {
      if (this.generateTOTP(secret, window) === token) {
        return true
      }
    }
    return false
  }

  static generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      codes.push(crypto.randomBytes(4).toString("hex").toUpperCase())
    }
    return codes
  }
}
