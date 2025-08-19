export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: any
  message: string
  validator?: (value: any) => boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedValue?: any
}

export class InputValidator {
  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
  ]

  private static readonly SQL_INJECTION_PATTERNS = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
    /(--|\/\*|\*\/|;)/g,
    /(\b(and|or)\b\s+\d+\s*=\s*\d+)/gi
  ]

  private static readonly COMMON_PASSWORDS = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ]

  static validatePassword(password: string): ValidationResult {
    const errors: string[] = []
    let sanitizedValue = password

    // Basic requirements
    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (password.length > 128) {
      errors.push('Password must be less than 128 characters')
      sanitizedValue = password.substring(0, 128)
    }

    // Character variety
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    // Check for common passwords
    if (this.COMMON_PASSWORDS.includes(password.toLowerCase())) {
      errors.push('Password is too common, please choose a stronger password')
    }

    // Check for repeated characters
    if (/(.)\1{3,}/.test(password)) {
      errors.push('Password contains too many repeated characters')
    }

    // Check for sequential characters (but allow short sequences)
    if (/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|890){3,}/i.test(password)) {
      errors.push('Password contains too many sequential characters')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    }
  }

  static validateEncryptionKey(key: string): ValidationResult {
    const errors: string[] = []
    let sanitizedValue = key

    // Basic requirements
    if (!key || key.length < 16) {
      errors.push('Encryption key must be at least 16 characters long')
    }

    if (key.length > 256) {
      errors.push('Encryption key must be less than 256 characters')
      sanitizedValue = key.substring(0, 256)
    }

    // Check for weak patterns
    if (/^[a-z]+$/i.test(key)) {
      errors.push('Encryption key should contain mixed character types')
    }

    if (/^[0-9]+$/.test(key)) {
      errors.push('Encryption key should not be only numbers')
    }

    // Check for repeated patterns
    if (/(.{2,})\1{2,}/.test(key)) {
      errors.push('Encryption key contains repeated patterns')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    }
  }

  static validateTextInput(text: string, maxLength: number = 1000): ValidationResult {
    const errors: string[] = []
    let sanitizedValue = text

    // Check for XSS patterns
    if (this.XSS_PATTERNS.some(pattern => pattern.test(text))) {
      errors.push('Input contains potentially dangerous content')
      sanitizedValue = this.sanitizeHtml(text)
    }

    // Check for SQL injection patterns
    if (this.SQL_INJECTION_PATTERNS.some(pattern => pattern.test(text))) {
      errors.push('Input contains potentially dangerous patterns')
    }

    // Length validation
    if (text.length > maxLength) {
      errors.push(`Input must be less than ${maxLength} characters`)
      sanitizedValue = text.substring(0, maxLength)
    }

    // Check for null bytes
    if (text.includes('\0')) {
      errors.push('Input contains null bytes')
      sanitizedValue = text.replace(/\0/g, '')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    }
  }

  static validateFileName(filename: string): ValidationResult {
    const errors: string[] = []
    let sanitizedValue = filename

    // Check for dangerous extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js']
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'))
    
    if (dangerousExtensions.includes(extension)) {
      errors.push('File type not allowed')
    }

    // Check for path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      errors.push('Invalid filename')
    }

    // Length validation
    if (filename.length > 255) {
      errors.push('Filename too long')
      sanitizedValue = filename.substring(0, 255)
    }

    // Remove dangerous characters but preserve the base filename
    sanitizedValue = sanitizedValue.replace(/[<>:"|?*]/g, '')

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    }
  }

  static validateUrl(url: string): ValidationResult {
    const errors: string[] = []
    let sanitizedValue = url

    try {
      const urlObj = new URL(url)
      
      // Check for dangerous protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.push('Only HTTP and HTTPS protocols are allowed')
      }

      // Check for localhost or private IPs
      const hostname = urlObj.hostname.toLowerCase()
      if (hostname === 'localhost' || 
          hostname.startsWith('127.') || 
          hostname.startsWith('192.168.') ||
          hostname.startsWith('10.') ||
          hostname.startsWith('172.')) {
        errors.push('Local or private network URLs are not allowed')
      }

      sanitizedValue = urlObj.toString()
    } catch {
      errors.push('Invalid URL format')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    }
  }

  static validateJson(jsonString: string): ValidationResult {
    const errors: string[] = []
    let sanitizedValue = jsonString

    try {
      const parsed = JSON.parse(jsonString)
      
      // Check for circular references
      const seen = new WeakSet()
      const checkCircular = (obj: any): boolean => {
        if (obj && typeof obj === 'object') {
          if (seen.has(obj)) return true
          seen.add(obj)
          
          for (const key in obj) {
            if (checkCircular(obj[key])) return true
          }
        }
        return false
      }

      if (checkCircular(parsed)) {
        errors.push('JSON contains circular references')
      }

      sanitizedValue = JSON.stringify(parsed)
    } catch (error) {
      errors.push('Invalid JSON format')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    }
  }

  private static sanitizeHtml(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
  }

  static generateSecureRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let result = ''
    const randomValues = new Uint8Array(length)
    crypto.getRandomValues(randomValues)
    
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length]
    }
    
    return result
  }
}
