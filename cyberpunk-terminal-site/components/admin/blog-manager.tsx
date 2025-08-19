"use client"

import type React from "react"

import { useState } from "react"
import { useBlogPosts } from "@/hooks/use-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { BlogPost } from "@/lib/database"

export default function BlogManager() {
  const { posts, loading, createPost, updatePost, deletePost } = useBlogPosts()
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    status: "draft" as const,
    category: "",
    tags: "",
    featuredImage: "",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      status: "draft",
      category: "",
      tags: "",
      featuredImage: "",
    })
    setEditingPost(null)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const postData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      slug: formData.slug || generateSlug(formData.title),
    }

    let success = false
    if (editingPost) {
      success = await updatePost(editingPost.id, postData)
    } else {
      success = await createPost(postData)
    }

    if (success) {
      resetForm()
      setIsCreateDialogOpen(false)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      category: post.category,
      tags: post.tags.join(", "),
      featuredImage: post.featuredImage || "",
    })
    setIsCreateDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await deletePost(id)
    }
  }

  const handlePublish = async (post: BlogPost) => {
    await updatePost(post.id, {
      status: "published",
      publishedAt: new Date().toISOString(),
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-gray-950 border-green-500/30">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                <div className="h-16 bg-gray-800 rounded"></div>
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
          <h2 className="text-2xl font-mono text-green-400">Blog Management</h2>
          <p className="text-gray-400 font-mono">
            {posts.length} posts total • {posts.filter((p) => p.status === "published").length} published
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-mono"
            >
              + NEW POST
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-950 border-green-500/30 text-green-400 max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono text-green-400">
                {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
              </DialogTitle>
              <DialogDescription className="text-gray-400 font-mono">
                {editingPost ? "Update blog post content" : "Write a new blog post"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-green-400 font-mono">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="text-green-400 font-mono">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                    placeholder="auto-generated-from-title"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-green-400 font-mono">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                  placeholder="Brief description of the post..."
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-green-400 font-mono">
                  Content (Markdown)
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  className="bg-gray-900 border-green-500/30 text-green-400 font-mono min-h-[300px]"
                  placeholder="# Your blog post content here..."
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status" className="text-green-400 font-mono">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="bg-gray-900 border-green-500/30 text-green-400 font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-green-500/30">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category" className="text-green-400 font-mono">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                    placeholder="Technical, Tutorial, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="featuredImage" className="text-green-400 font-mono">
                    Featured Image URL
                  </Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))}
                    className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags" className="text-green-400 font-mono">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  className="bg-gray-900 border-green-500/30 text-green-400 font-mono"
                  placeholder="cloud, devops, tutorial"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-gray-500 text-gray-400 hover:bg-gray-800 font-mono"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-mono"
                >
                  {editingPost ? "Update" : "Create"} Post
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-gray-950 border-green-500/30">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-green-400 font-mono flex items-center gap-2">
                    {post.title}
                    <Badge
                      className={
                        post.status === "published"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : post.status === "draft"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }
                    >
                      {post.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    {post.category} • {post.readTime} min read • {new Date(post.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  {post.status === "draft" && (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(post)}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-mono"
                    >
                      PUBLISH
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleEdit(post)}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono"
                  >
                    EDIT
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-mono"
                  >
                    DELETE
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{post.excerpt}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="border-gray-500/50 text-gray-400 font-mono">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="text-xs text-gray-500 font-mono">
                Slug: /{post.slug}
                {post.publishedAt && <> • Published: {new Date(post.publishedAt).toLocaleString()}</>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card className="bg-gray-950 border-green-500/30">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 font-mono">No blog posts found. Create your first post to get started.</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
