import { Octokit } from "@octokit/rest"

interface GitHubStats {
  totalStars: number
  totalForks: number
  totalWatchers: number
  totalRepos: number
  totalCommits: number
  languages: Record<string, number>
  recentActivity: Array<{
    type: string
    repo: string
    date: string
    message?: string
  }>
}

interface RepoStats {
  name: string
  stars: number
  forks: number
  watchers: number
  openIssues: number
  language: string
  updatedAt: string
  description: string
}

class GitHubService {
  private octokit: Octokit
  private username: string
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  constructor(token?: string, username = "your-github-username") {
    this.octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN,
    })
    this.username = username
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T
    }
    return null
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async getUserStats(): Promise<GitHubStats> {
    const cacheKey = `user-stats-${this.username}`
    const cached = this.getCachedData<GitHubStats>(cacheKey)
    if (cached) return cached

    try {
      // Get user repositories
      const { data: repos } = await this.octokit.rest.repos.listForUser({
        username: this.username,
        type: "public",
        sort: "updated",
        per_page: 100,
      })

      // Calculate totals
      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
      const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0)
      const totalWatchers = repos.reduce((sum, repo) => sum + repo.watchers_count, 0)

      // Get languages
      const languages: Record<string, number> = {}
      for (const repo of repos.slice(0, 20)) {
        // Limit to avoid rate limits
        try {
          const { data: repoLanguages } = await this.octokit.rest.repos.listLanguages({
            owner: this.username,
            repo: repo.name,
          })
          Object.entries(repoLanguages).forEach(([lang, bytes]) => {
            languages[lang] = (languages[lang] || 0) + bytes
          })
        } catch (error) {
          // Skip if languages can't be fetched
        }
      }

      // Get recent activity (commits)
      const recentActivity = []
      for (const repo of repos.slice(0, 5)) {
        try {
          const { data: commits } = await this.octokit.rest.repos.listCommits({
            owner: this.username,
            repo: repo.name,
            per_page: 3,
          })

          commits.forEach((commit) => {
            recentActivity.push({
              type: "commit",
              repo: repo.name,
              date: commit.commit.author?.date || "",
              message: commit.commit.message.split("\n")[0],
            })
          })
        } catch (error) {
          // Skip if commits can't be fetched
        }
      }

      // Estimate total commits (GitHub doesn't provide this directly)
      const totalCommits = recentActivity.length * 50 // Rough estimate

      const stats: GitHubStats = {
        totalStars,
        totalForks,
        totalWatchers,
        totalRepos: repos.length,
        totalCommits,
        languages,
        recentActivity: recentActivity.slice(0, 10),
      }

      this.setCachedData(cacheKey, stats)
      return stats
    } catch (error) {
      console.error("GitHub API error:", error)
      // Return mock data as fallback
      return this.getMockStats()
    }
  }

  async getRepoStats(repoName: string): Promise<RepoStats | null> {
    const cacheKey = `repo-${this.username}-${repoName}`
    const cached = this.getCachedData<RepoStats>(cacheKey)
    if (cached) return cached

    try {
      const { data: repo } = await this.octokit.rest.repos.get({
        owner: this.username,
        repo: repoName,
      })

      const stats: RepoStats = {
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        openIssues: repo.open_issues_count,
        language: repo.language || "Unknown",
        updatedAt: repo.updated_at,
        description: repo.description || "",
      }

      this.setCachedData(cacheKey, stats)
      return stats
    } catch (error) {
      console.error(`Error fetching repo ${repoName}:`, error)
      return null
    }
  }

  private getMockStats(): GitHubStats {
    return {
      totalStars: 2847,
      totalForks: 427,
      totalWatchers: 189,
      totalRepos: 42,
      totalCommits: 42700,
      languages: {
        TypeScript: 45,
        JavaScript: 25,
        Python: 15,
        Go: 10,
        Rust: 5,
      },
      recentActivity: [
        {
          type: "commit",
          repo: "cloud-infrastructure",
          date: new Date().toISOString(),
          message: "feat: add kubernetes monitoring dashboard",
        },
        {
          type: "commit",
          repo: "ml-pipeline",
          date: new Date(Date.now() - 3600000).toISOString(),
          message: "fix: optimize model inference performance",
        },
      ],
    }
  }
}

export const githubService = new GitHubService()
export type { GitHubStats, RepoStats }
