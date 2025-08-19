import { supabase, type Database } from "./supabase/client"
import { put } from "@vercel/blob"

type Project = Database["public"]["Tables"]["projects"]["Row"]
type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"]
type MediaFile = Database["public"]["Tables"]["media_files"]["Row"]

// Project Management
export const projectsApi = {
  async getAll() {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async create(project: Database["public"]["Tables"]["projects"]["Insert"]) {
    const { data, error } = await supabase.from("projects").insert(project).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Database["public"]["Tables"]["projects"]["Update"]) {
    const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) throw error
  },
}

// Blog Management
export const blogApi = {
  async getAll() {
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async create(post: Database["public"]["Tables"]["blog_posts"]["Insert"]) {
    const { data, error } = await supabase.from("blog_posts").insert(post).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Database["public"]["Tables"]["blog_posts"]["Update"]) {
    const { data, error } = await supabase.from("blog_posts").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)

    if (error) throw error
  },

  async publish(id: string) {
    return this.update(id, {
      status: "published",
      published_at: new Date().toISOString(),
    })
  },

  async unpublish(id: string) {
    return this.update(id, {
      status: "draft",
      published_at: null,
    })
  },
}

// Media Management
export const mediaApi = {
  async getAll() {
    const { data, error } = await supabase.from("media_files").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async upload(file: File, altText?: string, tags?: string[]) {
    try {
      // Upload to Vercel Blob
      const blob = await put(file.name, file, {
        access: "public",
      })

      // Save metadata to database
      const { data, error } = await supabase
        .from("media_files")
        .insert({
          filename: blob.pathname.split("/").pop() || file.name,
          original_name: file.name,
          file_url: blob.url,
          file_type: file.type,
          file_size: file.size,
          alt_text: altText || null,
          tags: tags || [],
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Upload error:", error)
      throw error
    }
  },

  async delete(id: string) {
    const { error } = await supabase.from("media_files").delete().eq("id", id)

    if (error) throw error
  },

  async updateMetadata(id: string, updates: { alt_text?: string; tags?: string[] }) {
    const { data, error } = await supabase.from("media_files").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },
}

// Analytics
export const analyticsApi = {
  async getStats() {
    const [projectsResult, blogResult, mediaResult] = await Promise.all([
      supabase.from("projects").select("id, status"),
      supabase.from("blog_posts").select("id, status, views, likes"),
      supabase.from("media_files").select("id, file_size"),
    ])

    const projects = projectsResult.data || []
    const blogPosts = blogResult.data || []
    const mediaFiles = mediaResult.data || []

    return {
      projects: {
        total: projects.length,
        active: projects.filter((p) => p.status === "active").length,
        draft: projects.filter((p) => p.status === "draft").length,
      },
      blog: {
        total: blogPosts.length,
        published: blogPosts.filter((p) => p.status === "published").length,
        draft: blogPosts.filter((p) => p.status === "draft").length,
        totalViews: blogPosts.reduce((sum, p) => sum + (p.views || 0), 0),
        totalLikes: blogPosts.reduce((sum, p) => sum + (p.likes || 0), 0),
      },
      media: {
        total: mediaFiles.length,
        totalSize: mediaFiles.reduce((sum, f) => sum + f.file_size, 0),
      },
    }
  },
}
