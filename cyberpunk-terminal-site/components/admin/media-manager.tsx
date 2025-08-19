"use client"

import type React from "react"

import { useState } from "react"
import { useMediaAssets } from "@/hooks/use-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function MediaManager() {
  const { assets, loading, uploadAsset } = useMediaAssets()
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    alt: "",
    description: "",
    tags: "",
  })
  const [uploading, setUploading] = useState(false)

  const resetUploadForm = () => {
    setUploadData({
      file: null,
      alt: "",
      description: "",
      tags: "",
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadData((prev) => ({ ...prev, file }))
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadData.file) return

    setUploading(true)
    const success = await uploadAsset(uploadData.file, {
      alt: uploadData.alt,
      description: uploadData.description,
      tags: uploadData.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    })

    if (success) {
      resetUploadForm()
      setIsUploadDialogOpen(false)
    }
    setUploading(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-gray-950 border-green-500/30">
            <CardContent className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-32 bg-gray-800 rounded"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-mono text-green-400">Media Management</h2>
          <p className="text-gray-400 font-mono">{assets.length} assets total</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetUploadForm}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-mono"
            >
              + UPLOAD MEDIA
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-950 border-green-500/30 text-green-400 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-mono text-green-400">Upload Media Asset</DialogTitle>
              <DialogDescription className="text-gray-400 font-mono">
                Upload images, documents, or other media files
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="file" className="text-green-400 font-mono">
                  File
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                  required
                />
                {uploadData.file && (
                  <div className="text-sm text-gray-400 mt-1">
                    Selected: {uploadData.file.name} ({formatFileSize(uploadData.file.size)})
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="alt" className="text-green-400 font-mono">
                  Alt Text
                </Label>
                <Input
                  id="alt"
                  value={uploadData.alt}
                  onChange={(e) => setUploadData((prev) => ({ ...prev, alt: e.target.value }))}
                  className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-green-400 font-mono">
                  Description
                </Label>
                <Input
                  id="description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData((prev) => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                  placeholder="Optional description"
                />
              </div>

              <div>
                <Label htmlFor="tags" className="text-green-400 font-mono">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  value={uploadData.tags}
                  onChange={(e) => setUploadData((prev) => ({ ...prev, tags: e.target.value }))}
                  className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                  placeholder="screenshot, ui, design"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                  className="border-gray-500 text-gray-400 hover:bg-gray-800 font-mono"
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-mono"
                  disabled={uploading || !uploadData.file}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <Card key={asset.id} className="bg-gray-950 border-green-500/30">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-green-400 font-mono text-sm truncate">{asset.originalName}</CardTitle>
                  <CardDescription className="text-gray-400 font-mono text-xs">
                    {formatFileSize(asset.size)} • {asset.mimeType}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(asset.url)}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono text-xs"
                >
                  COPY URL
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {asset.mimeType.startsWith("image/") ? (
                <div className="w-full h-32 bg-gray-800 rounded mb-3 flex items-center justify-center">
                  <div className="text-gray-500 font-mono text-xs">IMAGE PREVIEW</div>
                </div>
              ) : (
                <div className="w-full h-32 bg-gray-800 rounded mb-3 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 font-mono text-lg">📄</div>
                    <div className="text-gray-500 font-mono text-xs">{asset.mimeType}</div>
                  </div>
                </div>
              )}

              {asset.description && <p className="text-gray-300 text-sm mb-2">{asset.description}</p>}

              {asset.alt && <p className="text-gray-400 text-xs mb-2">Alt: {asset.alt}</p>}

              {asset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {asset.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="border-gray-500/50 text-gray-400 font-mono text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-500 font-mono">
                Uploaded: {new Date(asset.createdAt).toLocaleDateString()}
              </div>

              <div className="mt-2 p-2 bg-gray-900 rounded text-xs font-mono text-gray-400 break-all">{asset.url}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assets.length === 0 && (
        <Card className="bg-gray-950 border-green-500/30">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 font-mono">
              No media assets found. Upload your first asset to get started.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
