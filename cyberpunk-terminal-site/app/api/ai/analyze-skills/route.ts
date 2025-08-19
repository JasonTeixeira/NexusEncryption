import type { NextRequest } from "next/server"
import { aiAssistant } from "@/lib/ai-assistant"

export async function POST(request: NextRequest) {
  try {
    const { currentSkills, targetRole } = await request.json()

    if (!currentSkills || !targetRole) {
      return Response.json({ error: "Current skills and target role are required" }, { status: 400 })
    }

    const analysis = await aiAssistant.analyzeSkillGap(currentSkills, targetRole)

    return Response.json(analysis)
  } catch (error) {
    console.error("Skill analysis API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
