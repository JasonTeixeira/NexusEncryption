import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { cache } from "react"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create a cached version of the Supabase client for Server Components
export const createClient = cache(() => {
  const cookieStore = cookies()

  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")

    // Create a proper query builder mock
    const createQueryBuilder = () => ({
      select: (columns?: string) => createQueryBuilder(),
      insert: (values: any) => createQueryBuilder(),
      update: (values: any) => createQueryBuilder(),
      delete: () => createQueryBuilder(),
      eq: (column: string, value: any) => createQueryBuilder(),
      neq: (column: string, value: any) => createQueryBuilder(),
      gt: (column: string, value: any) => createQueryBuilder(),
      gte: (column: string, value: any) => createQueryBuilder(),
      lt: (column: string, value: any) => createQueryBuilder(),
      lte: (column: string, value: any) => createQueryBuilder(),
      like: (column: string, pattern: string) => createQueryBuilder(),
      ilike: (column: string, pattern: string) => createQueryBuilder(),
      is: (column: string, value: any) => createQueryBuilder(),
      in: (column: string, values: any[]) => createQueryBuilder(),
      contains: (column: string, value: any) => createQueryBuilder(),
      containedBy: (column: string, value: any) => createQueryBuilder(),
      rangeGt: (column: string, value: any) => createQueryBuilder(),
      rangeGte: (column: string, value: any) => createQueryBuilder(),
      rangeLt: (column: string, value: any) => createQueryBuilder(),
      rangeLte: (column: string, value: any) => createQueryBuilder(),
      rangeAdjacent: (column: string, value: any) => createQueryBuilder(),
      overlaps: (column: string, value: any) => createQueryBuilder(),
      textSearch: (column: string, query: string) => createQueryBuilder(),
      match: (query: Record<string, any>) => createQueryBuilder(),
      not: (column: string, operator: string, value: any) => createQueryBuilder(),
      or: (filters: string) => createQueryBuilder(),
      filter: (column: string, operator: string, value: any) => createQueryBuilder(),
      order: (column: string, options?: { ascending?: boolean }) => createQueryBuilder(),
      limit: (count: number) => createQueryBuilder(),
      range: (from: number, to: number) => createQueryBuilder(),
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      then: (resolve: any, reject?: any) => Promise.resolve({ data: [], error: null }).then(resolve, reject),
    })

    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
      from: (table: string) => createQueryBuilder(),
    }
  }

  return createServerComponentClient({ cookies: () => cookieStore })
})

export const createServerClient = createClient

// Helper function to get current user
export const getCurrentUser = cache(async () => {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
})

// Helper function to get user profile
export const getUserProfile = cache(async (userId?: string) => {
  const supabase = createClient()
  const currentUser = userId || (await getCurrentUser())?.id

  if (!currentUser) {
    return null
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", currentUser).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
})

// Helper function to check if user is admin
export const isAdmin = cache(async () => {
  const profile = await getUserProfile()
  return profile?.role === "admin"
})

// Helper function to check if user can edit content
export const canEditContent = cache(async () => {
  const profile = await getUserProfile()
  return profile?.role === "admin" || profile?.role === "editor"
})
