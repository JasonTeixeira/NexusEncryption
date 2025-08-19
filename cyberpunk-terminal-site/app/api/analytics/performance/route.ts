import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { metrics, sessionId } = body

    if (!metrics || !Array.isArray(metrics)) {
      return NextResponse.json({ error: "Invalid metrics data" }, { status: 400 })
    }

    // Process and store metrics
    const processedMetrics = metrics.map((metric) => ({
      session_id: sessionId,
      metric_name: metric.name,
      metric_value: metric.value,
      url: metric.url,
      user_agent: metric.userAgent,
      timestamp: new Date(metric.timestamp).toISOString(),
      created_at: new Date().toISOString(),
    }))

    const { error } = await supabase.from("performance_metrics").insert(processedMetrics)

    if (error) {
      console.error("Error storing performance metrics:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, stored: processedMetrics.length })
  } catch (error) {
    console.error("Performance metrics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "24h"
    const metric = searchParams.get("metric")

    let query = supabase.from("performance_metrics").select("*")

    // Filter by timeframe
    const now = new Date()
    let startTime: Date

    switch (timeframe) {
      case "1h":
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case "24h":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "7d":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }

    query = query.gte("timestamp", startTime.toISOString())

    if (metric) {
      query = query.eq("metric_name", metric)
    }

    const { data: metrics, error } = await query.order("timestamp", { ascending: false }).limit(1000)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Aggregate metrics for dashboard
    const aggregated = aggregateMetrics(metrics || [])

    return NextResponse.json({ metrics, aggregated })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function aggregateMetrics(metrics: any[]) {
  const grouped = metrics.reduce((acc, metric) => {
    const key = metric.metric_name
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(metric.metric_value)
    return acc
  }, {})

  const aggregated = Object.entries(grouped).map(([name, values]: [string, number[]]) => ({
    name,
    count: values.length,
    average: values.reduce((sum, val) => sum + val, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    p50: percentile(values, 0.5),
    p95: percentile(values, 0.95),
    p99: percentile(values, 0.99),
  }))

  return aggregated
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil(sorted.length * p) - 1
  return sorted[Math.max(0, index)]
}
