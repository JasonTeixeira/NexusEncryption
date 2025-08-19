"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useProjects } from "@/hooks/use-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Project } from "@/lib/database"

interface ProjectTag {
  id: string
  name: string
  slug: string
  color: string
  category: string
  project_count?: number
}

interface ProjectMilestone {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  due_date: string
  progress_percentage: number
}

interface ProjectEnvironment {
  id: string
  name: string
  type: "development" | "staging" | "production" | "testing"
  url: string
  status: "active" | "inactive" | "maintenance"
}

export default function ProjectManager() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects()
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const [availableTags, setAvailableTags] = useState<ProjectTag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagName, setNewTagName] = useState("")
  const [newTagCategory, setNewTagCategory] = useState("general")

  const [milestones, setMilestones] = useState<ProjectMilestone[]>([])
  const [environments, setEnvironments] = useState<ProjectEnvironment[]>([])

  useEffect(() => {
    fetchAvailableTags()
  }, [])

  const fetchAvailableTags = async () => {
    try {
      const response = await fetch("/api/projects/tags")
      const result = await response.json()
      if (response.ok) {
        setAvailableTags(result.data || [])
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  const createNewTag = async () => {
    if (!newTagName.trim()) return

    try {
      const response = await fetch("/api/projects/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTagName,
          category: newTagCategory,
          color: "#00ff41",
          description: `${newTagCategory} tag for ${newTagName}`,
        }),
      })

      if (response.ok) {
        setNewTagName("")
        setNewTagCategory("general")
        fetchAvailableTags()
      }
    } catch (error) {
      console.error("Error creating tag:", error)
    }
  }

  const [isGitHubSyncing, setIsGitHubSyncing] = useState(false)
  const [githubValidation, setGitHubValidation] = useState<{
    valid: boolean
    error?: string
  } | null>(null)

  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    description: "",
    longDescription: "",
    projectType: "web" as const,
    priority: 1,
    complexity: "medium" as const,
    status: "active" as const,
    featured: false,

    // Technical Details
    techStack: "",
    version: "1.0.0",
    license: "MIT",

    // URLs and Links
    githubUrl: "",
    demoUrl: "",
    documentationUrl: "",
    deploymentUrl: "",
    monitoringUrl: "",

    // Project Management
    teamSize: 1,
    durationMonths: 0,
    budgetRange: "",
    clientName: "",

    // Performance & Metrics
    uptimePercentage: 99.9,
    performanceScore: 0,
    securityScore: 0,
    accessibilityScore: 0,
    seoScore: 0,
    testingCoverage: 0,

    // Architecture & Technical
    architectureDiagram: "",
    databaseSchema: "",
    deploymentStrategy: "",
    securityFeatures: "",
    thirdPartyIntegrations: "",

    // Analysis
    challenges: "",
    solutions: "",
    lessonsLearned: "",
    futureImprovements: "",

    // GitHub Integration
    stars: 0,
    forks: 0,
    issues: 0,
    pullRequests: 0,
    contributors: "",

    // Cost & ROI
    costPerMonth: 0,
    roiPercentage: 0,
  })

  const validateGitHubUrl = async (url: string) => {
    if (!url) {
      setGitHubValidation(null)
      return
    }

    try {
      const response = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "validate", githubUrl: url }),
      })

      const result = await response.json()
      if (result.success) {
        setGitHubValidation(result.data)
      }
    } catch (error) {
      setGitHubValidation({ valid: false, error: "Validation failed" })
    }
  }

  const syncWithGitHub = async (projectId?: string, githubUrl?: string) => {
    setIsGitHubSyncing(true)
    try {
      const response = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: projectId ? "sync-single" : "sync-all",
          projectId,
          githubUrl,
        }),
      })

      const result = await response.json()
      if (result.success) {
        // Refresh projects data
        window.location.reload()
      }
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      setIsGitHubSyncing(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      projectType: "web",
      priority: 1,
      complexity: "medium",
      status: "active",
      featured: false,
      techStack: "",
      version: "1.0.0",
      license: "MIT",
      githubUrl: "",
      demoUrl: "",
      documentationUrl: "",
      deploymentUrl: "",
      monitoringUrl: "",
      teamSize: 1,
      durationMonths: 0,
      budgetRange: "",
      clientName: "",
      uptimePercentage: 99.9,
      performanceScore: 0,
      securityScore: 0,
      accessibilityScore: 0,
      seoScore: 0,
      testingCoverage: 0,
      architectureDiagram: "",
      databaseSchema: "",
      deploymentStrategy: "",
      securityFeatures: "",
      thirdPartyIntegrations: "",
      challenges: "",
      solutions: "",
      lessonsLearned: "",
      futureImprovements: "",
      stars: 0,
      forks: 0,
      issues: 0,
      pullRequests: 0,
      contributors: "",
      costPerMonth: 0,
      roiPercentage: 0,
    })
    setEditingProject(null)
    setSelectedTags([])
    setMilestones([])
    setEnvironments([])
    setActiveTab("overview")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const projectData = {
      ...formData,
      techStack: formData.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: selectedTags,
      milestones,
      environments,
      securityFeatures: formData.securityFeatures
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      thirdPartyIntegrations: formData.thirdPartyIntegrations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      challenges: formData.challenges
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      solutions: formData.solutions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      lessonsLearned: formData.lessonsLearned
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      futureImprovements: formData.futureImprovements
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      contributors: formData.contributors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }

    let success = false
    if (editingProject) {
      success = await updateProject(editingProject.id, projectData)
    } else {
      success = await createProject(projectData)
    }

    if (success) {
      resetForm()
      setIsCreateDialogOpen(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title || "",
      description: project.description || "",
      longDescription: project.longDescription || "",
      projectType: project.projectType || "web",
      priority: project.priority || 1,
      complexity: project.complexity || "medium",
      status: project.status || "active",
      featured: project.featured || false,
      techStack: project.techStack?.join(", ") || "",
      version: project.version || "1.0.0",
      license: project.license || "MIT",
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      documentationUrl: project.documentationUrl || "",
      deploymentUrl: project.deploymentUrl || "",
      monitoringUrl: project.monitoringUrl || "",
      teamSize: project.teamSize || 1,
      durationMonths: project.durationMonths || 0,
      budgetRange: project.budgetRange || "",
      clientName: project.clientName || "",
      uptimePercentage: project.uptimePercentage || 99.9,
      performanceScore: project.performanceScore || 0,
      securityScore: project.securityScore || 0,
      accessibilityScore: project.accessibilityScore || 0,
      seoScore: project.seoScore || 0,
      testingCoverage: project.testingCoverage || 0,
      architectureDiagram: project.architectureDiagram || "",
      databaseSchema: project.databaseSchema || "",
      deploymentStrategy: project.deploymentStrategy || "",
      securityFeatures: project.securityFeatures?.join(", ") || "",
      thirdPartyIntegrations: project.thirdPartyIntegrations?.join(", ") || "",
      challenges: project.challenges?.join("\n") || "",
      solutions: project.solutions?.join("\n") || "",
      lessonsLearned: project.lessonsLearned?.join("\n") || "",
      futureImprovements: project.futureImprovements?.join("\n") || "",
      stars: project.stars || 0,
      forks: project.forks || 0,
      issues: project.issues || 0,
      pullRequests: project.pullRequests || 0,
      contributors: project.contributors?.join(", ") || "",
      costPerMonth: project.costPerMonth || 0,
      roiPercentage: project.roiPercentage || 0,
    })
    setSelectedTags(project.tags || [])
    setMilestones(project.milestones || [])
    setEnvironments(project.environments || [])
    setIsCreateDialogOpen(true)
  }

  const addMilestone = () => {
    const newMilestone: ProjectMilestone = {
      id: `milestone-${Date.now()}`,
      title: "",
      description: "",
      status: "pending",
      due_date: "",
      progress_percentage: 0,
    }
    setMilestones([...milestones, newMilestone])
  }

  const updateMilestone = (id: string, updates: Partial<ProjectMilestone>) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id))
  }

  const addEnvironment = () => {
    const newEnvironment: ProjectEnvironment = {
      id: `env-${Date.now()}`,
      name: "",
      type: "development",
      url: "",
      status: "active",
    }
    setEnvironments([...environments, newEnvironment])
  }

  const updateEnvironment = (id: string, updates: Partial<ProjectEnvironment>) => {
    setEnvironments(environments.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  const removeEnvironment = (id: string) => {
    setEnvironments(environments.filter((e) => e.id !== id))
  }

  const handleDelete = async (id: string) => {
    const success = await deleteProject(id)
    if (success) {
      // Optionally, provide user feedback (e.g., a toast notification)
      console.log("Project deleted successfully.")
    } else {
      // Handle the error case
      console.error("Failed to delete project.")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-gray-950 border-green-500/30">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                <div className="h-16 bg-gray-800 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-mono text-green-400">Advanced Project Management</h2>
          <p className="text-gray-400 font-mono">{projects.length} projects total</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => syncWithGitHub()}
            disabled={isGitHubSyncing}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 font-mono"
          >
            {isGitHubSyncing ? "SYNCING..." : "SYNC GITHUB"}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-mono"
              >
                + NEW PROJECT
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-950 border-green-500/30 text-green-400 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-mono text-green-400">
                  {editingProject ? "Edit Project" : "Create New Project"}
                </DialogTitle>
                <DialogDescription className="text-gray-400 font-mono">
                  {editingProject
                    ? "Update comprehensive project information"
                    : "Add a new project with detailed specifications"}
                </DialogDescription>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-gray-900">
                  <TabsTrigger value="overview" className="font-mono">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="technical" className="font-mono">
                    Technical
                  </TabsTrigger>
                  <TabsTrigger value="management" className="font-mono">
                    Management
                  </TabsTrigger>
                  <TabsTrigger value="metrics" className="font-mono">
                    Metrics
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="font-mono">
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger value="github" className="font-mono">
                    GitHub
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="text-green-400 font-mono">
                          Project Title
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="projectType" className="text-green-400 font-mono">
                          Project Type
                        </Label>
                        <Select
                          value={formData.projectType}
                          onValueChange={(value: any) => setFormData((prev) => ({ ...prev, projectType: value }))}
                        >
                          <SelectTrigger className="bg-gray-900 border-green-500/30 text-green-400 font-mono">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-green-500/30">
                            <SelectItem value="web">Web Application</SelectItem>
                            <SelectItem value="mobile">Mobile App</SelectItem>
                            <SelectItem value="desktop">Desktop App</SelectItem>
                            <SelectItem value="api">API/Backend</SelectItem>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="ml">Machine Learning</SelectItem>
                            <SelectItem value="blockchain">Blockchain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-green-400 font-mono">
                        Short Description
                      </Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="longDescription" className="text-green-400 font-mono">
                        Detailed Description
                      </Label>
                      <Textarea
                        id="longDescription"
                        value={formData.longDescription}
                        onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono min-h-[120px]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="priority" className="text-green-400 font-mono">
                          Priority (1-5)
                        </Label>
                        <Input
                          id="priority"
                          type="number"
                          min="1"
                          max="5"
                          value={formData.priority}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, priority: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="complexity" className="text-green-400 font-mono">
                          Complexity
                        </Label>
                        <Select
                          value={formData.complexity}
                          onValueChange={(value: any) => setFormData((prev) => ({ ...prev, complexity: value }))}
                        >
                          <SelectTrigger className="bg-gray-900 border-green-500/30 text-green-400 font-mono">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-green-500/30">
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status" className="text-green-400 font-mono">
                          Status
                        </Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger className="bg-gray-900 border-green-500/30 text-green-400 font-mono">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-green-500/30">
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                        className="rounded border-green-500/30"
                      />
                      <Label htmlFor="featured" className="text-green-400 font-mono">
                        Featured Project
                      </Label>
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-4">
                    <div>
                      <Label htmlFor="techStack" className="text-green-400 font-mono">
                        Tech Stack (comma-separated)
                      </Label>
                      <Input
                        id="techStack"
                        value={formData.techStack}
                        onChange={(e) => setFormData((prev) => ({ ...prev, techStack: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="React, Node.js, AWS, Docker, PostgreSQL"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="version" className="text-green-400 font-mono">
                          Version
                        </Label>
                        <Input
                          id="version"
                          value={formData.version}
                          onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="1.0.0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="license" className="text-green-400 font-mono">
                          License
                        </Label>
                        <Input
                          id="license"
                          value={formData.license}
                          onChange={(e) => setFormData((prev) => ({ ...prev, license: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="MIT"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="githubUrl" className="text-green-400 font-mono">
                          GitHub Repository
                        </Label>
                        <div className="space-y-2">
                          <Input
                            id="githubUrl"
                            value={formData.githubUrl}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
                              validateGitHubUrl(e.target.value)
                            }}
                            className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                            placeholder="https://github.com/username/repo"
                          />
                          {githubValidation && (
                            <div
                              className={`text-xs font-mono ${
                                githubValidation.valid ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {githubValidation.valid ? "✓ Repository found" : `✗ ${githubValidation.error}`}
                            </div>
                          )}
                          {editingProject && formData.githubUrl && githubValidation?.valid && (
                            <Button
                              type="button"
                              onClick={() => syncWithGitHub(editingProject.id, formData.githubUrl)}
                              disabled={isGitHubSyncing}
                              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 font-mono text-xs"
                            >
                              {isGitHubSyncing ? "Syncing..." : "Sync GitHub Data"}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="demoUrl" className="text-green-400 font-mono">
                          Live Demo URL
                        </Label>
                        <Input
                          id="demoUrl"
                          value={formData.demoUrl}
                          onChange={(e) => setFormData((prev) => ({ ...prev, demoUrl: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="https://demo.example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="documentationUrl" className="text-green-400 font-mono">
                          Documentation URL
                        </Label>
                        <Input
                          id="documentationUrl"
                          value={formData.documentationUrl}
                          onChange={(e) => setFormData((prev) => ({ ...prev, documentationUrl: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="https://docs.example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deploymentUrl" className="text-green-400 font-mono">
                          Deployment URL
                        </Label>
                        <Input
                          id="deploymentUrl"
                          value={formData.deploymentUrl}
                          onChange={(e) => setFormData((prev) => ({ ...prev, deploymentUrl: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="https://app.example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="architectureDiagram" className="text-green-400 font-mono">
                        Architecture Diagram URL
                      </Label>
                      <Input
                        id="architectureDiagram"
                        value={formData.architectureDiagram}
                        onChange={(e) => setFormData((prev) => ({ ...prev, architectureDiagram: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="https://example.com/architecture.png"
                      />
                    </div>

                    <div>
                      <Label htmlFor="securityFeatures" className="text-green-400 font-mono">
                        Security Features (comma-separated)
                      </Label>
                      <Input
                        id="securityFeatures"
                        value={formData.securityFeatures}
                        onChange={(e) => setFormData((prev) => ({ ...prev, securityFeatures: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="JWT Authentication, HTTPS, Rate Limiting, Input Validation"
                      />
                    </div>

                    <div>
                      <Label htmlFor="thirdPartyIntegrations" className="text-green-400 font-mono">
                        Third-party Integrations (comma-separated)
                      </Label>
                      <Input
                        id="thirdPartyIntegrations"
                        value={formData.thirdPartyIntegrations}
                        onChange={(e) => setFormData((prev) => ({ ...prev, thirdPartyIntegrations: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="Stripe, SendGrid, AWS S3, Google Analytics"
                      />
                    </div>

                    <Separator className="bg-green-500/20" />

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label className="text-green-400 font-mono">Project Environments</Label>
                        <Button
                          type="button"
                          onClick={addEnvironment}
                          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono text-xs"
                        >
                          + Add Environment
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {environments.map((env) => (
                          <div
                            key={env.id}
                            className="grid grid-cols-5 gap-2 p-3 bg-gray-900/50 border border-gray-700 rounded"
                          >
                            <Input
                              placeholder="Environment name"
                              value={env.name}
                              onChange={(e) => updateEnvironment(env.id, { name: e.target.value })}
                              className="bg-gray-800 border-gray-600 text-green-400 font-mono text-sm"
                            />
                            <Select
                              value={env.type}
                              onValueChange={(value: any) => updateEnvironment(env.id, { type: value })}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-green-400 font-mono text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="development">Development</SelectItem>
                                <SelectItem value="staging">Staging</SelectItem>
                                <SelectItem value="production">Production</SelectItem>
                                <SelectItem value="testing">Testing</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="URL"
                              value={env.url}
                              onChange={(e) => updateEnvironment(env.id, { url: e.target.value })}
                              className="bg-gray-800 border-gray-600 text-green-400 font-mono text-sm"
                            />
                            <Select
                              value={env.status}
                              onValueChange={(value: any) => updateEnvironment(env.id, { status: value })}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-green-400 font-mono text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              onClick={() => removeEnvironment(env.id)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-mono text-xs"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="management" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="teamSize" className="text-green-400 font-mono">
                          Team Size
                        </Label>
                        <Input
                          id="teamSize"
                          type="number"
                          min="1"
                          value={formData.teamSize}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, teamSize: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="durationMonths" className="text-green-400 font-mono">
                          Duration (months)
                        </Label>
                        <Input
                          id="durationMonths"
                          type="number"
                          min="0"
                          value={formData.durationMonths}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, durationMonths: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="budgetRange" className="text-green-400 font-mono">
                          Budget Range
                        </Label>
                        <Input
                          id="budgetRange"
                          value={formData.budgetRange}
                          onChange={(e) => setFormData((prev) => ({ ...prev, budgetRange: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="$10K - $50K"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="clientName" className="text-green-400 font-mono">
                        Client/Company Name
                      </Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="Acme Corporation"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-green-400 font-mono">Project Tags</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="New tag name"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            className="bg-gray-900 border-green-500/30 text-green-400 font-mono w-32"
                          />
                          <Select value={newTagCategory} onValueChange={setNewTagCategory}>
                            <SelectTrigger className="bg-gray-900 border-green-500/30 text-green-400 font-mono w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-green-500/30">
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="framework">Framework</SelectItem>
                              <SelectItem value="language">Language</SelectItem>
                              <SelectItem value="tool">Tool</SelectItem>
                              <SelectItem value="platform">Platform</SelectItem>
                              <SelectItem value="methodology">Methodology</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            onClick={createNewTag}
                            size="sm"
                            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono"
                          >
                            ADD
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-900/50 rounded border border-green-500/30">
                        {availableTags.map((tag) => (
                          <Badge
                            key={tag.id}
                            onClick={() => {
                              const isSelected = selectedTags.includes(tag.slug)
                              setSelectedTags(
                                isSelected ? selectedTags.filter((t) => t !== tag.slug) : [...selectedTags, tag.slug],
                              )
                            }}
                            className={`cursor-pointer font-mono transition-all ${
                              selectedTags.includes(tag.slug)
                                ? "bg-green-500/30 text-green-300 border-green-500/50"
                                : "bg-gray-800/50 text-gray-400 border-gray-600/50 hover:bg-gray-700/50"
                            }`}
                          >
                            #{tag.name} ({tag.project_count})
                          </Badge>
                        ))}
                      </div>

                      {selectedTags.length > 0 && (
                        <div className="text-sm text-gray-400 font-mono">Selected: {selectedTags.length} tags</div>
                      )}
                    </div>

                    <Separator className="bg-green-500/20" />

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label className="text-green-400 font-mono">Project Milestones</Label>
                        <Button
                          type="button"
                          onClick={addMilestone}
                          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono text-xs"
                        >
                          + Add Milestone
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="p-4 bg-gray-900/50 border border-gray-700 rounded space-y-3"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="Milestone title"
                                value={milestone.title}
                                onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                                className="bg-gray-800 border-gray-600 text-green-400 font-mono"
                              />
                              <Select
                                value={milestone.status}
                                onValueChange={(value: any) => updateMilestone(milestone.id, { status: value })}
                              >
                                <SelectTrigger className="bg-gray-800 border-gray-600 text-green-400 font-mono">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Textarea
                              placeholder="Milestone description"
                              value={milestone.description}
                              onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                              className="bg-gray-800 border-gray-600 text-green-400 font-mono"
                              rows={2}
                            />
                            <div className="grid grid-cols-3 gap-3">
                              <Input
                                type="date"
                                placeholder="Due date"
                                value={milestone.due_date}
                                onChange={(e) => updateMilestone(milestone.id, { due_date: e.target.value })}
                                className="bg-gray-800 border-gray-600 text-green-400 font-mono"
                              />
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Progress %"
                                value={milestone.progress_percentage}
                                onChange={(e) =>
                                  updateMilestone(milestone.id, {
                                    progress_percentage: Number.parseInt(e.target.value),
                                  })
                                }
                                className="bg-gray-800 border-gray-600 text-green-400 font-mono"
                              />
                              <Button
                                type="button"
                                onClick={() => removeMilestone(milestone.id)}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-mono"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="uptimePercentage" className="text-green-400 font-mono">
                          Uptime Percentage
                        </Label>
                        <Input
                          id="uptimePercentage"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={formData.uptimePercentage}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, uptimePercentage: Number.parseFloat(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="testingCoverage" className="text-green-400 font-mono">
                          Testing Coverage (%)
                        </Label>
                        <Input
                          id="testingCoverage"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={formData.testingCoverage}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, testingCoverage: Number.parseFloat(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="performanceScore" className="text-green-400 font-mono">
                          Performance Score (0-100)
                        </Label>
                        <Input
                          id="performanceScore"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.performanceScore}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, performanceScore: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="securityScore" className="text-green-400 font-mono">
                          Security Score (0-100)
                        </Label>
                        <Input
                          id="securityScore"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.securityScore}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, securityScore: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accessibilityScore" className="text-green-400 font-mono">
                          Accessibility Score (0-100)
                        </Label>
                        <Input
                          id="accessibilityScore"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.accessibilityScore}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, accessibilityScore: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seoScore" className="text-green-400 font-mono">
                          SEO Score (0-100)
                        </Label>
                        <Input
                          id="seoScore"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.seoScore}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, seoScore: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="costPerMonth" className="text-green-400 font-mono">
                          Monthly Cost ($)
                        </Label>
                        <Input
                          id="costPerMonth"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.costPerMonth}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, costPerMonth: Number.parseFloat(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roiPercentage" className="text-green-400 font-mono">
                          ROI Percentage
                        </Label>
                        <Input
                          id="roiPercentage"
                          type="number"
                          step="0.01"
                          value={formData.roiPercentage}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, roiPercentage: Number.parseFloat(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-4">
                    <div>
                      <Label htmlFor="challenges" className="text-green-400 font-mono">
                        Challenges (one per line)
                      </Label>
                      <Textarea
                        id="challenges"
                        value={formData.challenges}
                        onChange={(e) => setFormData((prev) => ({ ...prev, challenges: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono min-h-[100px]"
                        placeholder="Scaling to handle 1M+ users&#10;Implementing real-time features&#10;Optimizing database performance"
                      />
                    </div>

                    <div>
                      <Label htmlFor="solutions" className="text-green-400 font-mono">
                        Solutions (one per line)
                      </Label>
                      <Textarea
                        id="solutions"
                        value={formData.solutions}
                        onChange={(e) => setFormData((prev) => ({ ...prev, solutions: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono min-h-[100px]"
                        placeholder="Implemented horizontal scaling with load balancers&#10;Used WebSocket connections for real-time updates&#10;Added database indexing and query optimization"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lessonsLearned" className="text-green-400 font-mono">
                        Lessons Learned (one per line)
                      </Label>
                      <Textarea
                        id="lessonsLearned"
                        value={formData.lessonsLearned}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lessonsLearned: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono min-h-[100px]"
                        placeholder="Early performance testing is crucial&#10;User feedback drives better features&#10;Documentation saves development time"
                      />
                    </div>

                    <div>
                      <Label htmlFor="futureImprovements" className="text-green-400 font-mono">
                        Future Improvements (one per line)
                      </Label>
                      <Textarea
                        id="futureImprovements"
                        value={formData.futureImprovements}
                        onChange={(e) => setFormData((prev) => ({ ...prev, futureImprovements: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono min-h-[100px]"
                        placeholder="Add machine learning recommendations&#10;Implement advanced analytics&#10;Mobile app development"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="github" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stars" className="text-green-400 font-mono">
                          GitHub Stars
                        </Label>
                        <Input
                          id="stars"
                          type="number"
                          min="0"
                          value={formData.stars}
                          onChange={(e) => setFormData((prev) => ({ ...prev, stars: Number.parseInt(e.target.value) }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="forks" className="text-green-400 font-mono">
                          GitHub Forks
                        </Label>
                        <Input
                          id="forks"
                          type="number"
                          min="0"
                          value={formData.forks}
                          onChange={(e) => setFormData((prev) => ({ ...prev, forks: Number.parseInt(e.target.value) }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="issues" className="text-green-400 font-mono">
                          Open Issues
                        </Label>
                        <Input
                          id="issues"
                          type="number"
                          min="0"
                          value={formData.issues}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, issues: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pullRequests" className="text-green-400 font-mono">
                          Pull Requests
                        </Label>
                        <Input
                          id="pullRequests"
                          type="number"
                          min="0"
                          value={formData.pullRequests}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, pullRequests: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contributors" className="text-green-400 font-mono">
                        Contributors (comma-separated)
                      </Label>
                      <Input
                        id="contributors"
                        value={formData.contributors}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contributors: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="john-doe, jane-smith, alex-dev"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="text-green-400 font-mono">
                          Project Title
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="projectType" className="text-green-400 font-mono">
                          Project Type
                        </Label>
                        <Select
                          value={formData.projectType}
                          onValueChange={(value: any) => setFormData((prev) => ({ ...prev, projectType: value }))}
                        >
                          <SelectTrigger className="bg-gray-900 border-green-500/30 text-green-400 font-mono">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-green-500/30">
                            <SelectItem value="web">Web Application</SelectItem>
                            <SelectItem value="mobile">Mobile App</SelectItem>
                            <SelectItem value="desktop">Desktop App</SelectItem>
                            <SelectItem value="api">API/Backend</SelectItem>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="ml">Machine Learning</SelectItem>
                            <SelectItem value="blockchain">Blockchain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-green-400 font-mono">
                        Short Description
                      </Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="longDescription" className="text-green-400 font-mono">
                        Detailed Description
                      </Label>
                      <Textarea
                        id="longDescription"
                        value={formData.longDescription}
                        onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono min-h-[120px]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="priority" className="text-green-400 font-mono">
                          Priority (1-5)
                        </Label>
                        <Input
                          id="priority"
                          type="number"
                          min="1"
                          max="5"
                          value={formData.priority}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, priority: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="complexity" className="text-green-400 font-mono">
                          Complexity
                        </Label>
                        <Select
                          value={formData.complexity}
                          onValueChange={(value: any) => setFormData((prev) => ({ ...prev, complexity: value }))}
                        >
                          <SelectTrigger className="bg-gray-900 border-green-500/30 text-green-400 font-mono">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-green-500/30">
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status" className="text-green-400 font-mono">
                          Status
                        </Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger className="bg-gray-900 border-green-500/30 text-green-400 font-mono">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-green-500/30">
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                        className="rounded border-green-500/30"
                      />
                      <Label htmlFor="featured" className="text-green-400 font-mono">
                        Featured Project
                      </Label>
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-4">
                    <div>
                      <Label htmlFor="techStack" className="text-green-400 font-mono">
                        Tech Stack (comma-separated)
                      </Label>
                      <Input
                        id="techStack"
                        value={formData.techStack}
                        onChange={(e) => setFormData((prev) => ({ ...prev, techStack: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="React, Node.js, AWS, Docker, PostgreSQL"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="version" className="text-green-400 font-mono">
                          Version
                        </Label>
                        <Input
                          id="version"
                          value={formData.version}
                          onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="1.0.0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="license" className="text-green-400 font-mono">
                          License
                        </Label>
                        <Input
                          id="license"
                          value={formData.license}
                          onChange={(e) => setFormData((prev) => ({ ...prev, license: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="MIT"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="githubUrl" className="text-green-400 font-mono">
                          GitHub Repository
                        </Label>
                        <div className="space-y-2">
                          <Input
                            id="githubUrl"
                            value={formData.githubUrl}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
                              validateGitHubUrl(e.target.value)
                            }}
                            className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                            placeholder="https://github.com/username/repo"
                          />
                          {githubValidation && (
                            <div
                              className={`text-xs font-mono ${
                                githubValidation.valid ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {githubValidation.valid ? "✓ Repository found" : `✗ ${githubValidation.error}`}
                            </div>
                          )}
                          {editingProject && formData.githubUrl && githubValidation?.valid && (
                            <Button
                              type="button"
                              onClick={() => syncWithGitHub(editingProject.id, formData.githubUrl)}
                              disabled={isGitHubSyncing}
                              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 font-mono text-xs"
                            >
                              {isGitHubSyncing ? "Syncing..." : "Sync GitHub Data"}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="demoUrl" className="text-green-400 font-mono">
                          Live Demo URL
                        </Label>
                        <Input
                          id="demoUrl"
                          value={formData.demoUrl}
                          onChange={(e) => setFormData((prev) => ({ ...prev, demoUrl: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="https://demo.example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="documentationUrl" className="text-green-400 font-mono">
                          Documentation URL
                        </Label>
                        <Input
                          id="documentationUrl"
                          value={formData.documentationUrl}
                          onChange={(e) => setFormData((prev) => ({ ...prev, documentationUrl: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="https://docs.example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deploymentUrl" className="text-green-400 font-mono">
                          Deployment URL
                        </Label>
                        <Input
                          id="deploymentUrl"
                          value={formData.deploymentUrl}
                          onChange={(e) => setFormData((prev) => ({ ...prev, deploymentUrl: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="https://app.example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="architectureDiagram" className="text-green-400 font-mono">
                        Architecture Diagram URL
                      </Label>
                      <Input
                        id="architectureDiagram"
                        value={formData.architectureDiagram}
                        onChange={(e) => setFormData((prev) => ({ ...prev, architectureDiagram: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="https://example.com/architecture.png"
                      />
                    </div>

                    <div>
                      <Label htmlFor="securityFeatures" className="text-green-400 font-mono">
                        Security Features (comma-separated)
                      </Label>
                      <Input
                        id="securityFeatures"
                        value={formData.securityFeatures}
                        onChange={(e) => setFormData((prev) => ({ ...prev, securityFeatures: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="JWT Authentication, HTTPS, Rate Limiting, Input Validation"
                      />
                    </div>

                    <div>
                      <Label htmlFor="thirdPartyIntegrations" className="text-green-400 font-mono">
                        Third-party Integrations (comma-separated)
                      </Label>
                      <Input
                        id="thirdPartyIntegrations"
                        value={formData.thirdPartyIntegrations}
                        onChange={(e) => setFormData((prev) => ({ ...prev, thirdPartyIntegrations: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="Stripe, SendGrid, AWS S3, Google Analytics"
                      />
                    </div>

                    <Separator className="bg-green-500/20" />

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label className="text-green-400 font-mono">Project Environments</Label>
                        <Button
                          type="button"
                          onClick={addEnvironment}
                          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono text-xs"
                        >
                          + Add Environment
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {environments.map((env) => (
                          <div
                            key={env.id}
                            className="grid grid-cols-5 gap-2 p-3 bg-gray-900/50 border border-gray-700 rounded"
                          >
                            <Input
                              placeholder="Environment name"
                              value={env.name}
                              onChange={(e) => updateEnvironment(env.id, { name: e.target.value })}
                              className="bg-gray-800 border-gray-600 text-green-400 font-mono text-sm"
                            />
                            <Select
                              value={env.type}
                              onValueChange={(value: any) => updateEnvironment(env.id, { type: value })}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-green-400 font-mono text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="development">Development</SelectItem>
                                <SelectItem value="staging">Staging</SelectItem>
                                <SelectItem value="production">Production</SelectItem>
                                <SelectItem value="testing">Testing</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="URL"
                              value={env.url}
                              onChange={(e) => updateEnvironment(env.id, { url: e.target.value })}
                              className="bg-gray-800 border-gray-600 text-green-400 font-mono text-sm"
                            />
                            <Select
                              value={env.status}
                              onValueChange={(value: any) => updateEnvironment(env.id, { status: value })}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-green-400 font-mono text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              onClick={() => removeEnvironment(env.id)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-mono text-xs"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="management" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="teamSize" className="text-green-400 font-mono">
                          Team Size
                        </Label>
                        <Input
                          id="teamSize"
                          type="number"
                          min="1"
                          value={formData.teamSize}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, teamSize: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="durationMonths" className="text-green-400 font-mono">
                          Duration (months)
                        </Label>
                        <Input
                          id="durationMonths"
                          type="number"
                          min="0"
                          value={formData.durationMonths}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, durationMonths: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="budgetRange" className="text-green-400 font-mono">
                          Budget Range
                        </Label>
                        <Input
                          id="budgetRange"
                          value={formData.budgetRange}
                          onChange={(e) => setFormData((prev) => ({ ...prev, budgetRange: e.target.value }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                          placeholder="$10K - $50K"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="clientName" className="text-green-400 font-mono">
                        Client/Company Name
                      </Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="Acme Corporation"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-green-400 font-mono">Project Tags</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="New tag name"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            className="bg-gray-900 border-green-500/30 text-green-400 font-mono w-32"
                          />
                          <Select value={newTagCategory} onValueChange={setNewTagCategory}>
                            <SelectTrigger className="bg-gray-900 border-green-500/30 text-green-400 font-mono w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-green-500/30">
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="framework">Framework</SelectItem>
                              <SelectItem value="language">Language</SelectItem>
                              <SelectItem value="tool">Tool</SelectItem>
                              <SelectItem value="platform">Platform</SelectItem>
                              <SelectItem value="methodology">Methodology</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            onClick={createNewTag}
                            size="sm"
                            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono"
                          >
                            ADD
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-900/50 rounded border border-green-500/30">
                        {availableTags.map((tag) => (
                          <Badge
                            key={tag.id}
                            onClick={() => {
                              const isSelected = selectedTags.includes(tag.slug)
                              setSelectedTags(
                                isSelected ? selectedTags.filter((t) => t !== tag.slug) : [...selectedTags, tag.slug],
                              )
                            }}
                            className={`cursor-pointer font-mono transition-all ${
                              selectedTags.includes(tag.slug)
                                ? "bg-green-500/30 text-green-300 border-green-500/50"
                                : "bg-gray-800/50 text-gray-400 border-gray-600/50 hover:bg-gray-700/50"
                            }`}
                          >
                            #{tag.name} ({tag.project_count})
                          </Badge>
                        ))}
                      </div>

                      {selectedTags.length > 0 && (
                        <div className="text-sm text-gray-400 font-mono">Selected: {selectedTags.length} tags</div>
                      )}
                    </div>

                    <Separator className="bg-green-500/20" />

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label className="text-green-400 font-mono">Project Milestones</Label>
                        <Button
                          type="button"
                          onClick={addMilestone}
                          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono text-xs"
                        >
                          + Add Milestone
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="p-4 bg-gray-900/50 border border-gray-700 rounded space-y-3"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="Milestone title"
                                value={milestone.title}
                                onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                                className="bg-gray-800 border-gray-600 text-green-400 font-mono"
                              />
                              <Select
                                value={milestone.status}
                                onValueChange={(value: any) => updateMilestone(milestone.id, { status: value })}
                              >
                                <SelectTrigger className="bg-gray-800 border-gray-600 text-green-400 font-mono">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Textarea
                              placeholder="Milestone description"
                              value={milestone.description}
                              onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                              className="bg-gray-800 border-gray-600 text-green-400 font-mono"
                              rows={2}
                            />
                            <div className="grid grid-cols-3 gap-3">
                              <Input
                                type="date"
                                placeholder="Due date"
                                value={milestone.due_date}
                                onChange={(e) => updateMilestone(milestone.id, { due_date: e.target.value })}
                                className="bg-gray-800 border-gray-600 text-green-400 font-mono"
                              />
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Progress %"
                                value={milestone.progress_percentage}
                                onChange={(e) =>
                                  updateMilestone(milestone.id, {
                                    progress_percentage: Number.parseInt(e.target.value),
                                  })
                                }
                                className="bg-gray-800 border-gray-600 text-green-400 font-mono"
                              />
                              <Button
                                type="button"
                                onClick={() => removeMilestone(milestone.id)}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-mono"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="uptimePercentage" className="text-green-400 font-mono">
                          Uptime Percentage
                        </Label>
                        <Input
                          id="uptimePercentage"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={formData.uptimePercentage}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, uptimePercentage: Number.parseFloat(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="testingCoverage" className="text-green-400 font-mono">
                          Testing Coverage (%)
                        </Label>
                        <Input
                          id="testingCoverage"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={formData.testingCoverage}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, testingCoverage: Number.parseFloat(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="performanceScore" className="text-green-400 font-mono">
                          Performance Score (0-100)
                        </Label>
                        <Input
                          id="performanceScore"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.performanceScore}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, performanceScore: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="securityScore" className="text-green-400 font-mono">
                          Security Score (0-100)
                        </Label>
                        <Input
                          id="securityScore"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.securityScore}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, securityScore: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accessibilityScore" className="text-green-400 font-mono">
                          Accessibility Score (0-100)
                        </Label>
                        <Input
                          id="accessibilityScore"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.accessibilityScore}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, accessibilityScore: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seoScore" className="text-green-400 font-mono">
                          SEO Score (0-100)
                        </Label>
                        <Input
                          id="seoScore"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.seoScore}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, seoScore: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="costPerMonth" className="text-green-400 font-mono">
                          Monthly Cost ($)
                        </Label>
                        <Input
                          id="costPerMonth"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.costPerMonth}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, costPerMonth: Number.parseFloat(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roiPercentage" className="text-green-400 font-mono">
                          ROI Percentage
                        </Label>
                        <Input
                          id="roiPercentage"
                          type="number"
                          step="0.01"
                          value={formData.roiPercentage}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, roiPercentage: Number.parseFloat(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-4">
                    <div>
                      <Label htmlFor="challenges" className="text-green-400 font-mono">
                        Challenges (one per line)
                      </Label>
                      <Textarea
                        id="challenges"
                        value={formData.challenges}
                        onChange={(e) => setFormData((prev) => ({ ...prev, challenges: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono min-h-[100px]"
                        placeholder="Scaling to handle 1M+ users&#10;Implementing real-time features&#10;Optimizing database performance"
                      />
                    </div>

                    <div>
                      <Label htmlFor="solutions" className="text-green-400 font-mono">
                        Solutions (one per line)
                      </Label>
                      <Textarea
                        id="solutions"
                        value={formData.solutions}
                        onChange={(e) => setFormData((prev) => ({ ...prev, solutions: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono min-h-[100px]"
                        placeholder="Implemented horizontal scaling with load balancers&#10;Used WebSocket connections for real-time updates&#10;Added database indexing and query optimization"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lessonsLearned" className="text-green-400 font-mono">
                        Lessons Learned (one per line)
                      </Label>
                      <Textarea
                        id="lessonsLearned"
                        value={formData.lessonsLearned}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lessonsLearned: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono min-h-[100px]"
                        placeholder="Early performance testing is crucial&#10;User feedback drives better features&#10;Documentation saves development time"
                      />
                    </div>

                    <div>
                      <Label htmlFor="futureImprovements" className="text-green-400 font-mono">
                        Future Improvements (one per line)
                      </Label>
                      <Textarea
                        id="futureImprovements"
                        value={formData.futureImprovements}
                        onChange={(e) => setFormData((prev) => ({ ...prev, futureImprovements: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono min-h-[100px]"
                        placeholder="Add machine learning recommendations&#10;Implement advanced analytics&#10;Mobile app development"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="github" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stars" className="text-green-400 font-mono">
                          GitHub Stars
                        </Label>
                        <Input
                          id="stars"
                          type="number"
                          min="0"
                          value={formData.stars}
                          onChange={(e) => setFormData((prev) => ({ ...prev, stars: Number.parseInt(e.target.value) }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="forks" className="text-green-400 font-mono">
                          GitHub Forks
                        </Label>
                        <Input
                          id="forks"
                          type="number"
                          min="0"
                          value={formData.forks}
                          onChange={(e) => setFormData((prev) => ({ ...prev, forks: Number.parseInt(e.target.value) }))}
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="issues" className="text-green-400 font-mono">
                          Open Issues
                        </Label>
                        <Input
                          id="issues"
                          type="number"
                          min="0"
                          value={formData.issues}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, issues: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pullRequests" className="text-green-400 font-mono">
                          Pull Requests
                        </Label>
                        <Input
                          id="pullRequests"
                          type="number"
                          min="0"
                          value={formData.pullRequests}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, pullRequests: Number.parseInt(e.target.value) }))
                          }
                          className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contributors" className="text-green-400 font-mono">
                        Contributors (comma-separated)
                      </Label>
                      <Input
                        id="contributors"
                        value={formData.contributors}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contributors: e.target.value }))}
                        className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                        placeholder="john-doe, jane-smith, alex-dev"
                      />
                    </div>
                  </TabsContent>

                  <div className="flex justify-end space-x-2 pt-6 border-t border-green-500/20">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="border-gray-500 text-gray-400 hover:bg-gray-800 font-mono"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-mono"
                    >
                      {editingProject ? "Update" : "Create"} Project
                    </Button>
                  </div>
                </form>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ... existing code for project list display ... */}

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="bg-gray-950 border-green-500/30">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-green-400 font-mono flex items-center gap-2">
                    {project.title}
                    {project.featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">FEATURED</Badge>
                    )}
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {project.projectType?.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    {project.complexity?.toUpperCase()} • {project.status?.toUpperCase()} • Priority {project.priority}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(project)}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono"
                  >
                    EDIT
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-mono"
                  >
                    DELETE
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{project.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 font-mono">UPTIME</div>
                  <div className="text-green-400 font-mono">{project.uptimePercentage || 99.9}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono">PERFORMANCE</div>
                  <div className="text-green-400 font-mono">{project.performanceScore || 0}/100</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono">SECURITY</div>
                  <div className="text-green-400 font-mono">{project.securityScore || 0}/100</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono">TESTING</div>
                  <div className="text-green-400 font-mono">{project.testingCoverage || 0}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono">COST/MONTH</div>
                  <div className="text-green-400 font-mono">${project.costPerMonth || 0}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.techStack?.map((tech, i) => (
                  <Badge key={i} variant="outline" className="border-cyan-500/50 text-cyan-400 font-mono">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags?.map((tag, i) => (
                  <Badge key={i} variant="outline" className="border-gray-500/50 text-gray-400 font-mono">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {(project.githubUrl || project.demoUrl || project.documentationUrl) && (
                <div className="flex space-x-2 mt-4">
                  {project.githubUrl && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500/50 text-blue-400 font-mono bg-transparent"
                        onClick={() => window.open(project.githubUrl, "_blank")}
                      >
                        GitHub ({project.stars || 0} ⭐)
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => syncWithGitHub(project.id, project.githubUrl)}
                        disabled={isGitHubSyncing}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 font-mono text-xs"
                      >
                        {isGitHubSyncing ? "..." : "↻"}
                      </Button>
                    </div>
                  )}
                  {project.demoUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500/50 text-green-400 font-mono bg-transparent"
                      onClick={() => window.open(project.demoUrl, "_blank")}
                    >
                      Demo
                    </Button>
                  )}
                  {project.documentationUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-500/50 text-purple-400 font-mono bg-transparent"
                      onClick={() => window.open(project.documentationUrl, "_blank")}
                    >
                      Docs
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="bg-gray-950 border-green-500/30">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 font-mono">No projects found. Create your first project to get started.</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
