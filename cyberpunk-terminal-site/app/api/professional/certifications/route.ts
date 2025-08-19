import { type NextRequest, NextResponse } from "next/server"
import { certificationService } from "@/lib/professional-apis"

export async function GET(request: NextRequest) {
  try {
    const data = await certificationService.getCertifications()

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Certifications API error:", error)
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { certificationId } = await request.json()

    if (!certificationId) {
      return NextResponse.json({ error: "Certification ID required" }, { status: 400 })
    }

    const verified = await certificationService.verifyCertification(certificationId)

    return NextResponse.json({
      success: true,
      data: { verified, certificationId },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Certification verification error:", error)
    return NextResponse.json({ error: "Failed to verify certification" }, { status: 500 })
  }
}
