import { type NextRequest, NextResponse } from "next/server"
import { newsService } from "@/lib/professional-apis"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let data
    if (category) {
      data = await newsService.getNewsByCategory(category)
    } else {
      data = await newsService.getIndustryNews()
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("News API error:", error)
    return NextResponse.json({ error: "Failed to fetch industry news" }, { status: 500 })
  }
}
