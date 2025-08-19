export interface GuardrailsConfig {
  allowedTopics: string[]
  blockedTopics: string[]
  maxMessageLength: number
  rateLimitPerMinute: number
  requireProfessionalTone: boolean
}

export interface GuardrailsResult {
  allowed: boolean
  reason?: string
  modifiedMessage?: string
  warning?: string
}

export class AIGuardrails {
  private config: GuardrailsConfig
  private messageHistory: Map<string, number[]> = new Map()

  constructor(config: GuardrailsConfig) {
    this.config = config
  }

  // Main guardrails validation
  async validateMessage(message: string, userContext?: any): Promise<GuardrailsResult> {
    // Rate limiting check
    const rateLimitResult = this.checkRateLimit(userContext?.userId || "anonymous")
    if (!rateLimitResult.allowed) {
      return rateLimitResult
    }

    // Message length check
    if (message.length > this.config.maxMessageLength) {
      return {
        allowed: false,
        reason: `Message too long. Maximum ${this.config.maxMessageLength} characters allowed.`,
      }
    }

    // Topic validation
    const topicResult = await this.validateTopic(message)
    if (!topicResult.allowed) {
      return topicResult
    }

    // Content safety check
    const safetyResult = await this.checkContentSafety(message)
    if (!safetyResult.allowed) {
      return safetyResult
    }

    return { allowed: true }
  }

  // Validate if message is about allowed topics
  private async validateTopic(message: string): Promise<GuardrailsResult> {
    const lowerMessage = message.toLowerCase()

    // Check for blocked topics first
    const blockedTopic = this.config.blockedTopics.find((topic) => lowerMessage.includes(topic.toLowerCase()))

    if (blockedTopic) {
      return {
        allowed: false,
        reason: `I can only discuss topics related to Jason's professional work, projects, and technical expertise. Let's talk about cloud architecture, dashboards, or my projects instead!`,
      }
    }

    // Check for allowed topics
    const hasAllowedTopic = this.config.allowedTopics.some(
      (topic) => lowerMessage.includes(topic.toLowerCase()) || this.isRelatedTopic(lowerMessage, topic),
    )

    if (!hasAllowedTopic && !this.isGeneralGreeting(lowerMessage)) {
      return {
        allowed: false,
        reason: `I'm Jason's AI assistant focused on his professional work. I can help you learn about his projects, technical skills, cloud architecture experience, or dashboard development. What would you like to know?`,
      }
    }

    return { allowed: true }
  }

  // Check for content safety
  private async checkContentSafety(message: string): Promise<GuardrailsResult> {
    const lowerMessage = message.toLowerCase()

    const unsafePatterns = [
      "hack",
      "exploit",
      "vulnerability",
      "attack",
      "malware",
      "personal information",
      "private data",
      "password",
      "secret",
      "inappropriate",
      "offensive",
      "harassment",
    ]

    const foundUnsafe = unsafePatterns.find((pattern) => lowerMessage.includes(pattern))

    if (foundUnsafe) {
      return {
        allowed: false,
        reason: `I maintain professional boundaries and can't discuss that topic. Let's focus on Jason's technical expertise and projects instead.`,
      }
    }

    return { allowed: true }
  }

  // Rate limiting implementation
  private checkRateLimit(userId: string): GuardrailsResult {
    const now = Date.now()
    const userMessages = this.messageHistory.get(userId) || []

    // Remove messages older than 1 minute
    const recentMessages = userMessages.filter((timestamp) => now - timestamp < 60000)

    if (recentMessages.length >= this.config.rateLimitPerMinute) {
      return {
        allowed: false,
        reason: `Rate limit exceeded. Please wait a moment before sending another message.`,
      }
    }

    // Update message history
    recentMessages.push(now)
    this.messageHistory.set(userId, recentMessages)

    return { allowed: true }
  }

  // Helper methods
  private isRelatedTopic(message: string, topic: string): boolean {
    const relatedTerms: Record<string, string[]> = {
      cloud: ["aws", "azure", "gcp", "kubernetes", "docker", "serverless", "microservices"],
      dashboard: ["analytics", "monitoring", "metrics", "visualization", "charts"],
      javascript: ["react", "nextjs", "typescript", "node", "frontend"],
      database: ["sql", "postgresql", "supabase", "mongodb", "redis"],
      devops: ["ci/cd", "deployment", "infrastructure", "automation", "pipeline"],
    }

    const related = relatedTerms[topic.toLowerCase()] || []
    return related.some((term) => message.includes(term))
  }

  private isGeneralGreeting(message: string): boolean {
    const greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "help"]
    return greetings.some((greeting) => message.includes(greeting))
  }

  // Response filtering for AI outputs
  async filterResponse(response: string): Promise<string> {
    // Ensure professional tone
    if (this.config.requireProfessionalTone) {
      response = this.ensureProfessionalTone(response)
    }

    // Add context reminders if needed
    if (this.shouldAddContextReminder(response)) {
      response +=
        "\n\nI'm here to help you learn about Jason's technical expertise and projects. Feel free to ask about cloud architecture, dashboard development, or any of his showcased work!"
    }

    return response
  }

  private ensureProfessionalTone(response: string): string {
    // Replace casual language with professional alternatives
    const replacements: Record<string, string> = {
      yeah: "yes",
      nope: "no",
      gonna: "going to",
      wanna: "want to",
      kinda: "somewhat",
      sorta: "somewhat",
    }

    let professionalResponse = response
    Object.entries(replacements).forEach(([casual, professional]) => {
      const regex = new RegExp(`\\b${casual}\\b`, "gi")
      professionalResponse = professionalResponse.replace(regex, professional)
    })

    return professionalResponse
  }

  private shouldAddContextReminder(response: string): boolean {
    return (
      response.length < 100 || !response.toLowerCase().includes("jason") || !response.toLowerCase().includes("project")
    )
  }
}

// Default configuration
export const defaultGuardrailsConfig: GuardrailsConfig = {
  allowedTopics: [
    "cloud",
    "architecture",
    "dashboard",
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "database",
    "supabase",
    "postgresql",
    "devops",
    "kubernetes",
    "docker",
    "aws",
    "monitoring",
    "analytics",
    "performance",
    "security",
    "frontend",
    "backend",
    "api",
    "rest",
    "graphql",
    "microservices",
    "serverless",
    "ci/cd",
    "deployment",
    "project",
    "portfolio",
    "experience",
    "skills",
    "work",
    "development",
    "cyberpunk",
    "terminal",
    "ui",
    "ux",
    "design",
    "accessibility",
  ],
  blockedTopics: [
    "personal life",
    "family",
    "relationships",
    "politics",
    "religion",
    "financial advice",
    "medical advice",
    "legal advice",
    "inappropriate content",
    "private information",
    "passwords",
    "secrets",
    "hacking",
    "illegal activities",
  ],
  maxMessageLength: 1000,
  rateLimitPerMinute: 10,
  requireProfessionalTone: true,
}

// Export singleton instance
export const aiGuardrails = new AIGuardrails(defaultGuardrailsConfig)
