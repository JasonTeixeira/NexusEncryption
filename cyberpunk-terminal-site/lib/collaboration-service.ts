interface User {
  id: string
  name: string
  email: string
  avatar?: string
  color: string
}

interface DashboardSession {
  id: string
  dashboardId: string
  users: Map<string, User>
  comments: Comment[]
  annotations: Annotation[]
  createdAt: Date
}

interface Comment {
  id: string
  userId: string
  content: string
  x: number
  y: number
  timestamp: Date
  replies: Comment[]
}

interface Annotation {
  id: string
  userId: string
  type: "highlight" | "arrow" | "circle" | "text"
  x: number
  y: number
  width?: number
  height?: number
  content?: string
  color: string
  timestamp: Date
}

class CollaborationService {
  private sessions: Map<string, DashboardSession> = new Map()
  private eventCallbacks: Map<string, Function[]> = new Map()

  // Create or join a dashboard session
  joinSession(dashboardId: string, user: User): string {
    const sessionId = `session_${dashboardId}`

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        id: sessionId,
        dashboardId,
        users: new Map(),
        comments: [],
        annotations: [],
        createdAt: new Date(),
      })
    }

    const session = this.sessions.get(sessionId)!
    session.users.set(user.id, user)

    this.emit("user-joined", sessionId, { user, userCount: session.users.size })

    return sessionId
  }

  // Leave a dashboard session
  leaveSession(sessionId: string, userId: string) {
    const session = this.sessions.get(sessionId)
    if (session) {
      const user = session.users.get(userId)
      session.users.delete(userId)

      this.emit("user-left", sessionId, { user, userCount: session.users.size })

      // Clean up empty sessions
      if (session.users.size === 0) {
        this.sessions.delete(sessionId)
      }
    }
  }

  // Add comment to dashboard
  addComment(sessionId: string, comment: Omit<Comment, "id" | "timestamp" | "replies">): Comment {
    const session = this.sessions.get(sessionId)
    if (!session) throw new Error("Session not found")

    const newComment: Comment = {
      ...comment,
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      replies: [],
    }

    session.comments.push(newComment)
    this.emit("comment-added", sessionId, newComment)

    return newComment
  }

  // Add annotation to dashboard
  addAnnotation(sessionId: string, annotation: Omit<Annotation, "id" | "timestamp">): Annotation {
    const session = this.sessions.get(sessionId)
    if (!session) throw new Error("Session not found")

    const newAnnotation: Annotation = {
      ...annotation,
      id: `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }

    session.annotations.push(newAnnotation)
    this.emit("annotation-added", sessionId, newAnnotation)

    return newAnnotation
  }

  // Get session data
  getSession(sessionId: string): DashboardSession | undefined {
    return this.sessions.get(sessionId)
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, [])
    }
    this.eventCallbacks.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const callbacks = this.eventCallbacks.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private emit(event: string, sessionId: string, data: any) {
    const callbacks = this.eventCallbacks.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(sessionId, data))
    }
  }

  // Generate shareable link
  generateShareLink(dashboardId: string, permissions: "view" | "edit" = "view"): string {
    const shareToken = btoa(`${dashboardId}:${permissions}:${Date.now()}`).replace(/[+/=]/g, "")
    return `${window.location.origin}/dashboards/shared/${shareToken}`
  }

  // Parse share link
  parseShareLink(shareToken: string): { dashboardId: string; permissions: string } | null {
    try {
      const decoded = atob(shareToken)
      const [dashboardId, permissions] = decoded.split(":")
      return { dashboardId, permissions }
    } catch {
      return null
    }
  }
}

export const collaborationService = new CollaborationService()
export type { User, DashboardSession, Comment, Annotation }
