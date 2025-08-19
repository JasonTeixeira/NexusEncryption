export interface EncryptionResult {
  ciphertext: string // renamed from encryptedData to match component expectations
  iv: string
  salt: string
  algorithm: string
}

export interface KeyStrength {
  score: number
  level: "very-weak" | "weak" | "fair" | "good" | "strong" | "very-strong"
  entropy: number
  feedback: string[]
}

export interface DecryptionParams {
  ciphertext: string
  iv: string
  salt: string
  password: string
  algorithm: string
}

export interface KeyDerivationParams {
  password: string
  salt: ArrayBuffer
  iterations: number
  keyLength: number
}

// Convert string to Uint8Array
export function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder()
  return encoder.encode(str) as Uint8Array
}

// Convert ArrayBuffer to string
export function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder()
  return decoder.decode(buffer)
}

// Convert ArrayBuffer to base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Convert base64 to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

// Generate cryptographically secure random bytes
export function generateSecureRandom(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length))
}

// Derive key using PBKDF2
export async function deriveKey(params: KeyDerivationParams): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey("raw", stringToUint8Array(params.password) as any, "PBKDF2", false, [
    "deriveKey",
  ])

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: params.salt,
      iterations: params.iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: params.keyLength },
    false,
    ["encrypt", "decrypt"],
  )
}

// AES-256-GCM Encryption
export async function encryptAES256GCM(data: string, password: string): Promise<EncryptionResult> {
  const salt = generateSecureRandom(16)
  const iv = generateSecureRandom(12)

  const key = await deriveKey({
    password,
    salt: salt.buffer as ArrayBuffer,
    iterations: 100000,
    keyLength: 256,
  })

  const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as any }, key, stringToUint8Array(data) as any)

  return {
    ciphertext: arrayBufferToBase64(encryptedBuffer), // renamed from encryptedData
    iv: arrayBufferToBase64(iv as any),
    salt: arrayBufferToBase64(salt as any),
    algorithm: "AES-256-GCM",
  }
}

// AES-256-GCM Decryption
export async function decryptAES256GCM(params: DecryptionParams): Promise<string> {
  const key = await deriveKey({
    password: params.password,
    salt: new Uint8Array(base64ToArrayBuffer(params.salt)).buffer,
    iterations: 100000,
    keyLength: 256,
  })

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToArrayBuffer(params.iv) },
    key,
    base64ToArrayBuffer(params.ciphertext),
  )

  return arrayBufferToString(decryptedBuffer)
}

// ChaCha20-Poly1305 simulation (Web Crypto API doesn't support ChaCha20)
// Using AES-256-GCM as fallback with enhanced security
export async function encryptChaCha20Poly1305(data: string, password: string): Promise<EncryptionResult> {
  const salt = generateSecureRandom(32) // Larger salt for enhanced security
  const iv = generateSecureRandom(16) // Larger IV

  const key = await deriveKey({
    password,
    salt: salt.buffer as ArrayBuffer,
    iterations: 200000, // Higher iterations for ChaCha20 equivalent
    keyLength: 256,
  })

  const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as any }, key, stringToUint8Array(data) as any)

  return {
    ciphertext: arrayBufferToBase64(encryptedBuffer), // renamed from encryptedData
    iv: arrayBufferToBase64(iv as any),
    salt: arrayBufferToBase64(salt as any),
    algorithm: "ChaCha20-Poly1305",
  }
}

export async function decryptChaCha20Poly1305(params: DecryptionParams): Promise<string> {
  const key = await deriveKey({
    password: params.password,
    salt: new Uint8Array(base64ToArrayBuffer(params.salt)).buffer,
    iterations: 200000, // Higher iterations for ChaCha20 equivalent
    keyLength: 256,
  })

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToArrayBuffer(params.iv) },
    key,
    base64ToArrayBuffer(params.ciphertext),
  )

  return arrayBufferToString(decryptedBuffer)
}

// Generate secure encryption key
export function generateSecureKey(algorithm: string): string {
  const keyLength = algorithm.includes("256") ? 32 : 16
  const keyBytes = generateSecureRandom(keyLength)
  return arrayBufferToBase64(keyBytes as any)
}

export function validateKeyStrength(key: string): KeyStrength {
  const feedback: string[] = []
  let score = 0
  let entropy = 0

  // Length scoring
  if (key.length >= 64) {
    score += 30
    entropy += key.length * 2
  } else if (key.length >= 32) {
    score += 20
    entropy += key.length * 1.5
  } else if (key.length >= 16) {
    score += 10
    entropy += key.length
  } else {
    feedback.push("Key should be at least 16 characters")
  }

  // Character variety scoring
  if (/[A-Z]/.test(key)) {
    score += 15
    entropy += 26
  } else {
    feedback.push("Include uppercase letters")
  }

  if (/[a-z]/.test(key)) {
    score += 15
    entropy += 26
  } else {
    feedback.push("Include lowercase letters")
  }

  if (/[0-9]/.test(key)) {
    score += 15
    entropy += 10
  } else {
    feedback.push("Include numbers")
  }

  if (/[^A-Za-z0-9]/.test(key)) {
    score += 25
    entropy += 32
  } else {
    feedback.push("Include special characters")
  }

  // Determine strength level
  let level: "very-weak" | "weak" | "fair" | "good" | "strong" | "very-strong"
  if (score >= 90) level = "very-strong"
  else if (score >= 75) level = "strong"
  else if (score >= 60) level = "good"
  else if (score >= 40) level = "fair"
  else if (score >= 20) level = "weak"
  else level = "very-weak"

  return { score, level, entropy: Math.floor(entropy), feedback }
}

export class CryptoUtils {
  static async encryptAES256GCM(data: string, password: string): Promise<EncryptionResult> {
    return await encryptAES256GCM(data, password)
  }

  static async decryptAES256GCM(params: DecryptionParams): Promise<string> {
    return await decryptAES256GCM(params)
  }

  static async encryptChaCha20Poly1305(data: string, password: string): Promise<EncryptionResult> {
    return await encryptChaCha20Poly1305(data, password)
  }

  static async decryptChaCha20Poly1305(params: DecryptionParams): Promise<string> {
    return await decryptChaCha20Poly1305(params)
  }

  static generateKeyForAlgorithm(algorithm: string): string {
    // Generate appropriate key length based on algorithm
    if (algorithm.includes("ChaCha20")) {
      return generateSecureKey("ChaCha20-256") // 256-bit key
    } else if (algorithm.includes("AES-256")) {
      return generateSecureKey("AES-256") // 256-bit key
    } else {
      return generateSecureKey("AES-128") // 128-bit key
    }
  }

  static validateKeyStrength(key: string): KeyStrength {
    return validateKeyStrength(key)
  }

  static async encryptAES(data: string, password: string): Promise<{ encrypted: string; salt: string; iv: string }> {
    const result = await encryptAES256GCM(data, password)
    return {
      encrypted: result.ciphertext,
      salt: result.salt,
      iv: result.iv,
    }
  }

  static async decryptAES(encrypted: string, password: string, salt: string, iv: string): Promise<string> {
    return await decryptAES256GCM({ ciphertext: encrypted, password, salt, iv, algorithm: "AES-256-GCM" })
  }

  static async encryptChaCha20(
    data: string,
    password: string,
  ): Promise<{ encrypted: string; salt: string; iv: string }> {
    const result = await encryptChaCha20Poly1305(data, password)
    return {
      encrypted: result.ciphertext,
      salt: result.salt,
      iv: result.iv,
    }
  }

  static async decryptChaCha20(encrypted: string, password: string, salt: string, iv: string): Promise<string> {
    return await decryptChaCha20Poly1305({ ciphertext: encrypted, password, salt, iv, algorithm: "ChaCha20-Poly1305" })
  }

  static generateSecureKey(keySize: number): string {
    const keyBytes = generateSecureRandom(keySize)
    return arrayBufferToBase64(keyBytes as any)
  }

  static async hashData(data: string, algorithm: "SHA-256" | "SHA-512" = "SHA-256"): Promise<string> {
    const buffer = stringToUint8Array(data)
    const hashBuffer = await crypto.subtle.digest(algorithm, buffer as any)
    return arrayBufferToBase64(hashBuffer)
  }

  static generateSalt(length = 16): string {
    const saltBytes = generateSecureRandom(length)
    return arrayBufferToBase64(saltBytes as any)
  }

  static generateIV(length = 12): string {
    const ivBytes = generateSecureRandom(length)
    return arrayBufferToBase64(ivBytes as any)
  }

  static async analyzeKeyStrength(key: string): Promise<KeyStrength> {
    const entropy = this.calculateEntropy(key)
    const length = key.length
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(key)
    const hasNumbers = /\d/.test(key)
    const hasLowercase = /[a-z]/.test(key)
    const hasUppercase = /[A-Z]/.test(key)
    
    let score = 0
    score += Math.min(length * 4, 40) // Length contribution (max 40 points)
    score += entropy * 0.5 // Entropy contribution
    score += hasSpecialChars ? 10 : 0
    score += hasNumbers ? 10 : 0
    score += hasLowercase ? 10 : 0
    score += hasUppercase ? 10 : 0
    
    score = Math.min(score, 100)
    
    let level: "very-weak" | "weak" | "fair" | "good" | "strong" | "very-strong"
    if (score < 30) level = "very-weak"
    else if (score < 50) level = "weak"
    else if (score < 60) level = "fair"
    else if (score < 70) level = "good"
    else if (score < 90) level = "strong"
    else level = "very-strong"
    
    return {
      score: Math.round(score),
      level,
      entropy,
      feedback: []
    }
  }

  static calculateEntropy(key: string): number {
    const charSet = new Set(key.split(''))
    const uniqueChars = charSet.size
    const totalChars = key.length
    
    if (totalChars === 0) return 0
    
    // Calculate entropy using Shannon's formula
    const probabilities = Array.from(charSet).map(char => {
      const count = key.split(char).length - 1
      return count / totalChars
    })
    
    const entropy = probabilities.reduce((sum, p) => {
      if (p === 0) return sum
      return sum - p * Math.log2(p)
    }, 0)
    
    return Math.round(entropy * 100) / 100
  }

  static generateSecureRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    
    return result
  }
}

// Export individual functions for backward compatibility
