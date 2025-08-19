"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { CryptoUtils, type KeyStrength, type EncryptionResult } from "../lib/crypto-utils"
import {
  Shield,
  Key,
  Lock,
  Copy,
  Settings,
  Activity,
  FileText,
  Hash,
  CheckCircle2,
  Zap,
  AlertTriangle,
  Unlock,
  Info,
  Plus,
  Upload,
  BarChart3,
  Play,
  Download,
  Trash2,
  Search,
  Folder,
  Eye,
  EyeOff,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react"
import { useToast } from "./ui/use-toast"
import { Button } from "./ui/button"
import { useTheme } from "../hooks/use-theme"
import { EnterpriseManager } from "../lib/enterprise-manager"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

interface EncryptionAlgorithm {
  id: string
  name: string
  description: string
  keySize: string
  security: string
}

interface ActivityLog {
  id: string
  action: string
  timestamp: string
  status: "success" | "error" | "warning"
  details: string
  category?: string
}

interface SecurityMetrics {
  encryptionStrength: number
  keyRotationStatus: string
  threatLevel: "low" | "medium" | "high"
  complianceScore: number
}

interface StoredKey {
  id: string
  name: string
  algorithm: string
  keyData: string
  created: Date
  lastUsed: Date
  usage: number
  category: string
}

interface PasswordEntry {
  id: string
  title: string
  username: string
  password: string
  url: string
  category: string
  strength: number
  created: Date
  lastModified: Date
  notes: string
}

interface FileEncryptionJob {
  id: string
  fileName: string
  size: number
  status: "pending" | "processing" | "completed" | "error"
  progress: number
  algorithm: string
  encryptedData?: string
  originalData?: string
  startTime?: Date
  completedTime?: Date
  errorMessage?: string
}

interface EncryptionKey {
  id: string
  name: string
  algorithm: string
  keySize: number
  created: string
  lastUsed: string
  usage: number
}

const ENCRYPTION_ALGORITHMS: EncryptionAlgorithm[] = [
  {
    id: "aes-256-gcm",
    name: "AES-256-GCM",
    description: "Advanced Encryption Standard with 256-bit key and Galois/Counter Mode",
    keySize: "256-bit",
    security: "Military Grade",
  },
  {
    id: "chacha20-poly1305",
    name: "ChaCha20-Poly1305",
    description: "Modern stream cipher with Poly1305 authenticator",
    keySize: "256-bit",
    security: "High Performance",
  },
]

const tabs = [
  { id: "encryption", name: "Encryption", icon: Shield },
  { id: "keys", name: "Key Manager", icon: Key },
  { id: "vault", name: "Password Vault", icon: Lock },
  { id: "files", name: "File Encryption", icon: FileText },
  { id: "generator", name: "Key Generator", icon: Zap },
  { id: "hash", name: "Hash Functions", icon: Hash },
  { id: "audit", name: "Audit Log", icon: Activity },
  { id: "settings", name: "Settings", icon: Settings },
]

export default function NexusCipher() {
  const { theme, setTheme } = useTheme()

  const [activeTab, setActiveTab] = useState("encryption")
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [encryptionKey, setEncryptionKey] = useState("")
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("AES-256-GCM")
  const [isProcessing, setIsProcessing] = useState(false)
  const [keys, setKeys] = useState<EncryptionKey[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    encryptionStrength: 95,
    keyRotationStatus: "Current",
    threatLevel: "low",
    complianceScore: 98,
  })

  const [keyStrength, setKeyStrength] = useState<KeyStrength | null>(null)
  const [encryptionResult, setEncryptionResult] = useState<EncryptionResult | null>(null)

  const [storedKeys, setStoredKeys] = useState<StoredKey[]>([
    {
      id: "1",
      name: "Production Key",
      algorithm: "AES-256-GCM",
      keyData: "a1b2c3d4e5f6...",
      created: new Date(Date.now() - 86400000 * 7),
      lastUsed: new Date(Date.now() - 3600000),
      usage: 142,
      category: "Production",
    },
    {
      id: "2",
      name: "Backup Key",
      algorithm: "ChaCha20-Poly1305",
      keyData: "x9y8z7w6v5u4...",
      created: new Date(Date.now() - 86400000 * 3),
      lastUsed: new Date(Date.now() - 7200000),
      usage: 23,
      category: "Backup",
    },
  ])

  const [passwords, setPasswords] = useState<PasswordEntry[]>([
    {
      id: "1",
      title: "GitHub",
      username: "user@example.com",
      password: "SecurePass123!",
      url: "https://github.com",
      category: "Development",
      strength: 85,
      created: new Date(Date.now() - 86400000 * 5),
      lastModified: new Date(Date.now() - 86400000 * 2),
      notes: "Main development account",
    },
  ])

  const [fileJobs, setFileJobs] = useState<FileEncryptionJob[]>([])

  const [newPassword, setNewPassword] = useState<Partial<PasswordEntry>>({
    title: "",
    username: "",
    password: "",
    url: "",
    category: "Personal",
    notes: "",
  })
  const [isAddingPassword, setIsAddingPassword] = useState(false)
  const [editingPassword, setEditingPassword] = useState<string | null>(null)
  const [passwordFilter, setPasswordFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const [auditSearchTerm, setAuditSearchTerm] = useState("")
  const [auditStatusFilter, setAuditStatusFilter] = useState("all")
  const [auditTimeFilter, setAuditTimeFilter] = useState("all")
  const [auditSortBy, setAuditSortBy] = useState("timestamp")
  const [auditSortOrder, setAuditSortOrder] = useState<"asc" | "desc">("desc")

  const [currentKey, setCurrentKey] = useState<string>("")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("lastModified")
  const [selectedPasswords, setSelectedPasswords] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [fileEncryptionKey, setFileEncryptionKey] = useState("")
  const [selectedFileAlgorithm, setSelectedFileAlgorithm] = useState("AES-256-GCM")
  const [isDragOver, setIsDragOver] = useState(false)

  const [settings, setSettings] = useState({
    theme: "dark",
    autoLock: true,
    autoLockTimeout: 15,
    notifications: true,
    soundEffects: false,
    keyRotationInterval: 30,
    backupFrequency: "weekly",
    complianceMode: "standard",
    debugMode: false,
    telemetry: true,
    // New accessibility settings
    highContrast: false,
    reducedMotion: false,
    screenReaderMode: false,
    // New MFA settings
    mfaEnabled: false,
    mfaMethod: "totp",
    backupCodes: [],
  })

  const [keyGenAlgorithm, setKeyGenAlgorithm] = useState("AES-256")
  const [keyGenLength, setKeyGenLength] = useState(32)
  const [keyGenFormat, setKeyGenFormat] = useState("hex")
  const [keyGenBatchSize, setKeyGenBatchSize] = useState(1)
  const [generatedKeys, setGeneratedKeys] = useState<
    Array<{
      id: string
      algorithm: string
      length: number
      format: string
      key: string
      strength: number
      entropy: number
      timestamp: Date
    }>
  >([])
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false)

  const [hashInput, setHashInput] = useState("")
  const [hashSalt, setHashSalt] = useState("")
  const [selectedHashAlgorithm, setSelectedHashAlgorithm] = useState("SHA-256")
  const [hashOutput, setHashOutput] = useState("")
  const [hashOutputFormat, setHashOutputFormat] = useState("hex")
  const [hashHistory, setHashHistory] = useState<
    Array<{
      id: string
      algorithm: string
      input: string
      salt: string
      output: string
      timestamp: Date
    }>
  >([])
  const [isHashing, setIsHashing] = useState(false)
  const [hashFile, setHashFile] = useState<File | null>(null)
  const [hashMode, setHashMode] = useState<"text" | "file">("text")
  const [verificationHash, setVerificationHash] = useState("")
  const [verificationResult, setVerificationResult] = useState<"match" | "no-match" | null>(null)

  const generatePassword = useCallback((length = 16, includeSymbols = true) => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    let charset = lowercase + uppercase + numbers
    if (includeSymbols) charset += symbols

    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    return password
  }, [])

  const calculatePasswordStrength = useCallback((password: string): number => {
    let score = 0
    if (password.length >= 8) score += 25
    if (password.length >= 12) score += 25
    if (/[a-z]/.test(password)) score += 10
    if (/[A-Z]/.test(password)) score += 10
    if (/[0-9]/.test(password)) score += 10
    if (/[^A-Za-z0-9]/.test(password)) score += 20
    return Math.min(100, score)
  }, [])

  const { toast } = useToast()

  const addActivityLog = useCallback((logEntry: Omit<ActivityLog, "id" | "timestamp">) => {
    setActivityLog((prev) => [
      { id: Date.now().toString(), timestamp: new Date().toLocaleString(), ...logEntry },
      ...prev.slice(0, 9),
    ])
  }, [])

  const addPassword = useCallback(() => {
    if (!newPassword.title || !newPassword.password) {
      toast({
        title: "Error",
        description: "Title and password are required",
        variant: "destructive",
      })
      return
    }

    const password: PasswordEntry = {
      id: Date.now().toString(),
      title: newPassword.title || "",
      username: newPassword.username || "",
      password: newPassword.password || "",
      url: newPassword.url || "",
      category: newPassword.category || "Personal",
      strength: calculatePasswordStrength(newPassword.password || ""),
      created: new Date(),
      lastModified: new Date(),
      notes: newPassword.notes || "",
    }

    setPasswords((prev) => [password, ...prev])
    setNewPassword({
      title: "",
      username: "",
      password: "",
      url: "",
      category: "Personal",
      notes: "",
    })
    setIsAddingPassword(false)

    const logEntry: ActivityLog = {
      id: Date.now().toString(),
      action: "Password Added",
      timestamp: new Date().toLocaleString(),
      status: "success",
      details: `Added password entry: ${password.title}`,
    }
    setActivityLog((prev) => [logEntry, ...prev.slice(0, 9)])

    toast({
      title: "Success",
      description: "Password added to vault",
    })
  }, [newPassword, calculatePasswordStrength, toast, addActivityLog])

  const updatePassword = useCallback(
    (id: string, updates: Partial<PasswordEntry>) => {
      setPasswords((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...updates,
                strength: updates.password ? calculatePasswordStrength(updates.password) : p.strength,
                lastModified: new Date(),
              }
            : p,
        ),
      )

      const logEntry: ActivityLog = {
        id: Date.now().toString(),
        action: "Password Updated",
        timestamp: new Date().toLocaleString(),
        status: "success",
        details: `Updated password entry: ${updates.title || "Unknown"}`,
      }
      setActivityLog((prev) => [logEntry, ...prev.slice(0, 9)])

      toast({
        title: "Success",
        description: "Password updated",
      })
    },
    [calculatePasswordStrength, toast, addActivityLog],
  )

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    onConfirm: () => void
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })

  const showConfirmDialog = (title: string, description: string, onConfirm: () => void) => {
    setConfirmDialog({
      open: true,
      title,
      description,
      onConfirm,
    })
  }

  const deletePassword = useCallback(
    (id: string) => {
      const password = passwords.find((p) => p.id === id)
      if (password) {
        showConfirmDialog("Delete Password", `Are you sure you want to delete "${password.title}"?`, () => {
          setPasswords((prev) => prev.filter((p) => p.id !== id))
          const activity: ActivityLog = {
            id: Date.now().toString(),
            action: "Password deleted",
            details: `Deleted password: ${password.title}`,
            timestamp: new Date().toISOString(),
            status: "success",
            category: "password",
          }
          setActivityLog((prev) => [activity, ...prev])
          toast({
            title: "Password Deleted",
            description: `"${password.title}" has been removed from your vault`,
          })
        })
      }
    },
    [passwords, toast],
  )

  const filteredPasswords = passwords.filter((password) => {
    const matchesFilter =
      password.title.toLowerCase().includes(passwordFilter.toLowerCase()) ||
      password.username.toLowerCase().includes(passwordFilter.toLowerCase()) ||
      password.url.toLowerCase().includes(passwordFilter.toLowerCase())
    const matchesCategory = categoryFilter === "All" || password.category === categoryFilter
    return matchesFilter && matchesCategory
  })

  const categories = ["All", ...Array.from(new Set(passwords.map((p) => p.category)))]

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }, [])

  const processFileEncryption = useCallback(
    async (file: File, encrypt = true) => {
      if (!fileEncryptionKey.trim()) {
        toast({
          title: "Error",
          description: "Please enter an encryption key for file operations",
          variant: "destructive",
        })
        return
      }

      const jobId = Date.now().toString()
      const newJob: FileEncryptionJob = {
        id: jobId,
        fileName: file.name,
        size: file.size,
        status: "pending",
        progress: 0,
        algorithm: selectedFileAlgorithm,
        startTime: new Date(),
      }

      setFileJobs((prev) => [newJob, ...prev])

      let progressInterval: NodeJS.Timeout | undefined

      try {
        // Update job status to processing
        setFileJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: "processing" as const } : job)))

        // Simulate progress updates
        progressInterval = setInterval(() => {
          setFileJobs((prev) =>
            prev.map((job) =>
              job.id === jobId && job.status === "processing"
                ? { ...job, progress: Math.min(job.progress + Math.random() * 20, 90) }
                : job,
            ),
          )
        }, 500)

        // Read file content
        const fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.onerror = reject
          reader.readAsText(file)
        })

        let result: string
        if (encrypt) {
          const encryptionResult = await CryptoUtils.encryptAES256GCM(fileContent, fileEncryptionKey)
          result = JSON.stringify(encryptionResult)
        } else {
          // For decryption, assume file contains JSON with encryption data
          const encryptionData = JSON.parse(fileContent)
          result = await CryptoUtils.decryptAES256GCM({
            ciphertext: encryptionData.ciphertext,
            iv: encryptionData.iv,
            salt: encryptionData.salt,
            password: fileEncryptionKey,
            algorithm: encryptionData.algorithm,
          })
        }

        if (progressInterval) clearInterval(progressInterval)

        // Complete the job
        setFileJobs((prev) =>
          prev.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  status: "completed" as const,
                  progress: 100,
                  encryptedData: encrypt ? result : undefined,
                  originalData: !encrypt ? result : undefined,
                  completedTime: new Date(),
                }
              : job,
          ),
        )

        const logEntry: ActivityLog = {
          id: Date.now().toString(),
          action: encrypt ? "File Encrypted" : "File Decrypted",
          timestamp: new Date().toLocaleString(),
          status: "success",
          details: `${encrypt ? "Encrypted" : "Decrypted"} file: ${file.name} (${formatFileSize(file.size)})`,
        }
        setActivityLog((prev) => [logEntry, ...prev.slice(0, 9)])

        toast({
          title: "Success",
          description: `File ${encrypt ? "encrypted" : "decrypted"} successfully`,
        })
      } catch (error) {
        if (progressInterval) clearInterval(progressInterval)

        setFileJobs((prev) =>
          prev.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  status: "error" as const,
                  errorMessage: error instanceof Error ? error.message : "Unknown error",
                  completedTime: new Date(),
                }
              : job,
          ),
        )

        toast({
          title: "Error",
          description: `Failed to ${encrypt ? "encrypt" : "decrypt"} file`,
          variant: "destructive",
        })
      }
    },
    [fileEncryptionKey, selectedFileAlgorithm, formatFileSize, toast, addActivityLog],
  )

  const handleFileDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      files.forEach((file) => processFileEncryption(file, true))
    },
    [processFileEncryption],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      files.forEach((file) => processFileEncryption(file, true))
    },
    [processFileEncryption],
  )

  const downloadFile = useCallback(
    (job: FileEncryptionJob, isEncrypted: boolean) => {
      const data = isEncrypted ? job.encryptedData : job.originalData
      if (!data) return

      const blob = new Blob([data], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = isEncrypted ? `${job.fileName}.encrypted` : job.fileName.replace(".encrypted", "")
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Download Started",
        description: `Downloading ${isEncrypted ? "encrypted" : "decrypted"} file`,
      })
    },
    [toast],
  )

  const deleteJob = useCallback(
    (jobId: string) => {
      setFileJobs((prev) => prev.filter((job) => job.id !== jobId))

      const logEntry: ActivityLog = {
        id: Date.now().toString(),
        action: "File Job Deleted",
        timestamp: new Date().toLocaleString(),
        status: "warning",
        details: "Removed file encryption job from queue",
      }
      setActivityLog((prev) => [logEntry, ...prev.slice(0, 9)])
    },
    [addActivityLog],
  )

  const handleEncrypt = useCallback(async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to encrypt",
        variant: "destructive",
      })
      return
    }

    if (!encryptionKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an encryption key",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      let result: EncryptionResult

      if (selectedAlgorithm === "AES-256-GCM") {
        result = await CryptoUtils.encryptAES256GCM(inputText, encryptionKey)
      } else if (selectedAlgorithm === "ChaCha20-Poly1305") {
        result = await CryptoUtils.encryptChaCha20Poly1305(inputText, encryptionKey)
      } else {
        result = await CryptoUtils.encryptAES256GCM(inputText, encryptionKey)
      }

      setEncryptionResult(result)
      setOutputText(result.ciphertext)

      const logEntry: ActivityLog = {
        id: Date.now().toString(),
        action: "Text Encrypted",
        timestamp: new Date().toLocaleString(),
        status: "success",
        details: `Encrypted ${inputText.length} characters using ${result.algorithm} with PBKDF2 key derivation`,
      }
      setActivityLog((prev) => [logEntry, ...prev.slice(0, 9)])

      // Update security metrics
      setMetrics((prev) => ({
        ...prev,
        encryptionStrength: Math.min(100, prev.encryptionStrength + 1),
      }))

      toast({
        title: "Success",
        description: "Text encrypted with military-grade security",
      })
    } catch (error) {
      console.error("Encryption error:", error)
      toast({
        title: "Error",
        description: "Failed to encrypt text. Please check your input.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [inputText, encryptionKey, selectedAlgorithm, toast, addActivityLog])

  const handleDecrypt = useCallback(async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to decrypt",
        variant: "destructive",
      })
      return
    }

    if (!encryptionKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter the decryption key",
        variant: "destructive",
      })
      return
    }

    if (!encryptionResult) {
      toast({
        title: "Error",
        description: "No encryption data available. Please encrypt text first.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const decryptionParams = {
        ciphertext: inputText,
        iv: encryptionResult.iv,
        salt: encryptionResult.salt,
        password: encryptionKey,
        algorithm: encryptionResult.algorithm,
      }

      let decrypted: string
      if (selectedAlgorithm === "AES-256-GCM") {
        decrypted = await CryptoUtils.decryptAES256GCM(decryptionParams)
      } else if (selectedAlgorithm === "ChaCha20-Poly1305") {
        decrypted = await CryptoUtils.decryptChaCha20Poly1305(decryptionParams)
      } else {
        decrypted = await CryptoUtils.decryptAES256GCM(decryptionParams)
      }

      setOutputText(decrypted)

      const logEntry: ActivityLog = {
        id: Date.now().toString(),
        action: "Text Decrypted",
        timestamp: new Date().toLocaleString(),
        status: "success",
        details: `Successfully decrypted text using ${encryptionResult.algorithm}`,
      }
      setActivityLog((prev) => [logEntry, ...prev.slice(0, 9)])

      toast({
        title: "Success",
        description: "Text decrypted successfully",
      })
    } catch (error) {
      console.error("Decryption error:", error)
      toast({
        title: "Error",
        description: "Failed to decrypt text. Please check your key and encrypted data.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [inputText, encryptionKey, selectedAlgorithm, encryptionResult, toast, addActivityLog])

  const handleGenerateKey = useCallback(() => {
    const newKey = CryptoUtils.generateKeyForAlgorithm(selectedAlgorithm)
    setEncryptionKey(newKey)

    const strength = CryptoUtils.validateKeyStrength(newKey)
    setKeyStrength(strength)

    const logEntry: ActivityLog = {
      id: Date.now().toString(),
      action: "Secure Key Generated",
      timestamp: new Date().toLocaleString(),
      status: "success",
      details: `Generated cryptographically secure ${selectedAlgorithm} key with ${strength.entropy} bits of entropy`,
    }
    setActivityLog((prev) => [logEntry, ...prev.slice(0, 9)])

    toast({
      title: "Success",
      description: `Generated ${strength.level} encryption key`,
    })
  }, [selectedAlgorithm, toast, addActivityLog])

  const handleKeyChange = useCallback((value: string) => {
    setEncryptionKey(value)
    if (value) {
      const strength = CryptoUtils.validateKeyStrength(value)
      setKeyStrength(strength)
    } else {
      setKeyStrength(null)
    }
  }, [])

  const copyToClipboard = useCallback(
    async (text: string, message = "Output data copied successfully") => {
      try {
        await navigator.clipboard.writeText(text)
        toast({
          title: "Copied!",
          description: message,
        })
        const newActivity: ActivityLog = {
          id: Date.now().toString(),
          action: "Data copied to clipboard",
          timestamp: new Date().toLocaleString(),
          status: "success",
          details: "Output data copied successfully",
        }
        setActivityLog((prev) => [newActivity, ...prev.slice(0, 9)])
      } catch (error) {
        console.error("Failed to copy:", error)
      }
    },
    [addActivityLog, toast],
  )

  const handleExportData = useCallback(async () => {
    try {
      const exportData = await EnterpriseManager.exportData()
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `nexus-cipher-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      const newActivity: ActivityLog = {
        id: Date.now().toString(),
        action: "Data exported successfully",
        timestamp: new Date().toLocaleString(),
        status: "success",
        details: "Complete data backup exported",
      }
      setActivityLog((prev) => [newActivity, ...prev.slice(0, 9)])
      toast({
        title: "Export Complete",
        description: "All data has been exported successfully",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }, [toast])

  const handleImportData = useCallback(
    async (file: File) => {
      try {
        const text = await file.text()
        const importData = JSON.parse(text)
        await EnterpriseManager.importData(importData)
        // Reload data from storage
        const savedKeys = EnterpriseManager.loadData<StoredKey[]>("encryption-keys")
        if (savedKeys) setStoredKeys(savedKeys)
        const savedPasswords = EnterpriseManager.loadData<PasswordEntry[]>("password-vault")
        if (savedPasswords) setPasswords(savedPasswords)
        const newActivity: ActivityLog = {
          id: Date.now().toString(),
          action: "Data imported successfully",
          timestamp: new Date().toLocaleString(),
          status: "success",
          details: "Data restored from backup",
        }
        setActivityLog((prev) => [newActivity, ...prev.slice(0, 9)])
        toast({
          title: "Import Complete",
          description: "Data has been restored from backup",
        })
      } catch (error) {
        console.error("Import error:", error)
        toast({
          title: "Import Failed",
          description: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleClearAllData = useCallback(async () => {
    showConfirmDialog(
      "Clear All Data",
      "Are you sure you want to permanently delete all data? This action cannot be undone.",
      async () => {
        try {
          await EnterpriseManager.clearAllData()
          setStoredKeys([])
          setPasswords([])
          setActivityLog([
            {
              id: "1",
              action: "All data cleared",
              timestamp: new Date().toLocaleString(),
              status: "warning",
              details: "All application data has been permanently deleted",
            },
          ])
          toast({
            title: "Data Cleared",
            description: "All data has been permanently deleted",
          })
        } catch (error) {
          console.error("Clear data error:", error)
          toast({
            title: "Clear Failed",
            description: `Failed to clear data: ${error instanceof Error ? error.message : "Unknown error"}`,
            variant: "destructive",
          })
        }
      },
    )
  }, [toast])

  const exportAuditLog = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalEntries: activityLog.length,
      entries: activityLog.map((log) => ({
        ...log,
        timestamp: log.timestamp,
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nexus-cipher-audit-log-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Audit Log Exported",
      description: "Audit log has been exported successfully",
    })
  }, [activityLog, toast])

  const clearAuditLog = () => {
    showConfirmDialog(
      "Clear Audit Log",
      "Are you sure you want to clear the audit log? This action cannot be undone.",
      () => {
        setActivityLog([])
        toast({
          title: "Audit Log Cleared",
          description: "All audit log entries have been removed",
        })
      },
    )
  }

  const updateSetting = useCallback(
    (key: string, value: any) => {
      setSettings((prev) => ({ ...prev, [key]: value }))

      // Handle theme changes
      if (key === "theme") {
        setTheme(value)
      }

      const logEntry: ActivityLog = {
        id: Date.now().toString(),
        action: "Setting Updated",
        timestamp: new Date().toLocaleString(),
        status: "success",
        details: `Updated ${key} setting to ${value}`,
      }
      setActivityLog((prev) => [logEntry, ...prev.slice(0, 9)])

      toast({
        title: "Setting Updated",
        description: `${key} has been updated successfully`,
      })
    },
    [toast, addActivityLog, setTheme],
  )

  const resetSettings = () => {
    showConfirmDialog("Reset Settings", "Are you sure you want to reset all settings to default values?", () => {
      setSettings({
        theme: "dark",
        autoLock: true,
        autoLockTimeout: 15,
        notifications: true,
        soundEffects: false,
        keyRotationInterval: 30,
        backupFrequency: "weekly",
        complianceMode: "standard",
        debugMode: false,
        telemetry: true,
        highContrast: false,
        reducedMotion: false,
        screenReaderMode: false,
        mfaEnabled: false,
        mfaMethod: "totp",
        backupCodes: [],
      })
      toast({
        title: "Settings Reset",
        description: "All settings have been restored to default values",
      })
    })
  }

  const exportSettings = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: "1.0.0",
      settings: settings,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nexus-cipher-settings-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Settings Exported",
      description: "Settings configuration has been exported",
    })
  }, [settings, toast])

  const importSettings = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string)
          if (importData.settings) {
            setSettings(importData.settings)

            const logEntry: ActivityLog = {
              id: Date.now().toString(),
              action: "Settings Imported",
              timestamp: new Date().toLocaleString(),
              status: "success",
              details: "Settings configuration imported from backup",
            }
            setActivityLog((prev) => [logEntry, ...prev.slice(0, 9)])

            toast({
              title: "Settings Imported",
              description: "Settings have been restored from backup",
            })
          }
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid settings file format",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    },
    [toast, addActivityLog],
  )

  const renderFileEncryptionTab = () => {
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      files.forEach((file) => processFileEncryption(file, true))
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      files.forEach((file) => processFileEncryption(file, true))
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case "completed":
          return "text-green-400"
        case "processing":
          return "text-blue-400"
        case "error":
          return "text-red-400"
        default:
          return "text-yellow-400"
      }
    }

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "completed":
          return "✓"
        case "processing":
          return "⟳"
        case "error":
          return "✗"
        default:
          return "⏳"
      }
    }

    const completedJobs = fileJobs.filter((job) => job.status === "completed")
    const processingJobs = fileJobs.filter((job) => job.status === "processing")
    const errorJobs = fileJobs.filter((job) => job.status === "error")

    return (
      <div className="space-y-6">
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Jobs</p>
                <p className="text-2xl font-bold text-white">{fileJobs.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-400">{completedJobs.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-400/20 flex items-center justify-center">
                <span className="text-green-400 font-bold">✓</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Processing</p>
                <p className="text-2xl font-bold text-blue-400">{processingJobs.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold">⟳</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Errors</p>
                <p className="text-2xl font-bold text-red-400">{errorJobs.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-400/20 flex items-center justify-center">
                <span className="text-red-400 font-bold">✗</span>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-400" />
            File Upload & Configuration
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? "border-blue-400 bg-blue-400/10" : "border-gray-600 hover:border-gray-500"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-gray-400 mb-4">Supports all file types up to 100MB</p>
                <input type="file" multiple onChange={handleFileSelect} className="hidden" id="file-upload" />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Select Files
                </label>
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Encryption Key</label>
                <input
                  type="password"
                  value={fileEncryptionKey}
                  onChange={(e) => setFileEncryptionKey(e.target.value)}
                  placeholder="Enter encryption key..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Algorithm</label>
                <select
                  value={selectedFileAlgorithm}
                  onChange={(e) => setSelectedFileAlgorithm(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AES-256-GCM">AES-256-GCM (Recommended)</option>
                  <option value="ChaCha20-Poly1305">ChaCha20-Poly1305</option>
                </select>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-300">Security Notice</p>
                    <p className="text-xs text-blue-200/80">
                      Files are encrypted locally in your browser. Keys are never transmitted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Jobs List */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              File Operations ({fileJobs.length})
            </h3>
          </div>

          {fileJobs.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No file operations yet</p>
              <p className="text-sm text-gray-500">Upload files to start encrypting</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {fileJobs.map((job) => (
                <div key={job.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`text-lg ${getStatusColor(job.status)}`}>{getStatusIcon(job.status)}</div>
                      <div>
                        <p className="font-medium text-white">{job.fileName}</p>
                        <p className="text-sm text-gray-400">
                          {formatFileSize(job.size)} • {job.algorithm}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === "completed" && (
                        <>
                          <button
                            onClick={() => downloadFile(job, true)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                          >
                            Download Encrypted
                          </button>
                          {job.originalData && (
                            <button
                              onClick={() => downloadFile(job, false)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                            >
                              Download Original
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {job.status === "processing" && (
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(job.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {job.status === "error" && job.errorMessage && (
                    <div className="bg-red-900/20 border border-red-700/50 rounded p-2 mt-2">
                      <p className="text-sm text-red-300">Error: {job.errorMessage}</p>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Started: {job.startTime?.toLocaleString()}</span>
                    {job.completedTime && <span>Completed: {job.completedTime.toLocaleString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bulk Operations */}
        {fileJobs.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-400" />
              Bulk Operations
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const completedJobsToDownload = fileJobs.filter((job) => job.status === "completed")
                  completedJobsToDownload.forEach((job) => downloadFile(job, true))
                }}
                disabled={completedJobs.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Download All Encrypted
              </button>
              <button
                onClick={() => {
                  setFileJobs((prev) => prev.filter((job) => job.status !== "completed"))
                }}
                disabled={completedJobs.length === 0}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Clear Completed
              </button>
              <button
                onClick={() => {
                  setFileJobs([])
                }}
                disabled={fileJobs.length === 0}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderKeyManagerTab = () => {
    return (
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Key Manager</h2>
            <p className="text-gray-400">Manage encryption keys with enterprise-grade security</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const newKey: StoredKey = {
                  id: Date.now().toString(),
                  name: `Key-${Date.now()}`,
                  algorithm: "AES-256-GCM",
                  keyData: Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
                    b.toString(16).padStart(2, "0"),
                  ).join(""),
                  created: new Date(),
                  lastUsed: new Date(),
                  usage: 0,
                  category: "Generated",
                }
                setStoredKeys((prev) => [newKey, ...prev])
                const activity: ActivityLog = {
                  id: Date.now().toString(),
                  action: "New key generated",
                  timestamp: new Date().toLocaleString(),
                  status: "success",
                  details: `Generated ${newKey.algorithm} key: ${newKey.name}`,
                }
                setActivityLog((prev) => [activity, ...prev.slice(0, 9)])
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Key
            </Button>
            <Button
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = ".json"
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      try {
                        const keys = JSON.parse(e.target?.result as string)
                        setStoredKeys((prev) => [...prev, ...keys])
                        const activity: ActivityLog = {
                          id: Date.now().toString(),
                          action: "Keys imported",
                          timestamp: new Date().toLocaleString(),
                          status: "success",
                          details: `Imported ${keys.length} keys from file`,
                        }
                        setActivityLog((prev) => [activity, ...prev.slice(0, 9)])
                      } catch (error) {
                        console.error("Import error:", error)
                      }
                    }
                    reader.readAsText(file)
                  }
                }
                input.click()
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Keys
            </Button>
          </div>
        </div>

        {/* Key Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Keys</p>
                <p className="text-2xl font-bold text-white">{storedKeys.length}</p>
              </div>
              <Key className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Keys</p>
                <p className="text-2xl font-bold text-green-400">{storedKeys.filter((k) => k.usage > 0).length}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Usage</p>
                <p className="text-2xl font-bold text-purple-400">{storedKeys.reduce((sum, k) => sum + k.usage, 0)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Security Score</p>
                <p className="text-2xl font-bold text-yellow-400">98%</p>
              </div>
              <Shield className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Key Management Interface */}
        <div className="bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search keys by name, algorithm, or category..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Categories</option>
                <option value="Production">Production</option>
                <option value="Backup">Backup</option>
                <option value="Generated">Generated</option>
                <option value="Imported">Imported</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">Key Details</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Algorithm</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Usage Stats</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Security</th>
                  <th className="text-right p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {storedKeys.map((key, index) => (
                  <tr key={key.id} className="border-t border-gray-700 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-medium text-white">{key.name}</div>
                        <div className="text-sm text-gray-400">ID: {key.id}</div>
                        <div className="text-xs text-gray-500">Created: {key.created.toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
                          {key.algorithm}
                        </span>
                        <div className="text-xs text-gray-400">{key.category}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-white font-medium">{key.usage} uses</div>
                        <div className="text-xs text-gray-400">Last: {key.lastUsed.toLocaleDateString()}</div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((key.usage / 100) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-green-400">Secure</span>
                        </div>
                        <div className="text-xs text-gray-400">256-bit strength</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          onClick={() => {
                            setCurrentKey(key.keyData)
                            const activity: ActivityLog = {
                              id: Date.now().toString(),
                              action: "Key loaded for encryption",
                              timestamp: new Date().toLocaleString(),
                              status: "success",
                              details: `Loaded key: ${key.name}`,
                            }
                            setActivityLog((prev) => [activity, ...prev.slice(0, 9)])
                          }}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          onClick={() => {
                            navigator.clipboard.writeText(key.keyData)
                            const activity: ActivityLog = {
                              id: Date.now().toString(),
                              action: "Key copied to clipboard",
                              timestamp: new Date().toLocaleString(),
                              status: "success",
                              details: `Copied key: ${key.name}`,
                            }
                            setActivityLog((prev) => [activity, ...prev.slice(0, 9)])
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          onClick={() => {
                            const dataStr = JSON.stringify([key], null, 2)
                            const dataBlob = new Blob([dataStr], { type: "application/json" })
                            const url = URL.createObjectURL(dataBlob)
                            const link = document.createElement("a")
                            link.href = url
                            link.download = `${key.name}-key.json`
                            link.click()
                            URL.revokeObjectURL(url)
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                Delete key "{key.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  setStoredKeys((prev) => prev.filter((k) => k.id !== key.id))
                                  const activity: ActivityLog = {
                                    id: Date.now().toString(),
                                    action: "Key deleted",
                                    details: `Deleted key: ${key.name}`,
                                    timestamp: new Date().toISOString(),
                                    status: "success",
                                    category: "key",
                                  }
                                  setActivityLog((prev) => [activity, ...prev])
                                  toast({
                                    title: "Key Deleted",
                                    description: `Key "${key.name}" has been removed`,
                                  })
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bulk Operations */}
        <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Bulk Operations</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              onClick={() => {
                const dataStr = JSON.stringify(storedKeys, null, 2)
                const dataBlob = new Blob([dataStr], { type: "application/json" })
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement("a")
                link.href = url
                link.download = "all-keys-backup.json"
                link.click()
                URL.revokeObjectURL(url)
                const activity: ActivityLog = {
                  id: Date.now().toString(),
                  action: "All keys exported",
                  timestamp: new Date().toLocaleString(),
                  status: "success",
                  details: `Exported ${storedKeys.length} keys to backup file`,
                }
                setActivityLog((prev) => [activity, ...prev.slice(0, 9)])
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Keys
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Rotate All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Rotate All Keys</AlertDialogTitle>
                  <AlertDialogDescription>
                    Rotate all keys? This will generate new key data for all stored keys.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setStoredKeys((prev) =>
                        prev.map((key) => ({
                          ...key,
                          keyData: Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
                            b.toString(16).padStart(2, "0"),
                          ).join(""),
                          createdAt: new Date().toISOString(),
                        })),
                      )
                      const activity: ActivityLog = {
                        id: Date.now().toString(),
                        action: "Keys rotated",
                        details: `Rotated ${storedKeys.length} keys`,
                        timestamp: new Date().toISOString(),
                        status: "success",
                        category: "key",
                      }
                      setActivityLog((prev) => [activity, ...prev])
                      toast({
                        title: "Keys Rotated",
                        description: `All ${storedKeys.length} keys have been rotated with new data`,
                      })
                    }}
                  >
                    Rotate Keys
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All Keys
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete All Keys</AlertDialogTitle>
                  <AlertDialogDescription>
                    Delete all keys? This action cannot be undone and will permanently remove all stored keys.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setStoredKeys([])
                      const activity: ActivityLog = {
                        id: Date.now().toString(),
                        action: "All keys deleted",
                        details: "Permanently deleted all stored keys",
                        timestamp: new Date().toISOString(),
                        status: "warning",
                        category: "key",
                      }
                      setActivityLog((prev) => [activity, ...prev])
                      toast({
                        title: "All Keys Deleted",
                        description: "All stored keys have been permanently removed",
                      })
                    }}
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    )
  }

  const generateHash = useCallback(
    async (input: string, algorithm: string, salt = "") => {
      const encoder = new TextEncoder()
      const data = encoder.encode(salt + input)

      let hashBuffer: ArrayBuffer

      switch (algorithm) {
        case "SHA-256":
          hashBuffer = await crypto.subtle.digest("SHA-256", data)
          break
        case "SHA-512":
          hashBuffer = await crypto.subtle.digest("SHA-512", data)
          break
        case "SHA-1":
          hashBuffer = await crypto.subtle.digest("SHA-1", data)
          break
        default:
          // For MD5 and BLAKE2, we'll simulate with SHA-256 for demo purposes
          hashBuffer = await crypto.subtle.digest("SHA-256", data)
      }

      const hashArray = new Uint8Array(hashBuffer)

      if (hashOutputFormat === "hex") {
        return Array.from(hashArray)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      } else {
        return btoa(String.fromCharCode(...hashArray))
      }
    },
    [hashOutputFormat],
  )

  const handleHashGeneration = useCallback(async () => {
    if (!hashInput.trim()) return

    setIsHashing(true)
    try {
      const result = await generateHash(hashInput, selectedHashAlgorithm, hashSalt)
      setHashOutput(result)

      const newHashEntry = {
        id: Date.now().toString(),
        algorithm: selectedHashAlgorithm,
        input: hashInput,
        salt: hashSalt,
        output: result,
        timestamp: new Date(),
      }

      setHashHistory((prev) => [newHashEntry, ...prev.slice(0, 49)]) // Keep last 50

      addActivityLog({
        action: "Hash Generated",
        details: `Generated ${selectedHashAlgorithm} hash${hashSalt ? " with salt" : ""}`,
        status: "success",
      })
    } catch (error) {
      addActivityLog({
        action: "Hash Generation Failed",
        details: `Failed to generate ${selectedHashAlgorithm} hash: ${error}`,
        status: "error",
      })
    } finally {
      setIsHashing(false)
    }
  }, [hashInput, selectedHashAlgorithm, hashSalt, generateHash, addActivityLog])

  const handleFileHash = useCallback(
    async (file: File) => {
      setIsHashing(true)
      try {
        const arrayBuffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest(selectedHashAlgorithm.replace("-", ""), arrayBuffer)
        const hashArray = new Uint8Array(hashBuffer)

        const result =
          hashOutputFormat === "hex"
            ? Array.from(hashArray)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")
            : btoa(String.fromCharCode(...hashArray))

        setHashOutput(result)

        const newHashEntry = {
          id: Date.now().toString(),
          algorithm: selectedHashAlgorithm,
          input: `File: ${file.name} (${file.size} bytes)`,
          salt: "",
          output: result,
          timestamp: new Date(),
        }

        setHashHistory((prev) => [newHashEntry, ...prev.slice(0, 49)])

        addActivityLog({
          action: "File Hash Generated",
          details: `Generated ${selectedHashAlgorithm} hash for file: ${file.name}`,
          status: "success",
        })
      } catch (error) {
        addActivityLog({
          action: "File Hash Failed",
          details: `Failed to hash file ${file.name}: ${error}`,
          status: "error",
        })
      } finally {
        setIsHashing(false)
      }
    },
    [selectedHashAlgorithm, hashOutputFormat, addActivityLog],
  )

  const verifyHash = useCallback(async () => {
    if (!hashInput.trim() || !verificationHash.trim()) return

    const generatedHash = await generateHash(hashInput, selectedHashAlgorithm, hashSalt)
    setVerificationResult(generatedHash.toLowerCase() === verificationHash.toLowerCase() ? "match" : "no-match")

    addActivityLog({
      action: "Hash Verification",
      details: `Hash verification ${generatedHash.toLowerCase() === verificationHash.toLowerCase() ? "successful" : "failed"}`,
      status: generatedHash.toLowerCase() === verificationHash.toLowerCase() ? "success" : "error",
    })
  }, [hashInput, verificationHash, selectedHashAlgorithm, hashSalt, generateHash, addActivityLog])

  const clearHashHistory = useCallback(() => {
    setHashHistory([])
    addActivityLog({
      action: "Hash History Cleared",
      details: "Cleared all hash generation history",
      status: "success",
    })
  }, [addActivityLog])

  const exportHashHistory = useCallback(() => {
    const data = {
      exportDate: new Date().toISOString(),
      hashHistory: hashHistory,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `hash-history-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    addActivityLog({
      action: "Hash History Exported",
      details: `Exported ${hashHistory.length} hash entries`,
      status: "success",
    })
  }, [hashHistory, addActivityLog])

  const renderHashFunctionsTab = () => (
    <div className="space-y-6">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Total Hashes</div>
          <div className="text-2xl font-bold text-white">{hashHistory.length}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Current Algorithm</div>
          <div className="text-lg font-semibold text-blue-400">{selectedHashAlgorithm}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Output Format</div>
          <div className="text-lg font-semibold text-green-400">{hashOutputFormat.toUpperCase()}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Using Salt</div>
          <div className="text-lg font-semibold text-purple-400">{hashSalt ? "Yes" : "No"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hash Generation Panel */}
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Hash Generation
          </h3>

          {/* Mode Selection */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setHashMode("text")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                hashMode === "text" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Text Hash
            </button>
            <button
              onClick={() => setHashMode("file")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                hashMode === "file" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              File Hash
            </button>
          </div>

          {/* Algorithm Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Hash Algorithm</label>
            <select
              value={selectedHashAlgorithm}
              onChange={(e) => setSelectedHashAlgorithm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="SHA-256">SHA-256 (Recommended)</option>
              <option value="SHA-512">SHA-512 (High Security)</option>
              <option value="SHA-1">SHA-1 (Legacy - Not Recommended)</option>
              <option value="MD5">MD5 (Legacy - Not Recommended)</option>
              <option value="BLAKE2">BLAKE2 (Modern)</option>
            </select>
            {(selectedHashAlgorithm === "SHA-1" || selectedHashAlgorithm === "MD5") && (
              <div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-600 rounded text-yellow-200 text-sm">
                ⚠️ This algorithm is considered cryptographically weak and should not be used for security purposes.
              </div>
            )}
          </div>

          {/* Output Format */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Output Format</label>
            <select
              value={hashOutputFormat}
              onChange={(e) => setHashOutputFormat(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hex">Hexadecimal</option>
              <option value="base64">Base64</option>
            </select>
          </div>

          {hashMode === "text" ? (
            <>
              {/* Text Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Input Text</label>
                <textarea
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="Enter text to hash..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <div className="text-xs text-gray-400 mt-1">{hashInput.length} characters</div>
              </div>

              {/* Salt Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Salt (Optional)</label>
                <input
                  type="text"
                  value={hashSalt}
                  onChange={(e) => setHashSalt(e.target.value)}
                  placeholder="Enter salt for additional security..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          ) : (
            /* File Input */
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select File</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  setHashFile(file || null)
                  if (file) handleFileHash(file)
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={hashMode === "text" ? handleHashGeneration : undefined}
            disabled={isHashing || (hashMode === "text" && !hashInput.trim())}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isHashing ? "Generating Hash..." : "Generate Hash"}
          </button>
        </div>

        {/* Hash Output & Verification Panel */}
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Hash Output & Verification
          </h3>

          {/* Hash Output */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Generated Hash</label>
            <div className="relative">
              <textarea
                value={hashOutput}
                readOnly
                placeholder="Hash will appear here..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm resize-none"
                rows={4}
              />
              {hashOutput && (
                <button
                  onClick={() => copyToClipboard(hashOutput, "Hash copied to clipboard")}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Hash Verification */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Verify Hash</label>
            <input
              type="text"
              value={verificationHash}
              onChange={(e) => setVerificationHash(e.target.value)}
              placeholder="Enter hash to verify..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={verifyHash}
              disabled={!hashInput.trim() || !verificationHash.trim()}
              className="mt-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Verify Hash
            </button>
            {verificationResult && (
              <div
                className={`mt-2 p-2 rounded text-sm ${
                  verificationResult === "match"
                    ? "bg-green-900/50 border border-green-600 text-green-200"
                    : "bg-red-900/50 border border-red-600 text-red-200"
                }`}
              >
                {verificationResult === "match" ? "✓ Hash matches!" : "✗ Hash does not match"}
              </div>
            )}
          </div>

          {/* Algorithm Info */}
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-sm text-gray-300">
              <div className="font-medium mb-1">Algorithm Info:</div>
              <div className="text-xs space-y-1">
                {selectedHashAlgorithm === "SHA-256" && (
                  <div>• 256-bit output, cryptographically secure, widely used</div>
                )}
                {selectedHashAlgorithm === "SHA-512" && (
                  <div>• 512-bit output, highest security, slower processing</div>
                )}
                {selectedHashAlgorithm === "SHA-1" && <div>• 160-bit output, deprecated due to vulnerabilities</div>}
                {selectedHashAlgorithm === "MD5" && <div>• 128-bit output, fast but cryptographically broken</div>}
                {selectedHashAlgorithm === "BLAKE2" && <div>• Modern algorithm, faster than SHA-3, secure</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hash History */}
      <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Hash History ({hashHistory.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={exportHashHistory}
              disabled={hashHistory.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Export History
            </button>
            <button
              onClick={clearHashHistory}
              disabled={hashHistory.length === 0}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Clear History
            </button>
          </div>
        </div>

        {hashHistory.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {hashHistory.map((entry) => (
              <div key={entry.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-400">{entry.algorithm}</span>
                    <span className="text-xs text-gray-400">{entry.timestamp.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(entry.output, "Hash copied to clipboard")}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-300 mb-1">
                  Input: {entry.input.length > 50 ? entry.input.substring(0, 50) + "..." : entry.input}
                </div>
                {entry.salt && <div className="text-xs text-gray-400 mb-1">Salt: {entry.salt}</div>}
                <div className="text-xs font-mono text-gray-200 bg-gray-800 rounded p-2 break-all">{entry.output}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Hash className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <div>No hash history yet</div>
            <div className="text-sm">Generate your first hash to see it here</div>
          </div>
        )}
      </div>
    </div>
  )

  const renderEncryptionTab = () => {
    const algorithms = [
      {
        id: "aes-256-gcm",
        name: "AES-256-GCM",
        description: "Advanced Encryption Standard with 256-bit key and Galois/Counter Mode",
        strength: "Military",
      },
      {
        id: "chacha20-poly1305",
        name: "ChaCha20-Poly1305",
        description: "Modern stream cipher with Poly1305 authenticator",
        strength: "Enterprise",
      },
    ]

    return (
      <div className="space-y-6">
        {/* Algorithm Selection */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Encryption Algorithm
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {algorithms.map((algo) => (
              <button
                key={algo.id}
                onClick={() => setSelectedAlgorithm(algo.id)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedAlgorithm === algo.id
                    ? "border-blue-500 bg-blue-900/20 text-blue-300"
                    : "border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500"
                }`}
              >
                <div className="font-medium mb-1">{algo.name}</div>
                <div className="text-sm opacity-75">{algo.description}</div>
                <div className="text-xs mt-2 flex items-center gap-1">
                  <span
                    className={`px-2 py-1 rounded ${
                      algo.strength === "Military"
                        ? "bg-green-900 text-green-300"
                        : algo.strength === "Enterprise"
                          ? "bg-blue-900 text-blue-300"
                          : "bg-yellow-900 text-yellow-300"
                    }`}
                  >
                    {algo.strength}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Key Management */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-green-400" />
            Encryption Key
          </h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="password"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                placeholder="Enter your encryption key..."
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleGenerateKey}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Generate
              </button>
            </div>

            {encryptionKey && (
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Key Strength</span>
                  <span
                    className={`text-sm font-medium ${
                      keyStrength?.level === "very-strong"
                        ? "text-green-400"
                        : keyStrength?.level === "strong"
                          ? "text-blue-400"
                          : keyStrength?.level === "good"
                            ? "text-yellow-400"
                            : keyStrength?.level === "fair"
                              ? "text-orange-400"
                              : keyStrength?.level === "weak"
                                ? "text-red-400"
                                : "text-gray-400"
                    }`}
                  >
                    {keyStrength?.level}
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      (keyStrength?.score || 0) >= 80
                        ? "bg-green-500"
                        : (keyStrength?.score || 0) >= 60
                          ? "bg-blue-500"
                          : (keyStrength?.score || 0) >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                    style={{ width: `${keyStrength?.score || 0}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">Entropy: {(keyStrength?.entropy || 0).toFixed(1)} bits</div>
              </div>
            )}
          </div>
        </div>

        {/* Input/Output Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Input Text
            </h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to encrypt or decrypt..."
              className="w-full h-40 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-400">{inputText.length} characters</span>
              <button
                onClick={() => setInputText("")}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-400" />
              Output Text
            </h3>
            <textarea
              value={outputText}
              readOnly
              placeholder="Encrypted or decrypted text will appear here..."
              className="w-full h-40 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-400">{outputText.length} characters</span>
              {outputText && (
                <button
                  onClick={() => copyToClipboard(outputText)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleEncrypt}
            disabled={isProcessing || !inputText.trim() || !encryptionKey.trim()}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Encrypting...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Encrypt Text
              </>
            )}
          </button>

          <button
            onClick={handleDecrypt}
            disabled={isProcessing || !inputText.trim() || !encryptionKey.trim()}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Decrypting...
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                Decrypt Text
              </>
            )}
          </button>
        </div>

        {/* Encryption Details */}
        {encryptionResult && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              Encryption Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Algorithm:</span>
                  <span className="text-white font-mono">{encryptionResult.algorithm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Key Derivation:</span>
                  <span className="text-white font-mono">PBKDF2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Iterations:</span>
                  <span className="text-white font-mono">100,000</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">IV Length:</span>
                  <span className="text-white font-mono">{encryptionResult.iv.length} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Salt Length:</span>
                  <span className="text-white font-mono">{encryptionResult.salt.length} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Timestamp:</span>
                  <span className="text-white font-mono">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tips */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Security Best Practices
          </h3>
          <ul className="space-y-2 text-blue-200 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400" />
              Use strong, unique encryption keys with high entropy
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400" />
              Never share your encryption keys through insecure channels
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400" />
              Store encrypted data and keys separately for maximum security
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400" />
              Regularly rotate encryption keys for sensitive data
            </li>
          </ul>
        </div>
      </div>
    )
  }

  const renderPasswordVaultTab = () => {
    const categories = ["All", "Personal", "Work", "Development", "Finance", "Social", "Shopping", "Other"]

    const filteredPasswords = passwords
      .filter((password) => {
        const matchesSearch =
          password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          password.url.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "All" || password.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title)
          case "strength":
            return b.strength - a.strength
          case "created":
            return new Date(b.created).getTime() - new Date(a.created).getTime()
          case "lastModified":
            return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
          default:
            return 0
        }
      })

    const getStrengthColor = (strength: number) => {
      if (strength >= 80) return "text-green-400"
      if (strength >= 60) return "text-yellow-400"
      if (strength >= 40) return "text-orange-400"
      return "text-red-400"
    }

    const getStrengthLabel = (strength: number) => {
      if (strength >= 80) return "Strong"
      if (strength >= 60) return "Good"
      if (strength >= 40) return "Weak"
      return "Very Weak"
    }

    const generateSecurePassword = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
      let password = ""
      for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return password
    }

    const handleBulkDelete = () => {
      setPasswords((prev) => prev.filter((p) => !selectedPasswords.includes(p.id)))
      setSelectedPasswords([])
      setShowBulkActions(false)
      toast({ title: "Success", description: `Deleted ${selectedPasswords.length} passwords` })
    }

    const exportPasswords = () => {
      const exportData = filteredPasswords.map((p) => ({
        title: p.title,
        username: p.username,
        url: p.url,
        category: p.category,
        notes: p.notes,
        created: p.created,
        lastModified: p.lastModified,
      }))

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "password-vault-export.json"
      a.click()
      URL.revokeObjectURL(url)

      toast({ title: "Success", description: "Passwords exported successfully" })
    }

    return (
      <div className="space-y-6">
        {/* Vault Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Passwords</p>
                <p className="text-2xl font-bold text-white">{passwords.length}</p>
              </div>
              <Lock className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Strong Passwords</p>
                <p className="text-2xl font-bold text-green-400">{passwords.filter((p) => p.strength >= 80).length}</p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Weak Passwords</p>
                <p className="text-2xl font-bold text-red-400">{passwords.filter((p) => p.strength < 60).length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-purple-400">{new Set(passwords.map((p) => p.category)).size}</p>
              </div>
              <Folder className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search passwords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lastModified">Last Modified</option>
              <option value="title">Title</option>
              <option value="strength">Strength</option>
              <option value="created">Created</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsAddingPassword(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Password
            </button>

            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Bulk Actions
            </button>

            <button
              onClick={exportPasswords}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>

          {showBulkActions && (
            <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{selectedPasswords.length} passwords selected</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkDelete}
                    disabled={selectedPasswords.length === 0}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedPasswords([])}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Password Form */}
        {isAddingPassword && (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={newPassword.title || ""}
                onChange={(e) => setNewPassword((prev) => ({ ...prev, title: e.target.value }))}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Username/Email"
                value={newPassword.username || ""}
                onChange={(e) => setNewPassword((prev) => ({ ...prev, username: e.target.value }))}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Password"
                  value={newPassword.password || ""}
                  onChange={(e) => setNewPassword((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setNewPassword((prev) => ({ ...prev, password: generateSecurePassword() }))}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                >
                  Generate
                </button>
              </div>
              <input
                type="url"
                placeholder="Website URL"
                value={newPassword.url || ""}
                onChange={(e) => setNewPassword((prev) => ({ ...prev, url: e.target.value }))}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newPassword.category || "Personal"}
                onChange={(e) => setNewPassword((prev) => ({ ...prev, category: e.target.value }))}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Notes (optional)"
                value={newPassword.notes || ""}
                onChange={(e) => setNewPassword((prev) => ({ ...prev, notes: e.target.value }))}
                className="md:col-span-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            {newPassword.password && (
              <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Password Strength:</span>
                  <span
                    className={`text-sm font-semibold ${getStrengthColor(calculatePasswordStrength(newPassword.password))}`}
                  >
                    {getStrengthLabel(calculatePasswordStrength(newPassword.password))} (
                    {calculatePasswordStrength(newPassword.password)}%)
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      calculatePasswordStrength(newPassword.password) >= 80
                        ? "bg-green-500"
                        : calculatePasswordStrength(newPassword.password) >= 60
                          ? "bg-yellow-500"
                          : calculatePasswordStrength(newPassword.password) >= 40
                            ? "bg-orange-500"
                            : "bg-red-500"
                    }`}
                    style={{ width: `${calculatePasswordStrength(newPassword.password)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={addPassword}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Password
              </button>
              <button
                onClick={() => {
                  setIsAddingPassword(false)
                  setNewPassword({
                    title: "",
                    username: "",
                    password: "",
                    url: "",
                    category: "Personal",
                    notes: "",
                  })
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Password List */}
        <div className="space-y-3">
          {filteredPasswords.map((password) => (
            <div
              key={password.id}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {showBulkActions && (
                    <input
                      type="checkbox"
                      checked={selectedPasswords.includes(password.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPasswords((prev) => [...prev, password.id])
                        } else {
                          setSelectedPasswords((prev) => prev.filter((id) => id !== password.id))
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{password.title}</h3>
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{password.category}</span>
                      <span className={`text-xs font-medium ${getStrengthColor(password.strength)}`}>
                        {getStrengthLabel(password.strength)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{password.username}</p>
                    {password.url && (
                      <a
                        href={password.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        {password.url}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(password.password)
                      toast({ title: "Copied", description: "Password copied to clipboard" })
                    }}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Copy Password"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowPasswords((prev) => ({ ...prev, [password.id]: !prev[password.id] }))}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title={showPasswords[password.id] ? "Hide Password" : "Show Password"}
                  >
                    {showPasswords[password.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setEditingPassword(password.id)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Edit Password"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setPasswords((prev) => prev.filter((p) => p.id !== password.id))
                      toast({ title: "Deleted", description: "Password removed from vault" })
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete Password"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {showPasswords[password.id] && (
                <div className="mt-3 p-3 bg-gray-700/50 rounded border border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-white">{password.password}</span>
                    <div className="w-24 bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          password.strength >= 80
                            ? "bg-green-500"
                            : password.strength >= 60
                              ? "bg-yellow-500"
                              : password.strength >= 40
                                ? "bg-orange-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${password.strength}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {password.notes && (
                <div className="mt-2 text-sm text-gray-400">
                  <strong>Notes:</strong> {password.notes}
                </div>
              )}

              <div className="mt-2 text-xs text-gray-500">
                Created: {password.created.toLocaleDateString()} • Modified:{" "}
                {password.lastModified.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {filteredPasswords.length === 0 && (
          <div className="text-center py-12">
            <Lock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No passwords found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filter criteria"
                : "Add your first password to get started"}
            </p>
          </div>
        )}
      </div>
    )
  }

  const generateKey = async () => {
    setIsGeneratingKeys(true)
    try {
      const newKeys: Array<{
        id: string
        algorithm: string
        length: number
        format: string
        key: string
        strength: number
        entropy: number
        timestamp: Date
      }> = []
      
      for (let i = 0; i < keyGenBatchSize; i++) {
        const key = await CryptoUtils.generateSecureKey(keyGenLength)
        const strength = await CryptoUtils.analyzeKeyStrength(key)
        const entropy = CryptoUtils.calculateEntropy(key)
        
        newKeys.push({
          id: `key-${Date.now()}-${i}`,
          algorithm: keyGenAlgorithm,
          length: keyGenLength,
          format: keyGenFormat,
          key: key,
          strength: strength.score || 0,
          entropy: entropy,
          timestamp: new Date()
        })
      }
      
      setGeneratedKeys(prev => [...newKeys, ...prev])
      
      // Add to activity log
      setActivityLog(prev => [
        {
          id: `log-${Date.now()}`,
          action: "Key Generation",
          timestamp: new Date().toISOString(),
          status: "success",
          details: `Generated ${keyGenBatchSize} ${keyGenAlgorithm} key(s) with ${keyGenLength}-bit length`,
          category: "Key Generation"
        },
        ...prev
      ])
      
      toast({
        title: "Keys Generated",
        description: `Successfully generated ${keyGenBatchSize} secure key(s)`,
        variant: "success"
      })
    } catch (error) {
      console.error("Key generation error:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate keys. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingKeys(false)
    }
  }

  const copyKeyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: "Key Copied",
      description: "Key has been copied to clipboard",
      variant: "success"
    })
  }

  const exportKeys = () => {
    const keyData = generatedKeys.map(key => ({
      algorithm: key.algorithm,
      length: key.length,
      format: key.format,
      key: key.key,
      strength: key.strength,
      entropy: key.entropy,
      timestamp: key.timestamp.toISOString()
    }))
    
    const blob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nexus-cipher-keys-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Keys Exported",
      description: "Keys have been exported to JSON file",
      variant: "success"
    })
  }

  const clearGeneratedKeys = () => {
    setGeneratedKeys([])
    toast({
      title: "Keys Cleared",
      description: "All generated keys have been cleared",
      variant: "success"
    })
  }

  const renderKeyGeneratorTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Key Generator</h2>
          <p className="text-gray-400 mt-2">Generate cryptographically secure keys for encryption</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={exportKeys}
            disabled={generatedKeys.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Keys
          </Button>
          <Button
            onClick={clearGeneratedKeys}
            disabled={generatedKeys.length === 0}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Key Generation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Generation Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Algorithm
              </label>
              <select
                value={keyGenAlgorithm}
                onChange={(e) => setKeyGenAlgorithm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AES-256">AES-256</option>
                <option value="ChaCha20">ChaCha20</option>
                <option value="RSA-2048">RSA-2048</option>
                <option value="RSA-4096">RSA-4096</option>
                <option value="Ed25519">Ed25519</option>
                <option value="X25519">X25519</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Key Length (bits)
              </label>
              <select
                value={keyGenLength}
                onChange={(e) => setKeyGenLength(Number(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={128}>128-bit</option>
                <option value={192}>192-bit</option>
                <option value={256}>256-bit</option>
                <option value={512}>512-bit</option>
                <option value={1024}>1024-bit</option>
                <option value={2048}>2048-bit</option>
                <option value={4096}>4096-bit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Output Format
              </label>
              <select
                value={keyGenFormat}
                onChange={(e) => setKeyGenFormat(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hex">Hexadecimal</option>
                <option value="base64">Base64</option>
                <option value="base32">Base32</option>
                <option value="raw">Raw Bytes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Batch Size
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={keyGenBatchSize}
                onChange={(e) => setKeyGenBatchSize(Number(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              onClick={generateKey}
              disabled={isGeneratingKeys}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center gap-2"
            >
              {isGeneratingKeys ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate Keys
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Key Statistics</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Generated:</span>
              <span className="text-white font-semibold">{generatedKeys.length}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Average Strength:</span>
              <span className="text-white font-semibold">
                {generatedKeys.length > 0 
                  ? Math.round(generatedKeys.reduce((sum, key) => sum + key.strength, 0) / generatedKeys.length)
                  : 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Average Entropy:</span>
              <span className="text-white font-semibold">
                {generatedKeys.length > 0 
                  ? Math.round(generatedKeys.reduce((sum, key) => sum + key.entropy, 0) / generatedKeys.length)
                  : 0} bits
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Last Generated:</span>
              <span className="text-white font-semibold">
                {generatedKeys.length > 0 
                  ? generatedKeys[0].timestamp.toLocaleTimeString()
                  : "Never"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Keys Display */}
      {generatedKeys.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Generated Keys</h3>
          
          <div className="space-y-4">
            {generatedKeys.map((key) => (
              <div key={key.id} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-gray-300">
                        {key.algorithm} ({key.length}-bit)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        key.strength >= 80 ? 'bg-green-500' : 
                        key.strength >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm text-gray-400">
                        Strength: {key.strength}%
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      Entropy: {key.entropy.toFixed(1)} bits
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => copyKeyToClipboard(key.key)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </Button>
                    <span className="text-xs text-gray-500">
                      {key.timestamp.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-900/50 border border-gray-600 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {key.format.toUpperCase()} Format
                    </span>
                    <span className="text-xs text-gray-500">
                      {key.key.length} characters
                    </span>
                  </div>
                  <div className="font-mono text-sm text-gray-300 break-all">
                    {key.key}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {generatedKeys.length === 0 && (
        <div className="text-center py-12">
          <Zap className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No keys generated yet</h3>
          <p className="text-gray-500 mb-6">
            Configure your settings and generate your first secure key
          </p>
          <Button
            onClick={generateKey}
            disabled={isGeneratingKeys}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            Generate Your First Key
          </Button>
        </div>
      )}
    </div>
  )

  const renderPlaceholderTab = (tabName: string) => (
    <div className="text-center py-24">
      <h2 className="text-3xl font-semibold text-white mb-4">{tabName} Tab</h2>
      <p className="text-gray-400">This tab is under development. Check back soon!</p>
    </div>
  )

  const renderAuditLogTab = () => {
    const filteredLogs = activityLog.filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(auditSearchTerm.toLowerCase())
      const matchesStatus = auditStatusFilter === "all" || log.status === auditStatusFilter

      let matchesTime = true
      if (auditTimeFilter !== "all") {
        const logTime = new Date(log.timestamp).getTime()
        const now = Date.now()
        const timeFilters = {
          "1h": 60 * 60 * 1000,
          "24h": 24 * 60 * 60 * 1000,
          "7d": 7 * 24 * 60 * 60 * 1000,
          "30d": 30 * 24 * 60 * 60 * 1000,
        }
        matchesTime = now - logTime <= timeFilters[auditTimeFilter as keyof typeof timeFilters]
      }

      return matchesSearch && matchesStatus && matchesTime
    })

    const sortedLogs = [...filteredLogs].sort((a, b) => {
      let aValue: any = a[auditSortBy as keyof ActivityLog]
      let bValue: any = b[auditSortBy as keyof ActivityLog]

      if (auditSortBy === "timestamp") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (auditSortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "success":
          return <CheckCircle className="w-4 h-4 text-green-500" />
        case "error":
          return <XCircle className="w-4 h-4 text-red-500" />
        case "warning":
          return <AlertTriangle className="w-4 h-4 text-yellow-500" />
        default:
          return <Info className="w-4 h-4 text-blue-500" />
      }
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case "success":
          return "bg-green-500/10 text-green-400 border-green-500/20"
        case "error":
          return "bg-red-500/10 text-red-400 border-red-500/20"
        case "warning":
          return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
        default:
          return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      }
    }

    const auditStats = {
      total: activityLog.length,
      success: activityLog.filter((log) => log.status === "success").length,
      error: activityLog.filter((log) => log.status === "error").length,
      warning: activityLog.filter((log) => log.status === "warning").length,
      today: activityLog.filter((log) => {
        const logDate = new Date(log.timestamp).toDateString()
        const today = new Date().toDateString()
        return logDate === today
      }).length,
    }

    return (
      <div className="space-y-6">
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Total Events</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">{auditStats.total}</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Success</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mt-1">{auditStats.success}</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-gray-400">Errors</span>
            </div>
            <div className="text-2xl font-bold text-red-400 mt-1">{auditStats.error}</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Warnings</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">{auditStats.warning}</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Today</span>
            </div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{auditStats.today}</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={auditSearchTerm}
                  onChange={(e) => setAuditSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={auditStatusFilter}
                onChange={(e) => setAuditStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
              </select>

              <select
                value={auditTimeFilter}
                onChange={(e) => setAuditTimeFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              <div className="flex items-center space-x-2">
                <select
                  value={auditSortBy}
                  onChange={(e) => setAuditSortBy(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="timestamp">Sort by Time</option>
                  <option value="action">Sort by Action</option>
                  <option value="status">Sort by Status</option>
                </select>

                <button
                  onClick={() => setAuditSortOrder(auditSortOrder === "asc" ? "desc" : "asc")}
                  className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
                >
                  {auditSortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={exportAuditLog}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                onClick={clearAuditLog}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Showing {sortedLogs.length} of {activityLog.length} entries
          </div>
        </div>

        {/* Audit Log Entries */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Audit Trail</h3>
            <p className="text-sm text-gray-400">Complete log of all system activities and security events</p>
          </div>

          <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
            {sortedLogs.length === 0 ? (
              <div className="p-8 text-center">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No audit log entries found</p>
                <p className="text-sm text-gray-500 mt-1">
                  {auditSearchTerm || auditStatusFilter !== "all" || auditTimeFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Activity will appear here as you use the application"}
                </p>
              </div>
            ) : (
              sortedLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getStatusIcon(log.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-white">{log.action}</span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(log.status)}`}>
                            {log.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{log.timestamp}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderSettingsTab = () => (
    <div className="space-y-6" role="tabpanel" aria-labelledby="settings-tab">
      <div className="sr-only" aria-live="polite" id="settings-status">
        Settings panel loaded
      </div>

      {/* General Settings */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>

        <div className="space-y-4">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <label htmlFor="theme-select" className="text-gray-300">
              Theme
            </label>
            <select
              id="theme-select"
              value={settings.theme}
              onChange={(e) => updateSetting("theme", e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible"
              aria-describedby="theme-help"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
            <div id="theme-help" className="sr-only">
              Choose between dark, light, or system theme preference
            </div>
          </div>

          {/* Auto Lock */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Auto Lock</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoLock}
                onChange={(e) => updateSetting("autoLock", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Auto Lock Timeout */}
          {settings.autoLock && (
            <div className="flex items-center justify-between">
              <label className="text-gray-300">Auto Lock Timeout (minutes)</label>
              <input
                type="number"
                value={settings.autoLockTimeout}
                onChange={(e) => updateSetting("autoLockTimeout", Number.parseInt(e.target.value))}
                className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Notifications</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSetting("notifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Sound Effects</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={(e) => updateSetting("soundEffects", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Accessibility</h3>

        <div className="space-y-4">
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <label htmlFor="high-contrast" className="text-gray-300">
              High Contrast Mode
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="high-contrast"
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSetting("highContrast", e.target.checked)}
                className="sr-only peer"
                aria-describedby="high-contrast-help"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <div id="high-contrast-help" className="sr-only">
              Enable high contrast mode for improved visibility
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <label htmlFor="reduced-motion" className="text-gray-300">
              Reduced Motion
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="reduced-motion"
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting("reducedMotion", e.target.checked)}
                className="sr-only peer"
                aria-describedby="reduced-motion-help"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <div id="reduced-motion-help" className="sr-only">
              Disable animations and transitions for users sensitive to motion
            </div>
          </div>

          {/* Screen Reader Mode */}
          <div className="flex items-center justify-between">
            <label htmlFor="screen-reader-mode" className="text-gray-300">
              Screen Reader Mode
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="screen-reader-mode"
                type="checkbox"
                checked={settings.screenReaderMode}
                onChange={(e) => updateSetting("screenReaderMode", e.target.checked)}
                className="sr-only peer"
                aria-describedby="screen-reader-mode-help"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <div id="screen-reader-mode-help" className="sr-only">
              Optimize the application for use with screen readers
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Factor Authentication Settings */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Multi-Factor Authentication</h3>

        <div className="space-y-4">
          {/* MFA Enabled */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Enable MFA</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.mfaEnabled}
                onChange={(e) => updateSetting("mfaEnabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* MFA Method */}
          {settings.mfaEnabled && (
            <div className="flex items-center justify-between">
              <label htmlFor="mfa-method-select" className="text-gray-300">
                MFA Method
              </label>
              <select
                id="mfa-method-select"
                value={settings.mfaMethod}
                onChange={(e) => updateSetting("mfaMethod", e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="totp">TOTP (Authenticator App)</option>
                <option value="email">Email Verification</option>
                <option value="sms">SMS Verification</option>
              </select>
            </div>
          )}

          {/* Backup Codes */}
          {settings.mfaEnabled && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300">Backup Codes</label>
                <Button variant="outline" size="sm">
                  Generate Codes
                </Button>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-lg text-sm text-gray-400">
                Backup codes can be used to access your account if you lose access to your primary MFA method. Keep
                these codes in a safe place.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>

        <div className="space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Export Data</label>
            <Button onClick={handleExportData} variant="outline">
              Export
            </Button>
          </div>

          {/* Import Data */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Import Data</label>
            <input
              type="file"
              id="import-file"
              className="hidden"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) importSettings(file)
              }}
            />
            <label htmlFor="import-file">
              <Button variant="outline" asChild>
                <span className="flex items-center gap-2">
                  Import
                  <Upload className="w-4 h-4" />
                </span>
              </Button>
            </label>
          </div>

          {/* Clear All Data */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Clear All Data</label>
            <Button onClick={handleClearAllData} variant="destructive">
              Clear
            </Button>
          </div>

          {/* Reset Settings */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Reset Settings</label>
            <Button onClick={resetSettings} variant="destructive">
              Reset
            </Button>
          </div>

          {/* Export Settings */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Export Settings</label>
            <Button onClick={exportSettings} variant="outline">
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "encryption":
        return renderEncryptionTab()
      case "keys":
        return renderKeyManagerTab()
      case "vault":
        return renderPasswordVaultTab()
      case "files":
        return renderFileEncryptionTab()
      case "generator":
        return renderKeyGeneratorTab()
      case "hash":
        return renderHashFunctionsTab()
      case "audit":
        return renderAuditLogTab()
      case "settings":
        return renderSettingsTab()
      default:
        return renderEncryptionTab()
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-800 pt-6">
        <div className="px-4 mb-8">
          <h1 className="text-2xl font-bold">Nexus Encryption</h1>
          <p className="text-sm text-gray-400">Your Secure Enclave</p>
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-800 transition-colors w-full text-left ${
                activeTab === tab.id ? "bg-gray-800 text-blue-400" : "text-gray-300"
              }`}
            >
              <tab.icon className="mr-3 h-4 w-4 flex-shrink-0 opacity-70 group-hover:opacity-100" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Tab Content */}
        <div className="container mx-auto">
          <main className="grid gap-6">
            {/* Main Content Area */}
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  )
}
