import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co" &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0 &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "placeholder_anon_key"

// Create a singleton instance of the Supabase client for Client Components
export const supabase = isSupabaseConfigured 
  ? createClientComponentClient()
  : createMockClient()

export const createClient = () => isSupabaseConfigured 
  ? createClientComponentClient()
  : createMockClient()

// Create a mock client for when Supabase is not configured
function createMockClient() {
  console.warn("Supabase environment variables are not properly configured. Using mock client.")
  
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
      signIn: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: (table: string) => createQueryBuilder(),
  }
}

// Database types
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: "admin" | "editor" | "viewer"
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  tech_stack: string[]
  status: "active" | "archived" | "draft"
  featured: boolean
  github_url?: string
  live_url?: string
  image_url?: string
  uptime: number
  requests_per_day: number
  avg_response_time: number
  created_at: string
  updated_at: string
  created_by?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  status: "draft" | "published" | "archived"
  featured: boolean
  featured_image?: string
  seo_title?: string
  seo_description?: string
  views: number
  likes: number
  comments_count: number
  reading_time: number
  published_at?: string
  created_at: string
  updated_at: string
  created_by?: string
  categories?: BlogCategory[]
  tags?: BlogTag[]
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  icon?: string
  post_count: number
  created_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  color: string
  post_count: number
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  page_path?: string
  user_agent?: string
  ip_address?: string
  country?: string
  city?: string
  referrer?: string
  session_id?: string
  user_id?: string
  metadata?: Record<string, any>
  created_at: string
}

export interface SearchResult {
  id: string
  content_type: "project" | "blog_post"
  content_id: string
  title: string
  content: string
  rank: number
}
