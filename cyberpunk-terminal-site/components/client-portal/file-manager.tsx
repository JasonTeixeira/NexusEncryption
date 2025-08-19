"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import type { ProjectFile } from "@/lib/client-portal"

interface FileManagerProps {
  projectId: string
}

export function FileManager({ projectId }: FileManagerProps) {
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles) return

    setUploading(true)

    try {
      for (const file of Array.from(selectedFiles)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("projectId", projectId)

        // Simulate upload
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newFile: ProjectFile = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date(),
          uploadedBy: "You",
          category: "deliverable",
          url: URL.createObjectURL(file),
          version: 1,
        }

        setFiles((prev) => [...prev, newFile])
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("word") || type.includes("document")) return "📝"
    if (type.includes("excel") || type.includes("spreadsheet")) return "📊"
    if (type.includes("zip") || type.includes("archive")) return "📦"
    return "📁"
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "requirement":
        return "text-blue-400 bg-blue-500/20 border-blue-500/50"
      case "design":
        return "text-purple-400 bg-purple-500/20 border-purple-500/50"
      case "code":
        return "text-green-400 bg-green-500/20 border-green-500/50"
      case "documentation":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50"
      case "deliverable":
        return "text-cyan-400 bg-cyan-500/20 border-cyan-500/50"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50"
    }
  }

  const filteredFiles = selectedCategory === "all" ? files : files.filter((file) => file.category === selectedCategory)

  return (
    <div className="bg-black/95 border border-cyan-500/50 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-cyan-400 font-mono text-lg">File Manager</span>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </Button>
      </div>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.jpg,.jpeg,.png,.gif,.svg"
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "requirement", "design", "code", "documentation", "deliverable"].map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`text-xs px-3 py-1 ${
              selectedCategory === category
                ? "bg-cyan-500/30 border-cyan-500/50 text-cyan-300"
                : "bg-gray-700/30 border-gray-600/50 text-gray-400 hover:bg-gray-600/30"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Files List */}
      <ScrollArea className="h-96">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">📁</div>
            <div className="text-gray-400 text-sm">No files uploaded yet</div>
            <div className="text-gray-500 text-xs mt-1">Click "Upload Files" to get started</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border border-gray-700/50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getFileIcon(file.type)}</div>
                  <div>
                    <div className="text-cyan-400 text-sm font-mono">{file.name}</div>
                    <div className="text-gray-400 text-xs">
                      {formatFileSize(file.size)} • Uploaded by {file.uploadedBy} •{" "}
                      {file.uploadDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded border text-xs ${getCategoryColor(file.category)}`}>
                    {file.category}
                  </span>
                  <Button
                    onClick={() => window.open(file.url, "_blank")}
                    className="text-xs px-3 py-1 bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-yellow-400 text-sm">Uploading files...</span>
          </div>
        </div>
      )}
    </div>
  )
}
