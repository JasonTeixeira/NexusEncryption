import type { NextRequest } from "next/server"
import { aiAssistant } from "@/lib/ai-assistant"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    const stream = await aiAssistant.streamResponse(message, context)

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
            }
            controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
          } catch (error) {
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`))
          } finally {
            controller.close()
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      },
    )
  } catch (error) {
    console.error("AI Stream API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
