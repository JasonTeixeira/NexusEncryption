import { type NextRequest, NextResponse } from "next/server"
import { gcpService } from "@/lib/cloud-apis"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "metrics"

    let data
    switch (type) {
      case "resources":
        data = await gcpService.getResources()
        break
      case "metrics":
        data = await gcpService.getMetrics()
        break
      default:
        data = await gcpService.getMetrics()
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("GCP API error:", error)
    return NextResponse.json({ error: "Failed to fetch GCP data" }, { status: 500 })
  }
}
