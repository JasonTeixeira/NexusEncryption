import type { NextRequest } from "next/server"
import { analytics } from "@/lib/analytics"
import { requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth("view_analytics")(request)
    if (session instanceof Response) return session

    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const summary = await analytics.getAnalyticsSummary(days)
    return Response.json({ summary })
  } catch (error) {
    console.error("Analytics summary error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
