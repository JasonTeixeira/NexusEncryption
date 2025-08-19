import type { NextRequest } from "next/server"
import { IndustryRecognitionService } from "@/lib/industry-recognition"

export async function GET(request: NextRequest) {
  try {
    const engagements = await IndustryRecognitionService.getSpeakingEngagements()
    return Response.json({ engagements })
  } catch (error) {
    console.error("Speaking engagements API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
