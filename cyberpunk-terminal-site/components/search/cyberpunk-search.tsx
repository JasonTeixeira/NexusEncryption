"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2, FileText, Code, Hash } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"

interface SearchResult {
  id: string
  content_type: "project" | "blog_post"
  title: string
  snippet: string
  rank: number
  content_data: any
}

interface SearchSuggestion {
  text: string
  type: string
  source: "content" | "popular"
}

export default function CyberpunkSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const searchRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Open search with Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
        setQuery("")
        setResults([])
        setSuggestions([])
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isOpen])

  // Handle search with debouncing
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSuggestions([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)

      try {
        // Get search results
        const searchResponse = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)
        const searchData = await searchResponse.json()

        if (searchData.data) {
          setResults(searchData.data)
        }

        // Get suggestions
        const suggestionsResponse = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}&limit=5`)
        const suggestionsData = await suggestionsResponse.json()

        if (suggestionsData.data) {
          setSuggestions(suggestionsData.data)
        }

        // Track search event
        await apiClient.trackEvent({
          event_type: "search",
          page_path: window.location.pathname,
          metadata: { query, results_count: searchData.data?.length || 0 },
        })
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const totalItems = results.length + suggestions.length

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % totalItems)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems)
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleItemSelect(selectedIndex)
    }
  }

  const handleItemSelect = (index: number) => {
    if (index < results.length) {
      const result = results[index]
      const path =
        result.content_type === "project"
          ? `/projects/${result.content_data.slug}`
          : `/blog/${result.content_data.slug}`
      router.push(path)
    } else {
      const suggestion = suggestions[index - results.length]
      setQuery(suggestion.text)
      searchRef.current?.focus()
      return
    }

    setIsOpen(false)
    setQuery("")
    setResults([])
    setSuggestions([])
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Code className="w-4 h-4 text-cyan-400" />
      case "blog_post":
        return <FileText className="w-4 h-4 text-green-400" />
      default:
        return <Hash className="w-4 h-4 text-gray-400" />
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-cyan-400 hover:border-cyan-400/50 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search...</span>
        <kbd className="px-2 py-1 text-xs bg-cyan-500/20 rounded border border-cyan-500/30">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl mx-4">
        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center bg-black border-2 border-cyan-500 rounded-lg overflow-hidden">
            <Search className="w-5 h-5 text-cyan-400 ml-4" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search projects and blog posts..."
              className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-400 outline-none"
            />
            {isLoading && <Loader2 className="w-5 h-5 text-cyan-400 animate-spin mr-4" />}
            <button onClick={() => setIsOpen(false)} className="p-4 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        {(results.length > 0 || suggestions.length > 0) && (
          <div
            ref={resultsRef}
            className="mt-2 bg-black border-2 border-cyan-500/50 rounded-lg max-h-96 overflow-y-auto"
          >
            {/* Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-cyan-400 uppercase tracking-wider px-3 py-2 border-b border-cyan-500/20">
                  Results ({results.length})
                </div>
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleItemSelect(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedIndex === index ? "bg-cyan-500/20 border border-cyan-500/50" : "hover:bg-cyan-500/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getResultIcon(result.content_type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">{result.title}</div>
                        <div className="text-sm text-gray-400 mt-1">
                          <span dangerouslySetInnerHTML={{ __html: result.snippet }} className="line-clamp-2" />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">
                            {result.content_type === "project" ? "Project" : "Blog Post"}
                          </span>
                          {result.content_data.tech_stack && (
                            <span className="text-xs text-gray-500">
                              {result.content_data.tech_stack.slice(0, 2).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2 border-t border-cyan-500/20">
                <div className="text-xs text-cyan-400 uppercase tracking-wider px-3 py-2">Suggestions</div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleItemSelect(results.length + index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedIndex === results.length + index
                        ? "bg-cyan-500/20 border border-cyan-500/50"
                        : "hover:bg-cyan-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{suggestion.text}</span>
                      {suggestion.source === "popular" && (
                        <span className="text-xs text-gray-500 ml-auto">Popular</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {query && !isLoading && results.length === 0 && suggestions.length === 0 && (
          <div className="mt-2 bg-black border-2 border-cyan-500/50 rounded-lg p-8 text-center">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <div className="text-white font-medium mb-2">No results found</div>
            <div className="text-gray-400 text-sm">
              Try adjusting your search terms or browse our projects and blog posts.
            </div>
          </div>
        )}

        {/* Search Tips */}
        {!query && (
          <div className="mt-2 bg-black border-2 border-cyan-500/50 rounded-lg p-6">
            <div className="text-white font-medium mb-4">Search Tips</div>
            <div className="space-y-2 text-sm text-gray-400">
              <div>• Use keywords to find projects and blog posts</div>
              <div>• Search by technology stack (React, Next.js, TypeScript)</div>
              <div>• Use arrow keys to navigate results</div>
              <div>• Press Enter to open selected result</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
