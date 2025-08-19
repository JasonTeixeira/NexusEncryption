import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get("platform")
    const dateRange = searchParams.get("dateRange") || "7d"

    let query = supabase.from("social_media_posts").select("*")

    if (platform) query = query.eq("platform", platform)

    // Date filtering
    const now = new Date()
    const startDate = new Date()
    switch (dateRange) {
      case "1d":
        startDate.setDate(now.getDate() - 1)
        break
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
    }

    query = query.gte("created_at", startDate.toISOString())

    const { data: posts, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    // Calculate metrics
    const totalPosts = posts?.length || 0
    const totalEngagement = posts?.reduce((acc, post) => acc + (post.likes + post.shares + post.comments), 0) || 0
    const totalReach = posts?.reduce((acc, post) => acc + (post.reach || 0), 0) || 0
    const engagementRate = totalReach > 0 ? Math.round((totalEngagement / totalReach) * 100 * 100) / 100 : 0

    // Platform breakdown
    const platformStats =
      posts?.reduce((acc: any, post) => {
        if (!acc[post.platform]) {
          acc[post.platform] = { posts: 0, engagement: 0, reach: 0 }
        }
        acc[post.platform].posts++
        acc[post.platform].engagement += post.likes + post.shares + post.comments
        acc[post.platform].reach += post.reach || 0
        return acc
      }, {}) || {}

    return NextResponse.json({
      posts: posts || [],
      metrics: {
        totalPosts,
        totalEngagement,
        totalReach,
        engagementRate,
        platformStats,
      },
    })
  } catch (error) {
    console.error("Social Media API Error:", error)
    return NextResponse.json({ error: "Failed to fetch social media data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { data: post, error } = await supabase
      .from("social_media_posts")
      .insert([
        {
          platform: body.platform,
          content: body.content,
          likes: body.likes || 0,
          shares: body.shares || 0,
          comments: body.comments || 0,
          reach: body.reach || 0,
          hashtags: body.hashtags || [],
          post_type: body.post_type || "text",
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Social Media Post Creation Error:", error)
    return NextResponse.json({ error: "Failed to create social media post" }, { status: 500 })
  }
}
