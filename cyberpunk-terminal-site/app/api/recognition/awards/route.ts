import type { NextRequest } from "next/server"
import { IndustryRecognitionService } from "@/lib/industry-recognition"

export async function GET(request: NextRequest) {
  try {
    const awards = await IndustryRecognitionService.getAwards()
    return Response.json({ awards })
  } catch (error) {
    console.error("Awards API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
