"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectTag {
  id: string
  name: string
  slug: string
  color: string
  category: string
  project_count: number
}

interface ProjectTagFilterProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  onSearchChange: (search: string) => void
}

export default function ProjectTagFilter({ selectedTags, onTagsChange, onSearchChange }: ProjectTagFilterProps) {
  const [tags, setTags] = useState<ProjectTag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "technology", label: "Technology" },
    { value: "framework", label: "Framework" },
    { value: "language", label: "Language" },
    { value: "tool", label: "Tool" },
    { value: "platform", label: "Platform" },
    { value: "methodology", label: "Methodology" },
    { value: "industry", label: "Industry" },
  ]

  useEffect(() => {
    fetchTags()
  }, [selectedCategory])

  const fetchTags = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }

      const response = await fetch(`/api/projects/tags?${params}`)
      const result = await response.json()

      if (response.ok) {
        setTags(result.data || [])
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTagToggle = (tagSlug: string) => {
    const newTags = selectedTags.includes(tagSlug)
      ? selectedTags.filter((t) => t !== tagSlug)
      : [...selectedTags, tagSlug]

    onTagsChange(newTags)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  const clearAllFilters = () => {
    onTagsChange([])
    setSearchTerm("")
    onSearchChange("")
    setSelectedCategory("all")
  }

  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-4 p-4 bg-gray-950/50 border border-green-500/30 rounded-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-green-400 font-mono text-lg">Filter Projects</h3>
        {(selectedTags.length > 0 || searchTerm || selectedCategory !== "all") && (
          <Button
            onClick={clearAllFilters}
            size="sm"
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-mono"
          >
            CLEAR ALL
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div>
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
        />
      </div>

      {/* Category Filter */}
      <div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-gray-900 border-green-500/30 text-green-400 font-mono">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-green-500/30">
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tag Cloud */}
      <div>
        <div className="text-sm text-gray-400 font-mono mb-2">Tags ({filteredTags.length})</div>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {loading ? (
            <div className="text-gray-500 font-mono">Loading tags...</div>
          ) : filteredTags.length > 0 ? (
            filteredTags.map((tag) => (
              <Badge
                key={tag.id}
                onClick={() => handleTagToggle(tag.slug)}
                className={`cursor-pointer font-mono transition-all ${
                  selectedTags.includes(tag.slug)
                    ? "bg-green-500/30 text-green-300 border-green-500/50"
                    : "bg-gray-800/50 text-gray-400 border-gray-600/50 hover:bg-gray-700/50"
                }`}
                style={{ borderColor: selectedTags.includes(tag.slug) ? tag.color : undefined }}
              >
                #{tag.name} ({tag.project_count})
              </Badge>
            ))
          ) : (
            <div className="text-gray-500 font-mono">No tags found</div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {selectedTags.length > 0 && (
        <div>
          <div className="text-sm text-gray-400 font-mono mb-2">Active Filters ({selectedTags.length})</div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tagSlug) => {
              const tag = tags.find((t) => t.slug === tagSlug)
              return tag ? (
                <Badge
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.slug)}
                  className="cursor-pointer bg-green-500/30 text-green-300 border-green-500/50 font-mono"
                >
                  #{tag.name} ✕
                </Badge>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
