import type { NextRequest } from "next/server"
import { ClientPortalService } from "@/lib/client-portal"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    await verifyAuth(authHeader.replace("Bearer ", ""))
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    if (!projectId) {
      return Response.json({ error: "Project ID required" }, { status: 400 })
    }

    const messages = await ClientPortalService.getProjectMessages(projectId)

    return Response.json({ messages })
  } catch (error) {
    console.error("Client portal messages API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await verifyAuth(authHeader.replace("Bearer ", ""))
    const { projectId, content, type = "text" } = await request.json()

    if (!projectId || !content) {
      return Response.json({ error: "Project ID and content required" }, { status: 400 })
    }

    // In a real implementation, save the message to database
    const message = {
      id: `msg-${Date.now()}`,
      projectId,
      senderId: user.id,
      senderName: user.name || "User",
      content,
      timestamp: new Date(),
      type,
      read: false,
    }

    return Response.json({ message })
  } catch (error) {
    console.error("Client portal send message API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
