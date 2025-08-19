import { type NextRequest, NextResponse } from "next/server"
import { githubSyncService } from "@/lib/github-sync"
import { verifyAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await verifyAuth(request)
    if (!auth.valid || auth.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, githubUrl, action } = body

    if (action === "sync-all") {
      // Sync all projects with GitHub
      const result = await githubSyncService.syncAllProjectsWithGitHub()
      return NextResponse.json({
        success: true,
        message: `Synced ${result.success} projects successfully, ${result.failed} failed`,
        data: result,
      })
    } else if (action === "sync-single" && projectId && githubUrl) {
      // Sync single project
      const success = await githubSyncService.syncProjectWithGitHub(projectId, githubUrl)
      return NextResponse.json({
        success,
        message: success ? "Project synced successfully" : "Failed to sync project",
      })
    } else if (action === "validate" && githubUrl) {
      // Validate GitHub URL
      const validation = await githubSyncService.validateGitHubUrl(githubUrl)
      return NextResponse.json({
        success: true,
        data: validation,
      })
    } else {
      return NextResponse.json({ error: "Invalid action or missing parameters" }, { status: 400 })
    }
  } catch (error) {
    console.error("GitHub sync API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
