import type { NextRequest } from "next/server"
import { db } from "@/lib/database"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const assets = await db.getMediaAssets()
    return Response.json({ assets })
  } catch (error) {
    console.error("Get media assets error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth("write")(request)
    if (session instanceof Response) return session

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    // In production, upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll simulate the upload
    const asset = await db.createMediaAsset({
      filename: `${Date.now()}-${file.name}`,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: `/uploads/${Date.now()}-${file.name}`, // Simulated URL
      alt: (formData.get("alt") as string) || "",
      description: (formData.get("description") as string) || "",
      tags: ((formData.get("tags") as string) || "").split(",").filter(Boolean),
      uploadedBy: session.user.id,
    })

    return Response.json({ asset }, { status: 201 })
  } catch (error) {
    console.error("Upload media error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
