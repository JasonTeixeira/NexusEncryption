"use client"

import { useEffect, useState, useRef } from "react"
import {
  collaborationService,
  type User,
  type DashboardSession,
  type Comment,
  type Annotation,
} from "@/lib/collaboration-service"

export function useCollaboration(dashboardId: string, currentUser: User) {
  const [session, setSession] = useState<DashboardSession | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const sessionIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Join session
    const sessionId = collaborationService.joinSession(dashboardId, currentUser)
    sessionIdRef.current = sessionId
    setIsConnected(true)

    // Set initial session state
    const initialSession = collaborationService.getSession(sessionId)
    if (initialSession) {
      setSession({ ...initialSession })
    }

    // Listen for collaboration events
    const handleUserJoined = (sid: string, data: any) => {
      if (sid === sessionId) {
        const updatedSession = collaborationService.getSession(sessionId)
        if (updatedSession) setSession({ ...updatedSession })
      }
    }

    const handleUserLeft = (sid: string, data: any) => {
      if (sid === sessionId) {
        const updatedSession = collaborationService.getSession(sessionId)
        if (updatedSession) setSession({ ...updatedSession })
      }
    }

    const handleCommentAdded = (sid: string, comment: Comment) => {
      if (sid === sessionId) {
        const updatedSession = collaborationService.getSession(sessionId)
        if (updatedSession) setSession({ ...updatedSession })
      }
    }

    const handleAnnotationAdded = (sid: string, annotation: Annotation) => {
      if (sid === sessionId) {
        const updatedSession = collaborationService.getSession(sessionId)
        if (updatedSession) setSession({ ...updatedSession })
      }
    }

    collaborationService.on("user-joined", handleUserJoined)
    collaborationService.on("user-left", handleUserLeft)
    collaborationService.on("comment-added", handleCommentAdded)
    collaborationService.on("annotation-added", handleAnnotationAdded)

    // Cleanup on unmount
    return () => {
      if (sessionIdRef.current) {
        collaborationService.leaveSession(sessionIdRef.current, currentUser.id)
      }
      collaborationService.off("user-joined", handleUserJoined)
      collaborationService.off("user-left", handleUserLeft)
      collaborationService.off("comment-added", handleCommentAdded)
      collaborationService.off("annotation-added", handleAnnotationAdded)
      setIsConnected(false)
    }
  }, [dashboardId, currentUser])

  const addComment = (content: string, x: number, y: number) => {
    if (sessionIdRef.current) {
      return collaborationService.addComment(sessionIdRef.current, {
        userId: currentUser.id,
        content,
        x,
        y,
      })
    }
  }

  const addAnnotation = (type: Annotation["type"], x: number, y: number, options?: Partial<Annotation>) => {
    if (sessionIdRef.current) {
      return collaborationService.addAnnotation(sessionIdRef.current, {
        userId: currentUser.id,
        type,
        x,
        y,
        color: currentUser.color,
        ...options,
      })
    }
  }

  const generateShareLink = (permissions: "view" | "edit" = "view") => {
    return collaborationService.generateShareLink(dashboardId, permissions)
  }

  return {
    session,
    isConnected,
    users: session ? Array.from(session.users.values()) : [],
    comments: session?.comments || [],
    annotations: session?.annotations || [],
    addComment,
    addAnnotation,
    generateShareLink,
  }
}
