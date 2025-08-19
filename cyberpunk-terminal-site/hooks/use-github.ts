"use client"

import { useState, useEffect } from "react"
import type { GitHubStats, RepoStats } from "@/lib/github-api"

export function useGitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const response = await fetch("/api/github/stats")
        const result = await response.json()

        if (result.success) {
          setStats(result.data)
          setError(null)
        } else {
          setError(result.error || "Failed to fetch GitHub stats")
        }
      } catch (err) {
        setError("Network error fetching GitHub stats")
        console.error("GitHub stats error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { stats, loading, error }
}

export function useGitHubRepo(repoName: string) {
  const [repo, setRepo] = useState<RepoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!repoName) return

    async function fetchRepo() {
      try {
        setLoading(true)
        const response = await fetch(`/api/github/repo/${repoName}`)
        const result = await response.json()

        if (result.success) {
          setRepo(result.data)
          setError(null)
        } else {
          setError(result.error || "Failed to fetch repository stats")
        }
      } catch (err) {
        setError("Network error fetching repository stats")
        console.error("GitHub repo error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRepo()
  }, [repoName])

  return { repo, loading, error }
}
