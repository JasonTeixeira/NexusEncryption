import type { NextRequest } from "next/server"
import { analytics } from "@/lib/analytics"
import { requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth("view_analytics")(request)
    if (session instanceof Response) return session

    const realTimeData = await analytics.getRealTimeData()
    return Response.json({ data: realTimeData })
  } catch (error) {
    console.error("Real-time analytics error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
