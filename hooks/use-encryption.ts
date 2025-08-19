"use client"

import { useState, useCallback, useRef } from "react"
import { CryptoUtils } from "../lib/crypto-utils"
import { PerformanceMonitor } from "../lib/performance-monitor"
import { CacheManager } from "../lib/cache-manager"
import { EnterpriseManager } from "../lib/enterprise-manager"
import type { ActivityLog } from "../types/encryption"

interface UseEncryptionOptions {
  onActivityUpdate?: (activity: ActivityLog) => void
  onMetricsUpdate?: (metrics: any) => void
}

export const useEncryption = ({ onActivityUpdate, onMetricsUpdate }: UseEncryptionOptions = {}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const workerRef = useRef<Worker | null>(null)
  const performanceMonitor = useRef(new PerformanceMonitor())
  const cacheManager = useRef(new CacheManager())

  const initializeWorker = useCallback(() => {
    if (typeof Worker !== "undefined" && !workerRef.current) {
      workerRef.current = new Worker(new URL("../lib/crypto-worker.ts", import.meta.url))
    }
  }, [])

  const encrypt = useCallback(
    async (inputData: string, encryptionKey: string, algorithm: string): Promise<string> => {
      if (!inputData || !encryptionKey) {
        throw new Error("Please provide both data and encryption key")
      }

      const metricId = performanceMonitor.current.startMetric("encryption_operation")
      setIsProcessing(true)

      try {
        const cacheKey = `encrypt_${btoa(inputData)}_${btoa(encryptionKey)}_${algorithm}`
        let result = cacheManager.current.get<{ encrypted: string; salt: string; iv: string }>(cacheKey)

        if (!result) {
          if (workerRef.current && inputData.length > 1000) {
            result = await new Promise((resolve, reject) => {
              const worker = workerRef.current!
              const handleMessage = (e: MessageEvent) => {
                worker.removeEventListener("message", handleMessage)
                if (e.data.success) {
                  resolve(e.data.result)
                } else {
                  reject(new Error(e.data.error))
                }
              }
              worker.addEventListener("message", handleMessage)
              worker.postMessage({
                type: "encrypt",
                data: { inputData, key: encryptionKey, algorithm },
              })
            })
          } else {
            switch (algorithm) {
              case "aes-256-gcm":
                result = await CryptoUtils.encryptAES(inputData, encryptionKey)
                break
              case "chacha20-poly1305":
                result = await CryptoUtils.encryptChaCha20(inputData, encryptionKey)
                break
              default:
                result = await CryptoUtils.encryptAES(inputData, encryptionKey)
            }
          }
          cacheManager.current.set(cacheKey, result, 300000)
        }

        if (!result) {
          throw new Error("Failed to encrypt data")
        }

        const encryptedOutput = JSON.stringify(
          {
            algorithm,
            encrypted: result.encrypted,
            salt: result.salt,
            iv: result.iv,
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        )

        onActivityUpdate?.({
          id: Date.now().toString(),
          action: "Data encrypted successfully",
          timestamp: new Date(),
          status: "success",
          details: `${formatBytes(new Blob([inputData]).size)} encrypted with ${algorithm}`,
        })

        onMetricsUpdate?.((prev: any) => ({
          ...prev,
          totalEncryptions: prev.totalEncryptions + 1,
        }))

        performanceMonitor.current.endMetric(metricId)
        return encryptedOutput
      } catch (error) {
        performanceMonitor.current.endMetric(metricId)
        onActivityUpdate?.({
          id: Date.now().toString(),
          action: "Encryption failed",
          timestamp: new Date(),
          status: "error",
          details: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        })
        throw error
      } finally {
        setIsProcessing(false)
      }
    },
    [onActivityUpdate, onMetricsUpdate],
  )

  const decrypt = useCallback(
    async (encryptedData: string, encryptionKey: string): Promise<string> => {
      if (!encryptedData || !encryptionKey) {
        throw new Error("Please provide both encrypted data and encryption key")
      }

      const metricId = performanceMonitor.current.startMetric("decryption_operation")
      setIsProcessing(true)

      try {
        const parsedData = JSON.parse(encryptedData)
        const { algorithm, encrypted, salt, iv } = parsedData

        let decrypted: string

        if (workerRef.current && encrypted.length > 1000) {
          const result = await new Promise<{ decrypted: string }>((resolve, reject) => {
            const worker = workerRef.current!
            const handleMessage = (e: MessageEvent) => {
              worker.removeEventListener("message", handleMessage)
              if (e.data.success) {
                resolve(e.data.result)
              } else {
                reject(new Error(e.data.error))
              }
            }
            worker.addEventListener("message", handleMessage)
            worker.postMessage({
              type: "decrypt",
              data: { encrypted, key: encryptionKey, algorithm, salt, iv },
            })
          })
          decrypted = result.decrypted
        } else {
          switch (algorithm) {
            case "aes-256-gcm":
              decrypted = await CryptoUtils.decryptAES(encrypted, encryptionKey, salt, iv)
              break
            case "chacha20-poly1305":
              decrypted = await CryptoUtils.decryptChaCha20(encrypted, encryptionKey, salt, iv)
              break
            default:
              throw new Error("Unsupported algorithm")
          }
        }

        onActivityUpdate?.({
          id: Date.now().toString(),
          action: "Data decrypted successfully",
          timestamp: new Date(),
          status: "success",
          details: `${formatBytes(new Blob([encrypted]).size)} decrypted with ${algorithm}`,
        })

        performanceMonitor.current.endMetric(metricId)
        return decrypted
      } catch (error) {
        performanceMonitor.current.endMetric(metricId)
        onActivityUpdate?.({
          id: Date.now().toString(),
          action: "Decryption failed",
          timestamp: new Date(),
          status: "error",
          details: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        })
        throw error
      } finally {
        setIsProcessing(false)
      }
    },
    [onActivityUpdate],
  )

  const generateKey = useCallback(
    async (keySize = 32): Promise<string> => {
      const metricId = performanceMonitor.current.startMetric("key_generation")

      try {
        let secureKey: string

        if (workerRef.current) {
          const result = await new Promise<{ key: string }>((resolve, reject) => {
            const worker = workerRef.current!
            const handleMessage = (e: MessageEvent) => {
              worker.removeEventListener("message", handleMessage)
              if (e.data.success) {
                resolve(e.data.result)
              } else {
                reject(new Error(e.data.error))
              }
            }
            worker.addEventListener("message", handleMessage)
            worker.postMessage({
              type: "generateKey",
              data: { keySize },
            })
          })
          secureKey = result.key
        } else {
          secureKey = CryptoUtils.generateSecureKey(keySize)
        }

        const strength = CryptoUtils.validateKeyStrength(secureKey)

        onActivityUpdate?.({
          id: Date.now().toString(),
          action: "Secure key generated",
          timestamp: new Date(),
          status: "success",
          details: `${keySize * 8}-bit cryptographically secure key (strength: ${strength.score}%)`,
        })

        performanceMonitor.current.endMetric(metricId)
        return secureKey
      } catch (error) {
        performanceMonitor.current.endMetric(metricId)
        EnterpriseManager.handleError("Key generation failed", error)
        throw error
      }
    },
    [onActivityUpdate],
  )

  const validateKey = useCallback((key: string) => {
    return CryptoUtils.validateKeyStrength(key)
  }, [])

  const cleanup = useCallback(() => {
    workerRef.current?.terminate()
    workerRef.current = null
  }, [])

  return {
    encrypt,
    decrypt,
    generateKey,
    validateKey,
    isProcessing,
    initializeWorker,
    cleanup,
  }
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
