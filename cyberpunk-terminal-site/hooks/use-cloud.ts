"use client"

import { useState, useEffect } from "react"
import type { CloudMetrics, CloudResource, CostOptimization } from "@/lib/cloud-apis"

export function useCloudMetrics(provider: "aws" | "azure" | "gcp") {
  const [metrics, setMetrics] = useState<CloudMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true)
        const response = await fetch(`/api/cloud/${provider}?type=metrics`)
        const result = await response.json()

        if (result.success) {
          setMetrics(result.data)
          setError(null)
        } else {
          setError(result.error || `Failed to fetch ${provider.toUpperCase()} metrics`)
        }
      } catch (err) {
        setError(`Network error fetching ${provider.toUpperCase()} metrics`)
        console.error(`${provider} metrics error:`, err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()

    // Refresh every 2 minutes
    const interval = setInterval(fetchMetrics, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [provider])

  return { metrics, loading, error }
}

export function useCloudResources(provider: "aws" | "azure" | "gcp") {
  const [resources, setResources] = useState<CloudResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true)
        const response = await fetch(`/api/cloud/${provider}?type=resources`)
        const result = await response.json()

        if (result.success) {
          setResources(result.data)
          setError(null)
        } else {
          setError(result.error || `Failed to fetch ${provider.toUpperCase()} resources`)
        }
      } catch (err) {
        setError(`Network error fetching ${provider.toUpperCase()} resources`)
        console.error(`${provider} resources error:`, err)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()

    // Refresh every 5 minutes
    const interval = setInterval(fetchResources, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [provider])

  return { resources, loading, error }
}

export function useCostOptimization() {
  const [optimization, setOptimization] = useState<CostOptimization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOptimization() {
      try {
        setLoading(true)
        const response = await fetch("/api/cloud/aws?type=cost-optimization")
        const result = await response.json()

        if (result.success) {
          setOptimization(result.data)
          setError(null)
        } else {
          setError(result.error || "Failed to fetch cost optimization data")
        }
      } catch (err) {
        setError("Network error fetching cost optimization data")
        console.error("Cost optimization error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOptimization()

    // Refresh every 30 minutes
    const interval = setInterval(fetchOptimization, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { optimization, loading, error }
}

export function useMultiCloudMetrics() {
  const awsMetrics = useCloudMetrics("aws")
  const azureMetrics = useCloudMetrics("azure")
  const gcpMetrics = useCloudMetrics("gcp")

  const totalCost =
    (awsMetrics.metrics?.totalCost || 0) + (azureMetrics.metrics?.totalCost || 0) + (gcpMetrics.metrics?.totalCost || 0)

  const totalResources =
    (awsMetrics.metrics?.totalResources || 0) +
    (azureMetrics.metrics?.totalResources || 0) +
    (gcpMetrics.metrics?.totalResources || 0)

  const avgHealthScore =
    [
      awsMetrics.metrics?.healthScore || 0,
      azureMetrics.metrics?.healthScore || 0,
      gcpMetrics.metrics?.healthScore || 0,
    ].reduce((sum, score) => sum + score, 0) / 3

  const allAlerts = [
    ...(awsMetrics.metrics?.alerts || []),
    ...(azureMetrics.metrics?.alerts || []),
    ...(gcpMetrics.metrics?.alerts || []),
  ]

  const loading = awsMetrics.loading || azureMetrics.loading || gcpMetrics.loading

  return {
    aws: awsMetrics,
    azure: azureMetrics,
    gcp: gcpMetrics,
    summary: {
      totalCost,
      totalResources,
      avgHealthScore: Math.round(avgHealthScore),
      alerts: allAlerts,
    },
    loading,
  }
}
