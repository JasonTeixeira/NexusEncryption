import type { NextRequest } from "next/server"
import { IndustryRecognitionService } from "@/lib/industry-recognition"

export async function GET(request: NextRequest) {
  try {
    const certifications = await IndustryRecognitionService.getCertifications()
    return Response.json({ certifications })
  } catch (error) {
    console.error("Certifications API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
