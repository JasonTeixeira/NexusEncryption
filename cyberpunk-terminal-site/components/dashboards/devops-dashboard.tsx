"use client"

import { useState, useEffect } from "react"
import { GitBranch, CheckCircle, XCircle, Clock, Play, RefreshCw } from "lucide-react"

interface Pipeline {
  id: string
  name: string
  status: "success" | "failed" | "running" | "pending"
  branch: string
  commit: string
  author: string
  duration: string
  startTime: string
  stages: PipelineStage[]
}

interface PipelineStage {
  name: string
  status: "success" | "failed" | "running" | "pending"
  duration: string
}

export default function DevOpsDashboard() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null)
  const [metrics, setMetrics] = useState({
    totalPipelines: 0,
    successRate: 0,
    avgDuration: "0m",
    deploymentsToday: 0,
  })

  useEffect(() => {
    const generatePipelines = (): Pipeline[] => {
      const branches = ["main", "develop", "feature/auth", "feature/dashboard", "hotfix/security"]
      const authors = ["john.doe", "jane.smith", "alex.chen", "sarah.wilson"]
      const statuses = ["success", "failed", "running", "pending"] as const
      const stageNames = ["Build", "Test", "Security Scan", "Deploy to Staging", "Deploy to Production"]

      return Array.from({ length: 12 }, (_, i) => {
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const stages = stageNames.map((name, index) => ({
          name,
          status: index < 3 ? "success" : status,
          duration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`,
        }))

        return {
          id: `pipeline-${i + 1}`,
          name: `Build #${1000 + i}`,
          status,
          branch: branches[Math.floor(Math.random() * branches.length)],
          commit: Math.random().toString(36).substring(2, 9),
          author: authors[Math.floor(Math.random() * authors.length)],
          duration: `${Math.floor(Math.random() * 15) + 2}m ${Math.floor(Math.random() * 60)}s`,
          startTime: new Date(Date.now() - Math.random() * 86400000).toLocaleTimeString(),
          stages,
        }
      })
    }

    const updateData = () => {
      const newPipelines = generatePipelines()
      setPipelines(newPipelines)

      const successCount = newPipelines.filter((p) => p.status === "success").length
      setMetrics({
        totalPipelines: newPipelines.length,
        successRate: Math.round((successCount / newPipelines.length) * 100),
        avgDuration: "8m 32s",
        deploymentsToday: Math.floor(Math.random() * 20) + 5,
      })
    }

    updateData()
    const interval = setInterval(updateData, 4000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "running":
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-400 border-green-400/30 bg-green-400/5"
      case "failed":
        return "text-red-400 border-red-400/30 bg-red-400/5"
      case "running":
        return "text-blue-400 border-blue-400/30 bg-blue-400/5"
      case "pending":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/5"
    }
  }

  return (
    <div className="p-6 bg-gray-950 text-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C940]" />
          </div>
          <h1 className="text-2xl font-bold text-orange-400 cyber-text-glow">DevOps CI/CD PIPELINE</h1>
        </div>

        <div className="text-gray-400 text-sm mb-6">
          <div>$ jenkins-cli pipeline --status --watch</div>
          <div className="text-orange-400">
            devops@nexus:~/pipelines$ monitoring {metrics.totalPipelines} active pipelines
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-blue-400/5 border border-blue-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <GitBranch className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-blue-400 font-mono">TOTAL</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{metrics.totalPipelines}</div>
          <div className="text-sm text-gray-400">Active Pipelines</div>
        </div>

        <div className="p-4 bg-green-400/5 border border-green-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span className="text-xs text-green-400 font-mono">SUCCESS</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{metrics.successRate}%</div>
          <div className="text-sm text-gray-400">Success Rate</div>
        </div>

        <div className="p-4 bg-purple-400/5 border border-purple-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-purple-400" />
            <span className="text-xs text-purple-400 font-mono">AVG TIME</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{metrics.avgDuration}</div>
          <div className="text-sm text-gray-400">Average Duration</div>
        </div>

        <div className="p-4 bg-cyan-400/5 border border-cyan-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Play className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">TODAY</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400">{metrics.deploymentsToday}</div>
          <div className="text-sm text-gray-400">Deployments</div>
        </div>
      </div>

      {/* Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline List */}
        <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">Recent Pipelines</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pipelines.map((pipeline) => (
              <div
                key={pipeline.id}
                className={`p-3 rounded border cursor-pointer transition-all hover:scale-[1.02] ${getStatusColor(pipeline.status)}`}
                onClick={() => setSelectedPipeline(pipeline)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(pipeline.status)}
                    <span className="font-mono text-sm">{pipeline.name}</span>
                  </div>
                  <span className="text-xs font-mono">{pipeline.duration}</span>
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  <span className="text-cyan-400">{pipeline.branch}</span> • {pipeline.commit} • {pipeline.author}
                </div>
                <div className="text-xs text-gray-400">Started: {pipeline.startTime}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Details */}
        <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">Pipeline Details</h3>
          {selectedPipeline ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(selectedPipeline.status)}
                <div>
                  <h4 className="font-bold text-lg">{selectedPipeline.name}</h4>
                  <p className="text-gray-400 text-sm">
                    Branch: <span className="text-cyan-400">{selectedPipeline.branch}</span> • Commit:{" "}
                    <span className="text-green-400">{selectedPipeline.commit}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-green-400">Pipeline Stages</h5>
                {selectedPipeline.stages.map((stage, index) => (
                  <div key={index} className={`p-3 rounded border ${getStatusColor(stage.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(stage.status)}
                        <span className="font-mono text-sm">{stage.name}</span>
                      </div>
                      <span className="text-xs font-mono">{stage.duration}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-800/50 rounded border border-gray-600/30">
                <h5 className="font-bold text-green-400 mb-2">Build Information</h5>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pipeline ID:</span>
                    <span className="text-green-400">{selectedPipeline.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Author:</span>
                    <span className="text-green-400">{selectedPipeline.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-green-400">{selectedPipeline.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Started:</span>
                    <span className="text-green-400">{selectedPipeline.startTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a pipeline to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
