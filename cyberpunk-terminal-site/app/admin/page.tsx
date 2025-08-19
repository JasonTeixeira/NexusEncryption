"use client"
import { useAuth } from "@/contexts/auth-context"
import AdminLogin from "@/components/admin-login"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect, Suspense, lazy } from "react"
import { useOptimizedFetch, usePerformanceMonitor } from "@/lib/performance-optimizer"

const OptimizedAnalyticsDashboard = lazy(() => import("@/components/optimized-analytics-dashboard"))
const ProjectManager = lazy(() => import("@/components/admin/project-manager"))
const BlogManager = lazy(() => import("@/components/admin/blog-manager"))
const MediaManager = lazy(() => import("@/components/admin/media-manager"))

const DashboardSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-black/50 border-green-500/30">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-800 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

export default function AdminPage() {
  usePerformanceMonitor("AdminPage")

  const { user, logout, loading } = useAuth()
  const [bootComplete, setBootComplete] = useState(false)
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  const { data: stats, loading: statsLoading } = useOptimizedFetch(
    "admin-stats",
    async () => {
      const [projects, posts, assets] = await Promise.all([
        fetch("/api/projects")
          .then((r) => r.json())
          .catch(() => ({ projects: [] })),
        fetch("/api/blog")
          .then((r) => r.json())
          .catch(() => ({ posts: [] })),
        fetch("/api/media")
          .then((r) => r.json())
          .catch(() => ({ assets: [] })),
      ])
      return { projects: projects.projects || [], posts: posts.posts || [], assets: assets.assets || [] }
    },
    {
      enabled: !!user && bootComplete,
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  )

  useEffect(() => {
    if (user && !bootComplete) {
      const bootSequence = [
        "> System initialized...",
        "> Security protocols enabled...",
        "> Terminal ready...",
        "",
        `Welcome to NEXUS ARCHITECT Terminal Gateway v2.4.1`,
        "",
        "Access granted. Authentication verified.",
      ]

      const timer = setTimeout(
        () => {
          if (currentStep < bootSequence.length) {
            setTerminalLines((prev) => [...prev, bootSequence[currentStep]])
            setCurrentStep((prev) => prev + 1)
          } else if (currentStep === bootSequence.length) {
            setBootComplete(true)
          }
        },
        currentStep === 0 ? 500 : 300,
      )

      return () => clearTimeout(timer)
    }
  }, [user, currentStep, bootComplete])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono animate-pulse">AUTHENTICATING...</div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin />
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="max-w-7xl mx-auto">
        {/* Terminal Window Header */}
        <div className="bg-gray-800/90 backdrop-blur-sm px-4 py-3 rounded-t-lg border-b border-green-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-300 font-mono">Terminal Gateway</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>NEXUSARCHITECT://GATEWAY</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="bg-gray-900/95 backdrop-blur-sm border-2 border-green-500/30 rounded-b-lg relative overflow-hidden">
          {/* Scanlines effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse"></div>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.03) 2px, rgba(34, 197, 94, 0.03) 4px)",
              }}
            ></div>
          </div>

          <div className="relative z-10 p-6">
            {/* Boot Sequence */}
            {!bootComplete && (
              <div className="space-y-1 mb-6">
                {terminalLines.map((line, index) => (
                  <div key={index} className="text-green-400 text-sm">
                    {line}
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="text-green-400">$ </span>
                  <div className="w-2 h-4 bg-green-400 ml-1 animate-pulse"></div>
                </div>
              </div>
            )}

            {bootComplete && (
              <>
                {/* Header */}
                <div className="border-b border-green-500/30 pb-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-green-400 mb-1">NEXUS ADMIN CONSOLE</h1>
                      <p className="text-gray-400 text-sm">
                        Welcome back, {user.name} • Role: {user.role.toUpperCase()} • Status: ONLINE
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-xs text-gray-400 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>System Status: OPERATIONAL</span>
                      </div>
                      <Button
                        onClick={logout}
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 font-mono bg-transparent text-xs px-3 py-1"
                      >
                        LOGOUT
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-black/50 border-green-500/30 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-green-400 font-mono text-xs flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        PROJECTS
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {statsLoading ? (
                        <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
                      ) : (
                        <>
                          <div className="text-xl font-mono text-white">{stats?.projects?.length || 0}</div>
                          <div className="text-xs text-gray-400">
                            {stats?.projects?.filter((p: any) => p.status === "active").length || 0} active
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border-green-500/30 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-green-400 font-mono text-xs flex items-center">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                        BLOG POSTS
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {statsLoading ? (
                        <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
                      ) : (
                        <>
                          <div className="text-xl font-mono text-white">{stats?.posts?.length || 0}</div>
                          <div className="text-xs text-gray-400">
                            {stats?.posts?.filter((p: any) => p.status === "published").length || 0} published
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border-green-500/30 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-green-400 font-mono text-xs flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        MEDIA ASSETS
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {statsLoading ? (
                        <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
                      ) : (
                        <>
                          <div className="text-xl font-mono text-white">{stats?.assets?.length || 0}</div>
                          <div className="text-xs text-gray-400">
                            {(stats?.assets?.reduce((sum, a: any) => sum + a.size, 0) / 1024 / 1024).toFixed(1)} MB
                            total
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border-green-500/30 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-green-400 font-mono text-xs flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        SYSTEM STATUS
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-mono text-green-400">ONLINE</div>
                      <div className="text-xs text-gray-400">All systems operational</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Admin Interface */}
                <Tabs defaultValue="analytics" className="space-y-4">
                  <TabsList className="bg-black/50 border border-green-500/30 backdrop-blur-sm">
                    <TabsTrigger
                      value="analytics"
                      className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 font-mono text-xs"
                    >
                      ANALYTICS
                    </TabsTrigger>
                    <TabsTrigger
                      value="projects"
                      className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 font-mono text-xs"
                    >
                      PROJECTS
                    </TabsTrigger>
                    <TabsTrigger
                      value="blog"
                      className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 font-mono text-xs"
                    >
                      BLOG
                    </TabsTrigger>
                    <TabsTrigger
                      value="media"
                      className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 font-mono text-xs"
                    >
                      MEDIA
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="analytics">
                    <Card className="bg-black/50 border-green-500/30 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-green-400 font-mono text-sm flex items-center">
                          <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                          ANALYTICS DASHBOARD
                        </CardTitle>
                        <CardDescription className="text-gray-400 font-mono text-xs">
                          Real-time visitor and engagement metrics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Suspense fallback={<DashboardSkeleton />}>
                          <OptimizedAnalyticsDashboard />
                        </Suspense>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="projects">
                    <Suspense fallback={<DashboardSkeleton />}>
                      <ProjectManager />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="blog">
                    <Suspense fallback={<DashboardSkeleton />}>
                      <BlogManager />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="media">
                    <Suspense fallback={<DashboardSkeleton />}>
                      <MediaManager />
                    </Suspense>
                  </TabsContent>
                </Tabs>

                {/* Terminal Prompt */}
                <div className="mt-6 pt-4 border-t border-green-500/20">
                  <div className="flex items-center text-sm">
                    <span className="text-green-400">admin@nexus-architect:~$ </span>
                    <div className="w-2 h-4 bg-green-400 ml-1 animate-pulse"></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
