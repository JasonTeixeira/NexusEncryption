"use client"

import { useState } from "react"
import { ProjectDashboard } from "@/components/client-portal/project-dashboard"
import { FileManager } from "@/components/client-portal/file-manager"
import { CommunicationHub } from "@/components/client-portal/communication-hub"
import { Button } from "@/components/ui/button"

export default function ClientPortalPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "files" | "communication">("dashboard")
  const [selectedProject] = useState("project-1") // In real app, this would be dynamic

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
          <h1 className="text-cyan-400 text-3xl font-mono">Client Portal</h1>
        </div>
        <div className="text-gray-400 text-sm">
          Welcome to your project management dashboard. Track progress, communicate with your team, and manage files.
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-2 mb-8">
        {[
          { id: "dashboard", label: "Project Dashboard", icon: "📊" },
          { id: "files", label: "File Manager", icon: "📁" },
          { id: "communication", label: "Communication", icon: "💬" },
        ].map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm ${
              activeTab === tab.id
                ? "bg-cyan-500/30 border-cyan-500/50 text-cyan-300"
                : "bg-gray-700/30 border-gray-600/50 text-gray-400 hover:bg-gray-600/30"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "dashboard" && <ProjectDashboard projectId={selectedProject} />}
        {activeTab === "files" && <FileManager projectId={selectedProject} />}
        {activeTab === "communication" && <CommunicationHub projectId={selectedProject} />}
      </div>
    </div>
  )
}
