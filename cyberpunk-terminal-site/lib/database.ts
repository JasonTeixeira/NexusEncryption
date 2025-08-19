export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  techStack: string[]
  status: "active" | "completed" | "maintenance" | "archived"
  metrics: {
    uptime: number
    requests: number
    latency: number
    errorRate: number
  }
  links: {
    github?: string
    demo?: string
    docs?: string
  }
  images: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
  category: string
  tags: string[]
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  status: "draft" | "published" | "archived"
  publishedAt?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  category: string
  featuredImage?: string
  readTime: number
}

export interface MediaAsset {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  alt?: string
  description?: string
  tags: string[]
  uploadedBy: string
  createdAt: string
}

// Mock database - In production, use PostgreSQL/MongoDB
class MockDatabase {
  private projects: Project[] = [
    {
      id: "1",
      title: "Cloud Infrastructure Orchestrator",
      description: "Multi-cloud Kubernetes orchestration platform",
      longDescription:
        "Advanced cloud infrastructure management system built with Terraform, Kubernetes, and AWS/Azure APIs. Features auto-scaling, cost optimization, and real-time monitoring across multiple cloud providers.",
      techStack: ["Kubernetes", "Terraform", "AWS", "Azure", "Go", "React"],
      status: "active",
      metrics: { uptime: 99.9, requests: 1250000, latency: 45, errorRate: 0.01 },
      links: { github: "https://github.com/nexus/cloud-orchestrator", demo: "https://demo.nexus.dev" },
      images: ["/api/placeholder/800/400"],
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: "Infrastructure",
      tags: ["kubernetes", "cloud", "devops"],
    },
  ]

  private blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Building Resilient Cloud Architecture",
      slug: "building-resilient-cloud-architecture",
      content:
        "# Building Resilient Cloud Architecture\n\nIn today's digital landscape, building resilient cloud architecture is crucial...",
      excerpt:
        "Learn the key principles of designing fault-tolerant cloud systems that can handle failures gracefully.",
      author: "Nexus Architect",
      status: "published",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["cloud", "architecture", "resilience"],
      category: "Technical",
      readTime: 8,
    },
  ]

  private mediaAssets: MediaAsset[] = []

  // Projects CRUD
  async getProjects(): Promise<Project[]> {
    return this.projects
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projects.find((p) => p.id === id) || null
  }

  async createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.projects.push(newProject)
    return newProject
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const index = this.projects.findIndex((p) => p.id === id)
    if (index === -1) return null

    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.projects[index]
  }

  async deleteProject(id: string): Promise<boolean> {
    const index = this.projects.findIndex((p) => p.id === id)
    if (index === -1) return false

    this.projects.splice(index, 1)
    return true
  }

  // Blog Posts CRUD
  async getBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts
  }

  async getBlogPost(id: string): Promise<BlogPost | null> {
    return this.blogPosts.find((p) => p.id === id) || null
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.blogPosts.find((p) => p.slug === slug) || null
  }

  async createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.blogPosts.push(newPost)
    return newPost
  }

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const index = this.blogPosts.findIndex((p) => p.id === id)
    if (index === -1) return null

    this.blogPosts[index] = {
      ...this.blogPosts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.blogPosts[index]
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const index = this.blogPosts.findIndex((p) => p.id === id)
    if (index === -1) return false

    this.blogPosts.splice(index, 1)
    return true
  }

  // Media Assets CRUD
  async getMediaAssets(): Promise<MediaAsset[]> {
    return this.mediaAssets
  }

  async getMediaAsset(id: string): Promise<MediaAsset | null> {
    return this.mediaAssets.find((a) => a.id === id) || null
  }

  async createMediaAsset(asset: Omit<MediaAsset, "id" | "createdAt">): Promise<MediaAsset> {
    const newAsset: MediaAsset = {
      ...asset,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.mediaAssets.push(newAsset)
    return newAsset
  }

  async deleteMediaAsset(id: string): Promise<boolean> {
    const index = this.mediaAssets.findIndex((a) => a.id === id)
    if (index === -1) return false

    this.mediaAssets.splice(index, 1)
    return true
  }
}

export const db = new MockDatabase()
