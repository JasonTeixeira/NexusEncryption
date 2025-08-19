export interface Award {
  id: string
  title: string
  organization: string
  category: string
  year: number
  description: string
  imageUrl?: string
  verificationUrl?: string
  significance: "local" | "national" | "international"
}

export interface Certification {
  id: string
  name: string
  provider: string
  credentialId: string
  issueDate: Date
  expiryDate?: Date
  verificationUrl: string
  badgeUrl?: string
  status: "active" | "expired" | "pending"
  level: "associate" | "professional" | "expert" | "architect"
}

export interface SpeakingEngagement {
  id: string
  title: string
  event: string
  eventType: "conference" | "meetup" | "webinar" | "workshop" | "podcast"
  date: Date
  location: string
  audience: number
  topics: string[]
  recordingUrl?: string
  slidesUrl?: string
  description: string
}

export interface Publication {
  id: string
  title: string
  type: "article" | "blog_post" | "research_paper" | "book" | "whitepaper"
  publisher: string
  publishDate: Date
  url: string
  abstract: string
  tags: string[]
  citations?: number
  views?: number
  coAuthors?: string[]
}

export interface OpenSourceContribution {
  id: string
  projectName: string
  repository: string
  role: "maintainer" | "contributor" | "creator"
  contributions: number
  stars: number
  forks: number
  language: string
  description: string
  lastContribution: Date
}

export interface Testimonial {
  id: string
  author: string
  position: string
  company: string
  content: string
  date: Date
  projectContext?: string
  rating?: number
  verified: boolean
  linkedinUrl?: string
}

export interface MediaMention {
  id: string
  title: string
  publication: string
  type: "interview" | "article" | "podcast" | "video" | "quote"
  date: Date
  url: string
  excerpt: string
  reach?: number
}

// Mock data for demonstration
export const mockAwards: Award[] = [
  {
    id: "award-1",
    title: "Cloud Architect of the Year",
    organization: "Cloud Computing Association",
    category: "Technical Excellence",
    year: 2024,
    description: "Recognized for innovative cloud architecture solutions and thought leadership",
    significance: "international",
    verificationUrl: "https://cloudcomputing.org/awards/2024",
  },
  {
    id: "award-2",
    title: "DevOps Innovation Award",
    organization: "DevOps Institute",
    category: "Innovation",
    year: 2023,
    description: "Outstanding contribution to DevOps practices and automation",
    significance: "national",
  },
]

export const mockCertifications: Certification[] = [
  {
    id: "cert-1",
    name: "AWS Certified Solutions Architect - Professional",
    provider: "Amazon Web Services",
    credentialId: "AWS-PSA-12345",
    issueDate: new Date("2024-01-15"),
    expiryDate: new Date("2027-01-15"),
    verificationUrl: "https://aws.amazon.com/verification",
    status: "active",
    level: "professional",
  },
  {
    id: "cert-2",
    name: "Certified Kubernetes Administrator",
    provider: "Cloud Native Computing Foundation",
    credentialId: "CKA-67890",
    issueDate: new Date("2023-08-20"),
    expiryDate: new Date("2026-08-20"),
    verificationUrl: "https://cncf.io/certification/verify",
    status: "active",
    level: "professional",
  },
]

export const mockSpeakingEngagements: SpeakingEngagement[] = [
  {
    id: "speaking-1",
    title: "Scaling Microservices in the Cloud",
    event: "CloudNative Conference 2024",
    eventType: "conference",
    date: new Date("2024-03-15"),
    location: "San Francisco, CA",
    audience: 1200,
    topics: ["Microservices", "Kubernetes", "Cloud Architecture"],
    description: "Deep dive into scaling strategies for cloud-native applications",
  },
  {
    id: "speaking-2",
    title: "DevOps Best Practices",
    event: "Tech Leaders Meetup",
    eventType: "meetup",
    date: new Date("2024-02-10"),
    location: "Virtual",
    audience: 300,
    topics: ["DevOps", "CI/CD", "Automation"],
    description: "Sharing practical DevOps implementation strategies",
  },
]

export const mockPublications: Publication[] = [
  {
    id: "pub-1",
    title: "Modern Cloud Architecture Patterns",
    type: "article",
    publisher: "IEEE Cloud Computing",
    publishDate: new Date("2024-01-20"),
    url: "https://ieee.org/cloud-patterns",
    abstract: "Comprehensive analysis of emerging cloud architecture patterns and their practical applications",
    tags: ["Cloud Computing", "Architecture", "Patterns"],
    citations: 45,
    views: 2300,
  },
  {
    id: "pub-2",
    title: "Kubernetes Security Best Practices",
    type: "whitepaper",
    publisher: "Cloud Security Alliance",
    publishDate: new Date("2023-11-15"),
    url: "https://cloudsecurityalliance.org/k8s-security",
    abstract: "Detailed guide on securing Kubernetes clusters in production environments",
    tags: ["Kubernetes", "Security", "DevOps"],
    views: 5600,
  },
]

export const mockTestimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    author: "Sarah Johnson",
    position: "CTO",
    company: "TechCorp Solutions",
    content:
      "Exceptional cloud architect who delivered a complex migration project ahead of schedule and under budget. Their expertise in AWS and microservices architecture was invaluable.",
    date: new Date("2024-02-15"),
    projectContext: "Cloud Infrastructure Migration",
    rating: 5,
    verified: true,
  },
  {
    id: "testimonial-2",
    author: "Michael Chen",
    position: "VP Engineering",
    company: "StartupX",
    content:
      "Outstanding technical leadership and deep knowledge of DevOps practices. Helped us scale from startup to enterprise-level infrastructure seamlessly.",
    date: new Date("2024-01-20"),
    projectContext: "DevOps Transformation",
    rating: 5,
    verified: true,
  },
]

export class IndustryRecognitionService {
  static async getAwards(): Promise<Award[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockAwards
  }

  static async getCertifications(): Promise<Certification[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockCertifications
  }

  static async getSpeakingEngagements(): Promise<SpeakingEngagement[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockSpeakingEngagements
  }

  static async getPublications(): Promise<Publication[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockPublications
  }

  static async getTestimonials(): Promise<Testimonial[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockTestimonials
  }

  static async getOpenSourceContributions(): Promise<OpenSourceContribution[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      {
        id: "oss-1",
        projectName: "CloudNative Toolkit",
        repository: "github.com/cloudnative/toolkit",
        role: "maintainer",
        contributions: 247,
        stars: 1200,
        forks: 340,
        language: "Go",
        description: "Comprehensive toolkit for cloud-native application development",
        lastContribution: new Date("2024-03-10"),
      },
      {
        id: "oss-2",
        projectName: "DevOps Automation Scripts",
        repository: "github.com/devops/automation",
        role: "creator",
        contributions: 156,
        stars: 890,
        forks: 210,
        language: "Python",
        description: "Collection of automation scripts for DevOps workflows",
        lastContribution: new Date("2024-03-08"),
      },
    ]
  }

  static getRecognitionScore(): {
    total: number
    breakdown: {
      awards: number
      certifications: number
      speaking: number
      publications: number
      openSource: number
      testimonials: number
    }
  } {
    return {
      total: 92,
      breakdown: {
        awards: 15,
        certifications: 18,
        speaking: 12,
        publications: 20,
        openSource: 15,
        testimonials: 12,
      },
    }
  }
}
