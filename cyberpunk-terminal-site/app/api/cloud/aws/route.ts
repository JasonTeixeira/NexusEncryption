import { type NextRequest, NextResponse } from "next/server"
import { awsService } from "@/lib/cloud-apis"

export async function GET(request: NextRequest) {
  try {
    // Optional: Require authentication for cloud data
    // const auth = await verifyAuth(request)
    // if (!auth.valid) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "metrics"

    let data
    switch (type) {
      case "resources":
        data = await awsService.getResources()
        break
      case "metrics":
        data = await awsService.getMetrics()
        break
      case "cost-optimization":
        data = await awsService.getCostOptimization()
        break
      default:
        data = await awsService.getMetrics()
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AWS API error:", error)
    return NextResponse.json({ error: "Failed to fetch AWS data" }, { status: 500 })
  }
}
