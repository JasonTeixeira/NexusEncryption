"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Project } from "@/lib/client-portal"

interface ProjectDashboardProps {
  projectId: string
}

export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/client-portal/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        })
        const data = await response.json()
        setProject(data.project)
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  if (loading) {
    return (
      <div className="bg-black/95 border border-cyan-500/50 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-cyan-500/20 rounded"></div>
          <div className="h-4 bg-cyan-500/10 rounded w-3/4"></div>
          <div className="h-32 bg-cyan-500/10 rounded"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="bg-black/95 border border-red-500/50 rounded-lg p-6 text-center">
        <div className="text-red-400 text-lg mb-2">Project Not Found</div>
        <div className="text-gray-400 text-sm">The requested project could not be loaded.</div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/20 border-green-500/50"
      case "in-progress":
        return "text-cyan-400 bg-cyan-500/20 border-cyan-500/50"
      case "review":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50"
      case "on-hold":
        return "text-red-400 bg-red-500/20 border-red-500/50"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-400"
      case "high":
        return "text-orange-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-black/95 border border-cyan-500/50 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-cyan-400 text-2xl font-mono mb-2">{project.name}</h1>
            <p className="text-gray-300 text-sm mb-4">{project.description}</p>
            <div className="flex items-center space-x-4 text-xs">
              <span className={`px-2 py-1 rounded border ${getStatusColor(project.status)}`}>
                {project.status.toUpperCase()}
              </span>
              <span className={`${getPriorityColor(project.priority)}`}>
                Priority: {project.priority.toUpperCase()}
              </span>
              <span className="text-gray-400">
                {project.startDate.toLocaleDateString()} - {project.endDate.toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-cyan-400 text-lg font-mono">{project.progress}%</div>
            <div className="text-gray-400 text-xs">Complete</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Progress</span>
            <span className="text-cyan-400">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-black/95 border border-green-500/50 rounded-lg p-6">
        <h2 className="text-green-400 text-lg font-mono mb-4">Budget Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-green-400 text-2xl font-mono">${project.budget.toLocaleString()}</div>
            <div className="text-gray-400 text-xs">Total Budget</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 text-2xl font-mono">${project.spent.toLocaleString()}</div>
            <div className="text-gray-400 text-xs">Spent</div>
          </div>
          <div className="text-center">
            <div className="text-cyan-400 text-2xl font-mono">${(project.budget - project.spent).toLocaleString()}</div>
            <div className="text-gray-400 text-xs">Remaining</div>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={(project.spent / project.budget) * 100} className="h-2" />
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-black/95 border border-purple-500/50 rounded-lg p-6">
        <h2 className="text-purple-400 text-lg font-mono mb-4">Project Milestones</h2>
        <ScrollArea className="h-64">
          <div className="space-y-4">
            {project.milestones.map((milestone) => (
              <div key={milestone.id} className="border border-gray-700/50 rounded p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-cyan-400 font-mono text-sm">{milestone.title}</h3>
                    <p className="text-gray-300 text-xs mt-1">{milestone.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded border text-xs ${getStatusColor(milestone.status)}`}>
                    {milestone.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-400">Due: {milestone.dueDate.toLocaleDateString()}</span>
                  <span className="text-cyan-400">{milestone.progress}%</span>
                </div>
                <Progress value={milestone.progress} className="h-1 mb-2" />
                <div className="text-xs">
                  <span className="text-gray-400">Deliverables: </span>
                  <span className="text-gray-300">{milestone.deliverables.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Team Members */}
      <div className="bg-black/95 border border-orange-500/50 rounded-lg p-6">
        <h2 className="text-orange-400 text-lg font-mono mb-4">Project Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.team.map((member) => (
            <div key={member.id} className="flex items-center space-x-3 p-3 border border-gray-700/50 rounded">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-mono text-sm">{member.name.charAt(0)}</span>
              </div>
              <div>
                <div className="text-cyan-400 text-sm font-mono">{member.name}</div>
                <div className="text-gray-400 text-xs">{member.role}</div>
                <div className="text-gray-500 text-xs">{member.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
