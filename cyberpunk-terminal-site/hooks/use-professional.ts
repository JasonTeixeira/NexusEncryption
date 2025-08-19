"use client"

import { useState, useEffect } from "react"
import type { LinkedInProfile, Certification, IndustryNews, ProfessionalMetrics } from "@/lib/professional-apis"

export function useLinkedInProfile() {
  const [profile, setProfile] = useState<LinkedInProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        const response = await fetch("/api/professional/linkedin?type=profile")
        const result = await response.json()

        if (result.success) {
          setProfile(result.data)
          setError(null)
        } else {
          setError(result.error || "Failed to fetch LinkedIn profile")
        }
      } catch (err) {
        setError("Network error fetching LinkedIn profile")
        console.error("LinkedIn profile error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return { profile, loading, error }
}

export function useLinkedInMetrics() {
  const [metrics, setMetrics] = useState<ProfessionalMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true)
        const response = await fetch("/api/professional/linkedin?type=metrics")
        const result = await response.json()

        if (result.success) {
          setMetrics(result.data)
          setError(null)
        } else {
          setError(result.error || "Failed to fetch LinkedIn metrics")
        }
      } catch (err) {
        setError("Network error fetching LinkedIn metrics")
        console.error("LinkedIn metrics error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()

    // Refresh every 30 minutes
    const interval = setInterval(fetchMetrics, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { metrics, loading, error }
}

export function useCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCertifications() {
      try {
        setLoading(true)
        const response = await fetch("/api/professional/certifications")
        const result = await response.json()

        if (result.success) {
          setCertifications(result.data)
          setError(null)
        } else {
          setError(result.error || "Failed to fetch certifications")
        }
      } catch (err) {
        setError("Network error fetching certifications")
        console.error("Certifications error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCertifications()
  }, [])

  const verifyCertification = async (certificationId: string) => {
    try {
      const response = await fetch("/api/professional/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificationId }),
      })
      const result = await response.json()
      return result.success ? result.data.verified : false
    } catch (error) {
      console.error("Verification error:", error)
      return false
    }
  }

  return { certifications, loading, error, verifyCertification }
}

export function useIndustryNews(category?: string) {
  const [news, setNews] = useState<IndustryNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        const url = category ? `/api/professional/news?category=${category}` : "/api/professional/news"

        const response = await fetch(url)
        const result = await response.json()

        if (result.success) {
          setNews(result.data)
          setError(null)
        } else {
          setError(result.error || "Failed to fetch industry news")
        }
      } catch (err) {
        setError("Network error fetching industry news")
        console.error("Industry news error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()

    // Refresh every hour
    const interval = setInterval(fetchNews, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [category])

  return { news, loading, error }
}
