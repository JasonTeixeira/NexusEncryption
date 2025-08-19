"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useTransition } from "@/contexts/transition-context"
import { useSound } from "@/contexts/sound-context"
import { useAccessibility } from "@/components/accessibility-provider"
import ProjectTagFilter from "@/components/project-tag-filter"
import ProjectDetailModal from "@/components/project-detail-modal"

interface Project {
  id: string
  name: string
  status: string
  security?: string
  classification?: string
  threatLevel?: string
  phase?: string
  description: string
  technologies: string[]
  metrics?: [string, string][]
  github?: string
  demo?: string
  tags?: string[]
}

const projects: { [key: string]: Project } = {
  nebula: {
    id: "PROJECT-001-NEBULA",
    name: "Global CDN Infrastructure",
    status: "OPERATIONAL",
    description:
      "Massively distributed content delivery network spanning 12 AWS regions with intelligent routing, auto-scaling, and real-time analytics.",
    technologies: ["AWS CloudFront", "Lambda@Edge", "S3", "Terraform", "Python"],
    metrics: [
      ["Latency:", "12ms"],
      ["Uptime:", "99.99%"],
      ["Traffic:", "500TB/day"],
      ["Saved:", "$47K/mo"],
    ],
    github: "github.com/nexus/nebula-cdn",
    demo: "https://demo.nebula-cdn.dev",
    tags: ["aws", "cdn", "infrastructure", "terraform", "python"],
  },
  phoenix: {
    id: "PROJECT-002-PHOENIX",
    name: "K8s Predictive Auto-Scaler",
    status: "SCALING",
    description:
      "ML-powered predictive scaling system that anticipates traffic patterns using Prophet and scales proactively, reducing costs by 70%.",
    technologies: ["Kubernetes", "Prometheus", "KEDA", "Prophet", "Go"],
    metrics: [
      ["Pods:", "0-10K"],
      ["Response:", "<100ms"],
      ["Cost Cut:", "70%"],
      ["Accuracy:", "94%"],
    ],
    github: "github.com/nexus/phoenix-scaler",
    demo: "https://demo.phoenix-scaler.dev",
    tags: ["kubernetes", "machine-learning", "go", "prometheus", "devops"],
  },
  fortress: {
    id: "PROJECT-003-FORTRESS",
    name: "Zero-Trust Security Mesh",
    status: "SECURE",
    description:
      "Enterprise-grade security infrastructure with mTLS everywhere, real-time threat detection, and automated incident response.",
    technologies: ["Istio", "OPA", "Falco", "Vault", "Python"],
    metrics: [
      ["Breaches:", "0"],
      ["Compliance:", "SOC2"],
      ["Latency:", "+5ms"],
      ["Coverage:", "100%"],
    ],
    github: "github.com/nexus/fortress-security",
    demo: "https://demo.fortress-security.dev",
    tags: ["security", "istio", "python", "zero-trust", "compliance"],
  },
  quantum: {
    id: "PROJECT-004-QUANTUM",
    name: "Distributed ML Pipeline",
    status: "CLASSIFIED",
    description:
      "Petabyte-scale machine learning infrastructure processing 100TB daily across 500 GPU nodes with real-time model serving.",
    technologies: ["Kubeflow", "TensorFlow", "Ray", "Spark", "Python"],
    metrics: [
      ["Data/Day:", "100TB"],
      ["GPUs:", "500"],
      ["Models:", "47"],
      ["Accuracy:", "96.7%"],
    ],
    github: "CLASSIFIED",
    demo: "ACCESS DENIED",
    tags: ["machine-learning", "tensorflow", "python", "big-data", "gpu"],
  },
  atlas: {
    id: "PROJECT-005-ATLAS",
    name: "Multi-Cloud Orchestrator",
    status: "ORCHESTRATING",
    description:
      "Unified control plane managing resources across AWS, GCP, and Azure with intelligent workload placement and cost optimization.",
    technologies: ["Terraform", "Crossplane", "ArgoCD", "Consul", "Go"],
    metrics: [
      ["Clouds:", "3"],
      ["Resources:", "2,847"],
      ["Saved:", "$127K/mo"],
      ["Regions:", "27"],
    ],
    github: "github.com/nexus/atlas-orchestrator",
    demo: "https://demo.atlas-cloud.dev",
    tags: ["multi-cloud", "terraform", "go", "devops", "cost-optimization"],
  },
  hydra: {
    id: "PROJECT-006-HYDRA",
    name: "GraphQL Federation Gateway",
    status: "DEVELOPMENT",
    description:
      "Unified GraphQL API gateway federating 30+ microservices with real-time subscriptions, caching, and automatic schema stitching.",
    technologies: ["Apollo", "GraphQL", "Redis", "Node.js", "TypeScript"],
    metrics: [
      ["Services:", "30+"],
      ["QPS:", "50K"],
      ["P99:", "45ms"],
      ["Cache Hit:", "87%"],
    ],
    github: "github.com/nexus/hydra-gateway",
    demo: "https://staging.hydra-api.dev",
    tags: ["graphql", "nodejs", "typescript", "microservices", "api-gateway"],
  },
  cerberus: {
    id: "PROJECT-007-CERBERUS",
    name: "Chaos Engineering Platform",
    status: "CHAOS_ACTIVE",
    description:
      "Automated chaos engineering platform that continuously tests system resilience by injecting failures and measuring recovery.",
    technologies: ["Chaos Monkey", "Litmus", "Gremlin", "Python", "K8s"],
    metrics: [
      ["Tests/Day:", "500"],
      ["MTTR:", "<30s"],
      ["Coverage:", "95%"],
      ["Incidents:", "-72%"],
    ],
    github: "github.com/nexus/cerberus-chaos",
    demo: "https://demo.cerberus-chaos.dev",
    tags: ["chaos-engineering", "kubernetes", "python", "reliability", "testing"],
  },
  genesis: {
    id: "PROJECT-008-GENESIS",
    name: "Legacy Migration Engine",
    status: "ARCHIVED",
    description:
      "Successfully migrated 200+ legacy applications to cloud-native architecture with zero downtime and 80% cost reduction.",
    technologies: ["Docker", "Jenkins", "Ansible", "Python", "Bash"],
    metrics: [
      ["Apps:", "200+"],
      ["Downtime:", "0min"],
      ["Duration:", "18mo"],
      ["Saved:", "$2M"],
    ],
    github: "github.com/nexus/genesis-migration",
    demo: "No longer available",
    tags: ["migration", "docker", "python", "jenkins", "legacy"],
  },
}

const CyberpunkProjectsTerminal: React.FC = () => {
  const [terminalOutput, setTerminalOutput] = useState<Array<{ type: string; content: string }>>([])
  const [inputValue, setInputValue] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [missionControlStats, setMissionControlStats] = useState({
    activeProjects: 8,
    totalCommits: "42.7K",
    uptime: "99.99%",
    impact: "$8.4M",
    users: "127M",
    responseTime: "12ms",
    deployments: 2847,
    coffee: "∞",
  })
  const [logs, setLogs] = useState<Array<{ time: string; level: string; message: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const terminalBodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { navigateWithTransition } = useTransition()
  const { playCommand, playSuccess, playError } = useSound()
  const { settings } = useAccessibility()

  const safeSettings = settings || {
    highContrast: false,
    fontSize: "medium",
    screenReaderMode: false,
    soundEnabled: true,
  }

  useEffect(() => {
    let filtered = { ...projects }

    // Filter by search term
    if (searchTerm) {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(
          ([key, project]) =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
        ),
      )
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([key, project]) => selectedTags.some((tag) => project.tags?.includes(tag))),
      )
    }

    setFilteredProjects(filtered)
  }, [selectedTags, searchTerm])

  const commands: { [key: string]: () => string } = {
    help: () => `
<span class="highlight">PROJECT COMMAND CENTER</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Navigation:</span>
  list          - List all projects
  status        - Check system status
  monitor       - View live monitoring
  architecture  - Display system architecture

<span class="info">Project Commands:</span>
  demo [name]   - Launch interactive demo
  deploy [name] - Simulate deployment
  metrics [name] - View detailed metrics
  logs [name]   - Stream project logs
  github [name] - Open GitHub repository
  test [name]   - Run test suite
  rollback [name] - Rollback deployment
  
<span class="info">Analysis:</span>
  stats         - Show GitHub statistics
  performance   - Performance analysis
  cost          - Cost breakdown
  impact        - Impact assessment
  radar         - Skills radar chart
  matrix        - Project comparison matrix
  
<span class="info">Special:</span>
  hack [name]   - Attempt to breach project
  chaos         - Trigger chaos engineering
  quantum       - Enter quantum realm
  coffee        - Brew virtual coffee
  inspire       - Get motivated
  clear         - Clear terminal
  home          - Return to main page

<span class="warning">Hidden commands exist. Try to find them!</span>`,

    list: () => {
      let output = '<span class="highlight">PROJECT DIRECTORY</span>\n'
      output += '<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>\n\n'

      for (const [key, project] of Object.entries(projects)) {
        const statusColor =
          project.status === "OPERATIONAL"
            ? "success"
            : project.status === "ARCHIVED"
              ? "dim"
              : project.status === "SECURE"
                ? "info"
                : "warning"
        output += `<span class="info">${key.toUpperCase()}</span>: <span class="${statusColor}">[${project.status}]</span> ${project.name}\n`
      }

      output += '\n<span class="success">8 projects total, 6 active, 1 in development, 1 archived</span>'
      return output
    },

    status: () => `
<span class="highlight">SYSTEM STATUS REPORT</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">CPU Usage:</span> 34%
<span class="info">Memory:</span> 2.1GB / 8GB
<span class="info">Network:</span> 1.2 Gbps
<span class="info">Active Connections:</span> 847
<span class="info">Security Level:</span> MAXIMUM
<span class="info">Threat Status:</span> CLEAR
<span class="info">Last Backup:</span> 2 hours ago
<span class="info">System Uptime:</span> 47 days
<span class="info">Coffee Consumed:</span> ∞`,

    monitor: () => `
<span class="highlight">LIVE MONITORING</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Nebula CDN:</span> Cache hit ratio 94.7% (+2.1%)
<span class="info">Phoenix Scaler:</span> Auto-scaled cluster from 42 to 127 pods
<span class="info">Fortress Security:</span> Blocked 847 malicious requests
<span class="info">Atlas Orchestrator:</span> Optimized workload placement, saved $1.2K
<span class="info">Hydra Gateway:</span> GraphQL federation serving 50K QPS
<span class="info">Cerberus Chaos:</span> Completed resilience test on payment service
<span class="info">System Health:</span> All services operational, 99.99% uptime
<span class="info">Cost Optimization:</span> Monthly savings target exceeded by 15%`,

    architecture: () => `
<span class="highlight">SYSTEM ARCHITECTURE</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Infrastructure:</span> AWS, GCP, Azure
<span class="info">Orchestration:</span> Kubernetes, Terraform
<span class="info">Security:</span> Zero-Trust, mTLS
<span class="info">Data Processing:</span> Spark, TensorFlow
<span class="info">API Gateway:</span> GraphQL Federation
<span class="info">Chaos Engineering:</span> Automated tests, recovery simulations`,

    demo: (name: string) => {
      const project = projects[name.toLowerCase()]
      if (project) {
        return `
<span class="highlight">LAUNCHING DEMO FOR ${project.name}</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Demo URL:</span> ${project.demo}
<span class="info">Opening in secure sandbox environment...</span>
<span class="success">✓ Demo launched successfully</span>`
      } else {
        return `<span class="error">Project ${name} not found.</span>`
      }
    },

    deploy: (name: string) => {
      const project = projects[name.toLowerCase()]
      if (project) {
        return `
<span class="highlight">SIMULATING DEPLOYMENT FOR ${project.name}</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Deployment initiated...</span>
<span class="info">Resources allocated...</span>
<span class="success">✓ Deployment successful</span>`
      } else {
        return `<span class="error">Project ${name} not found.</span>`
      }
    },

    metrics: (name: string) => {
      const project = projects[name.toLowerCase()]
      if (project && project.metrics) {
        let output = `<span class="highlight">METRICS FOR ${project.name}</span>\n`
        output += '<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>\n\n'

        for (const [label, value] of project.metrics) {
          output += `<span class="info">${label}</span>: <span class="success">${value}</span>\n`
        }

        return output
      } else {
        return `<span class="error">Project ${name} not found or has no metrics.</span>`
      }
    },

    logs: (name: string) => {
      const project = projects[name.toLowerCase()]
      if (project) {
        return `
<span class="highlight">STREAMING LOGS FOR ${project.name}</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Logs are streaming...</span>
<span class="info">Use 'clear' to stop streaming.</span>`
      } else {
        return `<span class="error">Project ${name} not found.</span>`
      }
    },

    github: (name: string) => {
      const project = projects[name.toLowerCase()]
      if (project && project.github) {
        return `
<span class="highlight">REPOSITORY FOR ${project.name}</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">URL:</span> ${project.github}
<span class="success">✓ Repository accessible</span>`
      } else if (project) {
        return `<span class="error">Project ${project.name} has a CLASSIFIED repository.</span>`
      } else {
        return `<span class="error">Project ${name} not found.</span>`
      }
    },

    test: (name: string) => {
      const project = projects[name.toLowerCase()]
      if (project) {
        return `
<span class="highlight">RUNNING TEST SUITE FOR ${project.name}</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Tests initiated...</span>
<span class="info">Results pending...</span>`
      } else {
        return `<span class="error">Project ${name} not found.</span>`
      }
    },

    rollback: (name: string) => {
      const project = projects[name.toLowerCase()]
      if (project) {
        return `
<span class="highlight">ROLLING BACK DEPLOYMENT FOR ${project.name}</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Rollback initiated...</span>
<span class="info">Resources being restored...</span>
<span class="success">✓ Rollback successful</span>`
      } else {
        return `<span class="error">Project ${name} not found.</span>`
      }
    },

    stats: () => `
<span class="highlight">GITHUB STATISTICS</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Total Repositories:</span> 8
<span class="info">Open Issues:</span> 12
<span class="info">Pull Requests:</span> 47
<span class="info">Contributors:</span> 127`,

    performance: () => `
<span class="highlight">PERFORMANCE ANALYSIS</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Average Latency:</span> 12ms
<span class="info">Max Uptime:</span> 99.99%
<span class="info">High Traffic Projects:</span> Nebula CDN, Phoenix Scaler
<span class="info">Low Latency Projects:</span> Hydra Gateway, Cerberus Chaos`,

    cost: () => `
<span class="highlight">COST BREAKDOWN</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Total Monthly Savings:</span> $8.4M
<span class="info">High Savings Projects:</span> Nebula CDN, Atlas Orchestrator
<span class="info">Cost Optimization Efforts:</span> Phoenix Scaler, Cerberus Chaos`,

    impact: () => `
<span class="highlight">IMPACT ASSESSMENT</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Total Users Served:</span> 127M
<span class="info">High Impact Projects:</span> Nebula CDN, Atlas Orchestrator
<span class="info">User Growth Projects:</span> Phoenix Scaler, Cerberus Chaos`,

    radar: () => `
<span class="highlight">SKILLS RADAR CHART</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Skills:</span> AWS, Kubernetes, Terraform, Docker, Python, Spark, TensorFlow, Istio, Chaos Engineering, GraphQL
<span class="info">Proficiency Level:</span> Expert`,

    matrix: () => `
<span class="highlight">PROJECT COMPARISON MATRIX</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Nebula CDN:</span> Global CDN, 12 regions, intelligent routing
<span class="info">Phoenix Scaler:</span> Predictive scaling, 70% cost reduction
<span class="info">Fortress Security:</span> Zero-Trust, real-time threat detection
<span class="info">Quantum Pipeline:</span> Petabyte-scale ML, 500 GPUs
<span class="info">Atlas Orchestrator:</span> Multi-cloud management, cost optimization
<span class="info">Hydra Gateway:</span> GraphQL federation, 30+ microservices
<span class="info">Cerberus Chaos:</span> Automated chaos engineering, resilience tests
<span class="info">Genesis Migration:</span> Legacy app migration, cloud-native architecture`,

    hack: (name: string) => {
      const project = projects[name.toLowerCase()]
      if (project) {
        return `
<span class="highlight">ATTEMPTING TO BREACH ${project.name}</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Hacking initiated...</span>
<span class="info">Security protocols engaged...</span>
<span class="error">⚠ ACCESS DENIED</span>`
      } else {
        return `<span class="error">Project ${name} not found.</span>`
      }
    },

    chaos: () => `
<span class="highlight">TRIGGERING CHAOS ENGINEERING</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Chaos engineering initiated...</span>
<span class="info">System resilience being tested...</span>
<span class="warning">⚠ BE CAREFUL - SYSTEMS MAY BECOME UNSTABLE</span>`,

    quantum: () => `
<span class="highlight">ENTERING QUANTUM REALM</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Quantum realm activated...</span>
<span class="info">Exploring the unknown...</span>
<span class="success">✓ Quantum exploration successful</span>`,

    coffee: () => `
<span class="highlight">BREWING VIRTUAL COFFEE</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Coffee brewing initiated...</span>
<span class="info">Enjoy your virtual coffee!</span>
<span class="success">✓ Coffee brewed successfully</span>`,

    inspire: () => `
<span class="highlight">GETTING MOTIVATED</span>
<span class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="info">Motivation boost initiated...</span>
<span class="info">Stay focused and achieve greatness!</span>
<span class="success">✓ Inspiration received</span>`,
  }

  useEffect(() => {
    const initTerminal = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const bootMessages = [
        {
          type: "system",
          content: '<span class="text-green-400">● operations.service - Project Management System</span>',
        },
        { type: "system", content: '<span class="text-green-400 ml-4">Active: active (running) since boot</span>' },
        { type: "system", content: "" },
        {
          type: "command",
          content:
            '<span class="text-green-500">$</span><span class="text-white ml-2">systemctl status operations.service</span>',
        },
        { type: "system", content: '<span class="text-green-400">✓ All systems operational</span>' },
        { type: "system", content: '<span class="text-green-400">✓ Security clearance: AUTHORIZED</span>' },
        { type: "system", content: '<span class="text-green-400">✓ Database synchronized</span>' },
        { type: "system", content: '<span class="text-green-400">✓ 8 active projects detected</span>' },
        { type: "system", content: "" },
      ]

      setTerminalOutput(bootMessages)
      setIsLoading(false)
      inputRef.current?.focus()
    }

    initTerminal()
  }, [])

  useEffect(() => {
    const generateLogs = () => {
      const logMessages = [
        "Nebula CDN: Cache hit ratio 94.7% (+2.1%)",
        "Phoenix Scaler: Auto-scaled cluster from 42 to 127 pods",
        "Fortress Security: Blocked 847 malicious requests",
        "Atlas Orchestrator: Optimized workload placement, saved $1.2K",
        "Hydra Gateway: GraphQL federation serving 50K QPS",
        "Cerberus Chaos: Completed resilience test on payment service",
        "System Health: All services operational, 99.99% uptime",
        "Cost Optimization: Monthly savings target exceeded by 15%",
      ]

      const levels = ["info", "success", "warning"]
      const newLog = {
        time: new Date().toLocaleTimeString(),
        level: levels[Math.floor(Math.random() * levels.length)],
        message: logMessages[Math.floor(Math.random() * logMessages.length)],
      }

      setLogs((prev) => [...prev.slice(-20), newLog])
    }

    const interval = setInterval(generateLogs, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleCommand = useCallback(
    (cmd: string) => {
      const [command, ...args] = cmd.toLowerCase().trim().split(" ")

      setHasUserInteracted(true)

      if (safeSettings.soundEnabled) {
        playCommand()
      }

      setTerminalOutput((prev) => [
        ...prev,
        {
          type: "command",
          content: `<span class="text-green-500">$</span><span class="text-white ml-2">${cmd}</span>`,
        },
        { type: "output", content: "" },
      ])

      if (commands[command]) {
        const response = commands[command](...args)
        setTerminalOutput((prev) => [...prev, { type: "response", content: response }])
        if (safeSettings.soundEnabled) {
          playSuccess()
        }
      } else {
        switch (command) {
          case "home":
            navigateWithTransition("/", "HOME")
            break
          case "about":
            navigateWithTransition("/about", "ABOUT")
            break
          case "skills":
            navigateWithTransition("/skills", "SKILLS")
            break
          case "contact":
            navigateWithTransition("/contact", "CONTACT")
            break
          case "dashboards":
            navigateWithTransition("/dashboards", "DASHBOARDS")
            break
          case "clear":
            setTerminalOutput([])
            if (safeSettings.soundEnabled) {
              playSuccess()
            }
            break
          default:
            setTerminalOutput((prev) => [
              ...prev,
              { type: "error", content: `<span class="text-red-400">Command not found: ${command}</span>` },
              { type: "error", content: `<span class="text-gray-400">Type 'help' for available commands</span>` },
            ])
            if (safeSettings.soundEnabled) {
              playError()
            }
        }
      }
    },
    [navigateWithTransition, playCommand, playSuccess, playError, safeSettings.soundEnabled],
  )

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (inputValue.trim()) {
        setCommandHistory((prev) => [...prev, inputValue])
        setHistoryIndex(0)
        handleCommand(inputValue)
        setInputValue("")
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length)
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[commandHistory.length - newIndex] || "")
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInputValue(newIndex === 0 ? "" : commandHistory[commandHistory.length - newIndex] || "")
      }
    }
  }

  const handleProjectClick = (projectKey: string, project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
    playCommand()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
    playSuccess()
  }

  useEffect(() => {
    if (terminalBodyRef.current && hasUserInteracted) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [terminalOutput, hasUserInteracted])

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-green-400 font-mono relative overflow-hidden">
      <style jsx>{`
        .scanlines {
          background: linear-gradient(transparent 50%, rgba(0, 255, 136, 0.03) 50%);
          background-size: 100% 4px;
          animation: scanlines 0.1s linear infinite;
        }
        
        .crt {
          background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
        }
        
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        
        @keyframes glitch-in {
          0% { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes type-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes scan-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-500 { animation-delay: 0.5s; }
        .animate-delay-700 { animation-delay: 0.7s; }
        .animate-delay-900 { animation-delay: 0.9s; }
        .animate-delay-1100 { animation-delay: 1.1s; }
        .animate-delay-1300 { animation-delay: 1.3s; }
        .animate-delay-1500 { animation-delay: 1.5s; }
        .animate-delay-1700 { animation-delay: 1.7s; }
        .animate-delay-2000 { animation-delay: 2s; }
        .animate-delay-2200 { animation-delay: 2.2s; }
        .animate-delay-2500 { animation-delay: 2.5s; }
        .animate-delay-2700 { animation-delay: 2.7s; }
        .animate-delay-3000 { animation-delay: 3s; }
        .animate-delay-3200 { animation-delay: 3.2s; }
        .animate-delay-3500 { animation-delay: 3.5s; }
        
        .prompt { color: #00FF88; }
        .command { color: #FFFFFF; }
        .output { color: #808080; }
        .success { color: #50FA7B; }
        .error { color: #FF0080; }
        .warning { color: #FFD700; }
        .info { color: #8BE9FD; }
        .highlight { color: #00D9FF; }
        .dim { color: #606060; }
      `}</style>

      <div className="scanlines fixed inset-0 pointer-events-none z-[2]" />
      <div className="crt fixed inset-0 pointer-events-none z-[3]" />

      <div className="h-screen flex flex-col relative z-[1]">
        <div className="bg-[#1C1C24] px-4 py-3 flex items-center justify-between border-b border-green-500/20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C940]" />
          </div>

          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => navigateWithTransition("/", "HOME")}
              className="text-gray-500 hover:text-cyan-400 transition-colors"
            >
              <span className="text-green-500">$ </span>home
            </button>
            <button
              onClick={() => navigateWithTransition("/about", "ABOUT")}
              className="text-gray-500 hover:text-cyan-400 transition-colors"
            >
              <span className="text-green-500">$ </span>about
            </button>
            <span className="text-cyan-400">
              <span className="text-green-500">$ </span>projects
              <span className="animate-pulse">_</span>
            </span>
            <button
              onClick={() => navigateWithTransition("/skills", "SKILLS")}
              className="text-gray-500 hover:text-cyan-400 transition-colors"
            >
              <span className="text-green-500">$ </span>skills
            </button>
            <button
              onClick={() => navigateWithTransition("/dashboards", "DASHBOARDS")}
              className="text-gray-500 hover:text-cyan-400 transition-colors"
            >
              <span className="text-green-500">$ </span>dashboards
            </button>
            <button
              onClick={() => navigateWithTransition("/contact", "CONTACT")}
              className="text-gray-500 hover:text-cyan-400 transition-colors"
            >
              <span className="text-green-500">$ </span>contact
            </button>
          </nav>

          <div className="text-gray-500 text-xs uppercase tracking-wider">NEXUS@ARCHITECT:~/projects</div>
        </div>

        <div
          ref={terminalBodyRef}
          className="flex-1 overflow-y-auto p-8"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#00FF88 rgba(0, 255, 136, 0.05)",
          }}
        >
          <div className="max-w-[1400px] mx-auto">
            <pre className="text-cyan-400 text-[10px] leading-tight mb-8 opacity-0 animate-[glitch-in_0.5s_forwards]">
              {` ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗
 ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
 ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗
 ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║
 ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║
 ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝
                    [TACTICAL OPERATIONS CENTER v5.2.1]`}
            </pre>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 p-6 bg-gradient-to-br from-green-500/5 to-cyan-500/5 border border-green-500/20 relative opacity-0 animate-[type-in_0.1s_forwards] animate-delay-900">
              <div className="absolute -top-2 left-4 bg-[#0A0A0F] px-2 text-green-500 text-xs tracking-wider">
                MISSION CONTROL
              </div>

              {Object.entries({
                "Active Projects": missionControlStats.activeProjects,
                "Total Commits": missionControlStats.totalCommits,
                "Avg Uptime": missionControlStats.uptime,
                "Value Created": missionControlStats.impact,
                "Users Served": missionControlStats.users,
                "Avg Response": missionControlStats.responseTime,
                Deployments: missionControlStats.deployments.toLocaleString(),
                "Coffee Consumed": missionControlStats.coffee,
              }).map(([label, value]) => (
                <div
                  key={label}
                  className="text-center p-3 bg-black/50 border border-green-500/10 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-[scan_3s_infinite]" />
                  <div className="text-2xl font-bold text-cyan-400">{value}</div>
                  <div className="text-xs text-gray-600 uppercase">{label}</div>
                </div>
              ))}
            </div>

            <div className="mb-8 opacity-0 animate-[type-in_0.1s_forwards] animate-delay-1100">
              <ProjectTagFilter
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                onSearchChange={setSearchTerm}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8 opacity-0 animate-[type-in_0.1s_forwards] animate-delay-1300">
              {Object.entries(filteredProjects).map(([key, project], index) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(key, project)}
                  className="border border-green-500/30 p-6 bg-green-500/5 relative transition-all hover:bg-green-500/10 hover:border-green-500 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:-translate-y-0.5 hover:scale-[1.02] overflow-hidden cursor-pointer group"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-[scan-line_3s_linear_infinite]" />

                  <div
                    className={`absolute top-4 right-4 px-3 py-1 text-xs uppercase tracking-wider animate-pulse ${project.status === "OPERATIONAL" ? "bg-green-500/10 border-green-500 text-green-400" : project.status === "SCALING" ? "bg-green-500/10 border-green-500 text-green-400" : project.status === "CLASSIFIED" ? "bg-pink-500/10 border-pink-500 text-pink-500" : "bg-gray-500/10 border-gray-500 text-gray-500"}`}
                  >
                    {project.status === "OPERATIONAL" && "● "}
                    {project.status === "SCALING" && "⚡ "}
                    {project.status === "CLASSIFIED" && "⚠ "}
                    {project.status === "ARCHIVED" && "■ "}
                    {project.status}
                  </div>

                  <div className="text-gray-600 text-xs mb-2">{project.id}</div>
                  <div className="text-cyan-400 text-xl font-bold mb-2 group-hover:text-white transition-colors">
                    {project.name}
                  </div>
                  <div className="text-gray-500 text-sm mb-4 group-hover:text-gray-300 transition-colors">
                    {project.description}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {project.metrics?.map(([label, value]) => (
                      <div key={label} className="flex justify-between text-xs">
                        <span className="text-gray-600 group-hover:text-gray-400 transition-colors">{label}</span>
                        <span className="text-green-500 font-semibold group-hover:text-green-400 transition-colors">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1 py-0.5 bg-gray-500/10 border border-gray-500/30 text-xs text-gray-400 group-hover:text-gray-300 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="absolute bottom-4 right-4 text-gray-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Click for detailed analysis →
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))}
            </div>

            {Object.keys(filteredProjects).length === 0 && (
              <div className="text-center py-12 opacity-0 animate-[type-in_0.1s_forwards] animate-delay-1500">
                <div className="text-gray-500 font-mono text-lg mb-2">No projects found</div>
                <div className="text-gray-600 font-mono text-sm">Try adjusting your filters or search terms</div>
              </div>
            )}

            <div className="bg-black/80 border border-green-500/20 p-4 my-8 h-[300px] overflow-y-auto opacity-0 animate-[type-in_0.1s_forwards] animate-delay-1700">
              <div className="text-green-500 font-semibold mb-4 uppercase text-sm">🔴 LIVE OPERATIONS FEED</div>
              <div>
                {logs.map((log, index) => (
                  <div key={index} className="text-xs mb-1 opacity-0 animate-[fade-in_0.3s_forwards]">
                    <span className="text-gray-600">{log.time}</span>{" "}
                    <span
                      className={`
                      ${log.level === "info" && "text-cyan-400"}
                      ${log.level === "success" && "text-green-400"}
                      ${log.level === "warning" && "text-yellow-400"}
                      ${log.level === "error" && "text-red-400"}
                    `}
                    >
                      [${log.level.toUpperCase()}]
                    </span>{" "}
                    {log.message}
                  </div>
                ))}
              </div>
            </div>

            {terminalOutput.map((line, index) => (
              <div key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line.content }} />
            ))}

            <div className="flex items-center mt-8 pt-8 border-t border-green-500/10 opacity-0 animate-[type-in_0.1s_forwards] animate-delay-3500">
              <span className="text-green-500">$</span>
              <input
                ref={inputRef}
                type="text"
                className="bg-transparent border-none text-white font-mono flex-1 outline-none ml-2"
                placeholder="Type 'help' for commands, or try 'demo nebula', 'deploy phoenix', 'list'..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
              />
              <span className="inline-block w-2.5 h-5 bg-green-500 animate-pulse ml-0.5" />
            </div>
          </div>
        </div>
      </div>
      <ProjectDetailModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

export default CyberpunkProjectsTerminal
