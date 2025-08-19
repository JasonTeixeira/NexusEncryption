import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { error } = await supabase.from("performance_metrics").insert([
      {
        page_path: body.page_path,
        load_time: body.load_time,
        first_contentful_paint: body.first_contentful_paint,
        largest_contentful_paint: body.largest_contentful_paint,
        cumulative_layout_shift: body.cumulative_layout_shift,
        first_input_delay: body.first_input_delay,
        user_agent: request.headers.get("user-agent"),
        connection_type: body.connection_type,
      },
    ])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data: metrics, error } = await supabase
      .from("performance_metrics")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate averages
    const avgMetrics = {
      avg_load_time: 0,
      avg_fcp: 0,
      avg_lcp: 0,
      avg_cls: 0,
      avg_fid: 0,
      total_samples: metrics?.length || 0,
    }

    if (metrics && metrics.length > 0) {
      avgMetrics.avg_load_time = metrics.reduce((sum, m) => sum + (m.load_time || 0), 0) / metrics.length
      avgMetrics.avg_fcp = metrics.reduce((sum, m) => sum + (m.first_contentful_paint || 0), 0) / metrics.length
      avgMetrics.avg_lcp = metrics.reduce((sum, m) => sum + (m.largest_contentful_paint || 0), 0) / metrics.length
      avgMetrics.avg_cls = metrics.reduce((sum, m) => sum + (m.cumulative_layout_shift || 0), 0) / metrics.length
      avgMetrics.avg_fid = metrics.reduce((sum, m) => sum + (m.first_input_delay || 0), 0) / metrics.length
    }

    return NextResponse.json({ metrics: avgMetrics, raw_data: metrics })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
