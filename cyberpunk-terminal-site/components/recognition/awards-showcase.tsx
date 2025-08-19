"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import type { Award } from "@/lib/industry-recognition"

export function AwardsShowcase() {
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await fetch("/api/recognition/awards")
        const data = await response.json()
        setAwards(data.awards || [])
      } catch (error) {
        console.error("Error fetching awards:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAwards()
  }, [])

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case "international":
        return "text-gold-400 bg-gold-500/20 border-gold-500/50"
      case "national":
        return "text-silver-400 bg-silver-500/20 border-silver-500/50"
      case "local":
        return "text-bronze-400 bg-bronze-500/20 border-bronze-500/50"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50"
    }
  }

  if (loading) {
    return (
      <div className="bg-black/95 border border-yellow-500/50 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-yellow-500/20 rounded"></div>
          <div className="h-32 bg-yellow-500/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/95 border border-yellow-500/50 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-yellow-400 font-mono text-lg">Industry Awards & Recognition</span>
      </div>

      {awards.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">🏆</div>
          <div className="text-gray-400 text-sm">No awards data available</div>
        </div>
      ) : (
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {awards.map((award) => (
              <div key={award.id} className="border border-gray-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-mono text-lg mb-1">{award.title}</h3>
                    <div className="text-gray-300 text-sm mb-2">
                      {award.organization} • {award.year}
                    </div>
                    <p className="text-gray-400 text-sm">{award.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded border text-xs ${getSignificanceColor(award.significance)}`}>
                      {award.significance.toUpperCase()}
                    </span>
                    <div className="text-yellow-400 text-2xl">🏆</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-cyan-400 text-xs">Category: {award.category}</div>
                  {award.verificationUrl && (
                    <Button
                      onClick={() => window.open(award.verificationUrl, "_blank")}
                      className="text-xs px-3 py-1 bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
                    >
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
