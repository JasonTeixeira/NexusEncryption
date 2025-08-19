"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MFASetup() {
  const [step, setStep] = useState<"setup" | "verify" | "complete">("setup")
  const [secret, setSecret] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const setupMFA = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/security/mfa/setup", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSecret(data.secret)
        setQrCodeUrl(data.qrCodeUrl)
        setBackupCodes(data.backupCodes)
        setStep("verify")
      } else {
        setError(data.error || "Setup failed")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const verifyMFA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/security/mfa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          token: verificationCode,
          secret,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStep("complete")
      } else {
        setError(data.error || "Verification failed")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-black/95 border border-cyan-500/50 rounded-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
        <span className="text-cyan-400 font-mono text-lg">Multi-Factor Authentication</span>
      </div>

      {/* Setup Step */}
      {step === "setup" && (
        <div className="space-y-4">
          <div className="text-gray-300 text-sm">
            Enhance your account security by enabling two-factor authentication. You'll need an authenticator app like
            Google Authenticator or Authy.
          </div>
          <Button
            onClick={setupMFA}
            disabled={loading}
            className="w-full bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
          >
            {loading ? "Setting up..." : "Setup MFA"}
          </Button>
        </div>
      )}

      {/* Verify Step */}
      {step === "verify" && (
        <div className="space-y-4">
          <div className="text-gray-300 text-sm mb-4">1. Scan this QR code with your authenticator app:</div>

          {/* QR Code placeholder - in production, use a QR code library */}
          <div className="bg-white p-4 rounded text-center">
            <div className="text-black text-xs font-mono break-all">{qrCodeUrl}</div>
          </div>

          <div className="text-gray-300 text-sm">2. Enter the 6-digit code from your authenticator app:</div>

          <Input
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            className="bg-black/50 border-cyan-500/30 text-cyan-300 text-center text-lg font-mono"
            maxLength={6}
          />

          <Button
            onClick={verifyMFA}
            disabled={loading || verificationCode.length !== 6}
            className="w-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </Button>

          {/* Backup Codes */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
            <div className="text-yellow-400 text-sm font-mono mb-2">Backup Recovery Codes</div>
            <div className="text-yellow-300 text-xs mb-3">
              Save these codes in a secure location. Each can only be used once.
            </div>
            <ScrollArea className="h-32">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-black/50 p-2 rounded text-center">
                    <span className="text-yellow-300 font-mono text-sm">{code}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Complete Step */}
      {step === "complete" && (
        <div className="text-center space-y-4">
          <div className="text-green-400 text-4xl mb-4">✓</div>
          <div className="text-green-400 text-lg font-mono">MFA Setup Complete!</div>
          <div className="text-gray-300 text-sm">
            Your account is now protected with two-factor authentication. You'll need to enter a code from your
            authenticator app when signing in.
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}
    </div>
  )
}
