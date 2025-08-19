import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, canEditContent } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: posts, error } = await supabase
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
      .eq("status", "published")
      .order("published_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to flatten categories and tags
    const transformedPosts = posts?.map((post) => ({
      ...post,
      categories: post.categories?.map((c: any) => c.category) || [],
      tags: post.tags?.map((t: any) => t.tag) || [],
    }))

    return NextResponse.json({ posts: transformedPosts })
  } catch (error) {
    console.error("Get blog posts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await canEditContent())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()
    const postData = await request.json()

    // Validate required fields
    if (!postData.title || !postData.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Generate slug from title if not provided
    const slug =
      postData.slug ||
      postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    // Calculate read time (average 200 words per minute)
    const wordCount = postData.content.split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)

    // Generate excerpt if not provided
    const excerpt = postData.excerpt || postData.content.substring(0, 200) + "..."

    const { data: post, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title: postData.title,
          slug,
          excerpt,
          content: postData.content,
          status: postData.status || "draft",
          featured: postData.featured || false,
          featured_image: postData.featured_image,
          seo_title: postData.seo_title,
          seo_description: postData.seo_description,
          reading_time: readTime,
          published_at: postData.status === "published" ? new Date().toISOString() : null,
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Create blog post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
