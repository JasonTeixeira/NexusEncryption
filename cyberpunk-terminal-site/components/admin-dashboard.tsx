"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectManager from "@/components/admin/project-manager"
import BlogManager from "@/components/admin/blog-manager"
import MediaManager from "@/components/admin/media-manager"
import UserManager from "@/components/admin/user-manager"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="font-mono">
          <div className="animate-pulse mb-4">NEXUS ADMIN INTERFACE v3.1.4</div>
          <div className="text-cyan-400">Initializing secure connection...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-cyan-400">NEXUS ADMIN INTERFACE</h1>
          </div>
          <div className="text-sm text-gray-400 font-mono">Secure Terminal • Authentication Required • v3.1.4</div>
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-green-500/30">
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              PROJECTS
            </TabsTrigger>
            <TabsTrigger
              value="blog"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              BLOG
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              MEDIA
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              USERS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            <ProjectManager />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <BlogManager />
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <MediaManager />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
