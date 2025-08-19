import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, canEditContent } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Try to find by ID first, then by slug
    let { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      // If not found by ID, try by slug
      const { data: projectBySlug, error: slugError } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", params.id)
        .single()

      if (slugError) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
      project = projectBySlug
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Get project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await canEditContent())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()
    const updates = await request.json()

    // Try to update by ID first, then by slug
    let { data: project, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      // If not found by ID, try by slug
      const { data: projectBySlug, error: slugError } = await supabase
        .from("projects")
        .update(updates)
        .eq("slug", params.id)
        .select()
        .single()

      if (slugError) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
      project = projectBySlug
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await canEditContent())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    // Try to delete by ID first, then by slug
    let { error } = await supabase.from("projects").delete().eq("id", params.id)

    if (error) {
      // If not found by ID, try by slug
      const { error: slugError } = await supabase.from("projects").delete().eq("slug", params.id)

      if (slugError) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
