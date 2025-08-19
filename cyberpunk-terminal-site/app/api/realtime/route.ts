import type { NextRequest } from "next/server"
import { performanceCache } from "@/lib/performance-cache"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  try {
    let data

    switch (type) {
      case "github":
        data = await performanceCache.get(
          "github-realtime",
          async () => {
            // Fetch real-time GitHub data
            return {
              commits: Math.floor(Math.random() * 10),
              stars: Math.floor(Math.random() * 5),
              issues: Math.floor(Math.random() * 3),
              timestamp: Date.now(),
            }
          },
          10000,
        ) // 10 second cache
        break

      case "cloud":
        data = await performanceCache.get(
          "cloud-realtime",
          async () => {
            // Fetch real-time cloud metrics
            return {
              cpu: Math.random() * 100,
              memory: Math.random() * 100,
              network: Math.random() * 1000,
              timestamp: Date.now(),
            }
          },
          5000,
        ) // 5 second cache
        break

      case "analytics":
        data = await performanceCache.get(
          "analytics-realtime",
          async () => {
            // Fetch real-time analytics
            return {
              activeUsers: Math.floor(Math.random() * 50),
              pageViews: Math.floor(Math.random() * 200),
              bounceRate: Math.random() * 100,
              timestamp: Date.now(),
            }
          },
          15000,
        ) // 15 second cache
        break

      default:
        return Response.json({ error: "Invalid type" }, { status: 400 })
    }

    return Response.json(data)
  } catch (error) {
    console.error("Realtime API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
