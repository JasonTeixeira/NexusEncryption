import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Try to find by ID first, then by slug
    let { data: post, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        categories (*),
        blog_post_tags (
          tags (*)
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      // If not found by ID, try by slug
      const { data: postBySlug, error: slugError } = await supabase
        .from("blog_posts")
        .select(`
          *,
          categories (*),
          blog_post_tags (
            tags (*)
          )
        `)
        .eq("slug", params.id)
        .single()

      if (slugError) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
      }
      post = postBySlug
    }

    // Increment view count
    await supabase
      .from("blog_posts")
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq("id", post.id)

    return NextResponse.json({ post })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Try to update by ID first, then by slug
    let { data: post, error } = await supabase
      .from("blog_posts")
      .update(body)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      // If not found by ID, try by slug
      const { data: postBySlug, error: slugError } = await supabase
        .from("blog_posts")
        .update(body)
        .eq("slug", params.id)
        .select()
        .single()

      if (slugError) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
      }
      post = postBySlug
    }

    return NextResponse.json({ post })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Try to delete by ID first, then by slug
    let { error } = await supabase.from("blog_posts").delete().eq("id", params.id)

    if (error) {
      // If not found by ID, try by slug
      const { error: slugError } = await supabase.from("blog_posts").delete().eq("slug", params.id)

      if (slugError) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
