"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSearch } from "@/hooks/use-search"
import { useSound } from "@/contexts/sound-context"
import { Search, X, FileText, Code, Wrench } from "lucide-react"
import Link from "next/link"

interface CyberpunkSearchProps {
  onClose?: () => void
  isOpen?: boolean
}

export default function CyberpunkSearch({ onClose, isOpen = false }: CyberpunkSearchProps) {
  const [isActive, setIsActive] = useState(isOpen)
  const { query, setQuery, results, isLoading, total } = useSearch()
  const { playCommand, playSuccess } = useSound()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsActive(isOpen)
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleClose = () => {
    setIsActive(false)
    setQuery("")
    onClose?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose()
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Code className="w-4 h-4" />
      case "blog":
        return <FileText className="w-4 h-4" />
      case "skill":
        return <Wrench className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project":
        return "text-cyan-400"
      case "blog":
        return "text-green-400"
      case "skill":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl mx-4">
        {/* Search Terminal Window */}
        <div className="bg-black border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-cyan-500/30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-cyan-400 text-sm font-mono">SEARCH_TERMINAL</span>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400 font-mono">nexus@search:~$</span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    if (e.target.value) playCommand()
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="search [query] --all"
                  className="w-full bg-transparent text-white font-mono outline-none border-none placeholder:text-gray-500"
                  autoComplete="off"
                />
                <div className="absolute right-0 top-0 flex items-center gap-2">
                  {isLoading && (
                    <div className="w-4 h-4 border border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Search Stats */}
            {query && (
              <div className="text-sm text-gray-400 font-mono mb-4">
                {isLoading ? (
                  <span className="text-yellow-400">Searching...</span>
                ) : (
                  <span>
                    Found {total} result{total !== 1 ? "s" : ""} for "{query}"
                  </span>
                )}
              </div>
            )}

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url || `/${result.type}${result.slug ? `/${result.slug}` : ""}`}
                  onClick={() => {
                    playSuccess()
                    handleClose()
                  }}
                  className="block p-3 bg-gray-900/30 border border-gray-700/50 rounded hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${getTypeColor(result.type)}`}>{getTypeIcon(result.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors truncate">
                          {result.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded ${getTypeColor(result.type)} bg-current/10`}>
                          {result.type}
                        </span>
                      </div>
                      {result.excerpt && <p className="text-gray-400 text-sm line-clamp-2">{result.excerpt}</p>}
                      {result.category && <span className="text-xs text-gray-500 mt-1 block">{result.category}</span>}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">{Math.round(result.relevance_score * 100)}%</div>
                  </div>
                </Link>
              ))}

              {query && !isLoading && results.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try different keywords or check spelling</p>
                </div>
              )}
            </div>

            {/* Search Help */}
            {!query && (
              <div className="text-sm text-gray-500 font-mono space-y-1">
                <p>Available commands:</p>
                <p>• search [query] - Search all content</p>
                <p>• search project:[query] - Search projects only</p>
                <p>• search blog:[query] - Search blog posts only</p>
                <p>• search skill:[query] - Search skills only</p>
                <p className="mt-2 text-gray-600">Press ESC to close</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
