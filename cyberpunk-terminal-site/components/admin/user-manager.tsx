"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  createdAt: string
  permissions: string[]
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer" as const,
    status: "active" as const,
    permissions: [] as string[],
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "viewer",
      status: "active",
      permissions: [],
    })
    setEditingUser(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users"
      const method = editingUser ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchUsers()
        resetForm()
        setIsCreateDialogOpen(false)
      }
    } catch (error) {
      console.error("Failed to save user:", error)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      permissions: user.permissions,
    })
    setIsCreateDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
        await fetchUsers()
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "border-red-500/50 text-red-400"
      case "editor":
        return "border-yellow-500/50 text-yellow-400"
      default:
        return "border-green-500/50 text-green-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-green-500/50 text-green-400"
      case "suspended":
        return "border-red-500/50 text-red-400"
      default:
        return "border-gray-500/50 text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-black/50 border-green-500/30">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
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
          <h2 className="text-xl font-mono text-green-400 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            USER MANAGEMENT
          </h2>
          <p className="text-gray-400 font-mono text-sm">{users.length} users registered</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-mono text-xs"
            >
              + CREATE USER
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 backdrop-blur-sm border-green-500/30 text-green-400 max-w-md">
            <DialogHeader>
              <DialogTitle className="font-mono text-green-400 text-sm">
                {editingUser ? "EDIT USER" : "CREATE USER"}
              </DialogTitle>
              <DialogDescription className="text-gray-400 font-mono text-xs">
                {editingUser ? "Update user information" : "Add a new user to the system"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-green-400 font-mono text-xs">
                  NAME
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-black/50 border-green-500/30 text-green-400 font-mono text-sm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-green-400 font-mono text-xs">
                  EMAIL
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="bg-black/50 border-green-500/30 text-green-400 font-mono text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role" className="text-green-400 font-mono text-xs">
                    ROLE
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="bg-black/50 border-green-500/30 text-green-400 font-mono text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-green-500/30">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status" className="text-green-400 font-mono text-xs">
                    STATUS
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="bg-black/50 border-green-500/30 text-green-400 font-mono text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-green-500/30">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-gray-500/50 text-gray-400 hover:bg-gray-800/50 font-mono text-xs"
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-mono text-xs"
                >
                  {editingUser ? "UPDATE" : "CREATE"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="bg-black/50 border-green-500/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-green-400 font-mono text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {user.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono text-xs">{user.email}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono text-xs px-2 py-1"
                  >
                    EDIT
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-mono text-xs px-2 py-1"
                  >
                    DELETE
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex space-x-2">
                  <Badge variant="outline" className={`${getRoleColor(user.role)} font-mono text-xs`}>
                    {user.role.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={`${getStatusColor(user.status)} font-mono text-xs`}>
                    {user.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  Last login: {new Date(user.lastLogin).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-gray-500 font-mono">CREATED</div>
                  <div className="text-green-400 font-mono">{new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-500 font-mono">PERMISSIONS</div>
                  <div className="text-green-400 font-mono">{user.permissions.length} granted</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card className="bg-black/50 border-green-500/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 font-mono text-sm">No users found. Create the first user to get started.</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
