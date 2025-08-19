import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const table = searchParams.get("table")
    const metric = searchParams.get("metric")
    const period = searchParams.get("period") || "7d"
    const groupBy = searchParams.get("groupBy") || "day"

    if (!table || !metric) {
      return NextResponse.json({ error: "Table and metric parameters required" }, { status: 400 })
    }

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    switch (period) {
      case "1d":
        startDate.setDate(now.getDate() - 1)
        break
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
    }

    // Build aggregation query based on table and metric
    const query = supabase.from(table).select("*").gte("created_at", startDate.toISOString())

    const { data: rawData, error } = await query

    if (error) throw error

    // Aggregate data by time period
    const aggregatedData = aggregateByTimePeriod(rawData || [], metric, groupBy)

    return NextResponse.json({
      data: aggregatedData,
      period,
      metric,
      groupBy,
    })
  } catch (error) {
    console.error("Historical Data API Error:", error)
    return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 500 })
  }
}

function aggregateByTimePeriod(data: any[], metric: string, groupBy: string) {
  const grouped: { [key: string]: any[] } = {}

  data.forEach((item) => {
    const date = new Date(item.created_at)
    let key: string

    switch (groupBy) {
      case "hour":
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}`
        break
      case "day":
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        break
      case "week":
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`
        break
      case "month":
        key = `${date.getFullYear()}-${date.getMonth() + 1}`
        break
      default:
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }

    if (!grouped[key]) grouped[key] = []
    grouped[key].push(item)
  })

  // Calculate aggregated values
  return Object.entries(grouped).map(([period, items]) => {
    let value: number

    switch (metric) {
      case "count":
        value = items.length
        break
      case "sum":
        value = items.reduce((acc, item) => acc + (item.value || 0), 0)
        break
      case "average":
        value = items.reduce((acc, item) => acc + (item.value || 0), 0) / items.length
        break
      default:
        value = items.length
    }

    return { period, value, count: items.length }
  })
}
