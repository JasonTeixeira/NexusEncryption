import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/search/suggestions - Get search suggestions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "5")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ data: [] })
    }

    const supabase = createClient()

    // Get suggestions from titles and content
    const { data: suggestions, error } = await supabase
      .from("search_index")
      .select("title, content_type")
      .ilike("title", `%${query}%`)
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also get popular search terms from analytics (if available)
    const { data: popularTerms } = await supabase
      .from("analytics")
      .select("metadata")
      .eq("event_type", "search")
      .like("metadata->query", `%${query}%`)
      .limit(3)

    const analyticsTerms =
      popularTerms
        ?.map((item) => item.metadata?.query)
        .filter((term) => term && term.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 2) || []

    const combinedSuggestions = [
      ...(suggestions?.map((s) => ({
        text: s.title,
        type: s.content_type,
        source: "content",
      })) || []),
      ...analyticsTerms.map((term) => ({
        text: term,
        type: "query",
        source: "popular",
      })),
    ]

    // Remove duplicates and limit results
    const uniqueSuggestions = combinedSuggestions
      .filter(
        (suggestion, index, self) =>
          index === self.findIndex((s) => s.text.toLowerCase() === suggestion.text.toLowerCase()),
      )
      .slice(0, limit)

    return NextResponse.json({ data: uniqueSuggestions })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
