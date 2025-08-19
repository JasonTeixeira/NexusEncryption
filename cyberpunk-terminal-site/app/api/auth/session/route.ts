import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return Response.json({ user: null })
    }

    return Response.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        permissions: session.user.permissions,
      },
    })
  } catch (error) {
    console.error("Session error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
