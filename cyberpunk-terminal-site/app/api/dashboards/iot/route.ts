import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let query = supabase.from("iot_devices").select("*")

    if (location) query = query.eq("location", location)
    if (status) query = query.eq("status", status)
    if (type) query = query.eq("type", type)

    const { data: devices, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    // Generate real-time metrics
    const totalDevices = devices?.length || 0
    const onlineDevices = devices?.filter((d) => d.status === "online").length || 0
    const alerts = devices?.filter((d) => d.status === "warning" || d.status === "error").length || 0

    return NextResponse.json({
      devices: devices || [],
      metrics: {
        totalDevices,
        onlineDevices,
        alerts,
        uptime: Math.round((onlineDevices / totalDevices) * 100 * 100) / 100,
      },
    })
  } catch (error) {
    console.error("IoT API Error:", error)
    return NextResponse.json({ error: "Failed to fetch IoT data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { data: device, error } = await supabase
      .from("iot_devices")
      .insert([
        {
          name: body.name,
          type: body.type,
          location: body.location,
          status: body.status || "online",
          battery: body.battery,
          temperature: body.temperature,
          humidity: body.humidity,
          power: body.power,
          signal: body.signal,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ device })
  } catch (error) {
    console.error("IoT Device Creation Error:", error)
    return NextResponse.json({ error: "Failed to create IoT device" }, { status: 500 })
  }
}
