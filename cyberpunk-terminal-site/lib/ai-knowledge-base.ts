import { createClient } from "@/lib/supabase/client"

export interface ProjectData {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  tech_stack: string[]
  status: string
  featured: boolean
  github_url?: string
  live_url?: string
  uptime: number
  requests_per_day: number
  avg_response_time: number
}

export interface BlogPostData {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  status: string
  featured: boolean
  views: number
  likes: number
  reading_time: number
  published_at?: string
}

export interface SkillData {
  category: string
  skills: string[]
  proficiency: string
}

export class AIKnowledgeBase {
  private supabase = createClient()

  // Get all projects data
  async getProjects(): Promise<ProjectData[]> {
    try {
      const { data: projects, error } = await this.supabase
        .from("projects")
        .select("*")
        .eq("status", "active")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error
      return projects || []
    } catch (error) {
      console.error("Error fetching projects:", error)
      return []
    }
  }

  // Get specific project by slug
  async getProject(slug: string): Promise<ProjectData | null> {
    try {
      const { data: project, error } = await this.supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("status", "active")
        .single()

      if (error) throw error
      return project
    } catch (error) {
      console.error("Error fetching project:", error)
      return null
    }
  }

  // Get blog posts
  async getBlogPosts(): Promise<BlogPostData[]> {
    try {
      const { data: posts, error } = await this.supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("published_at", { ascending: false })

      if (error) throw error
      return posts || []
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      return []
    }
  }

  // Get specific blog post by slug
  async getBlogPost(slug: string): Promise<BlogPostData | null> {
    try {
      const { data: post, error } = await this.supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single()

      if (error) throw error
      return post
    } catch (error) {
      console.error("Error fetching blog post:", error)
      return null
    }
  }

  // Get skills data
  async getSkills(): Promise<SkillData[]> {
    try {
      const { data: skills, error } = await this.supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("proficiency", { ascending: false })

      if (error) throw error
      return skills || []
    } catch (error) {
      console.error("Error fetching skills:", error)
      return []
    }
  }

  // Search across all content
  async search(query: string): Promise<{ projects: ProjectData[]; posts: BlogPostData[] }> {
    try {
      const [projectsResult, postsResult] = await Promise.all([
        this.supabase
          .from("projects")
          .select("*")
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .eq("status", "active"),
        this.supabase
          .from("blog_posts")
          .select("*")
          .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
          .eq("status", "published"),
      ])

      return {
        projects: projectsResult.data || [],
        posts: postsResult.data || [],
      }
    } catch (error) {
      console.error("Error searching:", error)
      return { projects: [], posts: [] }
    }
  }

  // Get analytics data
  async getAnalytics(): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching analytics:", error)
      return []
    }
  }

  // Get user profile
  async getUserProfile(): Promise<any> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) return null

      const { data: profile, error } = await this.supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) throw error
      return profile
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
  }

  // Update user profile
  async updateUserProfile(updates: any): Promise<any> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data: profile, error } = await this.supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single()

      if (error) throw error
      return profile
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }

  // Get system status
  async getSystemStatus(): Promise<any> {
    try {
      // This could be enhanced with real system metrics
      return {
        uptime: "99.99%",
        requests: "2.4M",
        latency: "12ms",
        costSaved: "$127K",
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error fetching system status:", error)
      return null
    }
  }

  // Get GitHub statistics
  async getGitHubStats(): Promise<any> {
    try {
      // This could be enhanced with real GitHub API calls
      return {
        stars: "127K",
        forks: "42K",
        openIssues: "42",
        contributors: "127",
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error fetching GitHub stats:", error)
      return null
    }
  }

  // Get cloud metrics
  async getCloudMetrics(): Promise<any> {
    try {
      // This could be enhanced with real cloud provider APIs
      return {
        aws: "42 services",
        gcp: "127 services",
        azure: "99 services",
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error fetching cloud metrics:", error)
      return null
    }
  }
}

// Export a singleton instance
export const aiKnowledgeBase = new AIKnowledgeBase()
