import type { NextRequest } from "next/server"
import { TwoFactorAuth, SecurityService } from "@/lib/security"
import { verifyAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await verifyAuth(authHeader.replace("Bearer ", ""))

    // Generate TOTP secret and backup codes
    const secret = TwoFactorAuth.generateSecret()
    const backupCodes = TwoFactorAuth.generateBackupCodes()

    // In production, save encrypted secret and backup codes to database
    const encryptedSecret = SecurityService.encrypt(secret)
    const encryptedBackupCodes = backupCodes.map((code) => SecurityService.encrypt(code))

    // Generate QR code URL for authenticator apps
    const qrCodeUrl = `otpauth://totp/CyberpunkPortfolio:${user.email}?secret=${secret}&issuer=CyberpunkPortfolio`

    return Response.json({
      secret,
      qrCodeUrl,
      backupCodes,
      message: "MFA setup initiated. Please scan the QR code with your authenticator app.",
    })
  } catch (error) {
    console.error("MFA setup error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
