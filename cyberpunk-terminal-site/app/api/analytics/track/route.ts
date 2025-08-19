import type { NextRequest } from "next/server"
import { analytics } from "@/lib/analytics"

export async function POST(request: NextRequest) {
  try {
    const { type, page, data, sessionId } = await request.json()

    if (!type || !page || !sessionId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const userAgent = request.headers.get("user-agent") || ""
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    if (type === "pageview") {
      await analytics.trackPageView({
        page,
        sessionId,
        userAgent,
        ip,
        referrer: data?.referrer,
        duration: data?.duration,
        country: data?.country,
        city: data?.city,
      })
    } else if (type === "performance") {
      await analytics.trackPerformance({
        page,
        sessionId,
        metrics: data.metrics,
      })
    } else {
      await analytics.trackEvent({
        type,
        page,
        sessionId,
        data,
        userAgent,
        ip,
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
