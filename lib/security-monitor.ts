export interface SecurityEvent {
  id: string
  type: "authentication" | "encryption" | "key_access" | "suspicious" | "compliance"
  severity: "low" | "medium" | "high" | "critical"
  timestamp: Date
  description: string
  metadata: Record<string, any>
  resolved: boolean
}

export interface ThreatIndicator {
  id: string
  pattern: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  active: boolean
}

export class SecurityMonitor {
  private events: SecurityEvent[] = []
  private threats: ThreatIndicator[] = [
    {
      id: "rapid-encryption",
      pattern: "Multiple encryption attempts within 10 seconds",
      description: "Potential brute force attack detected",
      severity: "high",
      active: true,
    },
    {
      id: "weak-key-usage",
      pattern: "Key strength below 70%",
      description: "Weak encryption key detected",
      severity: "medium",
      active: true,
    },
    {
      id: "failed-decryption",
      pattern: "Multiple failed decryption attempts",
      description: "Potential unauthorized access attempt",
      severity: "high",
      active: true,
    },
  ]

  logEvent(event: Omit<SecurityEvent, "id" | "timestamp" | "resolved">): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      resolved: false,
    }

    this.events.unshift(securityEvent)
    this.analyzeThreats(securityEvent)
  }

  private analyzeThreats(event: SecurityEvent): void {
    // Check for rapid encryption pattern
    if (event.type === "encryption") {
      const recentEncryptions = this.events.filter(
        (e) => e.type === "encryption" && Date.now() - e.timestamp.getTime() < 10000,
      ).length

      if (recentEncryptions > 5) {
        this.logEvent({
          type: "suspicious",
          severity: "high",
          description: "Rapid encryption activity detected - possible brute force attack",
          metadata: { encryptionCount: recentEncryptions },
        })
      }
    }

    // Check for failed decryption attempts
    if (event.type === "encryption" && event.metadata?.status === "failed") {
      const recentFailures = this.events.filter(
        (e) => e.type === "encryption" && e.metadata?.status === "failed" && Date.now() - e.timestamp.getTime() < 60000,
      ).length

      if (recentFailures > 3) {
        this.logEvent({
          type: "suspicious",
          severity: "critical",
          description: "Multiple failed decryption attempts - potential unauthorized access",
          metadata: { failureCount: recentFailures },
        })
      }
    }
  }

  getEvents(limit = 50): SecurityEvent[] {
    return this.events.slice(0, limit)
  }

  getActiveThreats(): ThreatIndicator[] {
    return this.threats.filter((t) => t.active)
  }

  resolveEvent(eventId: string): void {
    const event = this.events.find((e) => e.id === eventId)
    if (event) {
      event.resolved = true
    }
  }

  getSecurityScore(): number {
    const recentEvents = this.events.filter((e) => Date.now() - e.timestamp.getTime() < 24 * 60 * 60 * 1000)

    const criticalEvents = recentEvents.filter((e) => e.severity === "critical").length
    const highEvents = recentEvents.filter((e) => e.severity === "high").length
    const mediumEvents = recentEvents.filter((e) => e.severity === "medium").length

    let score = 100
    score -= criticalEvents * 20
    score -= highEvents * 10
    score -= mediumEvents * 5

    return Math.max(0, Math.min(100, score))
  }
}

export const securityMonitor = new SecurityMonitor()
