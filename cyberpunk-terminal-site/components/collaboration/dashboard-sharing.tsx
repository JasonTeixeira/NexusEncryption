"use client"

import type React from "react"

import { useState } from "react"
import { Share2, Copy, Check, Eye, Edit, Link, Download, Upload } from "lucide-react"

interface DashboardSharingProps {
  dashboardId: string
  dashboardName: string
  onGenerateLink: (permissions: "view" | "edit") => string
  onExport?: () => void
  onImport?: (file: File) => void
}

export default function DashboardSharing({
  dashboardId,
  dashboardName,
  onGenerateLink,
  onExport,
  onImport,
}: DashboardSharingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [permissions, setPermissions] = useState<"view" | "edit">("view")
  const [copied, setCopied] = useState(false)

  const generateLink = () => {
    const link = onGenerateLink(permissions)
    setShareLink(link)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onImport) {
      onImport(file)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded border border-green-500/20 text-gray-300 hover:text-green-400 hover:border-green-400/50 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm">Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-green-500/20 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-cyan-400">Share Dashboard</h3>
            </div>

            {/* Permission Selection */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Access Level</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPermissions("view")}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                    permissions === "view"
                      ? "bg-blue-400/20 text-blue-400 border border-blue-400/30"
                      : "bg-gray-800 text-gray-400 border border-gray-600/30 hover:text-blue-400"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  View Only
                </button>
                <button
                  onClick={() => setPermissions("edit")}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                    permissions === "edit"
                      ? "bg-green-400/20 text-green-400 border border-green-400/30"
                      : "bg-gray-800 text-gray-400 border border-gray-600/30 hover:text-green-400"
                  }`}
                >
                  <Edit className="w-4 h-4" />
                  Can Edit
                </button>
              </div>
            </div>

            {/* Generate Link */}
            <div className="mb-4">
              <button
                onClick={generateLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 rounded hover:bg-cyan-400/30 transition-colors"
              >
                <Link className="w-4 h-4" />
                Generate Share Link
              </button>
            </div>

            {/* Share Link Display */}
            {shareLink && (
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Share Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600/30 rounded text-sm text-gray-300 font-mono"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-3 py-2 rounded border transition-colors ${
                      copied
                        ? "bg-green-400/20 text-green-400 border-green-400/30"
                        : "bg-gray-800 text-gray-400 border-gray-600/30 hover:text-green-400"
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Export/Import */}
            <div className="border-t border-gray-700/50 pt-4">
              <div className="flex gap-2">
                {onExport && (
                  <button
                    onClick={onExport}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-400/20 text-purple-400 border border-purple-400/30 rounded hover:bg-purple-400/30 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                )}

                {onImport && (
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-400/20 text-orange-400 border border-orange-400/30 rounded hover:bg-orange-400/30 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import
                    <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
