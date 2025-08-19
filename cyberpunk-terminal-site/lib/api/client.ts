// API client utilities for frontend components
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data?: T; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const result = await response.json()

      if (!response.ok) {
        return { error: result.error || "An error occurred" }
      }

      return { data: result.data }
    } catch (error) {
      return { error: "Network error" }
    }
  }

  // Projects API
  async getProjects(params?: {
    status?: string
    featured?: boolean
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set("status", params.status)
    if (params?.featured) searchParams.set("featured", params.featured.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.offset) searchParams.set("offset", params.offset.toString())

    return this.request(`/projects?${searchParams}`)
  }

  async getProject(slug: string) {
    return this.request(`/projects/${slug}`)
  }

  async createProject(data: any) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateProject(slug: string, data: any) {
    return this.request(`/projects/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteProject(slug: string) {
    return this.request(`/projects/${slug}`, {
      method: "DELETE",
    })
  }

  // Blog API
  async getBlogPosts(params?: {
    status?: string
    featured?: boolean
    category?: string
    tag?: string
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set("status", params.status)
    if (params?.featured) searchParams.set("featured", params.featured.toString())
    if (params?.category) searchParams.set("category", params.category)
    if (params?.tag) searchParams.set("tag", params.tag)
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.offset) searchParams.set("offset", params.offset.toString())

    return this.request(`/blog/posts?${searchParams}`)
  }

  async getBlogPost(slug: string) {
    return this.request(`/blog/posts/${slug}`)
  }

  async createBlogPost(data: any) {
    return this.request("/blog/posts", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateBlogPost(slug: string, data: any) {
    return this.request(`/blog/posts/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteBlogPost(slug: string) {
    return this.request(`/blog/posts/${slug}`, {
      method: "DELETE",
    })
  }

  // Categories API
  async getCategories() {
    return this.request("/blog/categories")
  }

  async createCategory(data: any) {
    return this.request("/blog/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Analytics API
  async trackEvent(eventData: {
    event_type: string
    page_path?: string
    metadata?: Record<string, any>
  }) {
    return this.request("/analytics", {
      method: "POST",
      body: JSON.stringify(eventData),
    })
  }

  async getAnalytics(params?: {
    event_type?: string
    start_date?: string
    end_date?: string
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params?.event_type) searchParams.set("event_type", params.event_type)
    if (params?.start_date) searchParams.set("start_date", params.start_date)
    if (params?.end_date) searchParams.set("end_date", params.end_date)
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    return this.request(`/analytics?${searchParams}`)
  }

  // Search API
  async search(params: {
    query: string
    type?: "project" | "blog_post" | "all"
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams()
    searchParams.set("q", params.query)
    if (params.type) searchParams.set("type", params.type)
    if (params.limit) searchParams.set("limit", params.limit.toString())
    if (params.offset) searchParams.set("offset", params.offset.toString())

    return this.request(`/search?${searchParams}`)
  }

  async getSearchSuggestions(query: string, limit = 5) {
    const searchParams = new URLSearchParams()
    searchParams.set("q", query)
    searchParams.set("limit", limit.toString())

    return this.request(`/search/suggestions?${searchParams}`)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
