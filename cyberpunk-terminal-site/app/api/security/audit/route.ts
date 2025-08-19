import type { NextRequest } from "next/server"
import { SecurityMonitor } from "@/lib/security"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await verifyAuth(authHeader.replace("Bearer ", ""))

    // Only allow admin users to access security audit data
    if (user.role !== "admin") {
      return Response.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const securityStats = SecurityMonitor.getSecurityStats()

    return Response.json({
      stats: securityStats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Security audit API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
