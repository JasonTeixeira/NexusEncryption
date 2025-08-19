import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const branch = searchParams.get("branch")
    const status = searchParams.get("status")
    const author = searchParams.get("author")

    let query = supabase.from("devops_pipelines").select(`
      *,
      pipeline_stages (*)
    `)

    if (branch) query = query.eq("branch", branch)
    if (status) query = query.eq("status", status)
    if (author) query = query.eq("author", author)

    const { data: pipelines, error } = await query.order("created_at", { ascending: false }).limit(20)

    if (error) throw error

    // Calculate metrics
    const totalPipelines = pipelines?.length || 0
    const successCount = pipelines?.filter((p) => p.status === "success").length || 0
    const successRate = totalPipelines > 0 ? Math.round((successCount / totalPipelines) * 100) : 0

    // Calculate average duration
    const completedPipelines = pipelines?.filter((p) => p.status === "success" || p.status === "failed") || []
    const avgDuration =
      completedPipelines.length > 0
        ? Math.round(
            completedPipelines.reduce((acc, p) => acc + (p.duration_seconds || 0), 0) / completedPipelines.length,
          )
        : 0

    const deploymentsToday =
      pipelines?.filter((p) => {
        const today = new Date().toDateString()
        return new Date(p.created_at).toDateString() === today && p.status === "success"
      }).length || 0

    return NextResponse.json({
      pipelines: pipelines || [],
      metrics: {
        totalPipelines,
        successRate,
        avgDuration: `${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`,
        deploymentsToday,
      },
    })
  } catch (error) {
    console.error("DevOps API Error:", error)
    return NextResponse.json({ error: "Failed to fetch DevOps data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { data: pipeline, error } = await supabase
      .from("devops_pipelines")
      .insert([
        {
          name: body.name,
          branch: body.branch,
          commit: body.commit,
          author: body.author,
          status: body.status || "pending",
          duration_seconds: body.duration_seconds,
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Create pipeline stages
    if (body.stages && pipeline) {
      const stages = body.stages.map((stage: any) => ({
        pipeline_id: pipeline.id,
        name: stage.name,
        status: stage.status,
        duration_seconds: stage.duration_seconds,
        order_index: stage.order_index,
      }))

      await supabase.from("pipeline_stages").insert(stages)
    }

    return NextResponse.json({ pipeline })
  } catch (error) {
    console.error("DevOps Pipeline Creation Error:", error)
    return NextResponse.json({ error: "Failed to create DevOps pipeline" }, { status: 500 })
  }
}
