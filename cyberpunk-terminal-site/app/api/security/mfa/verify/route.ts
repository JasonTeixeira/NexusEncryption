import type { NextRequest } from "next/server"
import { TwoFactorAuth, SecurityMonitor, SecurityService } from "@/lib/security"
import { verifyAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { token, secret } = await request.json()
    const clientIP = SecurityService.getClientIP(request)

    if (!token || !secret) {
      return Response.json({ error: "Token and secret are required" }, { status: 400 })
    }

    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await verifyAuth(authHeader.replace("Bearer ", ""))

    // Verify TOTP token
    const isValid = TwoFactorAuth.verifyTOTP(token, secret)

    if (isValid) {
      SecurityMonitor.logSecurityEvent({
        type: "login_attempt",
        ip: clientIP,
        details: {
          userId: user.id,
          mfaVerified: true,
          success: true,
        },
        severity: "low",
      })

      return Response.json({
        success: true,
        message: "MFA verification successful",
      })
    } else {
      SecurityMonitor.logSecurityEvent({
        type: "suspicious_activity",
        ip: clientIP,
        details: {
          userId: user.id,
          reason: "Invalid MFA token",
          token: token.substring(0, 2) + "****", // Log partial token for debugging
        },
        severity: "medium",
      })

      return Response.json(
        {
          success: false,
          error: "Invalid verification code",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("MFA verification error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
