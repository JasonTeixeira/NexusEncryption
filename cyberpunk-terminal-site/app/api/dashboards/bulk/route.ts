import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { operation, table, data } = body

    if (operation === "import") {
      // Bulk import data
      const { data: result, error } = await supabase.from(table).insert(data).select()

      if (error) throw error

      return NextResponse.json({
        success: true,
        imported: result?.length || 0,
        data: result,
      })
    } else if (operation === "export") {
      // Bulk export data
      const { data: result, error } = await supabase.from(table).select("*")

      if (error) throw error

      return NextResponse.json({
        success: true,
        exported: result?.length || 0,
        data: result,
      })
    } else if (operation === "delete") {
      // Bulk delete data
      const { ids } = body
      const { error } = await supabase.from(table).delete().in("id", ids)

      if (error) throw error

      return NextResponse.json({
        success: true,
        deleted: ids.length,
      })
    }

    return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
  } catch (error) {
    console.error("Bulk Operation Error:", error)
    return NextResponse.json({ error: "Bulk operation failed" }, { status: 500 })
  }
}
