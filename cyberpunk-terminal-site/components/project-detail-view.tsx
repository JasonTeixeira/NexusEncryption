"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTransition } from "@/contexts/transition-context"
import { useSound } from "@/contexts/sound-context"
import { useGitHubRepo } from "@/hooks/use-github"
import { aiKnowledgeBase, type ProjectData } from "@/lib/ai-knowledge-base"

interface ProjectDetailViewProps {
  slug: string
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ slug }) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<ProjectData | null>(null)
  const [isStarring, setIsStarring] = useState(false)
  const { navigateWithTransition } = useTransition()
  const { playCommand, playSuccess, playError } = useSound()

  const githubRepoName = project?.github_url ? project.github_url.split("/").pop()?.replace(".git", "") || "" : ""

  const { repo: githubRepo, loading: githubLoading } = useGitHubRepo(githubRepoName)

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true)
      try {
        const projectData = await aiKnowledgeBase.getProject(slug)
        setProject(projectData)
      } catch (error) {
        console.error("Error loading project:", error)
        setProject(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [slug])

  const handleStarRepo = async () => {
    if (!project?.github_url || !githubRepo) return

    setIsStarring(true)
    playCommand()

    try {
      // Extract owner and repo from GitHub URL
      const match = project.github_url.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) throw new Error("Invalid GitHub URL")

      const [, owner, repo] = match
      const repoName = repo.replace(/\.git$/, "")

      // Call GitHub API to star the repository
      const response = await fetch(`/api/github/star`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ owner, repo: repoName }),
      })

      if (response.ok) {
        playSuccess()
        // Optionally refresh repo data to get updated star count
        window.open(`https://${project.github_url}`, "_blank")
      } else {
        throw new Error("Failed to star repository")
      }
    } catch (error) {
      console.error("Error starring repo:", error)
      playError()
      // Fallback: just open the GitHub repo
      window.open(`https://${project.github_url}`, "_blank")
    } finally {
      setIsStarring(false)
    }
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "architecture", label: "Architecture" },
    { id: "metrics", label: "Performance" },
    { id: "github", label: "Repository" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-400 text-xl mb-4">LOADING PROJECT DATA...</div>
          <div className="animate-pulse">▓▓▓▓▓▓▓▓▓▓</div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-4">PROJECT NOT FOUND</div>
          <div className="text-gray-400 mb-4">Project "{slug}" does not exist in the database.</div>
          <button
            onClick={() => navigateWithTransition("/projects", "PROJECTS")}
            className="text-cyan-400 hover:text-white transition-colors"
          >
            ← Return to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-green-400 font-mono relative overflow-hidden">
      <div className="scanlines fixed inset-0 pointer-events-none z-[2]" />
      <div className="crt fixed inset-0 pointer-events-none z-[3]" />

      <div className="relative z-[1] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigateWithTransition("/projects", "PROJECTS")}
              className="text-cyan-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>←</span> Back to Projects
            </button>
            <div className="text-gray-500 text-sm">{project.id}</div>
          </div>

          <div className="border border-green-500/30 p-6 mb-8 bg-green-500/5 relative">
            <div className="absolute top-4 right-4 px-3 py-1 text-xs uppercase tracking-wider bg-green-500/10 border border-green-500 text-green-400 animate-pulse">
              ● {project.status.toUpperCase()}
            </div>
            <h1 className="text-3xl font-bold text-cyan-400 mb-4">{project.title}</h1>
            <p className="text-gray-300 text-lg mb-6">{project.description}</p>
            {project.content && <p className="text-gray-400 mb-6">{project.content}</p>}

            <div className="flex gap-4 flex-wrap">
              {project.github_url && (
                <button
                  onClick={handleStarRepo}
                  disabled={isStarring}
                  className="px-4 py-2 bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <span>⭐</span>
                  {isStarring ? "Starring..." : "Star on GitHub"}
                  {githubRepo && !githubLoading && (
                    <div className="flex items-center gap-2 ml-2 text-xs">
                      <span className="text-yellow-400">⭐ {githubRepo.stars}</span>
                      <span className="text-blue-400">🔀 {githubRepo.forks}</span>
                    </div>
                  )}
                </button>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-cyan-500/10 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-2"
                >
                  <span>🚀</span> Live Demo
                </a>
              )}
            </div>
          </div>

          <div className="border-b border-green-500/20 mb-8">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    playCommand()
                  }}
                  className={`pb-4 px-2 transition-colors ${
                    activeTab === tab.id
                      ? "text-cyan-400 border-b-2 border-cyan-400"
                      : "text-gray-500 hover:text-green-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-green-400 mb-4 mt-8">Project Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-black/50 border border-green-500/10">
                      <span className="text-gray-400">Status</span>
                      <span className="text-green-400 font-bold uppercase">{project.status}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/50 border border-green-500/10">
                      <span className="text-gray-400">Featured</span>
                      <span className="text-green-400 font-bold">{project.featured ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/50 border border-green-500/10">
                      <span className="text-gray-400">Uptime</span>
                      <span className="text-green-400 font-bold">{project.uptime}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-black/50 border border-green-500/10">
                      <span className="text-gray-400">Daily Requests</span>
                      <span className="text-green-400 font-bold">{project.requests_per_day.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/50 border border-green-500/10">
                      <span className="text-gray-400">Avg Response Time</span>
                      <span className="text-green-400 font-bold">{project.avg_response_time}ms</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/50 border border-green-500/10">
                      <span className="text-gray-400">Uptime</span>
                      <span className="text-green-400 font-bold">{project.uptime}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "architecture" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-4">System Architecture</h3>
                  <div className="p-6 bg-black/50 border border-green-500/20">
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.tech_stack.map((tech, index) => (
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

            {activeTab === "metrics" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-500/5 border border-green-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse" />
                  <div className="text-3xl font-bold text-cyan-400 mb-2">
                    {project.requests_per_day.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Daily Requests</div>
                </div>
                <div className="text-center p-6 bg-green-500/5 border border-green-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse" />
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{project.avg_response_time}ms</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Response Time</div>
                </div>
                <div className="text-center p-6 bg-green-500/5 border border-green-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse" />
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{project.uptime}%</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Uptime</div>
                </div>
              </div>
            )}

            {activeTab === "github" && (
              <div className="space-y-8">
                {project.github_url ? (
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-4">Repository Information</h3>
                    {githubLoading ? (
                      <div className="text-gray-400">Loading GitHub data...</div>
                    ) : githubRepo ? (
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
                              ⭐ {isStarring ? "Starring..." : "Star Repository"}
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

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-black/30 border border-gray-500/20">
                              <span className="text-gray-400">Language:</span>
                              <span className="text-green-400 ml-2 font-bold">{githubRepo.language}</span>
                            </div>
                            <div className="p-3 bg-black/30 border border-gray-500/20">
                              <span className="text-gray-400">Last Updated:</span>
                              <span className="text-green-400 ml-2 font-bold">
                                {new Date(githubRepo.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400">Repository data unavailable</div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 font-mono text-lg mb-2">No GitHub Repository</div>
                    <div className="text-gray-600 font-mono text-sm">This project doesn't have a public repository</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scanlines {
          background: linear-gradient(transparent 50%, rgba(0, 255, 136, 0.03) 50%);
          background-size: 100% 4px;
          animation: scanlines 0.1s linear infinite;
        }
        
        .crt {
          background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
        }
        
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
      `}</style>
    </div>
  )
}

export default ProjectDetailView
