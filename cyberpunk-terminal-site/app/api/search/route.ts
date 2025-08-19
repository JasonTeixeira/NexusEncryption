import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/search - Full-text search across projects and blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") // 'project', 'blog_post', or 'all'
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ data: [], count: 0 })
    }

    const supabase = createClient()

    // Sanitize search query for PostgreSQL full-text search
    const sanitizedQuery = query
      .trim()
      .split(/\s+/)
      .map((term) => term.replace(/[^\w]/g, ""))
      .filter((term) => term.length > 0)
      .join(" & ")

    if (!sanitizedQuery) {
      return NextResponse.json({ data: [], count: 0 })
    }

    let searchQuery = supabase
      .from("search_index")
      .select(`
        *,
        rank: ts_rank(search_vector, plainto_tsquery('english', $1))
      `)
      .textSearch("search_vector", sanitizedQuery, {
        type: "websearch",
        config: "english",
      })
      .order("rank", { ascending: false })
      .range(offset, offset + limit - 1)

    if (type && type !== "all") {
      searchQuery = searchQuery.eq("content_type", type)
    }

    const { data: searchResults, error } = await searchQuery

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Enrich search results with actual content data
    const enrichedResults = await Promise.all(
      (searchResults || []).map(async (result) => {
        let contentData = null

        if (result.content_type === "project") {
          const { data } = await supabase
            .from("projects")
            .select("*")
            .eq("id", result.content_id)
            .eq("status", "active")
            .single()
          contentData = data
        } else if (result.content_type === "blog_post") {
          const { data } = await supabase
            .from("blog_posts")
            .select(`
              *,
              categories:blog_post_categories(
                category:blog_categories(name, slug, color)
              ),
              tags:blog_post_tags(
                tag:blog_tags(name, slug, color)
              )
            `)
            .eq("id", result.content_id)
            .eq("status", "published")
            .single()

          if (data) {
            contentData = {
              ...data,
              categories: data.categories?.map((c: any) => c.category) || [],
              tags: data.tags?.map((t: any) => t.tag) || [],
            }
          }
        }

        return {
          ...result,
          content_data: contentData,
          // Generate search snippet
          snippet: generateSnippet(result.content, query, 150),
        }
      }),
    )

    // Filter out results where content_data is null (deleted or unpublished content)
    const validResults = enrichedResults.filter((result) => result.content_data !== null)

    return NextResponse.json({
      data: validResults,
      count: validResults.length,
      query: query,
      total_found: searchResults?.length || 0,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to generate search snippets
function generateSnippet(content: string, query: string, maxLength = 150): string {
  if (!content || !query) return ""

  const queryTerms = query.toLowerCase().split(/\s+/)
  const contentLower = content.toLowerCase()

  // Find the first occurrence of any query term
  let bestIndex = -1
  let bestTerm = ""

  for (const term of queryTerms) {
    const index = contentLower.indexOf(term)
    if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
      bestIndex = index
      bestTerm = term
    }
  }

  if (bestIndex === -1) {
    // No terms found, return beginning of content
    return content.substring(0, maxLength) + (content.length > maxLength ? "..." : "")
  }

  // Calculate snippet boundaries
  const start = Math.max(0, bestIndex - Math.floor(maxLength / 2))
  const end = Math.min(content.length, start + maxLength)

  let snippet = content.substring(start, end)

  // Add ellipsis if needed
  if (start > 0) snippet = "..." + snippet
  if (end < content.length) snippet = snippet + "..."

  // Highlight search terms (basic implementation)
  for (const term of queryTerms) {
    const regex = new RegExp(`(${term})`, "gi")
    snippet = snippet.replace(regex, "<mark>$1</mark>")
  }

  return snippet
}
