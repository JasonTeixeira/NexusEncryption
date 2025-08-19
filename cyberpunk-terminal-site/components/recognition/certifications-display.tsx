"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import type { Certification } from "@/lib/industry-recognition"

export function CertificationsDisplay() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await fetch("/api/recognition/certifications")
        const data = await response.json()
        setCertifications(data.certifications || [])
      } catch (error) {
        console.error("Error fetching certifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCertifications()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/20 border-green-500/50"
      case "expired":
        return "text-red-400 bg-red-500/20 border-red-500/50"
      case "pending":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "architect":
        return "text-purple-400"
      case "expert":
        return "text-cyan-400"
      case "professional":
        return "text-blue-400"
      case "associate":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="bg-black/95 border border-blue-500/50 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-blue-500/20 rounded"></div>
          <div className="h-32 bg-blue-500/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/95 border border-blue-500/50 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-blue-400 font-mono text-lg">Professional Certifications</span>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">📜</div>
          <div className="text-gray-400 text-sm">No certifications data available</div>
        </div>
      ) : (
        <ScrollArea className="h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="border border-gray-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-blue-400 font-mono text-sm mb-1">{cert.name}</h3>
                    <div className="text-gray-300 text-xs mb-2">{cert.provider}</div>
                    <div className="text-gray-400 text-xs">
                      Issued: {cert.issueDate.toLocaleDateString()}
                      {cert.expiryDate && (
                        <>
                          <br />
                          Expires: {cert.expiryDate.toLocaleDateString()}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-blue-400 text-xl">🎓</div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded border text-xs ${getStatusColor(cert.status)}`}>
                    {cert.status.toUpperCase()}
                  </span>
                  <span className={`text-xs ${getLevelColor(cert.level)}`}>{cert.level.toUpperCase()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-gray-500 text-xs">ID: {cert.credentialId}</div>
                  <Button
                    onClick={() => window.open(cert.verificationUrl, "_blank")}
                    className="text-xs px-3 py-1 bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
                  >
                    Verify
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
