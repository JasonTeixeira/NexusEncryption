"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSound } from "@/contexts/sound-context"
import { X, ExternalLink, Star, AlertCircle } from "lucide-react"

interface Project {
  id: string
  name: string
  status: string
  description: string
  technologies: string[]
  metrics?: [string, string][]
  github?: string
  demo?: string
  tags?: string[]
  content?: string
  detailed_description?: string
  architecture?: string
  challenges?: string
  solutions?: string
  impact?: string
  future_plans?: string
}

interface ProjectDetailModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

interface GitHubRepo {
  name: string
  description: string
  stars: number
  forks: number
  watchers: number
  language: string
  updatedAt: string
  openIssues: number
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [terminalOutput, setTerminalOutput] = useState<Array<{ type: string; content: string }>>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [githubRepo, setGithubRepo] = useState<GitHubRepo | null>(null)
  const [isStarring, setIsStarring] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalBodyRef = useRef<HTMLDivElement>(null)

  const { playCommand, playSuccess, playError } = useSound()

  useEffect(() => {
    if (isOpen && project) {
      setActiveTab("overview")
      setTerminalOutput([])
      setInputValue("")

      // Initialize terminal with project info
      const initMessages = [
        {
          type: "system",
          content: `<span class="text-green-400">● Initializing project analysis for ${project.name}...</span>`,
        },
        { type: "system", content: `<span class="text-green-400">● Security clearance: AUTHORIZED</span>` },
        { type: "system", content: `<span class="text-green-400">● Project status: ${project.status}</span>` },
        { type: "system", content: `<span class="text-green-400">● Data synchronization complete</span>` },
        { type: "system", content: "" },
        {
          type: "info",
          content: `<span class="text-cyan-400">Type 'help' for available commands or explore the tabs above</span>`,
        },
      ]

      setTerminalOutput(initMessages)

      // Load GitHub data if available
      if (project.github) {
        loadGitHubData(project.github)
      }

      // Focus input after modal opens
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, project])

  const loadGitHubData = async (githubUrl: string) => {
    try {
      const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) return

      const [, owner, repo] = match
      const repoName = repo.replace(/\.git$/, "")

      // Mock GitHub data for now - in production this would call GitHub API
      setGithubRepo({
        name: repoName,
        description: project?.description || "",
        stars: Math.floor(Math.random() * 1000) + 100,
        forks: Math.floor(Math.random() * 200) + 20,
        watchers: Math.floor(Math.random() * 500) + 50,
        language: project?.technologies[0] || "TypeScript",
        updatedAt: new Date().toISOString(),
        openIssues: Math.floor(Math.random() * 20),
      })
    } catch (error) {
      console.error("Error loading GitHub data:", error)
    }
  }

  const handleStarRepo = async () => {
    if (!project?.github || !githubRepo) return

    setIsStarring(true)
    playCommand()

    try {
      // Simulate starring - in production this would call GitHub API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setGithubRepo((prev) => (prev ? { ...prev, stars: prev.stars + 1 } : null))
      playSuccess()

      setTerminalOutput((prev) => [
        ...prev,
        { type: "success", content: `<span class="text-green-400">✓ Repository starred successfully!</span>` },
        { type: "info", content: `<span class="text-cyan-400">Opening repository in new tab...</span>` },
      ])

      // Open GitHub repo
      window.open(`https://${project.github}`, "_blank")
    } catch (error) {
      playError()
      setTerminalOutput((prev) => [
        ...prev,
        { type: "error", content: `<span class="text-red-400">✗ Failed to star repository</span>` },
        { type: "info", content: `<span class="text-cyan-400">Opening repository directly...</span>` },
      ])
      window.open(`https://${project.github}`, "_blank")
    } finally {
      setIsStarring(false)
    }
  }

  const commands: { [key: string]: () => string } = {
    help: () => `
<span class="text-cyan-400">PROJECT ANALYSIS COMMANDS</span>
<span class="text-gray-500">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="text-green-400">Navigation:</span>
  overview      - Project overview and metrics
  architecture  - Technical architecture details
  github        - Repository information
  performance   - Performance metrics and stats
  
<span class="text-green-400">Actions:</span>
  star          - Star the GitHub repository
  demo          - Open live demo
  clone         - Get clone command
  deploy        - Deployment information
  
<span class="text-green-400">Analysis:</span>
  metrics       - Detailed performance metrics
  tech          - Technology stack analysis
  impact        - Project impact assessment
  
<span class="text-green-400">Utility:</span>
  clear         - Clear terminal output
  exit          - Close project analysis`,

    overview: () => {
      setActiveTab("overview")
      return `<span class="text-green-400">✓ Switched to overview tab</span>`
    },

    architecture: () => {
      setActiveTab("architecture")
      return `<span class="text-green-400">✓ Switched to architecture tab</span>`
    },

    github: () => {
      setActiveTab("github")
      return `<span class="text-green-400">✓ Switched to GitHub tab</span>`
    },

    performance: () => {
      setActiveTab("performance")
      return `<span class="text-green-400">✓ Switched to performance tab</span>`
    },

    star: () => {
      if (project?.github) {
        handleStarRepo()
        return `<span class="text-yellow-400">⭐ Starring repository...</span>`
      }
      return `<span class="text-red-400">✗ No GitHub repository available</span>`
    },

    demo: () => {
      if (project?.demo) {
        window.open(project.demo, "_blank")
        return `<span class="text-green-400">✓ Opening demo in new tab</span>`
      }
      return `<span class="text-red-400">✗ No demo available for this project</span>`
    },

    clone: () => {
      if (project?.github) {
        const cloneCmd = `git clone https://${project.github}`
        navigator.clipboard.writeText(cloneCmd)
        return `<span class="text-green-400">✓ Clone command copied to clipboard:</span>\n<span class="text-cyan-400">${cloneCmd}</span>`
      }
      return `<span class="text-red-400">✗ No repository available to clone</span>`
    },

    deploy: () => `
<span class="text-cyan-400">DEPLOYMENT INFORMATION</span>
<span class="text-gray-500">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="text-green-400">Status:</span> ${project?.status}
<span class="text-green-400">Environment:</span> Production
<span class="text-green-400">Last Deploy:</span> ${new Date().toLocaleDateString()}
<span class="text-green-400">Health:</span> All systems operational`,

    metrics: () => {
      if (project?.metrics) {
        let output = `<span class="text-cyan-400">DETAILED METRICS</span>\n`
        output += `<span class="text-gray-500">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>\n\n`

        project.metrics.forEach(([label, value]) => {
          output += `<span class="text-green-400">${label}</span> <span class="text-white">${value}</span>\n`
        })

        return output
      }
      return `<span class="text-red-400">✗ No metrics available</span>`
    },

    tech: () => {
      if (project?.technologies) {
        let output = `<span class="text-cyan-400">TECHNOLOGY STACK ANALYSIS</span>\n`
        output += `<span class="text-gray-500">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>\n\n`

        project.technologies.forEach((tech, index) => {
          output += `<span class="text-green-400">${index + 1}.</span> <span class="text-white">${tech}</span>\n`
        })

        return output
      }
      return `<span class="text-red-400">✗ No technology information available</span>`
    },

    impact: () => `
<span class="text-cyan-400">PROJECT IMPACT ASSESSMENT</span>
<span class="text-gray-500">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="text-green-400">Business Value:</span> High
<span class="text-green-400">Technical Innovation:</span> Advanced
<span class="text-green-400">Scalability:</span> Enterprise-grade
<span class="text-green-400">Maintainability:</span> Excellent`,

    exit: () => {
      onClose()
      return ""
    },

    clear: () => {
      setTerminalOutput([])
      return ""
    },
  }

  const handleCommand = (cmd: string) => {
    const [command, ...args] = cmd.toLowerCase().trim().split(" ")

    playCommand()

    setTerminalOutput((prev) => [
      ...prev,
      { type: "command", content: `<span class="text-green-500">$</span><span class="text-white ml-2">${cmd}</span>` },
    ])

    if (commands[command]) {
      const response = commands[command]()
      if (response) {
        setTerminalOutput((prev) => [...prev, { type: "response", content: response }])
      }
      playSuccess()
    } else {
      setTerminalOutput((prev) => [
        ...prev,
        { type: "error", content: `<span class="text-red-400">Command not found: ${command}</span>` },
        { type: "info", content: `<span class="text-gray-400">Type 'help' for available commands</span>` },
      ])
      playError()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (inputValue.trim()) {
        handleCommand(inputValue)
        setInputValue("")
      }
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [terminalOutput])

  if (!isOpen || !project) return null

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "architecture", label: "Architecture", icon: "🏗️" },
    { id: "performance", label: "Performance", icon: "⚡" },
    { id: "github", label: "Repository", icon: "🐙" },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-[#0A0A0F] border-2 border-green-500/50 w-full max-w-6xl h-[90vh] flex flex-col relative overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.3)]"
      >
        {/* Terminal Header */}
        <div className="bg-[#1C1C24] px-4 py-3 flex items-center justify-between border-b border-green-500/20">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C940]" />
            </div>
            <div className="text-green-400 font-mono text-sm">
              PROJECT_ANALYSIS://{project.name.toLowerCase().replace(/\s+/g, "-")}
            </div>
          </div>

          <button onClick={onClose} className="text-gray-500 hover:text-red-400 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Project Header */}
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-green-500/5 to-cyan-500/5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-gray-500 text-xs mb-1">{project.id}</div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">{project.name}</h2>
              <p className="text-gray-300 text-lg">{project.description}</p>
            </div>
            <div
              className={`px-3 py-1 text-xs uppercase tracking-wider border animate-pulse ${
                project.status === "OPERATIONAL"
                  ? "bg-green-500/10 border-green-500 text-green-400"
                  : project.status === "SCALING"
                    ? "bg-yellow-500/10 border-yellow-500 text-yellow-400"
                    : project.status === "CLASSIFIED"
                      ? "bg-red-500/10 border-red-500 text-red-400"
                      : "bg-gray-500/10 border-gray-500 text-gray-400"
              }`}
            >
              ● {project.status}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            {project.github && (
              <button
                onClick={handleStarRepo}
                disabled={isStarring}
                className="px-4 py-2 bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Star size={16} />
                {isStarring ? "Starring..." : "Star Repository"}
                {githubRepo && <span className="text-yellow-400 ml-2">⭐ {githubRepo.stars}</span>}
              </button>
            )}
            {project.demo && (
              <button
                onClick={() => window.open(project.demo, "_blank")}
                className="px-4 py-2 bg-cyan-500/10 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Live Demo
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-green-500/20 bg-[#0A0A0F]">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  playCommand()
                }}
                className={`px-6 py-3 text-sm font-mono transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5"
                    : "text-gray-500 hover:text-green-400 hover:bg-green-500/5"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-4">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm hover:bg-cyan-500/20 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.metrics && (
                    <div>
                      <h3 className="text-xl font-bold text-green-400 mb-4">Key Metrics</h3>
                      <div className="space-y-3">
                        {project.metrics.map(([label, value]) => (
                          <div
                            key={label}
                            className="flex justify-between items-center p-3 bg-black/50 border border-green-500/10"
                          >
                            <span className="text-gray-400">{label}</span>
                            <span className="text-green-400 font-bold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {project.tags && (
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-500/10 border border-gray-500/30 text-gray-400 text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "architecture" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-4">System Architecture</h3>
                  <div className="p-6 bg-black/50 border border-green-500/20">
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.technologies.map((tech, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20"
                        >
                          <span className="text-green-400">▶</span>
                          <span className="text-gray-300">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "performance" && project.metrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.metrics.map(([label, value]) => (
                  <div
                    key={label}
                    className="text-center p-6 bg-green-500/5 border border-green-500/20 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse" />
                    <div className="text-3xl font-bold text-cyan-400 mb-2">{value}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">{label.replace(":", "")}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "github" && (
              <div className="space-y-6">
                {project.github ? (
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-4">Repository Information</h3>
                    {githubRepo ? (
                      <div className="space-y-4">
                        <div className="p-6 bg-black/50 border border-green-500/20">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-cyan-400 text-lg font-bold">{githubRepo.name}</h4>
                              <p className="text-gray-400">{githubRepo.description}</p>
                            </div>
                            <button
                              onClick={handleStarRepo}
                              disabled={isStarring}
                              className="px-4 py-2 bg-yellow-500/10 border border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
                            >
                              ⭐ {isStarring ? "Starring..." : "Star"}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-yellow-500/5 border border-yellow-500/20">
                              <div className="text-2xl font-bold text-yellow-400">{githubRepo.stars}</div>
                              <div className="text-xs text-gray-400">Stars</div>
                            </div>
                            <div className="text-center p-3 bg-blue-500/5 border border-blue-500/20">
                              <div className="text-2xl font-bold text-blue-400">{githubRepo.forks}</div>
                              <div className="text-xs text-gray-400">Forks</div>
                            </div>
                            <div className="text-center p-3 bg-green-500/5 border border-green-500/20">
                              <div className="text-2xl font-bold text-green-400">{githubRepo.watchers}</div>
                              <div className="text-xs text-gray-400">Watchers</div>
                            </div>
                            <div className="text-center p-3 bg-red-500/5 border border-red-500/20">
                              <div className="text-2xl font-bold text-red-400">{githubRepo.openIssues}</div>
                              <div className="text-xs text-gray-400">Issues</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400">Loading repository data...</div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="mx-auto mb-4 text-gray-500" size={48} />
                    <div className="text-gray-500 font-mono text-lg mb-2">No Repository Available</div>
                    <div className="text-gray-600 font-mono text-sm">This project doesn't have a public repository</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Terminal Panel */}
          <div className="w-96 border-l border-green-500/20 bg-black/50 flex flex-col">
            <div className="p-3 border-b border-green-500/20 bg-green-500/5">
              <div className="text-green-400 font-mono text-sm">COMMAND TERMINAL</div>
            </div>

            <div
              ref={terminalBodyRef}
              className="flex-1 p-4 overflow-y-auto text-sm font-mono"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#00FF88 rgba(0, 255, 136, 0.05)",
              }}
            >
              {terminalOutput.map((line, index) => (
                <div key={index} className="mb-1" dangerouslySetInnerHTML={{ __html: line.content }} />
              ))}
            </div>

            <div className="p-4 border-t border-green-500/20">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  className="bg-transparent border-none text-white font-mono flex-1 outline-none text-sm"
                  placeholder="Type 'help' for commands..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scanlines {
          background: linear-gradient(transparent 50%, rgba(0, 255, 136, 0.03) 50%);
          background-size: 100% 4px;
          animation: scanlines 0.1s linear infinite;
        }
        
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
      `}</style>
    </div>
  )
}

export default ProjectDetailModal
