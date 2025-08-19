"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import type { SpeakingEngagement } from "@/lib/industry-recognition"

export function SpeakingEngagements() {
  const [engagements, setEngagements] = useState<SpeakingEngagement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEngagements = async () => {
      try {
        const response = await fetch("/api/recognition/speaking")
        const data = await response.json()
        setEngagements(data.engagements || [])
      } catch (error) {
        console.error("Error fetching speaking engagements:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEngagements()
  }, [])

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "conference":
        return "🎤"
      case "meetup":
        return "👥"
      case "webinar":
        return "💻"
      case "workshop":
        return "🛠️"
      case "podcast":
        return "🎧"
      default:
        return "📢"
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "conference":
        return "text-purple-400 bg-purple-500/20 border-purple-500/50"
      case "meetup":
        return "text-green-400 bg-green-500/20 border-green-500/50"
      case "webinar":
        return "text-blue-400 bg-blue-500/20 border-blue-500/50"
      case "workshop":
        return "text-orange-400 bg-orange-500/20 border-orange-500/50"
      case "podcast":
        return "text-pink-400 bg-pink-500/20 border-pink-500/50"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50"
    }
  }

  if (loading) {
    return (
      <div className="bg-black/95 border border-purple-500/50 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-purple-500/20 rounded"></div>
          <div className="h-32 bg-purple-500/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/95 border border-purple-500/50 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        <span className="text-purple-400 font-mono text-lg">Speaking Engagements</span>
      </div>

      {engagements.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">🎤</div>
          <div className="text-gray-400 text-sm">No speaking engagements data available</div>
        </div>
      ) : (
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {engagements.map((engagement) => (
              <div key={engagement.id} className="border border-gray-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-purple-400 font-mono text-lg mb-1">{engagement.title}</h3>
                    <div className="text-gray-300 text-sm mb-2">
                      {engagement.event} • {engagement.date.toLocaleDateString()}
                    </div>
                    <div className="text-gray-400 text-sm mb-2">{engagement.description}</div>
                    <div className="text-gray-500 text-xs">
                      {engagement.location} • {engagement.audience.toLocaleString()} attendees
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded border text-xs ${getEventTypeColor(engagement.eventType)}`}>
                      {engagement.eventType.toUpperCase()}
                    </span>
                    <div className="text-2xl">{getEventTypeIcon(engagement.eventType)}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {engagement.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  {engagement.recordingUrl && (
                    <Button
                      onClick={() => window.open(engagement.recordingUrl, "_blank")}
                      className="text-xs px-3 py-1 bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                    >
                      Recording
                    </Button>
                  )}
                  {engagement.slidesUrl && (
                    <Button
                      onClick={() => window.open(engagement.slidesUrl, "_blank")}
                      className="text-xs px-3 py-1 bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
                    >
                      Slides
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
