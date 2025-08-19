import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const dashboardId = searchParams.get("dashboardId")

    let query = supabase.from("dashboard_configs").select("*")

    if (dashboardId) {
      query = query.eq("dashboard_id", dashboardId)
    }

    const { data: configs, error } = await query

    if (error) throw error

    return NextResponse.json({ configs: configs || [] })
  } catch (error) {
    console.error("Dashboard Config API Error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard configs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { data: config, error } = await supabase
      .from("dashboard_configs")
      .insert([
        {
          dashboard_id: body.dashboard_id,
          user_id: body.user_id,
          config: body.config,
          name: body.name,
          is_default: body.is_default || false,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ config })
  } catch (error) {
    console.error("Dashboard Config Creation Error:", error)
    return NextResponse.json({ error: "Failed to create dashboard config" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data: config, error } = await supabase
      .from("dashboard_configs")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ config })
  } catch (error) {
    console.error("Dashboard Config Update Error:", error)
    return NextResponse.json({ error: "Failed to update dashboard config" }, { status: 500 })
  }
}
