export interface ComplianceRule {
  id: string
  name: string
  description: string
  category: "encryption" | "key_management" | "audit" | "access_control"
  severity: "low" | "medium" | "high" | "critical"
  check: (context: any) => boolean
  remediation: string
}

export interface ComplianceReport {
  id: string
  timestamp: Date
  overallScore: number
  passedRules: number
  failedRules: number
  violations: ComplianceViolation[]
}

export interface ComplianceViolation {
  ruleId: string
  ruleName: string
  severity: string
  description: string
  remediation: string
}

export class ComplianceChecker {
  private rules: ComplianceRule[] = [
    {
      id: "strong-encryption",
      name: "Strong Encryption Algorithm",
      description: "Must use AES-256 or equivalent encryption",
      category: "encryption",
      severity: "critical",
      check: (context) => context.algorithm?.includes("256") || context.algorithm?.includes("ChaCha20"),
      remediation: "Use AES-256-GCM or ChaCha20-Poly1305 encryption",
    },
    {
      id: "key-length",
      name: "Minimum Key Length",
      description: "Encryption keys must be at least 256 bits",
      category: "key_management",
      severity: "high",
      check: (context) => context.keyLength >= 32,
      remediation: "Generate keys with minimum 256-bit length",
    },
    {
      id: "key-rotation",
      name: "Key Rotation Policy",
      description: "Keys should be rotated every 90 days",
      category: "key_management",
      severity: "medium",
      check: (context) => {
        if (!context.keyAge) return true
        return context.keyAge < 90 * 24 * 60 * 60 * 1000
      },
      remediation: "Implement automatic key rotation every 90 days",
    },
    {
      id: "audit-logging",
      name: "Comprehensive Audit Logging",
      description: "All cryptographic operations must be logged",
      category: "audit",
      severity: "high",
      check: (context) => context.auditEnabled === true,
      remediation: "Enable comprehensive audit logging for all operations",
    },
    {
      id: "secure-random",
      name: "Cryptographically Secure Random",
      description: "Use cryptographically secure random number generation",
      category: "encryption",
      severity: "critical",
      check: (context) => context.usesCryptoRandom === true,
      remediation: "Use crypto.getRandomValues() for all random generation",
    },
  ]

  runCompliance(context: any): ComplianceReport {
    const violations: ComplianceViolation[] = []
    let passedRules = 0
    let failedRules = 0

    for (const rule of this.rules) {
      try {
        if (rule.check(context)) {
          passedRules++
        } else {
          failedRules++
          violations.push({
            ruleId: rule.id,
            ruleName: rule.name,
            severity: rule.severity,
            description: rule.description,
            remediation: rule.remediation,
          })
        }
      } catch (error) {
        failedRules++
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: "high",
          description: `Compliance check failed: ${error}`,
          remediation: rule.remediation,
        })
      }
    }

    const overallScore = Math.round((passedRules / this.rules.length) * 100)

    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      overallScore,
      passedRules,
      failedRules,
      violations,
    }
  }

  getRules(): ComplianceRule[] {
    return this.rules
  }
}

export const complianceChecker = new ComplianceChecker()
