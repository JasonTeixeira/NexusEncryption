"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import CyberpunkTerminalMenu from "./cyberpunk-terminal-menu"

interface Skill {
  name: string
  level: number
  category: string
  description: string
  abbr: string
  id: string
}

interface SkillNode {
  id: string
  icon: string
  name: string
  level: number | string
  status: "mastered" | "learning" | "locked"
}

interface Certification {
  icon: string
  name: string
  date: string
}

export default function CyberpunkSkillsTerminal() {
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ type: "command" | "output"; content: React.ReactNode }>
  >([])
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [characterStats, setCharacterStats] = useState({
    level: 42,
    xp: "847K",
    skills: 127,
    mastered: 47,
    certs: 12,
    power: 9001,
  })
  const [xpProgress, setXpProgress] = useState(73)
  const [skillMatrix, setSkillMatrix] = useState<Array<{ active: boolean; text: string; skillKey?: string }>>([])
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const skills: Record<string, Skill & { color: string; icon: string }> = {
    // Cloud & Infrastructure (15 skills)
    aws: {
      name: "AWS",
      level: 95,
      category: "cloud",
      description: "Amazon Web Services mastery - EC2, Lambda, S3, RDS, CloudFormation, EKS, Route53",
      color: "from-orange-500 to-yellow-500",
      icon: "☁️",
      abbr: "AWS",
      id: "aws",
    },
    gcp: {
      name: "Google Cloud",
      level: 80,
      category: "cloud",
      description: "Google Cloud Platform expertise - GKE, Cloud Functions, BigQuery, Pub/Sub",
      color: "from-blue-500 to-green-500",
      icon: "🌐",
      abbr: "GCP",
      id: "gcp",
    },
    azure: {
      name: "Azure",
      level: 70,
      category: "cloud",
      description: "Microsoft Azure proficiency - AKS, Functions, Cosmos DB, Service Bus",
      color: "from-blue-600 to-cyan-500",
      icon: "⛅",
      abbr: "AZR",
      id: "azure",
    },
    terraform: {
      name: "Terraform",
      level: 95,
      category: "infrastructure",
      description: "Infrastructure as Code expert - Multi-cloud deployments, Modules, State management",
      color: "from-purple-600 to-pink-500",
      icon: "🏗️",
      abbr: "TF",
      id: "terraform",
    },
    ansible: {
      name: "Ansible",
      level: 80,
      category: "infrastructure",
      description: "Configuration management - Playbooks, Roles, Automation, Tower",
      color: "from-red-500 to-orange-500",
      icon: "⚙️",
      abbr: "ANS",
      id: "ansible",
    },
    cloudformation: {
      name: "CloudFormation",
      level: 85,
      category: "infrastructure",
      description: "AWS Infrastructure as Code - Templates, Stacks, Resources, Nested stacks",
      color: "from-orange-600 to-red-500",
      icon: "📋",
      abbr: "CF",
      id: "cloudformation",
    },
    pulumi: {
      name: "Pulumi",
      level: 42,
      category: "infrastructure",
      description: "Modern Infrastructure as Code - TypeScript, Python, Go, Real programming languages",
      color: "from-purple-500 to-indigo-500",
      icon: "🎯",
      abbr: "PLM",
      id: "pulumi",
    },
    cdk: {
      name: "AWS CDK",
      level: 78,
      category: "infrastructure",
      description: "Cloud Development Kit - TypeScript/Python infrastructure, Constructs",
      color: "from-orange-500 to-purple-500",
      icon: "🔧",
      abbr: "CDK",
      id: "cdk",
    },
    crossplane: {
      name: "Crossplane",
      level: 65,
      category: "infrastructure",
      description: "Kubernetes-native infrastructure management - Compositions, Claims",
      color: "from-blue-500 to-purple-500",
      icon: "🌉",
      abbr: "XP",
      id: "crossplane",
    },
    consul: {
      name: "Consul",
      level: 72,
      category: "infrastructure",
      description: "Service mesh and service discovery - Connect, KV store, Health checks",
      color: "from-pink-500 to-red-500",
      icon: "🏛️",
      abbr: "CSL",
      id: "consul",
    },
    vault: {
      name: "HashiCorp Vault",
      level: 80,
      category: "security",
      description: "Secrets management - Dynamic secrets, PKI, Encryption as a service",
      color: "from-indigo-500 to-purple-500",
      icon: "🔐",
      abbr: "VLT",
      id: "vault",
    },
    nomad: {
      name: "Nomad",
      level: 45,
      category: "infrastructure",
      description: "HashiCorp workload orchestrator - Jobs, Allocation, Multi-region",
      color: "from-green-500 to-teal-500",
      icon: "🏃",
      abbr: "NMD",
      id: "nomad",
    },
    packer: {
      name: "Packer",
      level: 68,
      category: "infrastructure",
      description: "Image building automation - AMIs, Docker images, Multi-cloud",
      color: "from-blue-400 to-green-400",
      icon: "📦",
      abbr: "PKR",
      id: "packer",
    },
    waypoint: {
      name: "Waypoint",
      level: 35,
      category: "infrastructure",
      description: "Application deployment - Build, Deploy, Release workflow",
      color: "from-purple-400 to-pink-400",
      icon: "🛤️",
      abbr: "WP",
      id: "waypoint",
    },
    boundary: {
      name: "Boundary",
      level: 40,
      category: "security",
      description: "Secure remote access - Identity-based access, Zero trust",
      color: "from-gray-500 to-blue-500",
      icon: "🚪",
      abbr: "BND",
      id: "boundary",
    },

    // Container & Orchestration (12 skills)
    kubernetes: {
      name: "Kubernetes",
      level: 92,
      category: "containers",
      description: "Container orchestration expert - Deployments, Services, Ingress, CRDs, Operators",
      color: "from-purple-500 to-blue-500",
      icon: "☸️",
      abbr: "K8S",
      id: "kubernetes",
    },
    docker: {
      name: "Docker",
      level: 90,
      category: "containers",
      description: "Containerization specialist - Multi-stage builds, Docker Compose, Swarm",
      color: "from-blue-500 to-purple-500",
      icon: "🐳",
      abbr: "DCR",
      id: "docker",
    },
    helm: {
      name: "Helm",
      level: 85,
      category: "containers",
      description: "Kubernetes package manager - Charts, Templates, Releases, Hooks",
      color: "from-blue-400 to-cyan-500",
      icon: "⎈",
      abbr: "HLM",
      id: "helm",
    },
    istio: {
      name: "Istio",
      level: 75,
      category: "containers",
      description: "Service mesh - Traffic management, Security, Observability, Envoy",
      color: "from-teal-500 to-blue-500",
      icon: "🕸️",
      abbr: "IST",
      id: "istio",
    },
    linkerd: {
      name: "Linkerd",
      level: 60,
      category: "containers",
      description: "Lightweight service mesh - mTLS, Traffic splitting, Observability",
      color: "from-green-400 to-blue-400",
      icon: "🔗",
      abbr: "LNK",
      id: "linkerd",
    },
    rancher: {
      name: "Rancher",
      level: 60,
      category: "containers",
      description: "Kubernetes management platform - Multi-cluster, RBAC, Catalog",
      color: "from-blue-600 to-green-500",
      icon: "🤠",
      abbr: "RNC",
      id: "rancher",
    },
    openshift: {
      name: "OpenShift",
      level: 55,
      category: "containers",
      description: "Enterprise Kubernetes - Routes, BuildConfigs, DeploymentConfigs",
      color: "from-red-600 to-orange-500",
      icon: "🔴",
      abbr: "OCP",
      id: "openshift",
    },
    containerd: {
      name: "containerd",
      level: 70,
      category: "containers",
      description: "Container runtime - CRI implementation, Image management",
      color: "from-gray-500 to-blue-500",
      icon: "📦",
      abbr: "CTD",
      id: "containerd",
    },
    crio: {
      name: "CRI-O",
      level: 50,
      category: "containers",
      description: "Lightweight container runtime - OCI-compatible, Kubernetes-focused",
      color: "from-orange-400 to-red-400",
      icon: "⚙️",
      abbr: "CRO",
      id: "crio",
    },
    podman: {
      name: "Podman",
      level: 65,
      category: "containers",
      description: "Daemonless container engine - Rootless containers, Pod management",
      color: "from-purple-400 to-pink-400",
      icon: "🐙",
      abbr: "PDM",
      id: "podman",
    },
    buildah: {
      name: "Buildah",
      level: 45,
      category: "containers",
      description: "Container image building - OCI images, Scriptable builds",
      color: "from-green-500 to-yellow-500",
      icon: "🔨",
      abbr: "BLD",
      id: "buildah",
    },
    skopeo: {
      name: "Skopeo",
      level: 40,
      category: "containers",
      description: "Container image operations - Copy, Inspect, Delete images",
      color: "from-blue-400 to-purple-400",
      icon: "🔍",
      abbr: "SKP",
      id: "skopeo",
    },

    // Programming Languages (15 skills)
    python: {
      name: "Python",
      level: 90,
      category: "programming",
      description: "Python programming master - Django, FastAPI, Data Science, ML, AsyncIO",
      color: "from-yellow-500 to-green-500",
      icon: "🐍",
      abbr: "PY",
      id: "python",
    },
    go: {
      name: "Go",
      level: 75,
      category: "programming",
      description: "Golang developer - Microservices, CLI tools, High performance, Goroutines",
      color: "from-cyan-500 to-blue-500",
      icon: "🔷",
      abbr: "GO",
      id: "go",
    },
    javascript: {
      name: "JavaScript",
      level: 85,
      category: "programming",
      description: "Full-stack JavaScript - React, Node.js, TypeScript, Next.js, Express",
      color: "from-yellow-400 to-orange-500",
      icon: "⚡",
      abbr: "JS",
      id: "javascript",
    },
    typescript: {
      name: "TypeScript",
      level: 88,
      category: "programming",
      description: "Type-safe JavaScript - Interfaces, Generics, Advanced types, Decorators",
      color: "from-blue-500 to-indigo-500",
      icon: "📘",
      abbr: "TS",
      id: "typescript",
    },
    bash: {
      name: "Bash",
      level: 95,
      category: "programming",
      description: "Shell scripting wizard - Automation, System administration, Complex scripts",
      color: "from-gray-500 to-green-500",
      icon: "💻",
      abbr: "SH",
      id: "bash",
    },
    rust: {
      name: "Rust",
      level: 35,
      category: "programming",
      description: "Systems programming - Memory safety, Performance, Concurrency, WebAssembly",
      color: "from-orange-600 to-red-600",
      icon: "🦀",
      abbr: "RS",
      id: "rust",
    },
    java: {
      name: "Java",
      level: 70,
      category: "programming",
      description: "Enterprise Java - Spring Boot, Microservices, JVM optimization, Maven",
      color: "from-red-500 to-orange-500",
      icon: "☕",
      abbr: "JAVA",
      abbr: "JV",
      id: "java",
    },
    csharp: {
      name: "C#",
      level: 60,
      category: "programming",
      description: ".NET development - ASP.NET Core, Entity Framework, Azure integration",
      color: "from-purple-500 to-blue-500",
      icon: "🔷",
      abbr: "C#",
      id: "csharp",
    },
    cpp: {
      name: "C++",
      level: 45,
      category: "programming",
      description: "Systems programming - Performance optimization, Memory management",
      color: "from-blue-600 to-purple-600",
      icon: "⚡",
      abbr: "C++",
      id: "cpp",
    },
    ruby: {
      name: "Ruby",
      level: 55,
      category: "programming",
      description: "Ruby on Rails - Web development, Metaprogramming, Gems",
      color: "from-red-500 to-pink-500",
      icon: "💎",
      abbr: "RB",
      id: "ruby",
    },
    php: {
      name: "PHP",
      level: 50,
      category: "programming",
      description: "Web development - Laravel, Symfony, Composer, Modern PHP",
      color: "from-purple-400 to-blue-400",
      icon: "🐘",
      abbr: "PHP",
      id: "php",
    },
    scala: {
      name: "Scala",
      level: 40,
      category: "programming",
      description: "Functional programming - Akka, Spark, JVM ecosystem",
      color: "from-red-600 to-orange-600",
      icon: "🎭",
      abbr: "SC",
      id: "scala",
    },
    kotlin: {
      name: "Kotlin",
      level: 35,
      category: "programming",
      description: "Modern JVM language - Android development, Coroutines",
      color: "from-orange-500 to-purple-500",
      icon: "🎯",
      abbr: "KT",
      id: "kotlin",
    },
    swift: {
      name: "Swift",
      level: 30,
      category: "programming",
      description: "iOS development - SwiftUI, Combine, Server-side Swift",
      color: "from-orange-400 to-red-400",
      icon: "🦉",
      abbr: "SW",
      id: "swift",
    },
    lua: {
      name: "Lua",
      level: 25,
      category: "programming",
      description: "Embedded scripting - Nginx, Redis modules, Game development",
      color: "from-blue-400 to-cyan-400",
      icon: "🌙",
      abbr: "LUA",
      id: "lua",
    },

    // Databases (12 skills)
    postgresql: {
      name: "PostgreSQL",
      level: 90,
      category: "database",
      description: "Advanced PostgreSQL - Complex queries, Performance tuning, Extensions, JSONB",
      color: "from-blue-600 to-indigo-600",
      icon: "🐘",
      abbr: "PG",
      id: "postgresql",
    },
    mongodb: {
      name: "MongoDB",
      level: 75,
      category: "database",
      description: "NoSQL document database - Aggregation, Indexing, Sharding, Atlas",
      color: "from-green-600 to-teal-600",
      icon: "🍃",
      abbr: "MDB",
      id: "mongodb",
    },
    redis: {
      name: "Redis",
      level: 85,
      category: "database",
      description: "In-memory data store - Caching, Pub/Sub, Data structures, Clustering",
      color: "from-red-500 to-orange-500",
      icon: "💎",
      abbr: "RDS",
      id: "redis",
    },
    elasticsearch: {
      name: "Elasticsearch",
      level: 80,
      category: "database",
      description: "Search and analytics engine - Full-text search, Aggregations, Kibana",
      color: "from-yellow-500 to-green-500",
      icon: "🔍",
      abbr: "ELS",
      id: "elasticsearch",
    },
    cassandra: {
      name: "Cassandra",
      level: 55,
      category: "database",
      description: "Distributed NoSQL database - High availability, Scalability, CQL",
      color: "from-purple-500 to-blue-500",
      icon: "🏛️",
      abbr: "CSS",
      id: "cassandra",
    },
    dynamodb: {
      name: "DynamoDB",
      level: 70,
      category: "database",
      description: "AWS NoSQL database - Serverless, Auto-scaling, Global tables, Streams",
      color: "from-orange-500 to-red-500",
      icon: "⚡",
      abbr: "DDB",
      id: "dynamodb",
    },
    mysql: {
      name: "MySQL",
      level: 75,
      category: "database",
      description: "Relational database - Replication, Clustering, Performance optimization",
      color: "from-blue-500 to-orange-500",
      icon: "🐬",
      abbr: "SQL",
      id: "mysql",
    },
    mariadb: {
      name: "MariaDB",
      level: 65,
      category: "database",
      description: "MySQL fork - Galera clustering, ColumnStore, Enhanced features",
      color: "from-blue-400 to-green-400",
      icon: "🌊",
      abbr: "MDB",
      id: "mariadb",
    },
    cockroachdb: {
      name: "CockroachDB",
      level: 45,
      category: "database",
      description: "Distributed SQL database - ACID transactions, Horizontal scaling",
      color: "from-green-500 to-blue-500",
      icon: "🪳",
      abbr: "CDB",
      id: "cockroachdb",
    },
    neo4j: {
      name: "Neo4j",
      level: 40,
      category: "database",
      description: "Graph database - Cypher queries, Relationships, Graph algorithms",
      color: "from-blue-500 to-green-500",
      icon: "🕸️",
      abbr: "N4J",
      id: "neo4j",
    },
    influxdb: {
      name: "InfluxDB",
      level: 60,
      category: "database",
      description: "Time-series database - Metrics, IoT data, Flux queries, Telegraf",
      color: "from-purple-400 to-blue-400",
      icon: "📈",
      abbr: "IDB",
      id: "influxdb",
    },
    timescaledb: {
      name: "TimescaleDB",
      level: 50,
      category: "database",
      description: "PostgreSQL extension for time-series - Hypertables, Compression",
      color: "from-orange-400 to-red-400",
      icon: "⏰",
      abbr: "TDB",
      id: "timescaledb",
    },

    // Monitoring & Observability (10 skills)
    prometheus: {
      name: "Prometheus",
      level: 85,
      category: "monitoring",
      description: "Metrics and monitoring - PromQL, Alerting, Time-series DB, Exporters",
      color: "from-orange-500 to-red-500",
      icon: "📊",
      abbr: "PRO",
      id: "prometheus",
    },
    grafana: {
      name: "Grafana",
      level: 88,
      category: "monitoring",
      description: "Visualization expert - Dashboards, Alerting, Data sources, Plugins",
      color: "from-orange-400 to-pink-500",
      icon: "📈",
      abbr: "GRA",
      id: "grafana",
    },
    jaeger: {
      name: "Jaeger",
      level: 75,
      category: "monitoring",
      description: "Distributed tracing - Request tracking, Performance analysis, OpenTelemetry",
      color: "from-blue-500 to-purple-500",
      icon: "🔍",
      abbr: "JAE",
      id: "jaeger",
    },
    zipkin: {
      name: "Zipkin",
      level: 60,
      category: "monitoring",
      description: "Distributed tracing system - Latency analysis, Service dependencies",
      color: "from-green-400 to-blue-400",
      icon: "📍",
      abbr: "ZIP",
      id: "zipkin",
    },
    datadog: {
      name: "Datadog",
      level: 78,
      category: "monitoring",
      description: "Application monitoring - APM, Infrastructure, Logs, Synthetic monitoring",
      color: "from-purple-500 to-pink-500",
      icon: "🐕",
      abbr: "DTD",
      id: "datadog",
    },
    newrelic: {
      name: "New Relic",
      level: 65,
      category: "monitoring",
      description: "Application performance monitoring - Real user monitoring, Alerts",
      color: "from-green-500 to-teal-500",
      icon: "📡",
      abbr: "NRL",
      id: "newrelic",
    },
    splunk: {
      name: "Splunk",
      level: 70,
      category: "monitoring",
      description: "Log analysis platform - Search, Reporting, Machine learning, SIEM",
      color: "from-green-600 to-orange-500",
      icon: "🔍",
      abbr: "SPL",
      id: "splunk",
    },
    fluentd: {
      name: "Fluentd",
      level: 72,
      category: "monitoring",
      description: "Log collection and forwarding - Plugins, Routing, Buffer management",
      color: "from-blue-400 to-cyan-400",
      icon: "💧",
      abbr: "FLD",
      id: "fluentd",
    },
    logstash: {
      name: "Logstash",
      level: 68,
      category: "monitoring",
      description: "Data processing pipeline - Input, Filter, Output plugins, Grok patterns",
      color: "from-yellow-500 to-orange-500",
      icon: "📋",
      abbr: "LSH",
      id: "logstash",
    },
    otel: {
      name: "OpenTelemetry",
      level: 65,
      category: "monitoring",
      description: "Observability framework - Traces, Metrics, Logs, Auto-instrumentation",
      color: "from-purple-400 to-blue-400",
      icon: "🔭",
      abbr: "OTL",
      id: "otel",
    },

    // Security & Compliance (8 skills)
    opa: {
      name: "Open Policy Agent",
      level: 72,
      category: "security",
      description: "Policy as Code - Authorization, Compliance, Governance, Rego language",
      color: "from-green-600 to-teal-500",
      icon: "📜",
      abbr: "OPA",
      id: "opa",
    },
    zerotrust: {
      name: "Zero Trust",
      level: 85,
      category: "security",
      description: "Zero Trust Architecture - Identity verification, Least privilege, Continuous validation",
      color: "from-gray-600 to-blue-600",
      icon: "🛡️",
      abbr: "ZTS",
      id: "zerotrust",
    },
    falco: {
      name: "Falco",
      level: 68,
      category: "security",
      description: "Runtime security monitoring - Threat detection, Compliance, Kubernetes security",
      color: "from-red-500 to-pink-500",
      icon: "🦅",
      abbr: "FLC",
      id: "falco",
    },
    soc2: {
      name: "SOC2",
      level: 90,
      category: "security",
      description: "Security compliance framework - Controls, Auditing, Governance, Trust principles",
      color: "from-green-500 to-blue-500",
      icon: "✅",
      abbr: "SC2",
      id: "soc2",
    },
    ebpf: {
      name: "eBPF",
      level: 42,
      category: "security",
      description: "Extended Berkeley Packet Filter - Kernel programming, Observability, Security",
      color: "from-purple-600 to-pink-600",
      icon: "🔍",
      abbr: "EBPF",
      id: "ebpf",
    },
    cilium: {
      name: "Cilium",
      level: 55,
      category: "security",
      description: "eBPF-based networking and security - CNI, Network policies, Service mesh",
      color: "from-yellow-400 to-orange-400",
      icon: "🐝",
      abbr: "CLM",
      id: "cilium",
    },
    calico: {
      name: "Calico",
      level: 70,
      category: "security",
      description: "Kubernetes networking - Network policies, BGP routing, Security",
      color: "from-orange-500 to-red-500",
      icon: "🔥",
      abbr: "CAL",
      id: "calico",
    },
    aqua: {
      name: "Aqua Security",
      level: 50,
      category: "security",
      description: "Container security platform - Image scanning, Runtime protection, Compliance",
      color: "from-blue-500 to-cyan-500",
      icon: "🌊",
      abbr: "AQA",
      id: "aqua",
    },

    // DevOps & CI/CD (8 skills)
    jenkins: {
      name: "Jenkins",
      level: 85,
      category: "devops",
      description: "CI/CD automation - Pipelines, Plugins, Distributed builds, Blue Ocean",
      color: "from-blue-500 to-gray-500",
      icon: "🔧",
      abbr: "JNK",
      id: "jenkins",
    },
    gitlab: {
      name: "GitLab CI",
      level: 88,
      category: "devops",
      description: "GitLab CI/CD - Pipelines, Auto DevOps, Container registry, Security scanning",
      color: "from-orange-500 to-red-500",
      icon: "🦊",
      abbr: "GLB",
      id: "gitlab",
    },
    github: {
      name: "GitHub Actions",
      level: 90,
      category: "devops",
      description: "GitHub CI/CD - Workflows, Actions, Package registry, Security features",
      color: "from-gray-700 to-gray-900",
      icon: "🐙",
      abbr: "GH",
      id: "github",
    },
    argocd: {
      name: "ArgoCD",
      level: 78,
      category: "devops",
      description: "GitOps continuous delivery - Kubernetes deployments, Application sync",
      color: "from-blue-500 to-cyan-500",
      icon: "🚀",
      abbr: "ACD",
      id: "argocd",
    },
    flux: {
      name: "Flux",
      level: 65,
      category: "devops",
      description: "GitOps toolkit - Kubernetes continuous delivery, Source controller",
      color: "from-purple-400 to-blue-400",
      icon: "🌊",
      abbr: "FLX",
      id: "flux",
    },
    spinnaker: {
      name: "Spinnaker",
      level: 45,
      category: "devops",
      description: "Multi-cloud deployment - Pipelines, Canary deployments, Blue/green",
      color: "from-blue-600 to-purple-600",
      icon: "🎯",
      abbr: "SPN",
      id: "spinnaker",
    },
    tekton: {
      name: "Tekton",
      level: 55,
      category: "devops",
      description: "Kubernetes-native CI/CD - Pipelines, Tasks, Cloud-native builds",
      color: "from-red-400 to-orange-400",
      icon: "⚡",
      abbr: "TKN",
      id: "tekton",
    },
    circleci: {
      name: "CircleCI",
      level: 70,
      category: "devops",
      description: "Cloud CI/CD platform - Orbs, Workflows, Docker layer caching",
      color: "from-green-500 to-blue-500",
      icon: "⭕",
      abbr: "CCI",
      id: "circleci",
    },
  }

  // Skill tree data
  const skillTree = {
    cloud: {
      title: "☁️ CLOUD ARCHITECTURE",
      level: "MASTER",
      skills: [
        { id: "aws", icon: "⚡", name: "AWS", level: 95, status: "mastered" as const },
        { id: "gcp", icon: "🔷", name: "GCP", level: 80, status: "mastered" as const },
        { id: "azure", icon: "☁️", name: "Azure", level: 70, status: "mastered" as const },
        { id: "terraform", icon: "🏗️", name: "Terraform", level: 95, status: "mastered" as const },
        { id: "cloudformation", icon: "📋", name: "CloudForm", level: 85, status: "mastered" as const },
        { id: "pulumi", icon: "🎯", name: "Pulumi", level: 42, status: "learning" as const },
      ],
    },
    containers: {
      title: "🐳 CONTAINER ORCHESTRATION",
      level: "EXPERT",
      skills: [
        { id: "kubernetes", icon: "☸️", name: "Kubernetes", level: 92, status: "mastered" as const },
        { id: "docker", icon: "🐳", name: "Docker", level: 90, status: "mastered" as const },
        { id: "helm", icon: "⎈", name: "Helm", level: 85, status: "mastered" as const },
        { id: "istio", icon: "🕸️", name: "Istio", level: 75, status: "mastered" as const },
        { id: "nomad", icon: "🏃", name: "Nomad", level: 45, status: "learning" as const },
        { id: "rancher", icon: "🔒", name: "Rancher", level: "LOCKED", status: "locked" as const },
      ],
    },
    programming: {
      title: "💻 PROGRAMMING LANGUAGES",
      level: "EXPERT",
      skills: [
        { id: "python", icon: "🐍", name: "Python", level: 90, status: "mastered" as const },
        { id: "go", icon: "", name: "Go", level: 75, status: "mastered" as const },
        { id: "javascript", icon: "⚡", name: "JavaScript", level: 85, status: "mastered" as const },
        { id: "bash", icon: "🖥️", name: "Bash", level: 95, status: "mastered" as const },
        { id: "rust", icon: "🦀", name: "Rust", level: 35, status: "learning" as const },
        { id: "sql", icon: "🗃️", name: "SQL", level: 88, status: "mastered" as const },
      ],
    },
    security: {
      title: "🔒 SECURITY & COMPLIANCE",
      level: "ADVANCED",
      skills: [
        { id: "zero-trust", icon: "🛡️", name: "Zero Trust", level: 85, status: "mastered" as const },
        { id: "vault", icon: "🔐", name: "Vault", level: 80, status: "mastered" as const },
        { id: "opa", icon: "📜", name: "OPA", level: 72, status: "mastered" as const },
        { id: "falco", icon: "🦅", name: "Falco", level: 68, status: "mastered" as const },
        { id: "soc2", icon: "✅", name: "SOC2", level: 90, status: "mastered" as const },
        { id: "ebpf", icon: "🔍", name: "eBPF", level: 42, status: "learning" as const },
      ],
    },
  }

  // Certifications data
  const certifications: Certification[] = [
    { icon: "☁️", name: "AWS Solutions Architect Pro", date: "2023-2026" },
    { icon: "🔒", name: "AWS Security Specialty", date: "2023-2026" },
    { icon: "🌍", name: "GCP Cloud Architect", date: "2023-2025" },
    { icon: "☸️", name: "CKA (Kubernetes Admin)", date: "2024-2027" },
    { icon: "🛡️", name: "CKS (Kubernetes Security)", date: "2024-2027" },
    { icon: "🏗️", name: "HashiCorp Terraform", date: "2024-2026" },
    { icon: "🔷", name: "Azure Solutions Expert", date: "2024-2026" },
    { icon: "🎯", name: "RHCA (Red Hat Architect)", date: "2023-2026" },
  ]

  // Commands object
  const commands = {
    help: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">SKILL COMMAND CENTER</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>

          <div className="text-cyan-300">Skill Management:</div>
          <div className="grid grid-cols-2 gap-2 text-sm pl-4">
            <div>list - List all skills</div>
            <div>stats - View detailed statistics</div>
            <div>tree - Display skill tree</div>
            <div>matrix - Show skill matrix</div>
            <div>radar - Display radar chart</div>
          </div>

          <div className="text-cyan-300 mt-2">Learning & Testing:</div>
          <div className="grid grid-cols-2 gap-2 text-sm pl-4">
            <div>learn [skill] - Start learning module</div>
            <div>test [skill] - Take skill assessment</div>
            <div>quiz - Random skill quiz</div>
            <div>practice - Practice exercises</div>
            <div>roadmap - View learning path</div>
          </div>

          <div className="text-cyan-300 mt-2">Gamification:</div>
          <div className="grid grid-cols-2 gap-2 text-sm pl-4">
            <div>battle - Enter skills combat</div>
            <div>upgrade - Upgrade abilities</div>
            <div>achievements - View all achievements</div>
            <div>leaderboard - Global rankings</div>
            <div>xp - Experience details</div>
          </div>

          <div className="text-cyan-300 mt-2">Analysis:</div>
          <div className="grid grid-cols-2 gap-2 text-sm pl-4">
            <div>compare [skill] - Market comparison</div>
            <div>demand - In-demand skills</div>
            <div>salary - Salary by skill</div>
            <div>trends - Technology trends</div>
          </div>

          <div className="text-cyan-300 mt-2">Special:</div>
          <div className="grid grid-cols-2 gap-2 text-sm pl-4">
            <div>unlock - Unlock hidden skills</div>
            <div>cheat - Activate cheat codes</div>
            <div>godmode - Enable god mode</div>
            <div>hack - Hack the matrix</div>
            <div>level-up - Instant level up</div>
            <div>clear - Clear terminal</div>
          </div>

          <div className="text-yellow-400 text-sm mt-2">Easter eggs hidden throughout. Keep exploring!</div>
        </div>
      ),
    },
    list: {
      execute: () => {
        const categories = {
          cloud: "☁️ Cloud Platforms",
          containers: "🐳 Containers",
          programming: "💻 Programming",
          infrastructure: "🏗️ Infrastructure",
          security: "🔒 Security",
          monitoring: "📊 Monitoring",
        }

        return (
          <div className="space-y-3">
            <div className="text-cyan-400 font-bold">SKILL INVENTORY</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>

            {Object.entries(categories).map(([catKey, catName]) => (
              <div key={catKey}>
                <div className="text-cyan-300">{catName}:</div>
                <div className="pl-4 space-y-1">
                  {Object.entries(skills)
                    .filter(([_, skill]) => skill.category === catKey)
                    .map(([key, skill]) => {
                      const barFilled = Math.floor(skill.level / 5)
                      const barEmpty = 20 - barFilled
                      return (
                        <div key={key} className="font-mono text-sm">
                          <span className="inline-block w-32">{skill.name}</span>
                          <span className="text-green-400">{"█".repeat(barFilled)}</span>
                          <span className="text-gray-700">{"░".repeat(barEmpty)}</span>
                          <span className="text-cyan-400 ml-2">{skill.level}%</span>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        )
      },
    },
    stats: {
      execute: () => {
        const totalSkills = Object.keys(skills).length
        const avgLevel = Math.floor(Object.values(skills).reduce((a, b) => a + b.level, 0) / totalSkills)
        const mastered = Object.values(skills).filter((s) => s.level >= 80).length
        const learning = Object.values(skills).filter((s) => s.level < 60).length

        return (
          <div className="space-y-3">
            <div className="text-cyan-400 font-bold">📊 SKILL STATISTICS</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>

            <div className="text-cyan-300">Overview:</div>
            <div className="text-sm pl-4 space-y-1">
              <div>• Total Skills: {totalSkills}</div>
              <div>• Average Level: {avgLevel}%</div>
              <div>• Mastered (80%+): {mastered}</div>
              <div>
                • Learning ({`<`}60%): {learning}
              </div>
              <div>• Total XP: 847,293</div>
              <div>• Global Rank: #42</div>
            </div>

            <div className="text-cyan-300">Skill Distribution:</div>
            <div className="text-sm pl-4 space-y-1">
              <div>
                • Expert (90-100%): <span className="text-green-400">████████</span>
                <span className="text-gray-700">░░</span> 8 skills
              </div>
              <div>
                • Advanced (70-89%): <span className="text-green-400">██████████</span> 10 skills
              </div>
              <div>
                • Intermediate: <span className="text-green-400">████</span>
                <span className="text-gray-700">░░░░░░</span> 4 skills
              </div>
              <div>
                • Beginner: <span className="text-green-400">██</span>
                <span className="text-gray-700">░░░░░░░░</span> 2 skills
              </div>
            </div>

            <div className="text-cyan-300">Learning Velocity:</div>
            <div className="text-sm pl-4 space-y-1">
              <div>• This Week: +2,847 XP</div>
              <div>• This Month: +12,738 XP</div>
              <div>• Improvement: +12% avg level</div>
            </div>

            <div className="text-green-400">You're in the top 1% of engineers!</div>
          </div>
        )
      },
    },
    battle: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">⚔️ SKILLS BATTLE MODE</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>

          <div className="text-yellow-400 animate-pulse">CHALLENGER APPROACHING!</div>

          <div className="mt-3">
            <div className="text-cyan-300">You:</div> Level 42 Cloud Architect
            <br />
            HP: [<span className="text-green-400">████████████████████</span>] 100%
            <br />
            Skills: AWS(95) K8s(92) Python(90)
          </div>

          <div className="text-red-400 text-xl font-bold text-center my-2">VS</div>

          <div>
            <div className="text-cyan-300">Opponent:</div> Level 38 DevOps Engineer
            <br />
            HP: [<span className="text-green-400">████████████████████</span>] 100%
            <br />
            Skills: Docker(85) Jenkins(80) Linux(88)
          </div>

          <div className="text-yellow-400 mt-3">ROUND 1: FIGHT!</div>

          <div className="space-y-2 mt-3">
            <div>
              {`>`} You use <span className="text-green-400">Terraform Destroy!</span>
            </div>
            <div className="pl-2">Opponent's infrastructure crumbles! -30 HP</div>

            <div>
              {`>`} Opponent uses <span className="text-red-400">Pipeline Break!</span>
            </div>
            <div className="pl-2">Your CI/CD is disrupted! -20 HP</div>

            <div>
              {`>`} You counter with <span className="text-green-400">Kubernetes Scale!</span>
            </div>
            <div className="pl-2">Massive damage! -40 HP</div>

            <div>
              {`>`} Opponent uses <span className="text-red-400">Docker Compose!</span>
            </div>
            <div className="pl-2">Containers everywhere! -15 HP</div>
          </div>

          <div className="text-green-400 font-bold mt-3">FINAL BLOW: Infrastructure as Code!</div>

          <div className="text-cyan-400 text-xl font-bold mt-3">🏆 VICTORY! +500 XP</div>
          <div className="text-cyan-300">Loot: New skill unlocked - Chaos Engineering</div>
        </div>
      ),
    },
    upgrade: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">⬆️ SKILL UPGRADE SYSTEM</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>

          <div className="text-cyan-300">Available Skill Points: 5</div>

          <div className="mt-3">Choose skills to upgrade:</div>

          <div className="space-y-1 mt-2">
            <div>
              1. <span className="text-green-400">AWS (95 → 96)</span> Cost: 1 point
            </div>
            <div>
              2. <span className="text-green-400">Kubernetes (92 → 93)</span> Cost: 1 point
            </div>
            <div>
              3. <span className="text-yellow-400">Go (75 → 78)</span> Cost: 2 points
            </div>
            <div>
              4. <span className="text-yellow-400">Rust (35 → 40)</span> Cost: 3 points
            </div>
            <div>
              5. <span className="text-red-400">Quantum Computing (0 → 10)</span> Cost: 5 points
            </div>
          </div>

          <div className="text-cyan-300 mt-3">Upgrading Go...</div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500" style={{ width: "100%" }} />
          </div>

          <div className="text-green-400 mt-2">✅ Go upgraded to level 78!</div>
          <div>New abilities unlocked:</div>
          <div className="pl-4 text-sm">
            <div>• Goroutine Mastery</div>
            <div>• Channel Wizardry</div>
            <div>• Interface Guru</div>
          </div>

          <div className="text-yellow-400 mt-2">3 skill points remaining</div>
        </div>
      ),
    },
    achievements: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">🏆 ACHIEVEMENT GALLERY</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>

          <div className="text-green-400">Unlocked (27/50):</div>

          <div className="space-y-1 mt-2">
            <div>
              🥇 <span className="text-cyan-300">Cloud Master</span> - Reach level 90+ in any cloud platform
            </div>
            <div>
              🥇 <span className="text-cyan-300">Polyglot Programmer</span> - Master 5+ programming languages
            </div>
            <div>
              🥇 <span className="text-cyan-300">Container Captain</span> - Deploy 1000+ containers
            </div>
            <div>
              🥇 <span className="text-cyan-300">Terraform Terraformer</span> - Manage 100+ resources with IaC
            </div>
            <div>
              🥇 <span className="text-cyan-300">Security Sentinel</span> - Prevent 100 security breaches
            </div>
            <div>
              🥇 <span className="text-cyan-300">Uptime Hero</span> - Achieve 99.99% uptime for 365 days
            </div>
            <div>
              🥇 <span className="text-cyan-300">Cost Killer</span> - Save $1M+ in cloud costs
            </div>
            <div>
              🥇 <span className="text-cyan-300">Bug Squasher</span> - Fix 10,000 bugs
            </div>
            <div>
              🥇 <span className="text-cyan-300">Midnight Deployer</span> - Deploy at 3 AM on Friday
            </div>
            <div>
              🥇 <span className="text-cyan-300">Vim Master</span> - Exit vim successfully
            </div>
          </div>

          <div className="text-yellow-400 mt-3">Locked (23/50):</div>

          <div className="space-y-1 mt-2 text-gray-500">
            <div>🔒 Quantum Leaper - Master quantum computing</div>
            <div>🔒 AI Overlord - Build sentient AI (please don't)</div>
            <div>🔒 10x Engineer - Achieve legendary status</div>
          </div>

          <div className="text-cyan-300 mt-3">Total Achievement Points: 42,847</div>
          <div className="text-green-400">Global Rank: #127</div>
        </div>
      ),
    },
    roadmap: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">🗺️ LEARNING ROADMAP 2025</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>

          <div className="text-cyan-300">Q1 2025: Cloud Native Mastery</div>
          <div className="text-sm pl-4">
            <div>✅ Advanced Kubernetes (CKS)</div>
            <div>✅ Service Mesh (Istio/Linkerd)</div>
            <div>⬜ eBPF Observability</div>
            <div>⬜ WebAssembly on Edge</div>
          </div>

          <div className="text-cyan-300 mt-2">Q2 2025: AI/ML Integration</div>
          <div className="text-sm pl-4">
            <div>⬜ MLOps with Kubeflow</div>
            <div>⬜ LLM Fine-tuning</div>
            <div>⬜ Vector Databases</div>
            <div>⬜ AI Infrastructure</div>
          </div>

          <div className="text-cyan-300 mt-2">Q3 2025: Advanced Security</div>
          <div className="text-sm pl-4">
            <div>⬜ Supply Chain Security</div>
            <div>⬜ Zero Trust Architecture</div>
            <div>⬜ Quantum-Safe Cryptography</div>
            <div>⬜ Advanced Threat Hunting</div>
          </div>

          <div className="text-cyan-300 mt-2">Q4 2025: Emerging Tech</div>
          <div className="text-sm pl-4">
            <div>⬜ Quantum Computing Basics</div>
            <div>⬜ Blockchain Infrastructure</div>
            <div>⬜ Edge Computing</div>
            <div>⬜ 6G Network Preparation</div>
          </div>

          <div className="text-green-400 mt-3">Progress: 15% Complete</div>
          <div className="text-yellow-400">Estimated Time: 1,200 hours</div>
          <div className="text-cyan-300">Potential Salary Increase: +$50K</div>
        </div>
      ),
    },
    demand: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">🔥 HOT SKILLS IN DEMAND (2025)</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>

          <div className="text-red-400">🔥 CRITICAL DEMAND:</div>
          <div className="text-sm pl-4 space-y-1">
            <div>1. AI/ML Engineering +847% YoY</div>
            <div>2. Platform Engineering +234% YoY</div>
            <div>3. eBPF Development +189% YoY</div>
            <div>4. Rust Programming +156% YoY</div>
            <div>5. WebAssembly +142% YoY</div>
          </div>

          <div className="text-yellow-400 mt-3">📈 HIGH DEMAND:</div>
          <div className="text-sm pl-4 space-y-1">
            <div>6. Kubernetes +67% YoY</div>
            <div>7. Terraform +54% YoY</div>
            <div>8. Go Programming +48% YoY</div>
            <div>9. Security Engineering +45% YoY</div>
            <div>10. FinOps +42% YoY</div>
          </div>

          <div className="text-cyan-300 mt-3">📊 STEADY DEMAND:</div>
          <div className="text-sm pl-4">
            • Python, JavaScript, Cloud Platforms
            <br />• Docker, CI/CD, Monitoring
            <br />• SQL, APIs, Microservices
          </div>

          <div className="text-gray-500 mt-3">📉 DECLINING:</div>
          <div className="text-sm pl-4">
            • Perl, PHP (legacy)
            <br />• Traditional sysadmin
            <br />• Waterfall PM
          </div>

          <div className="text-green-400 mt-3">Your skills align with 8/10 top demands!</div>
        </div>
      ),
    },
    salary: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">💰 SALARY BY SKILL LEVEL</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>

          <div className="text-cyan-300">Your Skills → Salary Mapping:</div>

          <div className="text-sm space-y-1 mt-2">
            <div>AWS (95%) → $180K-220K</div>
            <div>Kubernetes (92%) → $170K-210K</div>
            <div>Python (90%) → $140K-180K</div>
            <div>Terraform (95%) → $160K-200K</div>
            <div>Go (75%) → $150K-190K</div>
          </div>

          <div className="text-green-400 mt-3">Your Estimated Range: $185K - $235K</div>

          <div className="text-cyan-300 mt-3">Market Comparison:</div>
          <div className="text-sm pl-4 space-y-1">
            <div>• Junior (0-2 yrs): $80K - $120K</div>
            <div>• Mid (3-5 yrs): $120K - $160K</div>
            <div>• Senior (5-8 yrs): $160K - $200K</div>
            <div>• Staff (8+ yrs): $200K - $300K</div>
            <div>• Principal: $300K+</div>
          </div>

          <div className="text-yellow-400 mt-3">Location Multipliers:</div>
          <div className="text-sm pl-4 space-y-1">
            <div>• San Francisco: 1.4x</div>
            <div>• New York: 1.3x</div>
            <div>• Remote: 1.0x</div>
            <div>• Austin: 0.9x</div>
          </div>

          <div className="text-green-400 mt-3">You're in the 95th percentile!</div>
        </div>
      ),
    },
    trends: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">📈 TECHNOLOGY TRENDS 2025</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>

          <div className="text-red-400">🚀 EXPLODING:</div>
          <div className="text-sm pl-4">
            • AI/ML Everything
            <br />• Platform Engineering
            <br />• WebAssembly
            <br />• eBPF
            <br />• Rust
          </div>

          <div className="text-yellow-400 mt-3">📈 GROWING:</div>
          <div className="text-sm pl-4">
            • Edge Computing
            <br />• Quantum Computing
            <br />• Blockchain Infrastructure
            <br />• Low-Code Platforms
            <br />• FinOps
          </div>

          <div className="text-cyan-300 mt-3">📊 STABLE:</div>
          <div className="text-sm pl-4">
            • Cloud (AWS/GCP/Azure)
            <br />• Kubernetes
            <br />• DevOps Practices
            <br />• Microservices
            <br />• API-First
          </div>

          <div className="text-gray-500 mt-3">📉 DECLINING:</div>
          <div className="text-sm pl-4">
            • Monoliths (but making a comeback?)
            <br />• Traditional VMs
            <br />• Manual Operations
          </div>

          <div className="text-green-400 mt-3">Your skills match 80% of growing trends!</div>
        </div>
      ),
    },
    unlock: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">🔓 UNLOCKING HIDDEN SKILLS...</div>

          <div>Scanning skill tree for locked nodes...</div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: "100%" }} />
          </div>

          <div className="text-green-400 font-bold mt-3">🎉 NEW SKILLS UNLOCKED!</div>

          <div className="space-y-2 mt-3">
            <div className="text-yellow-400">⚡ Chaos Engineering - Level 1</div>
            <div className="pl-4 text-sm">Ability: Randomly break production (safely)</div>

            <div className="text-yellow-400">🧠 Mind Reading - Level 1</div>
            <div className="pl-4 text-sm">Ability: Know what PM really wants</div>

            <div className="text-yellow-400">☕ Coffee Brewing - Level 99</div>
            <div className="pl-4 text-sm">Ability: Function without sleep</div>

            <div className="text-yellow-400">🎮 Vim Golf - Level 42</div>
            <div className="pl-4 text-sm">Ability: Edit files with minimum keystrokes</div>

            <div className="text-yellow-400">🦆 Rubber Duck Debugging - Level MAX</div>
            <div className="pl-4 text-sm">Ability: Solve problems by explaining to duck</div>
          </div>

          <div className="text-cyan-300 mt-3">+1000 XP for discovering hidden skills!</div>
        </div>
      ),
    },
    cheat: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">🎮 CHEAT CODE ACTIVATED</div>

          <div>
            Enter cheat code: <span className="text-yellow-400">↑ ↑ ↓ ↓ ← → ← → B A</span>
          </div>

          <div className="text-green-400 font-bold mt-2">KONAMI CODE ACCEPTED!</div>

          <div className="mt-2">Cheats Enabled:</div>
          <div className="pl-4 text-sm">
            • Infinite XP
            <br />• All Skills Unlocked
            <br />• God Mode Active
            <br />• Instant Deploy (no testing needed)
            <br />• Bug-Free Code (impossible!)
            <br />• Unlimited Coffee
          </div>

          <div className="text-red-400 mt-3">WARNING: Using cheats in production will void warranty!</div>

          <div className="text-gray-500 text-sm mt-2">
            Just kidding. There are no shortcuts in engineering.
            <br />
            Keep learning, keep building, keep growing! 💪
          </div>
        </div>
      ),
    },
    godmode: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold animate-pulse">⚡ GOD MODE ACTIVATED ⚡</div>

          <div className="text-purple-400 font-bold">TRANSCENDING MORTAL LIMITATIONS...</div>

          <div className="mt-3">Your new abilities:</div>
          <div className="pl-4 text-sm">
            • Write code that writes itself
            <br />• Deploy on Fridays without fear
            <br />• Understand regex on first try
            <br />• Exit vim with your mind
            <br />• Compile code by looking at it
            <br />• Debug quantum computers
            <br />• Speak fluent Kubernetes YAML
            <br />• Read AWS bills without crying
          </div>

          <div className="text-yellow-400 mt-3">Power Level: ∞</div>
          <div className="text-red-400">Reality.exe has stopped responding</div>

          <div className="text-green-400 mt-3">Achievement Unlocked: "One with the Code"</div>

          <div className="text-gray-500 text-sm mt-2">Remember: With great power comes great cloud bills.</div>
        </div>
      ),
    },
    hack: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-red-400 font-bold">HACKING THE SKILL MATRIX...</div>

          <div>Exploiting skill buffer overflow...</div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-yellow-500 animate-pulse"
              style={{ width: "100%" }}
            />
          </div>

          <div className="text-yellow-400 mt-3">MATRIX GLITCH DETECTED</div>

          <div className="mt-2">
            Reality warping...
            <br />
            Skills inverting...
            <br />
            Knowledge downloading...
          </div>

          <div className="text-green-400 font-bold mt-3">YOU ARE THE ONE.</div>

          <div className="mt-2">New reality loaded:</div>
          <div className="pl-4 text-sm">
            • You now know Kung Fu
            <br />• You can see the code (it's all green)
            <br />• Spoons don't exist
            <br />• Your typing speed: ∞ WPM
            <br />• Bug prediction: 100% accuracy
          </div>

          <div className="text-cyan-300 mt-3">Welcome to the real world, Neo.</div>

          <div className="text-gray-500 text-sm mt-2">Type 'matrix' to see the code</div>
        </div>
      ),
    },
    matrix: {
      execute: () => {
        const matrixCode = Array(20)
          .fill(0)
          .map(() =>
            Array(80)
              .fill(0)
              .map(() => (Math.random() > 0.5 ? "1" : "0"))
              .join(""),
          )
          .join("\n")

        return (
          <div>
            <pre className="text-green-400 text-xs">{matrixCode}</pre>
            <div className="text-cyan-400 mt-2">You can see the Matrix.</div>
          </div>
        )
      },
    },
    "level-up": {
      execute: () => {
        setCharacterStats((prev) => ({
          ...prev,
          level: prev.level + 1,
        }))

        return (
          <div className="space-y-3">
            <div className="text-cyan-400 font-bold">⬆️ LEVEL UP!</div>

            <div className="text-purple-400 font-bold animate-pulse">POWER SURGE DETECTED</div>

            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: "100%" }} />
            </div>

            <div className="text-green-400">Congratulations! You've reached Level {characterStats.level + 1}!</div>

            <div className="text-cyan-300">Rewards:</div>
            <div className="pl-4 text-sm">
              • +5 Skill Points
              <br />• +1000 XP Bonus
              <br />• New Title: "Senior Architect"
              <br />• Unlock: Advanced Skill Tree
              <br />• Special: Rainbow Terminal Mode
            </div>

            <div className="text-yellow-400 mt-2">New abilities available!</div>
            <div className="pl-4 text-sm">
              • Instant Coffee Brewing
              <br />• Telepathic Debugging
              <br />• Time-Travel Deployments
            </div>

            <div className="text-gray-500 text-sm mt-2">Only {100 - characterStats.level - 1} levels until max!</div>
          </div>
        )
      },
    },
    quiz: {
      execute: () => {
        const questions = [
          { q: "What does CAP theorem stand for?", a: "Consistency, Availability, Partition tolerance" },
          { q: "What port does HTTPS use by default?", a: "443" },
          { q: "What's the command to list all pods in Kubernetes?", a: "kubectl get pods" },
          { q: "What does ACID stand for in databases?", a: "Atomicity, Consistency, Isolation, Durability" },
        ]

        const question = questions[Math.floor(Math.random() * questions.length)]

        return (
          <div className="space-y-3">
            <div className="text-cyan-400 font-bold">🧠 QUICK QUIZ</div>
            <div className="text-cyan-300">Question:</div> {question.q}
            <div className="text-gray-500 mt-2">Thinking...</div>
            <div className="text-green-400 mt-2">Your Answer:</div> {question.a}
            <div className="text-green-400 mt-2">✅ Correct! +25 XP</div>
            <div className="text-sm text-gray-500">Type 'quiz' for another question!</div>
          </div>
        )
      },
    },
    xp: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">✨ EXPERIENCE DETAILS</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>

          <div className="text-cyan-300">Total XP: 847,293</div>

          <div className="text-cyan-300 mt-2">XP Breakdown:</div>
          <div className="text-sm pl-4 space-y-1">
            <div>• Cloud Mastery: 234,827 XP</div>
            <div>• Container Skills: 189,472 XP</div>
            <div>• Programming: 156,938 XP</div>
            <div>• Security: 98,274 XP</div>
            <div>• Infrastructure: 87,439 XP</div>
            <div>• Certifications: 80,343 XP</div>
          </div>

          <div className="text-cyan-300 mt-2">Recent XP Gains:</div>
          <div className="text-sm pl-4 space-y-1">
            <div>• Deployed to prod: +500 XP</div>
            <div>• Fixed critical bug: +750 XP</div>
            <div>• Learned new skill: +250 XP</div>
            <div>• Helped teammate: +100 XP</div>
            <div>• Read documentation: +50 XP (rare!)</div>
          </div>

          <div className="text-cyan-300 mt-2">XP Multipliers Active:</div>
          <div className="text-sm pl-4 space-y-1">
            <div>• Weekend Warrior: 1.5x</div>
            <div>• Night Owl: 1.3x</div>
            <div>• Coffee Powered: 1.2x</div>
          </div>

          <div className="text-yellow-400 mt-2">Next Level: 152,707 XP needed</div>
          <div className="text-green-400">Daily XP Goal: 500/500 ✅</div>
        </div>
      ),
    },
    leaderboard: {
      execute: () => (
        <div className="space-y-3">
          <div className="text-cyan-400 font-bold">🏆 GLOBAL LEADERBOARD</div>
          <div className="text-gray-500">{"─".repeat(40)}</div>

          <div className="text-cyan-300">Top Cloud Architects Worldwide:</div>

          <div className="space-y-1 mt-2 text-sm">
            <div>1. 🥇 CyberNinja_42 Level 99 | 1,337,420 XP</div>
            <div>2. 🥈 CloudMaster9000 Level 97 | 1,298,742 XP</div>
            <div>3. 🥉 TerraformWizard Level 95 | 1,247,839 XP</div>
            <div>4. 4️⃣ K8sGuru Level 94 | 1,198,274 XP</div>
            <div>...</div>
            <div className="text-green-400">42. 🎯 YOU (NEXUS) Level 42 | 847,293 XP</div>
            <div>...</div>
            <div>100. DevOpsNewbie Level 31 | 427,839 XP</div>
          </div>

          <div className="text-cyan-300 mt-3">Your Rankings:</div>
          <div className="text-sm pl-4 space-y-1">
            <div>• Global: #42 / 128,742</div>
            <div>• Country: #8 / 12,847</div>
            <div>• Cloud Skills: #12 / 42,738</div>
            <div>• Kubernetes: #27 / 38,429</div>
          </div>

          <div className="text-yellow-400 mt-2">23,847 XP to next rank</div>
          <div className="text-green-400">You're in the top 0.03%!</div>
        </div>
      ),
    },
    clear: {
      execute: () => {
        setTerminalHistory([])
        return null
      },
    },
  }

  // Process specific skill commands
  const processSkillCommand = useCallback((command: string, skillName: string) => {
    switch (command) {
      case "learn":
        if (skillName === "python") {
          return (
            <div className="space-y-3">
              <div className="text-cyan-400 font-bold">🐍 PYTHON LEARNING MODULE</div>
              <div className="text-gray-500">{"─".repeat(40)}</div>

              <div>
                Current Level: <span className="text-green-400">90/100</span>
              </div>

              <div className="text-cyan-300">Quick Challenge:</div>
              <div>Write a function to find the longest palindrome in a string.</div>

              <div className="text-gray-500 text-sm mt-2">
                def find_longest_palindrome(s):
                <br />
                {"    "}# Your code here
                <br />
                {"    "}pass
              </div>

              <div className="text-cyan-300 mt-3">Your Solution:</div>
              <pre className="text-green-400 text-sm bg-black/50 p-2 rounded">
                {`def find_longest_palindrome(s):
    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left+1:right]
    
    longest = ""
    for i in range(len(s)):
        odd = expand(i, i)
        even = expand(i, i+1)
        longest = max(longest, odd, even, key=len)
    return longest`}
              </pre>

              <div className="text-green-400">✅ Excellent! +50 XP earned!</div>
              <div className="text-yellow-400">Level Progress: 90 → 91</div>

              <div className="text-sm text-gray-500">Try 'test python' for a full assessment!</div>
            </div>
          )
        }
        return (
          <div>
            <div className="text-cyan-300">Starting learning module for: {skillName}</div>
            <div className="text-green-400">Feature coming soon! Try 'learn python' for now.</div>
          </div>
        )

      case "test":
        if (skillName === "kubernetes") {
          return (
            <div className="space-y-3">
              <div className="text-cyan-400 font-bold">☸️ KUBERNETES CERTIFICATION TEST</div>
              <div className="text-gray-500">{"─".repeat(40)}</div>

              <div className="text-cyan-300">Question 1/5:</div>
              <div>What is the default namespace in Kubernetes?</div>
              <div className="pl-4 text-sm">
                <div>A) kube-system</div>
                <div>B) default ✓</div>
                <div>C) kube-public</div>
                <div>D) kube-node-lease</div>
              </div>
              <div className="text-green-400">✅ Correct!</div>

              <div className="text-cyan-300 mt-3">Question 2/5:</div>
              <div>Which resource manages stateful applications?</div>
              <div className="pl-4 text-sm">
                <div>A) Deployment</div>
                <div>B) DaemonSet</div>
                <div>C) StatefulSet ✓</div>
                <div>D) ReplicaSet</div>
              </div>
              <div className="text-green-400">✅ Correct!</div>

              <div className="text-cyan-300 mt-3">Final Score: 5/5 (100%)</div>
              <div className="text-green-400">🏆 PERFECT SCORE! +200 XP</div>

              <div>
                Kubernetes Skill: <span className="text-yellow-400">92 → 93</span>
              </div>
            </div>
          )
        }
        return (
          <div>
            <div className="text-cyan-300">Loading test for: {skillName}</div>
            <div className="text-green-400">Feature coming soon! Try 'test kubernetes' for now.</div>
          </div>
        )

      case "compare":
        return (
          <div className="space-y-3">
            <div className="text-cyan-400 font-bold">📊 MARKET COMPARISON: {skillName.toUpperCase()}</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>

            <div>
              <div className="text-cyan-300">Your Level:</div>
              <span className="text-green-400">████████████████████</span> 92%
            </div>
            <div>
              <div className="text-cyan-300">Market Avg:</div>
              <span className="text-green-400">████████</span>
              <span className="text-gray-700">░░░░░░░░░░░░</span> 45%
            </div>
            <div>
              <div className="text-cyan-300">Top 10%:</div>
              <span className="text-green-400">████████████████</span>
              <span className="text-gray-700">░░░░</span> 80%
            </div>
            <div>
              <div className="text-cyan-300">Top 1%:</div>
              <span className="text-green-400">██████████████████</span>
              <span className="text-gray-700">░░</span> 90%
            </div>

            <div className="text-green-400 mt-3">You're in the top 1% for this skill!</div>

            <div className="text-cyan-300 mt-2">Market Demand:</div>
            <div className="text-sm pl-4">
              • Job Postings: 12,847 (↑ 23% YoY)
              <br />• Avg Salary: $165,000
              <br />• Your Range: $180,000 - $220,000
              <br />• Companies: FAANG, Fortune 500
            </div>
          </div>
        )

      default:
        return (
          <div className="text-red-400">
            Unknown command: {command} {skillName}
          </div>
        )
    }
  }, [])

  const processCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim().toLowerCase()

      // Check for exact command match
      if (commands[trimmed]) {
        return commands[trimmed].execute()
      }

      // Check for commands with parameters
      const parts = trimmed.split(" ")
      const baseCommand = parts[0]
      const param = parts.slice(1).join(" ")

      // Skill-specific commands
      const skillCommands = ["learn", "test", "compare"]
      if (skillCommands.includes(baseCommand) && param) {
        return processSkillCommand(baseCommand, param)
      }

      // Easter eggs
      if (trimmed === "tree") {
        return (
          <div>
            <div className="text-cyan-400 font-bold">🌳 SKILL DEPENDENCY TREE</div>
            <pre className="text-green-400 text-xs">
              {`Cloud Architecture
├── AWS [95%]
│   ├── EC2 [90%]
│   ├── S3 [95%]
│   ├── Lambda [88%]
│   └── CloudFormation [85%]
├── GCP [80%]
│   ├── Compute [75%]
│   ├── Storage [80%]
│   └── GKE [85%]
└── Azure [70%]
    ├── VMs [65%]
    └── AKS [75%]

Container Orchestration
├── Docker [90%]
│   └── Compose [85%]
└── Kubernetes [92%]
    ├── Pods [95%]
    ├── Services [90%]
    ├── Ingress [88%]
    └── CRDs [80%]`}
            </pre>
            <div className="text-gray-500 text-sm">Use 'learn [skill]' to improve any branch</div>
          </div>
        )
      }

      if (trimmed === "ls") {
        return (
          <div className="text-sm">
            <div>
              <span className="text-cyan-300">drwxr-xr-x</span> 2 nexus nexus 4096 Jan 15 skills{" "}
              <span className="text-cyan-400">cloud/</span>
            </div>
            <div>
              <span className="text-cyan-300">drwxr-xr-x</span> 2 nexus nexus 4096 Jan 15 skills{" "}
              <span className="text-cyan-400">containers/</span>
            </div>
            <div>
              <span className="text-cyan-300">drwxr-xr-x</span> 2 nexus nexus 4096 Jan 15 skills{" "}
              <span className="text-cyan-400">programming/</span>
            </div>
            <div>
              <span className="text-cyan-300">drwxr-xr-x</span> 2 nexus nexus 4096 Jan 15 skills{" "}
              <span className="text-cyan-400">security/</span>
            </div>
            <div>
              <span className="text-cyan-300">drwxr-xr-x</span> 2 nexus nexus 4096 Jan 15 skills{" "}
              <span className="text-cyan-400">infrastructure/</span>
            </div>
            <div>
              <span className="text-cyan-300">-rw-r--r--</span> 1 nexus nexus 8192 Jan 15 skills certifications.pdf
            </div>
            <div>
              <span className="text-cyan-300">-rw-r--r--</span> 1 nexus nexus 4096 Jan 15 skills resume.json
            </div>
            <div>
              <span className="text-cyan-300">-rwxr-xr-x</span> 1 nexus nexus 2048 Jan 15 skills{" "}
              <span className="text-green-400">level-up.sh</span>
            </div>
          </div>
        )
      }

      if (trimmed === "pwd") {
        return <div className="text-green-400">/home/nexus/skills</div>
      }

      if (trimmed === "whoami") {
        return <div className="text-cyan-400">nexus (Level {characterStats.level} Cloud Architect)</div>
      }

      if (trimmed === "date") {
        return <div className="text-yellow-400">{new Date().toString()}</div>
      }

      return <div className="text-red-400">Command not found: {trimmed}. Type 'help' for available commands.</div>
    },
    [characterStats.level, processSkillCommand],
  )

  const handleCommand = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && currentInput.trim()) {
        const newHistory = [
          ...terminalHistory,
          {
            type: "command" as const,
            content: (
              <>
                <span className="text-green-400">$</span> {currentInput}
              </>
            ),
          },
          { type: "output" as const, content: processCommand(currentInput) },
        ].filter((item) => item.content !== null)

        setTerminalHistory(newHistory)
        setCommandHistory((prev) => [...prev, currentInput])
        setHistoryIndex(commandHistory.length + 1)
        setCurrentInput("")

        setTimeout(() => {
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
          }
        }, 10)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex] || "")
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex] || "")
        } else {
          setHistoryIndex(commandHistory.length)
          setCurrentInput("")
        }
      }
    },
    [currentInput, terminalHistory, commandHistory, historyIndex, processCommand],
  )

  const generateSkillMatrix = () => {
    const matrix = []
    const usedSkills = new Set<string>()
    const totalCells = 100
    const targetFillRate = 0.92 // 92% fill rate
    const targetFilledCells = Math.floor(totalCells * targetFillRate) // 92 cells

    // Initialize empty matrix
    for (let i = 0; i < totalCells; i++) {
      matrix.push({ active: false, text: "", skillKey: undefined })
    }

    // Get all available skills sorted by level (highest first)
    const allSkills = Object.keys(skills).sort((a, b) => skills[b].level - skills[a].level)

    // Strategic placement zones for high-impact skills
    const premiumZones = [0, 1, 2, 9, 10, 11, 19, 20, 21, 29] // Top-right corner prominence
    const expertZones = [3, 4, 12, 13, 22, 30, 31, 40, 41, 50] // High visibility areas
    const coreZones = [
      5, 6, 7, 8, 14, 15, 16, 17, 18, 23, 24, 25, 26, 27, 28, 32, 33, 34, 35, 36, 37, 38, 39, 42, 43, 44, 45, 46, 47,
      48, 49,
    ] // Main content area
    const supportZones = [
      51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
      79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
    ] // Extended coverage

    let skillIndex = 0

    // Fill premium zones with top-tier skills (90+ level)
    const topTierSkills = allSkills.filter((skill) => skills[skill].level >= 90)
    premiumZones.forEach((pos, index) => {
      if (index < topTierSkills.length && skillIndex < targetFilledCells) {
        const skillKey = topTierSkills[index]
        matrix[pos] = {
          active: true,
          text: skills[skillKey].abbr || skills[skillKey].name.substring(0, 2).toUpperCase(),
          skillKey: skillKey,
        }
        usedSkills.add(skillKey)
        skillIndex++
      }
    })

    // Fill expert zones with high-level skills (80-89 level)
    const expertSkills = allSkills.filter(
      (skill) => skills[skill].level >= 80 && skills[skill].level < 90 && !usedSkills.has(skill),
    )
    expertZones.forEach((pos, index) => {
      if (index < expertSkills.length && skillIndex < targetFilledCells) {
        const skillKey = expertSkills[index]
        matrix[pos] = {
          active: true,
          text: skills[skillKey].abbr || skills[skillKey].name.substring(0, 2).toUpperCase(),
          skillKey: skillKey,
        }
        usedSkills.add(skillKey)
        skillIndex++
      }
    })

    // Fill core zones with mid-high level skills (60-79 level)
    const coreSkills = allSkills.filter(
      (skill) => skills[skill].level >= 60 && skills[skill].level < 80 && !usedSkills.has(skill),
    )
    coreZones.forEach((pos, index) => {
      if (index < coreSkills.length && skillIndex < targetFilledCells) {
        const skillKey = coreSkills[index]
        matrix[pos] = {
          active: true,
          text: skills[skillKey].abbr || skills[skillKey].name.substring(0, 2).toUpperCase(),
          skillKey: skillKey,
        }
        usedSkills.add(skillKey)
        skillIndex++
      }
    })

    // Fill support zones with remaining skills
    const remainingSkills = allSkills.filter((skill) => !usedSkills.has(skill))
    supportZones.forEach((pos, index) => {
      if (index < remainingSkills.length && skillIndex < targetFilledCells) {
        const skillKey = remainingSkills[index]
        matrix[pos] = {
          active: true,
          text: skills[skillKey].abbr || skills[skillKey].name.substring(0, 2).toUpperCase(),
          skillKey: skillKey,
        }
        usedSkills.add(skillKey)
        skillIndex++
      }
    })

    setSkillMatrix(matrix)
  }

  const getSkillIcon = (skillKey: string) => {
    const iconMap: { [key: string]: string } = {
      aws: "☁️",
      gcp: "🌐",
      azure: "🔷",
      terraform: "🏗️",
      ansible: "⚙️",
      kubernetes: "☸️",
      docker: "🐳",
      helm: "⎈",
      python: "🐍",
      go: "🔷",
      javascript: "⚡",
      typescript: "📘",
      bash: "💻",
      rust: "🦀",
      sql: "🗃️",
      vault: "🔐",
      prometheus: "📊",
      grafana: "📈",
      postgresql: "🐘",
      mongodb: "🍃",
      redis: "🔴",
      jenkins: "🔧",
      gitlab: "🦊",
      github: "🐙",
      java: "☕",
    }
    return iconMap[skillKey] || "⚡"
  }

  useEffect(() => {
    generateSkillMatrix()
  }, [])

  // Random stat updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setCharacterStats((prev) => ({
          ...prev,
          xp: Number.parseInt(prev.xp.replace("K", "")) + Math.floor(Math.random() * 10) + "K",
        }))
      }

      if (Math.random() < 0.05) {
        setCharacterStats((prev) => ({
          ...prev,
          power: prev.power + Math.floor(Math.random() * 10),
        }))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cloud":
        return "bg-gradient-to-br from-sky-500 to-blue-600"
      case "infrastructure":
        return "bg-gradient-to-br from-purple-500 to-indigo-500"
      case "containers":
        return "bg-gradient-to-br from-pink-500 to-rose-500"
      case "programming":
        return "bg-gradient-to-br from-yellow-500 to-orange-500"
      case "security":
        return "bg-gradient-to-br from-green-500 to-lime-500"
      case "monitoring":
        return "bg-gradient-to-br from-teal-500 to-cyan-500"
      case "database":
        return "bg-gradient-to-br from-red-500 to-amber-500"
      case "devops":
        return "bg-gradient-to-br from-blue-500 to-fuchsia-500"
      default:
        return "bg-gray-700"
    }
  }

  const getSkillLevelColor = (level: number) => {
    if (level >= 90) {
      return "bg-green-500"
    } else if (level >= 70) {
      return "bg-lime-500"
    } else if (level >= 50) {
      return "bg-yellow-500"
    } else {
      return "bg-red-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono relative overflow-hidden">
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-20 animate-pulse" />

      {/* CRT effect */}
      <div className="fixed inset-0 pointer-events-none z-20 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Terminal Window */}
      <div className="relative z-0 min-h-screen flex flex-col">
        <CyberpunkTerminalMenu currentPage="skills" />

        {/* Terminal Body */}
        <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 bg-black/40">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* ASCII Art Header */}
            <pre className="text-cyan-400 text-xs whitespace-pre opacity-0 animate-[fadeIn_0.5s_forwards]">
              {`███████╗██╗  ██╗██╗██╗     ██╗         ████████╗██████╗ ███████╗███████╗
██╔════╝██║ ██╔╝██║██║     ██║         ╚══██╔══╝██╔══██╗██╔════╝██╔════╝
███████╗█████╔╝ ██║██║     ██║            ██║   ██████╔╝█████╗  █████╗  
╚════██║██╔═██╗ ██║██║     ██║            ██║   ██╔══██╗██╔══╝  ██╔══╝  
███████║██║  ██╗██║███████╗███████╗       ██║   ██║  ██║███████╗███████╗
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝       ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝
              [CHARACTER STATS INTERFACE v9.0.1]`}
            </pre>

            {/* Initial Command */}
            <div className="space-y-2 opacity-0 animate-[fadeIn_0.5s_forwards_0.3s]">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> cat /proc/architect/skills | analyze --level
              </div>
              <div className="text-green-400">Loading skill database...</div>
            </div>

            {/* Character Stats */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 p-4 bg-gradient-to-br from-green-500/5 to-cyan-500/5 border border-green-500/20 rounded relative opacity-0 animate-[slideIn_0.5s_forwards_0.7s]">
              <div className="absolute -top-3 left-4 bg-gray-950 px-2 text-green-400 text-xs">ARCHITECT STATS</div>
              {[
                { label: "Level", value: characterStats.level },
                { label: "Total XP", value: characterStats.xp },
                { label: "Skills", value: characterStats.skills },
                { label: "Mastered", value: characterStats.mastered },
                { label: "Certs", value: characterStats.certs },
                { label: "Power", value: characterStats.power },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-3 bg-black/50 border border-green-500/10 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent -translate-x-full animate-[slideRight_4s_infinite]" />
                  <div className="text-cyan-400 text-2xl font-bold">{stat.value}</div>
                  <div className="text-gray-500 text-xs uppercase">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* XP Progress Bar */}
            <div className="relative h-8 bg-purple-500/10 border border-purple-500/30 rounded overflow-hidden opacity-0 animate-[fadeIn_0.5s_forwards_0.9s]">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-2000"
                style={{ width: `${xpProgress}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
                Level 42 → 43 ({xpProgress}% Complete)
              </div>
            </div>

            <div className="p-6 bg-black/30 border border-green-500/20 relative opacity-0 animate-[fadeIn_0.5s_forwards_0.9s] overflow-hidden">
              {/* Animated background particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              <div className="absolute -top-3 left-4 bg-gray-950 px-2 text-cyan-400 text-xs flex items-center gap-2">
                <span className="animate-pulse">●</span>
                SKILL MATRIX v4.2.0 - {skillMatrix.filter((cell) => cell.active).length}/100 LOADED
              </div>

              {/* Advanced tooltip for hovered skill */}
              {hoveredSkill && (
                <div
                  className={`absolute left-6 right-6 bg-gray-900/95 border border-cyan-400/50 p-4 rounded-lg z-50 backdrop-blur-sm animate-[slideDown_0.2s_ease-out] ${(() => {
                    const skillIndex = skillMatrix.findIndex((cell) => cell.skillKey === hoveredSkill)
                    const rowIndex = Math.floor(skillIndex / 10)
                    return rowIndex <= 1 ? "top-16" : "bottom-16"
                  })()}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{skills[hoveredSkill].icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-cyan-400 font-bold text-lg">{skills[hoveredSkill].name}</h3>
                        <span className="px-2 py-1 bg-cyan-400/20 text-cyan-300 text-xs rounded-full">
                          Level {skills[hoveredSkill].level}
                        </span>
                        <span className="px-2 py-1 bg-purple-400/20 text-purple-300 text-xs rounded-full capitalize">
                          {skills[hoveredSkill].category}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{skills[hoveredSkill].description}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ease-out"
                            style={{ width: `${skills[hoveredSkill].level}%` }}
                          />
                        </div>
                        <span className="text-cyan-400 text-sm font-mono">{skills[hoveredSkill].level}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-10 gap-1 mb-4 relative">
                {skillMatrix.map((cell, index) => {
                  const rowIndex = Math.floor(index / 10)
                  const colIndex = index % 10
                  const skill = cell.skillKey ? skills[cell.skillKey] : null

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`aspect-square border border-green-500/20 flex flex-col items-center justify-center text-xs font-mono cursor-pointer transition-all duration-500 hover:scale-125 hover:z-20 relative group overflow-hidden ${
                        cell.active && skill
                          ? `${skill.color} bg-gradient-to-br hover:brightness-125 shadow-lg hover:shadow-2xl hover:shadow-cyan-400/25 transform-gpu`
                          : "bg-gray-900/20 hover:bg-green-500/10 hover:border-green-400/40"
                      }`}
                      onClick={() => cell.skillKey && setSelectedSkill(cell.skillKey)}
                      onMouseEnter={() => cell.skillKey && setHoveredSkill(cell.skillKey)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      style={{
                        animationDelay: `${(rowIndex + colIndex) * 50}ms`,
                      }}
                    >
                      {cell.active && skill && (
                        <>
                          {/* Advanced animated background effects */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent animate-pulse"></div>
                            <div className="absolute top-1 right-1 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
                            <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/50 rounded-full animate-pulse delay-500"></div>
                            {/* Skill level indicator particles */}
                            {skill.level >= 90 && (
                              <div className="absolute top-0 right-0 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                            )}
                            {skill.level >= 80 && (
                              <div className="absolute bottom-0 right-0 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                            )}
                          </div>

                          {/* Skill icon with enhanced styling */}
                          <div className="text-lg mb-1 filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            {skill.icon}
                          </div>

                          {/* Skill abbreviation with better typography */}
                          <div className="text-white font-bold text-xs tracking-wider drop-shadow-md group-hover:text-cyan-200 transition-colors duration-300">
                            {cell.text}
                          </div>

                          {/* Enhanced level indicator */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                            <div
                              className={`h-full transition-all duration-1000 ease-out ${
                                skill.level >= 90
                                  ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                                  : skill.level >= 80
                                    ? "bg-gradient-to-r from-blue-400 to-cyan-400"
                                    : skill.level >= 70
                                      ? "bg-gradient-to-r from-green-400 to-teal-400"
                                      : skill.level >= 60
                                        ? "bg-gradient-to-r from-purple-400 to-pink-400"
                                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                              }`}
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>

                          {/* Hover glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-blue-400/0 group-hover:from-cyan-400/20 group-hover:to-blue-400/20 transition-all duration-300 rounded-sm"></div>

                          {/* Corner accent for high-level skills */}
                          {skill.level >= 85 && (
                            <div className="absolute top-0 right-0 w-0 h-0 border-l-4 border-b-4 border-l-transparent border-b-yellow-400/60"></div>
                          )}
                        </>
                      )}

                      {/* Empty cell hover effect */}
                      {!cell.active && (
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-cyan-400/0 group-hover:from-green-400/10 group-hover:to-cyan-400/10 transition-all duration-300"></div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Matrix statistics */}
              <div className="flex justify-between items-center text-xs text-gray-400 mt-4">
                <div className="flex gap-4">
                  <span>Expert (90+): {Object.values(skills).filter((s) => s.level >= 90).length}</span>
                  <span>
                    Advanced (80+): {Object.values(skills).filter((s) => s.level >= 80 && s.level < 90).length}
                  </span>
                  <span>
                    Proficient (60+): {Object.values(skills).filter((s) => s.level >= 60 && s.level < 80).length}
                  </span>
                </div>
                <div className="text-cyan-400">
                  {skillMatrix.filter((cell) => cell.active).length}/100 skills loaded
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-2 opacity-0 animate-[fadeIn_0.5s_forwards_1.5s]">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> ls -la /certifications/*.cert | head -8
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gradient-to-br from-yellow-500/5 to-yellow-500/[0.02] border border-yellow-500/30 text-center relative hover:bg-yellow-500/10 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="absolute top-2 right-2 text-yellow-400">✓</div>
                    <div className="text-3xl mb-2">{cert.icon}</div>
                    <div className="text-yellow-400 font-semibold text-sm">{cert.name}</div>
                    <div className="text-gray-500 text-xs mt-1">{cert.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Power Level Display */}
            <div className="space-y-2 opacity-0 animate-[fadeIn_0.5s_forwards_2.1s]">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> scouter --measure-power-level
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500 relative">
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                  {characterStats.power}
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-sm mt-2">POWER LEVEL</div>
                <div className="text-yellow-400 mt-4 animate-pulse">⚠️ IT'S OVER 9000!!! ⚠️</div>
              </div>
            </div>

            {/* Radar Skills Display */}
            <div className="space-y-2 opacity-0 animate-[fadeIn_0.5s_forwards_2.5s]">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> radar --scan-abilities
              </div>

              <div className="flex justify-center">
                <div className="w-96 h-96 relative bg-black/30 border border-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="absolute inset-0" viewBox="0 0 400 400">
                    {/* Pentagon Grid */}
                    <polygon
                      points="200,50 350,150 300,350 100,350 50,150"
                      fill="none"
                      stroke="rgba(34,197,94,0.1)"
                      strokeWidth="1"
                    />
                    <polygon
                      points="200,100 300,170 270,300 130,300 100,170"
                      fill="none"
                      stroke="rgba(34,197,94,0.2)"
                      strokeWidth="1"
                    />
                    <polygon
                      points="200,150 250,190 240,250 160,250 150,190"
                      fill="none"
                      stroke="rgba(34,197,94,0.3)"
                      strokeWidth="1"
                    />

                    {/* Skill Areas */}
                    <polygon
                      points="200,60 340,160 290,340 110,340 60,160"
                      fill="rgba(0,217,255,0.3)"
                      stroke="rgb(0,217,255)"
                      strokeWidth="2"
                    />

                    {/* Labels */}
                    <text x="200" y="40" textAnchor="middle" fill="rgb(0,217,255)" fontSize="12">
                      CLOUD
                    </text>
                    <text x="360" y="150" textAnchor="middle" fill="rgb(0,217,255)" fontSize="12">
                      SECURITY
                    </text>
                    <text x="320" y="360" textAnchor="middle" fill="rgb(0,217,255)" fontSize="12">
                      DEVOPS
                    </text>
                    <text x="80" y="360" textAnchor="middle" fill="rgb(0,217,255)" fontSize="12">
                      CODING
                    </text>
                    <text x="40" y="150" textAnchor="middle" fill="rgb(0,217,255)" fontSize="12">
                      DATA
                    </text>

                    {/* Center Point */}
                    <circle cx="200" cy="200" r="3" fill="rgb(34,197,94)" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Commands Help */}
            <div className="space-y-2 opacity-0 animate-[fadeIn_0.5s_forwards_2.9s]">
              <div className="text-gray-300">
                <span className="text-green-400">$</span> echo "Interactive skill commands available:"
              </div>

              <div className="text-cyan-300 text-sm">
                • Type <span className="text-yellow-400">help</span> for all commands
                <br />• Type <span className="text-yellow-400">learn [skill]</span> to practice a skill
                <br />• Type <span className="text-yellow-400">test [skill]</span> to test your knowledge
                <br />• Type <span className="text-yellow-400">battle</span> for skills combat mode
                <br />• Type <span className="text-yellow-400">upgrade</span> to level up abilities
                <br />• Type <span className="text-yellow-400">compare [skill]</span> to see market comparison
                <br />• Type <span className="text-yellow-400">roadmap</span> for learning path
                <br />• Try <span className="text-yellow-400">unlock</span>,{" "}
                <span className="text-yellow-400">cheat</span>, or <span className="text-yellow-400">godmode</span> for
                surprises!
              </div>
            </div>

            {/* Terminal History */}
            {terminalHistory.map((entry, i) => (
              <div key={i} className={entry.type === "command" ? "text-gray-300" : "text-gray-400"}>
                {entry.content}
              </div>
            ))}

            {/* Input Line */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-green-500/10 opacity-0 animate-[fadeIn_0.5s_forwards_3.3s]">
              <span className="text-green-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleCommand}
                className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-600"
                placeholder="Type 'help' for commands, or try 'learn python', 'test kubernetes', 'battle', 'godmode'..."
                autoFocus
              />
              <span className="w-2 h-5 bg-green-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          to { transform: translateX(200%); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
