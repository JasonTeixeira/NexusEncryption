import type { NextRequest } from "next/server"
import { ClientPortalService } from "@/lib/client-portal"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await verifyAuth(authHeader.replace("Bearer ", ""))
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId") || user.id

    const projects = await ClientPortalService.getClientProjects(clientId)

    return Response.json({ projects })
  } catch (error) {
    console.error("Client portal projects API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
