import { createClient } from "@/lib/supabase/client"

interface GitHubRepoData {
  name: string
  full_name: string
  description: string
  stars: number
  forks: number
  watchers: number
  open_issues: number
  language: string
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
  default_branch: string
  license?: {
    name: string
    spdx_id: string
  }
  homepage?: string
}

class GitHubSyncService {
  private supabase = createClient()

  async syncProjectWithGitHub(projectId: string, githubUrl: string): Promise<boolean> {
    try {
      // Extract owner and repo from GitHub URL
      const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) {
        throw new Error("Invalid GitHub URL format")
      }

      const [, owner, repo] = match
      const repoName = repo.replace(/\.git$/, "")

      // Fetch repository data from GitHub API
      const repoData = await this.fetchRepositoryData(owner, repoName)
      if (!repoData) {
        throw new Error("Failed to fetch repository data")
      }

      // Update project with GitHub data
      const { error } = await this.supabase
        .from("projects")
        .update({
          github_url: githubUrl,
          stars: repoData.stars,
          forks: repoData.forks,
          issues: repoData.open_issues,
          github_stats: {
            watchers: repoData.watchers,
            language: repoData.language,
            topics: repoData.topics,
            size: repoData.size,
            default_branch: repoData.default_branch,
            license: repoData.license?.name || null,
            homepage: repoData.homepage || null,
            created_at: repoData.created_at,
            last_push: repoData.pushed_at,
          },
          last_commit_date: repoData.pushed_at,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)

      if (error) {
        console.error("Database update error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("GitHub sync error:", error)
      return false
    }
  }

  async syncAllProjectsWithGitHub(): Promise<{ success: number; failed: number }> {
    try {
      // Get all projects with GitHub URLs
      const { data: projects, error } = await this.supabase
        .from("projects")
        .select("id, title, github_url")
        .not("github_url", "is", null)

      if (error) {
        console.error("Failed to fetch projects:", error)
        return { success: 0, failed: 0 }
      }

      let success = 0
      let failed = 0

      // Sync each project with rate limiting
      for (const project of projects || []) {
        const result = await this.syncProjectWithGitHub(project.id, project.github_url)
        if (result) {
          success++
        } else {
          failed++
        }

        // Rate limiting: wait 1 second between requests
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      return { success, failed }
    } catch (error) {
      console.error("Bulk sync error:", error)
      return { success: 0, failed: 0 }
    }
  }

  private async fetchRepositoryData(owner: string, repo: string): Promise<GitHubRepoData | null> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()

      return {
        name: data.name,
        full_name: data.full_name,
        description: data.description || "",
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        watchers: data.watchers_count || 0,
        open_issues: data.open_issues_count || 0,
        language: data.language || "Unknown",
        topics: data.topics || [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        pushed_at: data.pushed_at,
        size: data.size || 0,
        default_branch: data.default_branch || "main",
        license: data.license
          ? {
              name: data.license.name,
              spdx_id: data.license.spdx_id,
            }
          : undefined,
        homepage: data.homepage || undefined,
      }
    } catch (error) {
      console.error(`Error fetching repo ${owner}/${repo}:`, error)
      return null
    }
  }

  async validateGitHubUrl(url: string): Promise<{ valid: boolean; owner?: string; repo?: string; error?: string }> {
    try {
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) {
        return { valid: false, error: "Invalid GitHub URL format" }
      }

      const [, owner, repo] = match
      const repoName = repo.replace(/\.git$/, "")

      // Check if repository exists and is accessible
      const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (response.ok) {
        return { valid: true, owner, repo: repoName }
      } else if (response.status === 404) {
        return { valid: false, error: "Repository not found or not accessible" }
      } else {
        return { valid: false, error: `GitHub API error: ${response.status}` }
      }
    } catch (error) {
      return { valid: false, error: "Network error validating GitHub URL" }
    }
  }
}

export const githubSyncService = new GitHubSyncService()
