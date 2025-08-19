import { type NextRequest, NextResponse } from "next/server"
import { linkedInService } from "@/lib/professional-apis"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "profile"

    let data
    switch (type) {
      case "profile":
        data = await linkedInService.getProfile()
        break
      case "metrics":
        data = await linkedInService.getMetrics()
        break
      default:
        data = await linkedInService.getProfile()
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("LinkedIn API error:", error)
    return NextResponse.json({ error: "Failed to fetch LinkedIn data" }, { status: 500 })
  }
}
