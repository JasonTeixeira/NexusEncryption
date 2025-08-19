"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { AwardsShowcase } from "./awards-showcase"
import { CertificationsDisplay } from "./certifications-display"
import { SpeakingEngagements } from "./speaking-engagements"
import { IndustryRecognitionService } from "@/lib/industry-recognition"

export function RecognitionDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "awards" | "certifications" | "speaking">("overview")
  const [recognitionScore, setRecognitionScore] = useState<any>(null)

  useEffect(() => {
    const score = IndustryRecognitionService.getRecognitionScore()
    setRecognitionScore(score)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/95 border border-cyan-500/50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-cyan-400 font-mono text-2xl">Industry Recognition</span>
        </div>
        <div className="text-gray-400 text-sm">
          Professional achievements, certifications, and industry contributions
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "awards", label: "Awards", icon: "🏆" },
          { id: "certifications", label: "Certifications", icon: "🎓" },
          { id: "speaking", label: "Speaking", icon: "🎤" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm rounded border font-mono ${
              activeTab === tab.id
                ? "bg-cyan-500/30 border-cyan-500/50 text-cyan-300"
                : "bg-gray-700/30 border-gray-600/50 text-gray-400 hover:bg-gray-600/30"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && recognitionScore && (
        <div className="space-y-6">
          {/* Recognition Score */}
          <div className="bg-black/95 border border-green-500/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-green-400 font-mono text-lg">Industry Recognition Score</h2>
              <div className="text-green-400 text-3xl font-mono">{recognitionScore.total}/100</div>
            </div>
            <Progress value={recognitionScore.total} className="h-3 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(recognitionScore.breakdown).map(([category, score]) => (
                <div key={category} className="text-center">
                  <div className="text-cyan-400 text-lg font-mono">{score as number}</div>
                  <div className="text-gray-400 text-xs capitalize">{category}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <div className="text-yellow-400 text-2xl font-mono">2</div>
              <div className="text-gray-400 text-xs">Industry Awards</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-blue-400 text-2xl font-mono">8</div>
              <div className="text-gray-400 text-xs">Active Certifications</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-purple-400 text-2xl font-mono">15</div>
              <div className="text-gray-400 text-xs">Speaking Events</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-green-400 text-2xl font-mono">12</div>
              <div className="text-gray-400 text-xs">Publications</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "awards" && <AwardsShowcase />}
      {activeTab === "certifications" && <CertificationsDisplay />}
      {activeTab === "speaking" && <SpeakingEngagements />}
    </div>
  )
}
