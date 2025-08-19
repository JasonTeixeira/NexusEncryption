import { Suspense } from "react"
import PerformanceDashboard from "@/components/performance/performance-dashboard"
import { getCurrentUser, isAdmin } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PerformancePage() {
  const user = await getCurrentUser()
  if (!user || !(await isAdmin())) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="text-cyan-400">Loading performance dashboard...</div>
          </div>
        }
      >
        <PerformanceDashboard />
      </Suspense>
    </div>
  )
}
