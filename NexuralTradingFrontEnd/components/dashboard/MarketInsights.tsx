import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MarketInsight } from "@/lib/dashboard-data"

export default function MarketInsights({ data }: { data: MarketInsight[] }) {
  return (
    <Card className="cyberpunk-card">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-white tracking-wider">
          MARKET <span className="text-primary">INSIGHTS</span>
        </CardTitle>
        <CardDescription className="font-mono text-xs text-gray-400">AI-generated market analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {data.map((insight) => (
            <li key={insight.id} className="text-xs text-gray-300 font-mono">
              <Badge
                variant="outline"
                className={cn(
                  "mr-2 border-primary/30 text-primary",
                  insight.sentiment === "Bearish" && "border-red-500/30 text-red-500",
                  insight.sentiment === "Neutral" && "border-gray-500/30 text-gray-500",
                )}
              >
                {insight.sentiment}
              </Badge>
              {insight.text}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
