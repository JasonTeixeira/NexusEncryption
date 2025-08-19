import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { owner, repo } = await request.json()

    if (!owner || !repo) {
      return NextResponse.json({ error: "Owner and repo are required" }, { status: 400 })
    }

    // Check if we have a GitHub token
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 })
    }

    // Star the repository
    const response = await fetch(`https://api.github.com/user/starred/${owner}/${repo}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Length": "0",
      },
    })

    if (response.status === 204) {
      return NextResponse.json({ success: true, message: "Repository starred successfully" })
    } else if (response.status === 404) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 })
    } else {
      return NextResponse.json({ error: "Failed to star repository" }, { status: response.status })
    }
  } catch (error) {
    console.error("Error starring repository:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
