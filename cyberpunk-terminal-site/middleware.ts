import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SecurityService, SecurityMonitor } from "@/lib/security"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const clientIP = SecurityService.getClientIP(request)

  // Check if IP is blocked
  if (SecurityMonitor.isIPBlocked(clientIP)) {
    SecurityMonitor.logSecurityEvent({
      type: "suspicious_activity",
      ip: clientIP,
      details: { reason: "Blocked IP attempted access" },
      severity: "high",
    })
    return new NextResponse("Access Denied", { status: 403 })
  }

  // Rate limiting
  const rateLimitKey = `${clientIP}:${request.nextUrl.pathname}`
  if (!SecurityService.checkRateLimit(rateLimitKey, 100, 60000)) {
    SecurityMonitor.logSecurityEvent({
      type: "rate_limit_exceeded",
      ip: clientIP,
      userAgent: request.headers.get("user-agent") || undefined,
      details: { path: request.nextUrl.pathname },
      severity: "medium",
    })
    return new NextResponse("Rate limit exceeded", { status: 429 })
  }

  // Add security headers
  const securityHeaders = SecurityService.getSecurityHeaders()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // CSRF protection for state-changing requests
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const csrfToken = request.headers.get("x-csrf-token")
    const sessionToken = request.cookies.get("csrf-token")?.value

    if (!csrfToken || !sessionToken || !SecurityService.validateCSRFToken(csrfToken, sessionToken)) {
      SecurityMonitor.logSecurityEvent({
        type: "suspicious_activity",
        ip: clientIP,
        details: { reason: "Invalid CSRF token" },
        severity: "medium",
      })
      return new NextResponse("Invalid CSRF token", { status: 403 })
    }
  }

  // Log API access
  if (request.nextUrl.pathname.startsWith("/api/")) {
    SecurityMonitor.logSecurityEvent({
      type: "login_attempt",
      ip: clientIP,
      userAgent: request.headers.get("user-agent") || undefined,
      details: {
        method: request.method,
        path: request.nextUrl.pathname,
        timestamp: new Date().toISOString(),
      },
      severity: "low",
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
