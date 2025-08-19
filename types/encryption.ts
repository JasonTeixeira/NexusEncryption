export interface EncryptionAlgorithm {
  id: string
  name: string
  keySize: string
  speed: string
  security: string
  badge: "military" | "quantum" | "standard" | "extended"
  description: string
  strength: number
  quantumResistant: boolean
}

export interface EncryptionKey {
  id: string
  name: string
  algorithm: string
  created: Date
  lastUsed: Date
  usageCount: number
  fingerprint: string
  keySize: number
  expiresAt?: Date
}

export interface ActivityLog {
  id: string
  action: string
  timestamp: Date
  status: "success" | "warning" | "error"
  details: string
  keyId?: string
}

export interface SecurityMetrics {
  totalEncryptions: number
  activeKeys: number
  dataProcessed: string
  securityScore: number
  lastAudit: Date
  threats: number
}

export interface PasswordEntry {
  id: string
  name: string
  username: string
  url: string
  lastUsed: Date
  category?: string
  notes?: string
}

export interface AuditEntry {
  id: string
  event: string
  user: string
  timestamp: Date
  severity: "info" | "warning" | "error"
  details: string
  ipAddress?: string
  userAgent?: string
}

export interface ComplianceReport {
  generatedAt: string
  dataRetention: {
    status: "compliant" | "non_compliant"
    retentionDays: number
    maxAllowed: number
  }
  encryptionCompliance: {
    status: "compliant" | "non_compliant"
    compliantKeys: number
    totalKeys: number
  }
  accessControls: {
    status: "active" | "inactive"
    sessionManagement: boolean
    twoFactorEnabled: boolean
  }
  auditTrail: {
    status: "active" | "inactive"
    entriesCount: number
    lastEntry: number | null
  }
  recommendations: string[]
}
