import type { NextRequest } from "next/server"
import { ClientPortalService } from "@/lib/client-portal"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    await verifyAuth(authHeader.replace("Bearer ", ""))
    const project = await ClientPortalService.getProject(params.id)

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 })
    }

    return Response.json({ project })
  } catch (error) {
    console.error("Client portal project API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
