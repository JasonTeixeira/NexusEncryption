import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, isAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()
    const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const personalAdmin = {
      id: "admin-001",
      name: "NEXUS ARCHITECT",
      email: "sage@sageideas.org",
      role: "admin",
      status: "active",
      lastLogin: new Date().toISOString(),
      createdAt: "2023-01-01T00:00:00.000Z",
      permissions: ["read", "write", "delete", "admin"],
      projects: 12,
      blogPosts: 8,
      totalViews: 45672,
    }

    return NextResponse.json({ users: [personalAdmin] })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await request.json()

    // Validate required fields
    if (!userData.name || !userData.email || !userData.role) {
      return NextResponse.json({ error: "Name, email, and role are required" }, { status: 400 })
    }

    const supabase = createClient()

    // In a real implementation, you would create the user in Supabase Auth
    // and then store additional user data in your users table
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status || "active",
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      permissions: getPermissionsForRole(userData.role),
    }

    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getPermissionsForRole(role: string): string[] {
  switch (role) {
    case "admin":
      return ["read", "write", "delete", "admin"]
    case "editor":
      return ["read", "write"]
    case "viewer":
    default:
      return ["read"]
  }
}
