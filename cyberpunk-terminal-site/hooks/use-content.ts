"use client"

import { useState, useEffect } from "react"
import type { Project, BlogPost, MediaAsset } from "@/lib/database"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      setProjects(data.projects)
    } catch (err) {
      setError("Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        await fetchProjects()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await fetchProjects()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" })

      if (response.ok) {
        await fetchProjects()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  return { projects, loading, error, createProject, updateProject, deleteProject, refetch: fetchProjects }
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog")
      const data = await response.json()
      setPosts(data.posts)
    } catch (err) {
      setError("Failed to fetch blog posts")
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "author" | "readTime">) => {
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        await fetchPosts()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await fetchPosts()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/${id}`, { method: "DELETE" })

      if (response.ok) {
        await fetchPosts()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  return { posts, loading, error, createPost, updatePost, deletePost, refetch: fetchPosts }
}

export function useMediaAssets() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await fetch("/api/media")
      const data = await response.json()
      setAssets(data.assets)
    } catch (err) {
      setError("Failed to fetch media assets")
    } finally {
      setLoading(false)
    }
  }

  const uploadAsset = async (file: File, metadata: { alt?: string; description?: string; tags?: string[] }) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      if (metadata.alt) formData.append("alt", metadata.alt)
      if (metadata.description) formData.append("description", metadata.description)
      if (metadata.tags) formData.append("tags", metadata.tags.join(","))

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        await fetchAssets()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  return { assets, loading, error, uploadAsset, refetch: fetchAssets }
}
