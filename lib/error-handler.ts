export interface ErrorContext {
  userId?: string
  sessionId?: string
  action?: string
  timestamp: number
  userAgent?: string
  ipAddress?: string
  stack?: string
}

export interface SecurityError extends Error {
  code: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  context: ErrorContext
  isSecurityError: boolean
}

export class ErrorHandler {
  private static readonly MAX_ERRORS = 1000
  private static errors: Array<SecurityError> = []
  private static isInitialized = false

  static initialize(): void {
    if (this.isInitialized) return

    // Global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.handleError(new Error(event.message), {
          action: 'window_error',
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        })
      })

      window.addEventListener('unhandledrejection', (event) => {
        this.handleError(new Error(event.reason), {
          action: 'unhandled_rejection',
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        })
      })
    }

    this.isInitialized = true
  }

  static handleError(error: Error, context: Partial<ErrorContext> = {}): void {
    const securityError: SecurityError = {
      ...error,
      message: error.message, // Ensure message is preserved
      code: this.generateErrorCode(error),
      severity: this.determineSeverity(error),
      context: {
        timestamp: Date.now(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        ...context
      },
      isSecurityError: this.isSecurityRelated(error)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Security Error:', securityError)
    }

    // Store error
    this.errors.unshift(securityError)
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors = this.errors.slice(0, this.MAX_ERRORS)
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(securityError)
    }

    // Trigger security alerts for critical errors
    if (securityError.severity === 'critical') {
      this.triggerSecurityAlert(securityError)
    }
  }

  static handleSecurityViolation(violation: {
    type: string
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    context?: Partial<ErrorContext>
  }): void {
    const error = new Error(`Security Violation: ${violation.description}`) as SecurityError
    error.code = `SEC_${violation.type.toUpperCase()}`
    error.severity = violation.severity
    error.context = {
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      ...violation.context
    }
    error.isSecurityError = true
    error.message = `Security Violation: ${violation.description}` // Ensure message is set

    this.handleError(error, violation.context)
  }

  private static generateErrorCode(error: Error): string {
    const baseCode = error.name.replace(/\s+/g, '_').toUpperCase()
    const timestamp = Date.now().toString(36)
    return `${baseCode}_${timestamp}`
  }

  private static determineSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    const message = error.message.toLowerCase()
    const stack = error.stack?.toLowerCase() || ''

    // Critical security issues
    if (message.includes('authentication') || message.includes('authorization')) {
      return 'critical'
    }

    // High severity issues
    if (message.includes('encryption') || message.includes('decryption') || 
        message.includes('key') || message.includes('password')) {
      return 'high'
    }

    // Medium severity issues
    if (message.includes('validation') || message.includes('input') || 
        message.includes('sanitize')) {
      return 'medium'
    }

    return 'low'
  }

  private static isSecurityRelated(error: Error): boolean {
    const securityKeywords = [
      'auth', 'password', 'key', 'encrypt', 'decrypt', 'token', 'session',
      'csrf', 'xss', 'injection', 'sql', 'validation', 'sanitize'
    ]

    const message = error.message.toLowerCase()
    return securityKeywords.some(keyword => message.includes(keyword))
  }

  private static async sendToMonitoring(error: SecurityError): Promise<void> {
    try {
      // In a real implementation, this would send to a monitoring service
      // like Sentry, LogRocket, or a custom endpoint
      const payload = {
        error: {
          message: error.message,
          code: error.code,
          severity: error.severity,
          stack: error.stack
        },
        context: error.context,
        timestamp: new Date().toISOString()
      }

      // Example: Send to monitoring endpoint
      // await fetch('/api/monitoring/error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // })

      console.warn('Error monitoring not configured:', payload)
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError)
    }
  }

  private static triggerSecurityAlert(error: SecurityError): void {
    // In a real implementation, this would trigger alerts
    // like email notifications, Slack messages, etc.
    console.warn('SECURITY ALERT:', {
      code: error.code,
      message: error.message,
      severity: error.severity,
      timestamp: new Date().toISOString()
    })
  }

  static getErrors(severity?: 'low' | 'medium' | 'high' | 'critical'): SecurityError[] {
    if (severity) {
      return this.errors.filter(error => error.severity === severity)
    }
    return [...this.errors]
  }

  static getErrorStats(): {
    total: number
    bySeverity: Record<string, number>
    recentErrors: number
  } {
    const bySeverity = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    }

    this.errors.forEach(error => {
      bySeverity[error.severity]++
    })

    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    const recentErrors = this.errors.filter(error => 
      error.context.timestamp > oneHourAgo
    ).length

    return {
      total: this.errors.length,
      bySeverity,
      recentErrors
    }
  }

  static clearErrors(): void {
    this.errors = []
  }
}

// Initialize error handler
ErrorHandler.initialize()
