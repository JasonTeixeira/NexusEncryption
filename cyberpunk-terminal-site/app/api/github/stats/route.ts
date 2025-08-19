import { type NextRequest, NextResponse } from "next/server"
import { githubService } from "@/lib/github-api"

export async function GET(request: NextRequest) {
  try {
    // Optional: Require authentication for GitHub stats
    // const auth = await verifyAuth(request)
    // if (!auth.valid) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const stats = await githubService.getUserStats()

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("GitHub stats API error:", error)
    return NextResponse.json({ error: "Failed to fetch GitHub stats" }, { status: 500 })
  }
}
