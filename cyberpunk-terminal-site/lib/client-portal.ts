export interface Client {
  id: string
  name: string
  email: string
  company: string
  avatar?: string
  joinDate: Date
  status: "active" | "inactive" | "pending"
  tier: "basic" | "premium" | "enterprise"
}

export interface Project {
  id: string
  clientId: string
  name: string
  description: string
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold"
  priority: "low" | "medium" | "high" | "urgent"
  startDate: Date
  endDate: Date
  budget: number
  spent: number
  progress: number
  milestones: Milestone[]
  files: ProjectFile[]
  team: TeamMember[]
}

export interface Milestone {
  id: string
  title: string
  description: string
  dueDate: Date
  status: "pending" | "in-progress" | "completed" | "overdue"
  progress: number
  deliverables: string[]
}

export interface ProjectFile {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
  uploadedBy: string
  category: "requirement" | "design" | "code" | "documentation" | "deliverable"
  url: string
  version: number
}

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  email: string
}

export interface Message {
  id: string
  projectId: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: "text" | "file" | "system"
  attachments?: string[]
  read: boolean
}

export interface Invoice {
  id: string
  projectId: string
  clientId: string
  amount: number
  description: string
  status: "draft" | "sent" | "paid" | "overdue"
  dueDate: Date
  createdDate: Date
  paidDate?: Date
  items: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

// Mock data for demonstration
export const mockClients: Client[] = [
  {
    id: "client-1",
    name: "Sarah Johnson",
    email: "sarah@techcorp.com",
    company: "TechCorp Solutions",
    joinDate: new Date("2024-01-15"),
    status: "active",
    tier: "premium",
  },
  {
    id: "client-2",
    name: "Michael Chen",
    email: "michael@startupx.io",
    company: "StartupX",
    joinDate: new Date("2024-02-20"),
    status: "active",
    tier: "enterprise",
  },
]

export const mockProjects: Project[] = [
  {
    id: "project-1",
    clientId: "client-1",
    name: "Cloud Infrastructure Migration",
    description: "Migrate legacy systems to AWS with microservices architecture",
    status: "in-progress",
    priority: "high",
    startDate: new Date("2024-01-20"),
    endDate: new Date("2024-04-15"),
    budget: 75000,
    spent: 32500,
    progress: 65,
    milestones: [
      {
        id: "milestone-1",
        title: "Infrastructure Assessment",
        description: "Complete analysis of current systems",
        dueDate: new Date("2024-02-01"),
        status: "completed",
        progress: 100,
        deliverables: ["Assessment Report", "Migration Plan"],
      },
      {
        id: "milestone-2",
        title: "AWS Environment Setup",
        description: "Configure AWS infrastructure and security",
        dueDate: new Date("2024-02-28"),
        status: "completed",
        progress: 100,
        deliverables: ["AWS Environment", "Security Configuration"],
      },
      {
        id: "milestone-3",
        title: "Application Migration",
        description: "Migrate applications to new infrastructure",
        dueDate: new Date("2024-03-30"),
        status: "in-progress",
        progress: 70,
        deliverables: ["Migrated Applications", "Testing Results"],
      },
    ],
    files: [],
    team: [
      {
        id: "team-1",
        name: "Alex Rodriguez",
        role: "Cloud Architect",
        email: "alex@example.com",
      },
      {
        id: "team-2",
        name: "Emma Wilson",
        role: "DevOps Engineer",
        email: "emma@example.com",
      },
    ],
  },
]

export class ClientPortalService {
  static async getClientProjects(clientId: string): Promise<Project[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockProjects.filter((project) => project.clientId === clientId)
  }

  static async getProject(projectId: string): Promise<Project | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockProjects.find((project) => project.id === projectId) || null
  }

  static async getProjectMessages(projectId: string): Promise<Message[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return [
      {
        id: "msg-1",
        projectId,
        senderId: "team-1",
        senderName: "Alex Rodriguez",
        content: "Migration phase 1 completed successfully. All systems are running smoothly on AWS.",
        timestamp: new Date("2024-03-01T10:30:00"),
        type: "text",
        read: true,
      },
      {
        id: "msg-2",
        projectId,
        senderId: "client-1",
        senderName: "Sarah Johnson",
        content: "Great work! When can we expect the next milestone to be completed?",
        timestamp: new Date("2024-03-01T14:15:00"),
        type: "text",
        read: true,
      },
    ]
  }

  static async uploadFile(projectId: string, file: File): Promise<ProjectFile> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      id: `file-${Date.now()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date(),
      uploadedBy: "current-user",
      category: "deliverable",
      url: URL.createObjectURL(file),
      version: 1,
    }
  }

  static async getInvoices(clientId: string): Promise<Invoice[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return [
      {
        id: "invoice-1",
        projectId: "project-1",
        clientId,
        amount: 25000,
        description: "Cloud Infrastructure Migration - Phase 1",
        status: "paid",
        dueDate: new Date("2024-02-15"),
        createdDate: new Date("2024-02-01"),
        paidDate: new Date("2024-02-10"),
        items: [
          {
            id: "item-1",
            description: "Infrastructure Assessment",
            quantity: 1,
            rate: 15000,
            amount: 15000,
          },
          {
            id: "item-2",
            description: "AWS Environment Setup",
            quantity: 1,
            rate: 10000,
            amount: 10000,
          },
        ],
      },
    ]
  }
}
