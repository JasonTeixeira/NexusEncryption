import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export interface User {
  id: string
  email: string
  role: "admin" | "editor" | "viewer"
  name: string
  permissions: string[]
}

export interface Session {
  user: User
  expires: string
}

// Role-based permissions
export const PERMISSIONS = {
  ADMIN: ["read", "write", "delete", "manage_users", "manage_content", "view_analytics"],
  EDITOR: ["read", "write", "manage_content"],
  VIEWER: ["read"],
} as const

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, secret, {
    algorithms: ["HS256"],
  })
  return payload
}

export async function verifyAuth(request: NextRequest): Promise<User | null> {
  try {
    const session = request.cookies.get("session")?.value
    if (!session) return null

    const payload = await decrypt(session)
    return payload.user
  } catch {
    return null
  }
}

export function requireAuth(requiredPermission?: string) {
  return async (request: NextRequest) => {
    const session = await getSession()

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (requiredPermission && !hasPermission(session.user, requiredPermission)) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    return session
  }
}

export async function login(email: string, password: string): Promise<User | null> {
  const mockUsers: Record<string, { password: string; user: User }> = {
    "admin@nexusarchitect.dev": {
      password: "admin123",
      user: {
        id: "1",
        email: "admin@nexusarchitect.dev",
        role: "admin",
        name: "Nexus Architect",
        permissions: PERMISSIONS.ADMIN,
      },
    },
  }

  const userRecord = mockUsers[email]
  if (userRecord && userRecord.password === password) {
    return userRecord.user
  }
  return null
}

export async function getSession(): Promise<Session | null> {
  const session = cookies().get("session")?.value
  if (!session) return null

  try {
    const payload = await decrypt(session)
    return payload as Session
  } catch {
    return null
  }
}

export async function createSession(user: User) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session: Session = { user, expires: expires.toISOString() }
  const sessionToken = await encrypt(session)

  cookies().set("session", sessionToken, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession() {
  cookies().delete("session")
}

export function hasPermission(user: User, permission: string): boolean {
  return user.permissions.includes(permission)
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user || null
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === "admin" || false
}

export async function canEditContent(): Promise<boolean> {
  const user = await getCurrentUser()
  return user ? hasPermission(user, "write") : false
}

export async function canViewAnalytics(): Promise<boolean> {
  const user = await getCurrentUser()
  return user ? hasPermission(user, "view_analytics") : false
}
