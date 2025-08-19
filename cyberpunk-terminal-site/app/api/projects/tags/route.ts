import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, canEditContent } from "@/lib/auth"

// GET /api/projects/tags - Fetch project tags
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase.from("project_tags").select("*").order("project_count", { ascending: false }).limit(limit)

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/projects/tags - Create new project tag
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await canEditContent())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()
    const body = await request.json()

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const tagData = {
      ...body,
      slug,
    }

    const { data, error } = await supabase.from("project_tags").insert([tagData]).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
