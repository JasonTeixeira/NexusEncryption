import { type NextRequest, NextResponse } from "next/server"
import { githubService } from "@/lib/github-api"

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const repoName = params.name
    const stats = await githubService.getRepoStats(repoName)

    if (!stats) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("GitHub repo API error:", error)
    return NextResponse.json({ error: "Failed to fetch repository stats" }, { status: 500 })
  }
}
