import { type NextRequest, NextResponse } from "next/server"
import { azureService } from "@/lib/cloud-apis"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "metrics"

    let data
    switch (type) {
      case "resources":
        data = await azureService.getResources()
        break
      case "metrics":
        data = await azureService.getMetrics()
        break
      default:
        data = await azureService.getMetrics()
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Azure API error:", error)
    return NextResponse.json({ error: "Failed to fetch Azure data" }, { status: 500 })
  }
}
