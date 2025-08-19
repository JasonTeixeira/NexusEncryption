import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, canEditContent } from "@/lib/supabase/server"

// GET /api/blog/posts - Fetch blog posts
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status") || "published"
    const featured = searchParams.get("featured")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("blog_posts")
      .select(`
        *,
        categories:blog_post_categories(
          category:blog_categories(*)
        ),
        tags:blog_post_tags(
          tag:blog_tags(*)
        )
      `)
      .eq("status", status)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (featured === "true") {
      query = query.eq("featured", true)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to flatten categories and tags
    const transformedData = data?.map((post) => ({
      ...post,
      categories: post.categories?.map((c: any) => c.category) || [],
      tags: post.tags?.map((t: any) => t.tag) || [],
    }))

    return NextResponse.json({ data: transformedData, count: data?.length || 0 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/blog/posts - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await canEditContent())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()
    const body = await request.json()

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Calculate reading time (average 200 words per minute)
    const wordCount = body.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const postData = {
      ...body,
      slug,
      reading_time: readingTime,
      created_by: user.id,
      published_at: body.status === "published" ? new Date().toISOString() : null,
    }

    const { data, error } = await supabase.from("blog_posts").insert([postData]).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
