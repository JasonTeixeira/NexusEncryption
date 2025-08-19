"use client"

import { useState, useEffect, useCallback } from "react"

interface SearchResult {
  id: string
  title: string
  content: string
  type: "project" | "blog" | "skill"
  slug?: string
  url?: string
  category?: string
  excerpt?: string
  relevance_score: number
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
}

export function useSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setTotal(0)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data: SearchResponse = await response.json()
      setResults(data.results)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setResults([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      search(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, search])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    total,
    search,
  }
}
