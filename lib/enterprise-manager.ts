// Enterprise-grade data persistence and session management
import { SecureStore } from "./secure-store"
import { Logger } from "./logger"

export class EnterpriseManager {
  private static readonly STORAGE_PREFIX = "nexus_cipher_"
  private static readonly SESSION_KEY = "session_data"
  private static readonly BACKUP_KEY = "backup_data"
  private static readonly INDEX_KEY = "__index__"

  static initialize(): void {
    try {
      // Validate existing session on startup
      this.validateSession()

      // Clean up old data if needed
      this.cleanupOldData()

      // Log system initialization
      this.logActivity("system_initialized", "Enterprise manager initialized successfully")
    } catch (error) {
      this.handleError("Failed to initialize enterprise manager", error)
    }
  }

  private static isTauri(): boolean {
    return typeof window !== "undefined" && (window as any).__TAURI__
  }

  private static getMirrorKey(key: string): string {
    return this.STORAGE_PREFIX + key
  }

  private static async kvSet(key: string, value: any): Promise<void> {
    if (this.isTauri()) {
      await SecureStore.setJSON(this.getMirrorKey(key), value)
      // Mirror for sync readers
      try {
        localStorage.setItem(this.getMirrorKey(key), JSON.stringify(value))
      } catch (_) {}
      await this.updateIndex(key, true)
    } else {
      localStorage.setItem(this.getMirrorKey(key), JSON.stringify(value))
      await this.updateIndex(key, true)
    }
  }

  private static async kvGet<T>(key: string): Promise<T | null> {
    if (this.isTauri()) {
      const val = await SecureStore.getJSON<T>(this.getMirrorKey(key))
      if (val != null) return val
      const stored = localStorage.getItem(this.getMirrorKey(key))
      if (!stored) return null
      try {
        return JSON.parse(stored) as T
      } catch {
        return null
      }
    } else {
      const stored = localStorage.getItem(this.getMirrorKey(key))
      if (!stored) return null
      try {
        return JSON.parse(stored) as T
      } catch {
        return null
      }
    }
  }

  private static async kvRemove(key: string): Promise<void> {
    if (this.isTauri()) {
      await SecureStore.remove(this.getMirrorKey(key))
      try {
        localStorage.removeItem(this.getMirrorKey(key))
      } catch (_) {}
      await this.updateIndex(key, false)
    } else {
      localStorage.removeItem(this.getMirrorKey(key))
      await this.updateIndex(key, false)
    }
  }

  private static async updateIndex(key: string, add: boolean): Promise<void> {
    const idxKey = this.getMirrorKey(this.INDEX_KEY)
    let indexList: string[] = []
    try {
      const txt = localStorage.getItem(idxKey)
      if (txt) indexList = JSON.parse(txt)
    } catch (_) {}

    const has = indexList.includes(key)
    if (add && !has) indexList.push(key)
    if (!add && has) indexList = indexList.filter((k) => k !== key)

    try {
      localStorage.setItem(idxKey, JSON.stringify(indexList))
    } catch (_) {}
    if (this.isTauri()) {
      await SecureStore.setJSON(idxKey, indexList)
    }
  }

  private static cleanupOldData(): void {
    const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days
    const now = Date.now()

    // Clean up old audit logs
    const auditLog = this.loadData("audit_log") || []
    const filteredLog = (auditLog as any[]).filter((entry: any) => now - entry.timestamp < maxAge)
    if (filteredLog.length !== (auditLog as any[]).length) {
      // fire and forget; non-critical
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.saveData("audit_log", filteredLog)
    }

    // Clean up old error logs
    const errorLog = this.loadData("error_log") || []
    const filteredErrors = (errorLog as any[]).filter((entry: any) => now - entry.timestamp < maxAge)
    if (filteredErrors.length !== (errorLog as any[]).length) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.saveData("error_log", filteredErrors)
    }
  }

  // Data Persistence
  static async saveData(key: string, data: any): Promise<void> {
    try {
      const envelope = {
        data,
        timestamp: Date.now(),
        version: "1.0.0",
      }
      await this.kvSet(key, envelope)
      this.logActivity("data_saved", `Data saved: ${key}`)
    } catch (error) {
      this.handleError("Failed to save data", error)
    }
  }

  static loadDataSync<T>(key: string): T | null {
    // Best-effort sync read from mirror (localStorage)
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem(this.getMirrorKey(key)) : null
    if (!stored) return null
    try {
      const parsed = JSON.parse(stored)
      return parsed.data as T
    } catch {
      return null
    }
  }

  static loadData<T>(key: string): T | null {
    // Keep existing API: synchronous mirror read for UI without refactor
    return this.loadDataSync<T>(key)
  }

  // Session Management
  static createSession(userId: string): string {
    const sessionId = crypto.randomUUID()
    const sessionData = {
      id: sessionId,
      userId,
      created: Date.now(),
      lastActivity: Date.now(),
      permissions: ["encrypt", "decrypt", "key_management"],
    }

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData))
    this.logActivity("session_created", `Session created for user: ${userId}`)
    return sessionId
  }

  static validateSession(): boolean {
    try {
      const session = sessionStorage.getItem(this.SESSION_KEY)
      if (!session) return false

      const sessionData = JSON.parse(session)
      const now = Date.now()
      const maxAge = 30 * 60 * 1000 // 30 minutes

      if (now - sessionData.lastActivity > maxAge) {
        this.destroySession()
        return false
      }

      // Update last activity
      sessionData.lastActivity = now
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData))
      return true
    } catch {
      return false
    }
  }

  static destroySession(): void {
    sessionStorage.removeItem(this.SESSION_KEY)
    this.logActivity("session_destroyed", "User session terminated")
  }

  // Backup and Recovery
  static createBackup(): string {
    const backupData = {
      keys: this.loadData("encryption-keys") || [],
      passwords: this.loadData("password-vault") || [],
      settings: this.loadData("app_settings") || {},
      auditLog: this.loadData("audit_log") || [],
      created: Date.now(),
      version: "1.0.0",
    }

    const backup = JSON.stringify(backupData, null, 2)
    // fire and forget secure write
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.saveData(this.BACKUP_KEY, backupData)
    this.logActivity("backup_created", "System backup created successfully")
    return backup
  }

  static restoreBackup(backupString: string): boolean {
    try {
      const backupData = JSON.parse(backupString)

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      if (backupData.keys) this.saveData("encryption-keys", backupData.keys)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      if (backupData.passwords) this.saveData("password-vault", backupData.passwords)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      if (backupData.settings) this.saveData("app_settings", backupData.settings)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      if (backupData.auditLog) this.saveData("audit_log", backupData.auditLog)

      this.logActivity("backup_restored", "System restored from backup")
      return true
    } catch (error) {
      this.handleError("Failed to restore backup", error)
      return false
    }
  }

  // Import/Export for UI
  static exportData(): any {
    return {
      keys: this.loadData("encryption-keys") || [],
      passwords: this.loadData("password-vault") || [],
      auditLog: this.loadData("audit_log") || [],
      exported: new Date().toISOString(),
      format: "json",
    }
  }

  static async importData(data: any): Promise<void> {
    if (data?.keys) await this.saveData("encryption-keys", data.keys)
    if (data?.passwords) await this.saveData("password-vault", data.passwords)
    if (data?.auditLog) await this.saveData("audit_log", data.auditLog)
  }

  static async clearAllData(): Promise<void> {
    // Remove all tracked keys via index
    const idxKey = this.getMirrorKey(this.INDEX_KEY)
    let indexList: string[] = []
    try {
      const txt = localStorage.getItem(idxKey)
      if (txt) indexList = JSON.parse(txt)
    } catch (_) {}

    for (const k of indexList) {
      await this.kvRemove(k)
    }

    // Also clear known computed areas
    try {
      localStorage.removeItem(this.getMirrorKey(this.INDEX_KEY))
    } catch (_) {}
  }

  private static convertToCSV(data: any): string {
    const headers = ["Type", "ID", "Name", "Created", "Details"]
    const rows = [headers.join(",")]

    ;(data.keys as any[]).forEach((key: any) => {
      rows.push(["Key", key.id, key.name, key.created, key.algorithm].join(","))
    })

    return rows.join("\n")
  }

  // Error Handling and Recovery
  static handleError(message: string, error: any): void {
    const errorLog = {
      id: crypto.randomUUID(),
      message,
      error: error?.message || "Unknown error",
      stack: error?.stack,
      timestamp: Date.now(),
      severity: "error",
    }

    console.error("[NexusCipher Enterprise]", errorLog)
    // Persist to local log in desktop builds
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Logger.logError(message, errorLog)

    // Store error for audit
    const errors = this.loadData("error_log") || []
    ;(errors as any[]).unshift(errorLog)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.saveData("error_log", (errors as any[]).slice(0, 100)) // Keep last 100 errors
  }

  // Activity Logging
  static logActivity(action: string, details: string): void {
    const activity = {
      id: crypto.randomUUID(),
      action,
      details,
      timestamp: Date.now(),
      user: "current_user",
    }

    const log = this.loadData("audit_log") || []
    ;(log as any[]).unshift(activity)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.saveData("audit_log", (log as any[]).slice(0, 1000)) // Keep last 1000 activities
  }

  // Compliance and Monitoring
  static generateComplianceReport(): any {
    return {
      generatedAt: new Date().toISOString(),
      dataRetention: this.checkDataRetention(),
      encryptionCompliance: this.checkEncryptionCompliance(),
      accessControls: this.checkAccessControls(),
      auditTrail: this.validateAuditTrail(),
      recommendations: this.getComplianceRecommendations(),
    }
  }

  private static checkDataRetention(): any {
    const auditLog = this.loadData("audit_log") || []
    const oldestEntry = (auditLog as any[])[(auditLog as any[]).length - 1]
    const retentionDays = oldestEntry ? Math.floor((Date.now() - oldestEntry.timestamp) / (1000 * 60 * 60 * 24)) : 0

    return {
      status: retentionDays <= 365 ? "compliant" : "non_compliant",
      retentionDays,
      maxAllowed: 365,
    }
  }

  private static checkEncryptionCompliance(): any {
    const keys = this.loadData("encryption-keys") || []
    const compliantAlgorithms = ["aes-256-gcm", "chacha20-poly1305"]
    const compliantKeys = (keys as any[]).filter((key: any) => compliantAlgorithms.includes(key.algorithm))

    return {
      status: compliantKeys.length === (keys as any[]).length ? "compliant" : "non_compliant",
      compliantKeys: compliantKeys.length,
      totalKeys: (keys as any[]).length,
    }
  }

  private static checkAccessControls(): any {
    const session = sessionStorage.getItem(this.SESSION_KEY)
    return {
      status: session ? "active" : "inactive",
      sessionManagement: !!session,
      twoFactorEnabled: true, // Mock for demo
    }
  }

  private static validateAuditTrail(): any {
    const auditLog = this.loadData("audit_log") || []
    return {
      status: (auditLog as any[]).length > 0 ? "active" : "inactive",
      entriesCount: (auditLog as any[]).length,
      lastEntry: (auditLog as any[])[0]?.timestamp || null,
    }
  }

  private static getComplianceRecommendations(): string[] {
    const recommendations: string[] = []
    const report = {
      dataRetention: this.checkDataRetention(),
      encryption: this.checkEncryptionCompliance(),
      access: this.checkAccessControls(),
    }

    if (report.dataRetention.status === "non_compliant") {
      recommendations.push("Implement automated data retention policy")
    }
    if (report.encryption.status === "non_compliant") {
      recommendations.push("Upgrade non-compliant encryption algorithms")
    }
    if (!report.access.sessionManagement) {
      recommendations.push("Enable session management and timeout controls")
    }

    return recommendations
  }
}
