import type { NextRequest } from "next/server"

// Store active connections
const connections = new Set<ReadableStreamDefaultController>()
const subscriptions = new Map<string, { channel: string; filters?: Record<string, any> }>()

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      connections.add(controller)

      // Send initial connection message
      const data = JSON.stringify({
        type: "connected",
        timestamp: new Date().toISOString(),
      })
      controller.enqueue(`data: ${data}\n\n`)

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(`data: ${JSON.stringify({ type: "heartbeat", timestamp: new Date().toISOString() })}\n\n`)
        } catch (error) {
          clearInterval(heartbeat)
          connections.delete(controller)
        }
      }, 30000)

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        connections.delete(controller)
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}

// Broadcast message to all connected clients
export function broadcastToClients(channel: string, payload: any, filters?: Record<string, any>) {
  const message = JSON.stringify({
    channel,
    payload,
    filters,
    timestamp: new Date().toISOString(),
  })

  connections.forEach((controller) => {
    try {
      controller.enqueue(`data: ${message}\n\n`)
    } catch (error) {
      // Remove dead connections
      connections.delete(controller)
    }
  })
}
