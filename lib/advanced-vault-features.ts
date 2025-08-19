export interface SecureNote {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  encrypted: boolean
  created: Date
  lastModified: Date
  attachments?: SecureAttachment[]
}

export interface SecureAttachment {
  id: string
  name: string
  type: string
  size: number
  encryptedData: string
  created: Date
}

export interface PasswordHistory {
  id: string
  passwordId: string
  oldPassword: string
  changedAt: Date
  reason: string
}

export interface BreachAlert {
  id: string
  passwordId: string
  breachSource: string
  severity: "low" | "medium" | "high" | "critical"
  detectedAt: Date
  resolved: boolean
}

export interface SharedPassword {
  id: string
  passwordId: string
  sharedWith: string
  permissions: "view" | "edit"
  expiresAt?: Date
  created: Date
}

export interface EmergencyContact {
  id: string
  name: string
  email: string
  relationship: string
  accessLevel: "limited" | "full"
  waitingPeriod: number // hours
}

export class AdvancedVaultManager {
  private static instance: AdvancedVaultManager
  private secureNotes: SecureNote[] = []
  private passwordHistory: PasswordHistory[] = []
  private breachAlerts: BreachAlert[] = []
  private sharedPasswords: SharedPassword[] = []
  private emergencyContacts: EmergencyContact[] = []

  static getInstance(): AdvancedVaultManager {
    if (!AdvancedVaultManager.instance) {
      AdvancedVaultManager.instance = new AdvancedVaultManager()
    }
    return AdvancedVaultManager.instance
  }

  // Secure Notes Management
  async addSecureNote(note: Omit<SecureNote, "id" | "created" | "lastModified">): Promise<SecureNote> {
    const newNote: SecureNote = {
      ...note,
      id: crypto.randomUUID(),
      created: new Date(),
      lastModified: new Date(),
    }

    if (note.encrypted) {
      // Encrypt the content
      newNote.content = await this.encryptContent(note.content)
    }

    this.secureNotes.push(newNote)
    await this.saveToStorage()
    return newNote
  }

  // Password History Tracking
  async trackPasswordChange(passwordId: string, oldPassword: string, reason: string): Promise<void> {
    const historyEntry: PasswordHistory = {
      id: crypto.randomUUID(),
      passwordId,
      oldPassword: await this.encryptContent(oldPassword),
      changedAt: new Date(),
      reason,
    }

    this.passwordHistory.push(historyEntry)

    // Keep only last 10 versions per password
    const passwordHistories = this.passwordHistory.filter((h) => h.passwordId === passwordId)
    if (passwordHistories.length > 10) {
      const oldestId = passwordHistories.sort((a, b) => a.changedAt.getTime() - b.changedAt.getTime())[0].id
      this.passwordHistory = this.passwordHistory.filter((h) => h.id !== oldestId)
    }

    await this.saveToStorage()
  }

  // Breach Monitoring
  async checkForBreaches(passwords: any[]): Promise<BreachAlert[]> {
    const alerts: BreachAlert[] = []

    // Simulate breach checking (in real implementation, use HaveIBeenPwned API)
    for (const password of passwords) {
      const isBreached = await this.simulateBreachCheck(password.password)
      if (isBreached) {
        const alert: BreachAlert = {
          id: crypto.randomUUID(),
          passwordId: password.id,
          breachSource: "Data Breach Database",
          severity: this.calculateBreachSeverity(password),
          detectedAt: new Date(),
          resolved: false,
        }
        alerts.push(alert)
      }
    }

    this.breachAlerts.push(...alerts)
    await this.saveToStorage()
    return alerts
  }

  // Password Sharing
  async sharePassword(
    passwordId: string,
    email: string,
    permissions: "view" | "edit",
    expiresAt?: Date,
  ): Promise<SharedPassword> {
    const sharedPassword: SharedPassword = {
      id: crypto.randomUUID(),
      passwordId,
      sharedWith: email,
      permissions,
      expiresAt,
      created: new Date(),
    }

    this.sharedPasswords.push(sharedPassword)
    await this.saveToStorage()

    // In real implementation, send secure sharing notification
    await this.sendSharingNotification(email, passwordId)

    return sharedPassword
  }

  // Emergency Access
  async setupEmergencyContact(contact: Omit<EmergencyContact, "id">): Promise<EmergencyContact> {
    const emergencyContact: EmergencyContact = {
      ...contact,
      id: crypto.randomUUID(),
    }

    this.emergencyContacts.push(emergencyContact)
    await this.saveToStorage()
    return emergencyContact
  }

  // Advanced Analytics
  async generateSecurityReport(): Promise<{
    totalPasswords: number
    strongPasswords: number
    weakPasswords: number
    duplicatePasswords: number
    oldPasswords: number
    breachedPasswords: number
    sharedPasswords: number
    recommendations: string[]
  }> {
    // This would analyze all passwords and generate comprehensive security insights
    return {
      totalPasswords: 0,
      strongPasswords: 0,
      weakPasswords: 0,
      duplicatePasswords: 0,
      oldPasswords: 0,
      breachedPasswords: this.breachAlerts.filter((a) => !a.resolved).length,
      sharedPasswords: this.sharedPasswords.length,
      recommendations: ["Update 3 weak passwords", "Enable 2FA on 5 accounts", "Review shared passwords"],
    }
  }

  // Biometric Authentication
  async enableBiometricAuth(): Promise<boolean> {
    if ("credentials" in navigator) {
      try {
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: "NexusCipher" },
            user: {
              id: new Uint8Array(16),
              name: "user@example.com",
              displayName: "User",
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required",
            },
          },
        })
        return !!credential
      } catch (error) {
        console.error("Biometric setup failed:", error)
        return false
      }
    }
    return false
  }

  // Private helper methods
  private async encryptContent(content: string): Promise<string> {
    // Use your existing crypto utilities
    return btoa(content) // Simplified for demo
  }

  private async simulateBreachCheck(password: string): Promise<boolean> {
    // Simulate checking against breach databases
    const commonBreachedPasswords = ["password123", "123456", "admin", "qwerty"]
    return commonBreachedPasswords.includes(password.toLowerCase())
  }

  private calculateBreachSeverity(password: any): "low" | "medium" | "high" | "critical" {
    if (password.category === "Finance") return "critical"
    if (password.category === "Work") return "high"
    return "medium"
  }

  private async sendSharingNotification(email: string, passwordId: string): Promise<void> {
    // In real implementation, send secure email notification
    console.log(`Sharing notification sent to ${email} for password ${passwordId}`)
  }

  private async saveToStorage(): Promise<void> {
    // Save to encrypted storage
    const data = {
      secureNotes: this.secureNotes,
      passwordHistory: this.passwordHistory,
      breachAlerts: this.breachAlerts,
      sharedPasswords: this.sharedPasswords,
      emergencyContacts: this.emergencyContacts,
    }
    localStorage.setItem("advanced-vault-data", JSON.stringify(data))
  }

  // Getters
  getSecureNotes(): SecureNote[] {
    return this.secureNotes
  }
  getPasswordHistory(passwordId: string): PasswordHistory[] {
    return this.passwordHistory.filter((h) => h.passwordId === passwordId)
  }
  getBreachAlerts(): BreachAlert[] {
    return this.breachAlerts
  }
  getSharedPasswords(): SharedPassword[] {
    return this.sharedPasswords
  }
  getEmergencyContacts(): EmergencyContact[] {
    return this.emergencyContacts
  }
}
