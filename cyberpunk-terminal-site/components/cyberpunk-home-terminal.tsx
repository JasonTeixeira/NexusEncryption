"use client"

import { useMemo } from "react"

import type React from "react"
import { useState, useEffect, useRef, useCallback, memo } from "react"
import CyberpunkTerminalMenu from "./cyberpunk-terminal-menu"
import { useAnalytics } from "@/hooks/use-analytics"
import { useOptimizedArray, useDebouncedState } from "@/hooks/use-optimized-state"
import LiveDataDashboard from "./live-data-dashboard"
import PerformanceMonitor from "./performance-monitor"
import { MatrixRain, ParticleField, HolographicCard, NeuralNetwork, GlitchText, CyberGrid } from "./advanced-effects"

interface SystemStatus {
  uptime: string
  requests: string
  latency: string
  costSaved: string
}

interface ActivityMessage {
  type: "info" | "success" | "warning" | "error"
  message: string
}

// Memoized terminal history item component for better performance
const TerminalHistoryItem = memo(
  ({
    item,
    index,
  }: {
    item: { type: "command" | "output"; content: React.ReactNode; id: string }
    index: number
  }) => (
    <div className="flex items-start gap-2" key={item.id}>
      {item.type === "command" && (
        <div className="text-green-400 font-mono" aria-label="Command prompt">
          {item.content}
        </div>
      )}
      {item.type === "output" && (
        <div className="text-gray-300 font-mono" role="status">
          {item.content}
        </div>
      )}
    </div>
  ),
)

TerminalHistoryItem.displayName = "TerminalHistoryItem"

// Memoized system status component
const SystemStatusDisplay = memo(({ status }: { status: SystemStatus }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-green-500/20 rounded bg-green-500/5 opacity-0 animate-[fadeIn_0.5s_forwards_3.5s] glass-card card-hover-effect">
    <div>
      <div className="text-gray-500 text-xs uppercase">Uptime</div>
      <div className="text-cyan-400 text-2xl font-bold">{status.uptime}</div>
    </div>
    <div>
      <div className="text-gray-500 text-xs uppercase">Requests/Day</div>
      <div className="text-cyan-400 text-2xl font-bold">{status.requests}</div>
    </div>
    <div>
      <div className="text-gray-500 text-xs uppercase">Latency</div>
      <div className="text-cyan-400 text-2xl font-bold">{status.latency}</div>
    </div>
    <div>
      <div className="text-gray-500 text-xs uppercase">Cost Saved</div>
      <div className="text-cyan-400 text-2xl font-bold">{status.costSaved}</div>
    </div>
  </div>
))

SystemStatusDisplay.displayName = "SystemStatusDisplay"

export default function CyberpunkHomeTerminal() {
  // Using optimized array hook for better performance
  const terminalHistory = useOptimizedArray<{ type: "command" | "output"; content: React.ReactNode; id: string }>([])
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    uptime: "99.99%",
    requests: "2.4M",
    latency: "12ms",
    costSaved: "$127K",
  })
  const [visitorTime, setVisitorTime] = useState(0)
  const [konamiCode, setKonamiCode] = useState<string[]>([])
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)
  const { trackEvent } = useAnalytics()

  // Using debounced state for input to reduce re-renders
  const [debouncedInput, setDebouncedInput] = useDebouncedState("", 100)

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const commandIdCounter = useRef(0)

  // Memoized konami pattern to prevent recreation
  const konamiPattern = useMemo(
    () => [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ],
    [],
  )

  // Memoized commands object to prevent recreation on every render
  const commands = useMemo(
    () => ({
      help: {
        execute: () => (
          <div className="space-y-1">
            <div className="text-green-400 mb-2">NEXUS CLOUD INFRASTRUCTURE SYSTEM v4.2.1</div>
            <div className="text-gray-400">Available commands:</div>
            <div className="ml-4 space-y-1">
              <div>
                <span className="text-cyan-400">dashboard</span> - Live data command center
              </div>
              <div>
                <span className="text-cyan-400">status</span> - System status overview
              </div>
              <div>
                <span className="text-cyan-400">monitor</span> - Real-time monitoring
              </div>
              <div>
                <span className="text-cyan-400">github</span> - GitHub statistics
              </div>
              <div>
                <span className="text-cyan-400">cloud</span> - Multi-cloud metrics
              </div>
              <div>
                <span className="text-cyan-400">professional</span> - Professional profile data
              </div>
              <div>
                <span className="text-cyan-400">analytics</span> - Website analytics
              </div>
              <div>
                <span className="text-cyan-400">about</span> - Learn about the architect
              </div>
              <div>
                <span className="text-cyan-400">projects</span> - View project portfolio
              </div>
              <div>
                <span className="text-cyan-400">skills</span> - Technical skills matrix
              </div>
              <div>
                <span className="text-cyan-400">contact</span> - Get in touch
              </div>
              <div>
                <span className="text-cyan-400">clear</span> - Clear terminal history
              </div>
            </div>
          </div>
        ),
        description: "Show available commands",
      },
      dashboard: {
        execute: () => {
          trackEvent("interaction", { type: "live_dashboard_viewed" })
          return <LiveDataDashboard />
        },
        description: "Display comprehensive live data dashboard with real-time metrics",
      },
      status: {
        execute: () => (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">System Status Overview</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>
            <div className="text-gray-400 space-y-1">
              <div>
                <span className="text-cyan-300">System Uptime:</span> {systemStatus.uptime}
              </div>
              <div>
                <span className="text-cyan-300">Requests/Day:</span> {systemStatus.requests}
              </div>
              <div>
                <span className="text-cyan-300">Avg Latency:</span> {systemStatus.latency}
              </div>
              <div>
                <span className="text-cyan-300">Cost Saved:</span> {systemStatus.costSaved}
              </div>
            </div>
            <div className="text-green-400">All systems operational</div>
          </div>
        ),
        description: "Show system status overview",
      },
      monitor: {
        execute: () => {
          setShowPerformanceMonitor(!showPerformanceMonitor)
          return (
            <div className="text-green-400">Performance monitor {showPerformanceMonitor ? "disabled" : "enabled"}</div>
          )
        },
        description: "Toggle real-time monitoring",
      },
      github: {
        execute: () => (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">GitHub Statistics</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>
            <div className="text-gray-400 space-y-1">
              <div>
                <span className="text-cyan-300">Stars:</span> 127K
              </div>
              <div>
                <span className="text-cyan-300">Forks:</span> 42K
              </div>
              <div>
                <span className="text-cyan-300">Open Issues:</span> 42
              </div>
              <div>
                <span className="text-cyan-300">Contributors:</span> 127
              </div>
            </div>
            <div className="text-green-400">GitHub is where it's at!</div>
          </div>
        ),
        description: "Show GitHub statistics",
      },
      cloud: {
        execute: () => (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">Multi-Cloud Metrics</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>
            <div className="text-gray-400 space-y-1">
              <div>
                <span className="text-cyan-300">AWS:</span> 42 services
              </div>
              <div>
                <span className="text-cyan-300">GCP:</span> 127 services
              </div>
              <div>
                <span className="text-cyan-300">Azure:</span> 99 services
              </div>
            </div>
            <div className="text-green-400">Multi-cloud mastery achieved</div>
          </div>
        ),
        description: "Show multi-cloud metrics",
      },
      professional: {
        execute: () => (
          <div className="space-y-3">
            <div className="text-cyan-400 font-bold">Professional Profile Data</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>
            <div className="text-gray-400 space-y-1">
              <div>
                <span className="text-cyan-300">Experience:</span> 12 years
              </div>
              <div>
                <span className="text-cyan-300">Certifications:</span> AWS Certified Solutions Architect, GCP
                Professional Cloud Architect
              </div>
              <div>
                <span className="text-cyan-300">Languages:</span> TypeScript, Python, Bash
              </div>
              <div>
                <span className="text-cyan-300">Tools:</span> Terraform, Kubernetes, Istio
              </div>
            </div>
            <div className="text-green-400">Professional excellence</div>
          </div>
        ),
        description: "Show professional profile data",
      },
      analytics: {
        execute: () => (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">Website Analytics</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>
            <div className="text-gray-400 space-y-1">
              <div>
                <span className="text-cyan-300">Visitors:</span> 127K
              </div>
              <div>
                <span className="text-cyan-300">Sessions:</span> 420K
              </div>
              <div>
                <span className="text-cyan-300">Conversion Rate:</span> 2.4%
              </div>
            </div>
            <div className="text-green-400">Data-driven decisions</div>
          </div>
        ),
        description: "Show website analytics",
      },
      about: {
        execute: () => (
          <div className="space-y-3">
            <div className="text-cyan-400 font-bold">About Me</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>
            <div className="text-gray-400">
              I'm a <span className="text-cyan-300">Cloud Architect</span> and{" "}
              <span className="text-cyan-300">Infrastructure Engineer</span> with expertise in:
            </div>
            <div className="text-gray-400 space-y-1">
              • Designing scalable cloud solutions on AWS, GCP, and Azure
              <br />• Implementing zero-trust security architectures
              <br />• Optimizing infrastructure costs (saved companies $2M+ annually)
              <br />• Building CI/CD pipelines and GitOps workflows
              <br />• Managing Kubernetes clusters at scale
              <br />• Developing Infrastructure as Code with Terraform
            </div>
            <div className="text-green-400">Currently accepting new opportunities for challenging projects.</div>
          </div>
        ),
        description: "Learn about the architect",
      },
      projects: {
        execute: () => (
          <div className="space-y-3">
            <div className="text-cyan-400 font-bold">Featured Projects</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>
            <div className="space-y-3">
              <div>
                <div className="text-cyan-300">[1] Global CDN Infrastructure</div>
                <div className="text-gray-400 text-sm pl-4">
                  • 12 AWS regions, 50ms global latency
                  <br />• 99.99% uptime, 500TB daily traffic
                  <br />• Tech: CloudFront, Lambda@Edge, S3
                  <br />• Saved: $47K/month
                </div>
              </div>
              <div>
                <div className="text-cyan-300">[2] Kubernetes Auto-Scaler</div>
                <div className="text-gray-400 text-sm pl-4">
                  • Custom HPA metrics, 0-10K pods
                  <br />• 70% cost reduction during off-peak
                  <br />• Tech: EKS, Prometheus, KEDA
                  <br />• Response time: &lt;100ms
                </div>
              </div>
              <div>
                <div className="text-cyan-300">[3] Zero-Trust Security Mesh</div>
                <div className="text-gray-400 text-sm pl-4">
                  • mTLS everywhere, RBAC, real-time threat detection
                  <br />• 0 security breaches in 2 years
                  <br />• Tech: Istio, OPA, Falco
                  <br />• Compliance: SOC2, HIPAA
                </div>
              </div>
            </div>
            <div className="text-yellow-400 text-sm">
              Type <span className="text-white">project [number]</span> for more details
            </div>
          </div>
        ),
        description: "View project portfolio",
      },
      skills: {
        execute: () => (
          <div className="space-y-3">
            <div className="text-cyan-400 font-bold">Technical Skills</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>
            <div className="space-y-3">
              <div>
                <div className="text-cyan-300">Cloud Platforms:</div>
                <div className="space-y-1 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-20">AWS</span>
                    <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden max-w-xs">
                      <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500" style={{ width: "95%" }} />
                    </div>
                    <span className="text-green-400 text-sm">95%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-20">GCP</span>
                    <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden max-w-xs">
                      <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500" style={{ width: "80%" }} />
                    </div>
                    <span className="text-green-400 text-sm">80%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-20">Azure</span>
                    <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden max-w-xs">
                      <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500" style={{ width: "60%" }} />
                    </div>
                    <span className="text-green-400 text-sm">60%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
        description: "Show technical skills matrix",
      },
      contact: {
        execute: () => (
          <div className="space-y-3">
            <div className="text-cyan-400 font-bold">Contact Information</div>
            <div className="text-gray-500">{"─".repeat(40)}</div>
            <div className="space-y-1 text-gray-400">
              <div>
                <span className="text-cyan-300">Email:</span> architect@nexus.dev
              </div>
              <div>
                <span className="text-cyan-300">GitHub:</span> github.com/nexus-architect
              </div>
              <div>
                <span className="text-cyan-300">LinkedIn:</span> linkedin.com/in/nexus-architect
              </div>
              <div>
                <span className="text-cyan-300">Location:</span> San Francisco, CA | Remote
              </div>
            </div>
            <div className="text-green-400">Response time: Usually within 24 hours</div>
          </div>
        ),
        description: "Get in touch",
      },
      clear: {
        execute: () => {
          terminalHistory.clearArray()
          return null
        },
        description: "Clear terminal history",
      },
      stats: {
        execute: () => {
          const uptime = (99.9 + Math.random() * 0.09).toFixed(2)
          const requests = (2.3 + Math.random() * 0.4).toFixed(1)
          const latency = Math.floor(10 + Math.random() * 10)
          const cost = Math.floor(3000 + Math.random() * 500)

          return (
            <div className="space-y-2">
              <div className="text-cyan-400 font-bold">Live Infrastructure Statistics</div>
              <div className="text-gray-500">{"─".repeat(40)}</div>
              <div className="text-gray-400 space-y-1">
                <div>
                  <span className="text-cyan-300">System Uptime:</span> {uptime}%
                </div>
                <div>
                  <span className="text-cyan-300">Requests/Day:</span> {requests}M
                </div>
                <div>
                  <span className="text-cyan-300">Avg Latency:</span> {latency}ms
                </div>
                <div>
                  <span className="text-cyan-300">Today's AWS Cost:</span> ${cost}
                </div>
                <div>
                  <span className="text-cyan-300">Active Services:</span> 42
                </div>
                <div>
                  <span className="text-cyan-300">Running Pods:</span> 127
                </div>
                <div>
                  <span className="text-cyan-300">Error Rate:</span> 0.001%
                </div>
              </div>
              <div className="text-green-400">All systems operational</div>
            </div>
          )
        },
        description: "Show live infrastructure statistics",
      },
      hack: {
        execute: () => (
          <div className="space-y-2">
            <div className="text-red-400 font-bold">ACCESS DENIED</div>
            <div className="text-gray-400">
              Nice try! But this system is protected by:
              <br />• AWS WAF with custom rules
              <br />• DDoS protection
              <br />• Rate limiting
              <br />• Intrusion detection
              <br />• And a very paranoid architect
            </div>
            <div className="text-yellow-400">Your attempt has been logged. Just kidding! 😄</div>
          </div>
        ),
        description: "Try to hack the system",
      },
      ls: {
        execute: () => (
          <div className="font-mono text-sm">
            <div>
              <span className="text-cyan-300">drwxr-xr-x</span> 2 nexus nexus 4096 Jan 1 00:00{" "}
              <span className="text-cyan-400">projects/</span>
            </div>
            <div>
              <span className="text-cyan-300">drwxr-xr-x</span> 2 nexus nexus 4096 Jan 1 00:00{" "}
              <span className="text-cyan-400">infrastructure/</span>
            </div>
            <div>
              <span className="text-cyan-300">drwxr-xr-x</span> 2 nexus nexus 4096 Jan 1 00:00{" "}
              <span className="text-cyan-400">security/</span>
            </div>
            <div>
              <span className="text-cyan-300">drwxr-xr-x</span> 2 nexus nexus 4096 Jan 1 00:00{" "}
              <span className="text-cyan-400">scripts/</span>
            </div>
            <div>
              <span className="text-cyan-300">-rw-r--r--</span> 1 nexus nexus 2048 Jan 1 00:00 README.md
            </div>
            <div>
              <span className="text-cyan-300">-rw-r--r--</span> 1 nexus nexus 1337 Jan 1 00:00 terraform.tf
            </div>
            <div>
              <span className="text-cyan-300">-rw-r--r--</span> 1 nexus nexus 420 Jan 1 00:00 .env.encrypted
            </div>
            <div>
              <span className="text-cyan-300">-rwxr-xr-x</span> 1 nexus nexus 8192 Jan 1 00:00{" "}
              <span className="text-green-400">deploy.sh</span>
            </div>
            <div>
              <span className="text-cyan-300">drwx------</span> 2 nexus nexus 4096 Jan 1 00:00{" "}
              <span className="text-red-400">.secrets/</span>
            </div>
          </div>
        ),
        description: "List directory",
      },
      ping: {
        execute: () => {
          const services = ["api-gateway", "database", "cache", "cdn"]
          const service = services[Math.floor(Math.random() * services.length)]
          const latency = Math.floor(Math.random() * 50) + 10

          return (
            <div className="font-mono text-sm text-gray-400">
              <div>
                PING {service}.nexus.cloud (10.0.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}):
                56 data bytes
              </div>
              <div>
                64 bytes from {service}: icmp_seq=0 ttl=64 time={latency}.{Math.floor(Math.random() * 999)} ms
              </div>
              <div>
                64 bytes from {service}: icmp_seq=1 ttl=64 time={latency + 2}.{Math.floor(Math.random() * 999)} ms
              </div>
              <div>
                64 bytes from {service}: icmp_seq=2 ttl=64 time={latency - 1}.{Math.floor(Math.random() * 999)} ms
              </div>
              <div>
                64 bytes from {service}: icmp_seq=3 ttl=64 time={latency + 1}.{Math.floor(Math.random() * 999)} ms
              </div>
              <div className="mt-2">--- {service}.nexus.cloud ping statistics ---</div>
              <div>
                4 packets transmitted, 4 packets received, <span className="text-green-400">0.0% packet loss</span>
              </div>
            </div>
          )
        },
        description: "Test connection",
      },
      ssh: {
        execute: () => (
          <div className="space-y-2">
            <div className="text-yellow-400">Connecting to production-server...</div>
            <div className="text-gray-400">
              The authenticity of host 'production-server (10.0.1.42)' can't be established.
              <br />
              ED25519 key fingerprint is SHA256:xXx0xXx0xXx0xXx0xXx0xXx0xXx0xXx0xXx0xXx.
              <br />
              Are you sure you want to continue connecting (yes/no/[fingerprint])?
            </div>
            <div className="text-red-400">Permission denied (publickey).</div>
            <div className="text-cyan-300">Nice try! Production access requires proper authentication.</div>
            <div className="text-green-400">But I appreciate the attempt. You're hired! (just kidding... or am I?)</div>
          </div>
        ),
        description: "Remote connect",
      },
      top: {
        execute: () => (
          <div className="font-mono text-xs text-gray-400">
            <div className="text-cyan-400">Tasks: 127 total, 3 running, 124 sleeping, 0 stopped, 0 zombie</div>
            <div className="text-cyan-400">
              %Cpu(s): 42.7 us, 8.3 sy, 0.0 ni, 47.2 id, 1.5 wa, 0.0 hi, 0.3 si, 0.0 st
            </div>
            <div className="text-cyan-400">MiB Mem: 16384.0 total, 4096.2 free, 8192.5 used, 4095.3 buff/cache</div>
            <div className="mt-2"> PID USER PR NI VIRT RES SHR S %CPU %MEM TIME+ COMMAND</div>
            <div>
              {" "}
              2847 nexus 20 0 847.2m 127.4m 42.0m S <span className="text-yellow-400">78.4</span> 12.7 4:20.42{" "}
              <span className="text-cyan-300">kubernetes</span>
            </div>
            <div>
              {" "}
              1337 nexus 20 0 512.0m 84.2m 21.3m S 42.1 8.4 2:15.18 <span className="text-cyan-300">docker</span>
            </div>
            <div>
              {" "}
              420 nexus 20 0 256.8m 64.7m 12.8m S 21.7 6.4 1:08.73 <span className="text-cyan-300">terraform</span>
            </div>
          </div>
        ),
        description: "Show processes",
      },
      whoami: {
        execute: () => (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">nexus (Cloud Architect)</div>
            <div className="text-gray-400 text-sm">
              UID: 1337
              <br />
              GID: 1337
              <br />
              Groups: sudo, docker, kubernetes, aws-admins
              <br />
              Shell: /bin/zsh
              <br />
              Home: /home/nexus
              <br />
              <span className="text-green-400">Security Clearance: MAXIMUM</span>
            </div>
          </div>
        ),
        description: "Show user info",
      },
      date: {
        execute: () => <div className="text-cyan-300">{new Date().toString()}</div>,
        description: "Show current date",
      },
      weather: {
        execute: () => {
          const conditions = ["☀️ Sunny", "☁️ Cloudy", "🌧️ Rainy", "⛈️ Stormy"]
          const condition = conditions[Math.floor(Math.random() * conditions.length)]
          const temp = Math.floor(Math.random() * 30) + 60

          return (
            <div className="space-y-1">
              <div className="text-cyan-400 font-bold">Weather in The Cloud:</div>
              <div className="text-gray-400">
                {condition} {temp}°F
              </div>
              <div className="text-cyan-300">Server Room: Always 68°F 😎</div>
              <div className="text-yellow-400">Chance of system downtime: 0.01%</div>
            </div>
          )
        },
        description: "Check weather",
      },
      "sudo rm -rf /": {
        execute: () => (
          <div className="space-y-2">
            <div className="text-red-400 font-bold animate-pulse">WARNING: DESTRUCTIVE COMMAND DETECTED!</div>
            <div className="text-gray-400">Deleting system files{"...".padEnd(20, ".")}</div>
            <div className="text-green-400">Just kidding! Nice try though 😈</div>
            <div className="text-cyan-300">Your hacking attempt has been logged and sent to... nobody.</div>
            <div className="text-yellow-400">+10 hacker points awarded!</div>
          </div>
        ),
        description: "Attempt to delete system files",
      },
      matrix: {
        execute: () => {
          document.body.style.filter = "hue-rotate(120deg) saturate(2)"
          setTimeout(() => {
            document.body.style.filter = ""
          }, 2000)
          return <div className="text-green-400 text-xl animate-pulse">Wake up, Neo... The Matrix has you...</div>
        },
        description: "Activate Matrix effect",
      },
      vim: {
        execute: () => (
          <div className="space-y-2">
            <div className="text-red-400">Error: Vim detected!</div>
            <div className="text-gray-400">
              You're now stuck in vim. Here are your options:
              <br />
              1. Panic
              <br />
              2. Try random key combinations
              <br />
              3. Restart your computer
              <br />
              4. Accept your fate
            </div>
            <div className="text-cyan-300">Just kidding! Type :q! to exit (but you knew that, right?)</div>
          </div>
        ),
        description: "Attempt to use Vim",
      },
      "make coffee": {
        execute: () => (
          <div className="space-y-2">
            <div className="text-cyan-300">Brewing coffee...</div>
            <div className="text-green-400">☕ Coffee is ready!</div>
            <div className="text-gray-400">
              Your productivity has increased by 200%!
              <br />
              Side effects may include:
              <br />- Increased typing speed
              <br />- Sudden urge to refactor everything
              <br />- Ability to read Matrix code
            </div>
          </div>
        ),
        description: "Make coffee",
      },
      neofetch: {
        execute: () => (
          <div className="font-mono text-xs">
            <div className="flex gap-4">
              <pre className="text-cyan-400">_____ / \ / \ / \ / | \ / | \ / | \ /______|_______\</pre>
              <div className="text-gray-400">
                <div>nexus@architect</div>
                <div>---------------</div>
                <div>OS: Linux 6.x.x-arch</div>
                <div>Uptime: ∞</div>
                <div>Shell: zsh</div>
                <div>Terminal: NEXUS v2.4.1</div>
                <div>CPU: Neural Processor @ ∞GHz</div>
                <div>Memory: 42TB / ∞TB</div>
                <div>Disk: 1.21 PB / ∞PB</div>
                <div>Skills: Maximum</div>
                <div>
                  Coffee Level: <span className="text-yellow-400">LOW - REFILL NEEDED</span>
                </div>
              </div>
            </div>
          </div>
        ),
        description: "Show system info",
      },
      "hire me": {
        execute: () => (
          <div className="space-y-3">
            <div className="text-yellow-400 text-2xl font-bold animate-pulse">🎉 CONGRATULATIONS! 🎉</div>
            <div className="text-gray-400">You've made an excellent decision!</div>
            <div className="text-green-400">Generating employment contract...</div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-cyan-500 animate-pulse"
                style={{ width: "100%" }}
              />
            </div>
            <div className="text-cyan-300">Next Steps:</div>
            <div className="text-gray-400 pl-4">
              1. 📧 Send offer letter to: architect@nexus.dev
              <br />
              2. 🤝 Schedule onboarding call
              <br />
              3. 🚀 Prepare for awesome projects
              <br />
              4. ☕ Stock up on coffee
            </div>
            <div className="text-yellow-400">Warning: Side effects may include:</div>
            <div className="text-gray-400 pl-4">
              - Dramatically improved infrastructure
              <br />- Significant cost savings
              <br />- Enhanced security posture
              <br />- Team happiness increase
              <br />- General awesomeness
            </div>
            <div className="text-green-400">Thank you for using NEXUS ARCHITECT Terminal v2.4.1</div>
            <div className="text-cyan-400 font-bold">Let's build something amazing together!</div>
          </div>
        ),
        description: "Hire the architect",
      },
      cowsay: {
        execute: () => (
          <pre className="text-gray-400 text-xs whitespace-pre opacity-0 animate-[fadeIn_0.5s_forwards]">
            _______________________________ &lt; You should definitely hire me! &gt; ------------------------------- \
            ^__^ \ (oo)\_______ (__)\ )\/\ ||----w | || ||
          </pre>
        ),
        description: "Show a cowsay message",
      },
      fortune: {
        execute: () => {
          const fortunes = [
            "A new job opportunity awaits you.",
            "Your code will compile on the first try.",
            "You will find the missing semicolon.",
            "Today is a good day to push to production.",
            "Your pull request will be approved without changes.",
            "The bug is not in your code, it's in the requirements.",
            "You will successfully exit vim.",
            "Your Docker build will cache perfectly.",
          ]
          return <div className="text-cyan-400">🔮 {fortunes[Math.floor(Math.random() * fortunes.length)]} 🔮</div>
        },
        description: "Show a random fortune",
      },
      sl: {
        execute: () => (
          <div className="space-y-2">
            <div className="text-cyan-300">Did you mean: ls ?</div>
            <div className="text-gray-400">
              🚂🚃🚃🚃 <span className="text-green-400">CHOO CHOO!</span>
            </div>
            <div className="text-gray-400">The train has left the station... with your job offer!</div>
          </div>
        ),
        description: "Show a train message",
      },
      history: {
        execute: () => {
          if (commandHistory.length === 0) return "No commands in history yet."
          return (
            <div className="space-y-1 text-gray-400 text-sm">
              <div className="text-cyan-400">Command History:</div>
              {commandHistory.slice(-10).map((cmd, i) => (
                <div key={i}>
                  {commandHistory.length - 10 + i + 1} {cmd}
                </div>
              ))}
            </div>
          )
        },
        description: "Show command history",
      },
    }),
    [terminalHistory, showPerformanceMonitor],
  )

  const specialCommands: Record<string, (args?: string) => React.ReactNode> = {
    cat: (filename) => {
      if (!filename) {
        return (
          <div className="text-yellow-400">
            Usage: cat [filename]
            <br />
            Try: <span className="text-cyan-300">cat README.md</span> or{" "}
            <span className="text-cyan-300">cat terraform.tf</span>
          </div>
        )
      }

      if (filename === "readme.md" || filename === "README.md") {
        return (
          <div className="space-y-2 text-gray-400">
            <div className="text-cyan-400 font-bold"># NEXUS ARCHITECT</div>
            <div>Building the future of cloud infrastructure, one deployment at a time.</div>
            <div className="text-cyan-300">## Current Focus</div>
            <div className="pl-4">
              - Zero-trust security architectures
              <br />- Multi-cloud orchestration
              <br />- Cost optimization strategies
              <br />- Chaos engineering practices
            </div>
            <div className="text-cyan-300">## Infrastructure Stats</div>
            <div className="pl-4">
              - <span className="text-green-400">42 production deployments</span>
              <br />- <span className="text-green-400">$2M+ saved annually</span>
              <br />- <span className="text-green-400">99.99% uptime achieved</span>
              <br />- <span className="text-green-400">0 security breaches</span>
            </div>
            <div className="text-cyan-300">EOF</div>
          </div>
        )
      }

      return <div className="text-red-400">cat: {filename}: No such file or directory</div>
    },

    project: (num) => {
      const projects: Record<string, React.ReactNode> = {
        "1": (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">Global CDN Infrastructure</div>
            <div className="text-gray-400">
              A massively distributed content delivery network spanning 12 AWS regions.
            </div>
            <div className="text-cyan-300">Architecture:</div>
            <div className="text-gray-400 pl-4 text-sm">
              - CloudFront with custom Lambda@Edge functions
              <br />- S3 origins with intelligent tiering
              <br />- Real-time log processing with Kinesis
              <br />- Auto-scaling based on traffic patterns
            </div>
            <div className="text-green-400">Results:</div>
            <div className="text-gray-400 pl-4 text-sm">
              - 50ms global latency (p99)
              <br />- 99.99% uptime over 2 years
              <br />- $47K/month cost reduction
              <br />- 500TB daily traffic handled
            </div>
          </div>
        ),
        "2": (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">Kubernetes Auto-Scaler</div>
            <div className="text-gray-400">Custom horizontal pod autoscaler with predictive scaling using ML.</div>
            <div className="text-cyan-300">Features:</div>
            <div className="text-gray-400 pl-4 text-sm">
              - Predictive scaling using Prophet
              <br />- Custom metrics from Prometheus
              <br />- Cost-aware scaling decisions
              <br />- Multi-cluster management
            </div>
          </div>
        ),
        "3": (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">Zero-Trust Security Mesh</div>
            <div className="text-gray-400">Complete zero-trust architecture implementation for microservices.</div>
            <div className="text-cyan-300">Security Features:</div>
            <div className="text-gray-400 pl-4 text-sm">
              - mTLS everywhere (Istio service mesh)
              <br />- RBAC with OPA policies
              <br />- Real-time threat detection (Falco)
              <br />- Automated incident response
            </div>
          </div>
        ),
      }

      return projects[num || ""] || <div className="text-red-400">Project {num} not found</div>
    },
  }

  // Memoized process command function with better performance
  const processCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim().toLowerCase()
      if (!trimmed) return null

      // Check exact commands
      if (commands[trimmed as keyof typeof commands]) {
        return commands[trimmed as keyof typeof commands].execute()
      }

      // Fun responses for unknown commands
      const responses = [
        `Command not found: ${trimmed}`,
        `bash: ${trimmed}: command not found`,
        `'${trimmed}' is not recognized as an internal or external command`,
        `zsh: command not found: ${trimmed}`,
      ]

      return (
        <div className="text-red-400">
          {responses[Math.floor(Math.random() * responses.length)]}
          <br />
          Type <span className="text-cyan-300">help</span> for available commands.
        </div>
      )
    },
    [commands],
  )

  // Optimized command handler with better performance
  const handleCommand = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && currentInput.trim()) {
        const commandId = `cmd-${++commandIdCounter.current}`
        const outputId = `out-${commandIdCounter.current}`

        const commandItem = {
          type: "command" as const,
          content: (
            <>
              <span className="text-green-400">$</span> {currentInput}
            </>
          ),
          id: commandId,
        }

        const outputContent = processCommand(currentInput)
        const outputItem = outputContent
          ? {
              type: "output" as const,
              content: outputContent,
              id: outputId,
            }
          : null

        // Using optimized array methods with size limit
        terminalHistory.addItemWithLimit(commandItem, 500)
        if (outputItem) {
          terminalHistory.addItemWithLimit(outputItem, 500)
        }

        setCommandHistory((prev) => [...prev.slice(-100), currentInput]) // Limit command history
        setHistoryIndex(commandHistory.length + 1)
        setCurrentInput("")

        // Optimized scrolling with requestAnimationFrame
        requestAnimationFrame(() => {
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
          }
        })
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

  // Optimized activity messages with cleanup and limits
  useEffect(() => {
    const activities: ActivityMessage[] = [
      { type: "info", message: "[Docker] Container health check passed" },
      { type: "success", message: "[K8s] Pod autoscaled: replicas 3 → 5" },
      { type: "warning", message: "[CloudWatch] CPU usage spike detected: 78%" },
      { type: "info", message: "[Lambda] Function invoked: processPayment()" },
      { type: "success", message: "[CI/CD] Deployment successful to production" },
      { type: "info", message: "[Terraform] Infrastructure drift detected" },
      { type: "success", message: "[Security] All scans passed" },
      { type: "warning", message: "[Cost Alert] Daily spend: $3,247" },
    ]

    const interval = setInterval(() => {
      if (Math.random() < 0.1 && terminalHistory.array.length < 400) {
        // Prevent memory bloat
        const activity = activities[Math.floor(Math.random() * activities.length)]
        const colorClass = {
          info: "text-cyan-300",
          success: "text-green-400",
          warning: "text-yellow-400",
          error: "text-red-400",
        }[activity.type]

        terminalHistory.addItemWithLimit(
          {
            type: "output",
            content: <div className={colorClass}>{activity.message}</div>,
            id: `activity-${Date.now()}`,
          },
          500,
        )
      }
    }, 8000) // Reduced frequency

    return () => clearInterval(interval)
  }, [terminalHistory])

  // Optimized visitor time tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setVisitorTime((prev) => {
        const newTime = prev + 1
        if (newTime === 60) {
          terminalHistory.addItemWithLimit(
            {
              type: "output",
              content: <div className="text-yellow-400">[AWS Billing] Your visit has cost: $0.00000042</div>,
              id: `billing-${Date.now()}`,
            },
            500,
          )
          terminalHistory.addItemWithLimit(
            {
              type: "output",
              content: <div className="text-cyan-300">Don't worry, it's on me! 😄</div>,
              id: `billing-joke-${Date.now()}`,
            },
            500,
          )
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [terminalHistory])

  // Optimized Konami code detection with cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKonamiCode((prev) => {
        const newCode = [...prev, e.key].slice(-10)

        if (newCode.join(",") === konamiPattern.join(",")) {
          terminalHistory.addItemWithLimit(
            {
              type: "output",
              content: (
                <div className="text-cyan-400 text-xl font-bold animate-pulse">🎮 KONAMI CODE ACTIVATED! 🎮</div>
              ),
              id: `konami-${Date.now()}`,
            },
            500,
          )
          terminalHistory.addItemWithLimit(
            {
              type: "output",
              content: <div className="text-green-400">God mode enabled. You now have sudo access to everything!</div>,
              id: `konami-msg-${Date.now()}`,
            },
            500,
          )

          // Optimized animation with cleanup
          document.body.style.animation = "rainbow 2s"
          setTimeout(() => {
            document.body.style.animation = ""
          }, 2000)
        }

        return newCode
      })
    }

    document.addEventListener("keydown", handleKeyDown, { passive: true })
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [konamiPattern, terminalHistory])

  // Optimized auto-focus with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            inputRef.current?.focus()
          }
        })
      },
      { threshold: 0.1 },
    )

    if (inputRef.current) {
      observer.observe(inputRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Memoized terminal history rendering for better performance
  const renderedHistory = useMemo(() => {
    return terminalHistory.array.map((item, index) => <TerminalHistoryItem key={item.id} item={item} index={index} />)
  }, [terminalHistory.array])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono relative overflow-hidden">
      {/* Advanced Background Effects */}
      <MatrixRain intensity={0.3} />
      <ParticleField count={30} />
      <NeuralNetwork />
      <CyberGrid />
      
      <div className="sr-only">
        <h1>Cyberpunk Terminal Portfolio - Home</h1>
        <p>
          Interactive terminal interface for exploring professional portfolio. Use Tab to navigate, Enter to execute
          commands.
        </p>
      </div>

      {/* Scanline effect */}
      <div
        className="fixed inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-20 animate-pulse"
        aria-hidden="true"
      />

      {/* CRT effect */}
      <div
        className="fixed inset-0 pointer-events-none z-20 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"
        aria-hidden="true"
      />

      {/* Terminal Window */}
      <div className="relative z-0 min-h-screen flex flex-col">
        {/* Terminal Header */}
        <CyberpunkTerminalMenu currentPage="home" />

        {/* Terminal Body */}
        <div
          ref={terminalRef}
          className="flex-1 p-4 bg-black/40 glass-card terminal-glow scan-lines"
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
        >
          <div className="max-w-6xl mx-auto space-y-4">
            {/* ASCII Art Logo */}
            <pre
              className="text-cyan-400 text-xs whitespace-pre opacity-0 animate-[fadeIn_0.5s_forwards] matrix-text"
              aria-label="NEXUS ASCII art logo"
            >
              {`███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗
████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝
██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗
██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║
██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
       ARCHITECT TERMINAL v2.4.1`}
            </pre>

            {/* Boot Sequence */}
            <div className="space-y-2">
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_0.5s]">
                <span className="text-green-400">$</span> ./initialize_system --mode=architect
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_0.7s] text-green-400">
                ✓ System initialized successfully
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_0.9s] text-gray-400">
                Loading kernel modules...
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_1.1s] text-cyan-300">
                [OK] Infrastructure services started
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_1.3s] text-cyan-300">
                [OK] Security protocols enabled
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_1.5s] text-cyan-300">
                [OK] Neural network online
              </div>
            </div>

            {/* System Check */}
            <div className="space-y-2">
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_2s]">
                <span className="text-green-400">$</span> systemctl status infrastructure.service
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_2.2s] text-gray-400">
                ● infrastructure.service - Cloud Infrastructure Management
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_2.4s] text-green-400">
                Active: active (running) since 2025-01-01 00:00:00 UTC
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-2">
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_3s]">
                <span className="text-green-400">$</span> whoami
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_3.2s] text-cyan-400 font-bold">
                Cloud Architect | Infrastructure Engineer | Security Specialist
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_3.4s] text-cyan-300">
                📊 Achievement System: Active | 🏆 Easter Eggs: Hidden | 🎮 Commands: 50+
              </div>
            </div>

            {/* Optimized System Status with memoized component */}
            <SystemStatusDisplay status={systemStatus} />

            {/* Kubernetes Pods Table */}
            <div className="space-y-2">
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_4s]">
                <span className="text-green-400">$</span> kubectl get pods --all-namespaces
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_4.2s]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-green-500/20">
                      <td className="p-2">NAMESPACE</td>
                      <td className="p-2">NAME</td>
                      <td className="p-2">READY</td>
                      <td className="p-2">STATUS</td>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    <tr>
                      <td className="p-2">production</td>
                      <td className="p-2">api-gateway-7d9c5c5f9-x2k4m</td>
                      <td className="p-2">3/3</td>
                      <td className="p-2 text-green-400">Running</td>
                    </tr>
                    <tr>
                      <td className="p-2">production</td>
                      <td className="p-2">auth-service-5f8b7d6c4-n3p7q</td>
                      <td className="p-2">2/2</td>
                      <td className="p-2 text-green-400">Running</td>
                    </tr>
                    <tr>
                      <td className="p-2">monitoring</td>
                      <td className="p-2">prometheus-server-0</td>
                      <td className="p-2">1/1</td>
                      <td className="p-2 text-green-400">Running</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* AWS CloudWatch */}
            <div className="space-y-2">
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_5s]">
                <span className="text-green-400">$</span> aws cloudwatch get-metric-statistics --namespace AWS/Lambda
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_5.2s] text-green-400">
                ✓ Metrics retrieved: Invocations: 2847, Errors: 0, Duration: 42ms
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_5.5s]">
                <span className="text-green-400">$</span> analyze-infrastructure --optimize
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_5.7s]">
                <div className="w-full h-5 bg-green-500/10 border border-green-500/30 rounded overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500 animate-[progress_2s_ease-out_forwards]" />
                </div>
              </div>
              <div className="opacity-0 animate-[fadeIn_0.1s_forwards_7.7s] text-green-400">
                ✓ Optimization complete: $3,247 monthly savings identified
              </div>
            </div>

            {/* Help Text */}
            <div className="p-4 bg-green-500/5 border-l-2 border-green-500 text-gray-400 text-sm opacity-0 animate-[fadeIn_0.5s_forwards_8s]">
              <div className="text-cyan-400 font-bold mb-2">Available Commands:</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                <div>
                  <span className="text-cyan-300">help</span> - Show commands
                </div>
                <div>
                  <span className="text-cyan-300">about</span> - Learn about me
                </div>
                <div>
                  <span className="text-cyan-300">projects</span> - View projects
                </div>
                <div>
                  <span className="text-cyan-300">skills</span> - List skills
                </div>
                <div>
                  <span className="text-cyan-300">contact</span> - Get in touch
                </div>
                <div>
                  <span className="text-cyan-300">resume</span> - Download resume
                </div>
              </div>
              <div className="mt-2 text-yellow-400">
                💡 Pro tip: This terminal has many hidden commands. Try common Unix commands!
              </div>
              <div className="text-yellow-400">
                🎮 Easter eggs await those who explore... Maybe try some classic codes?
              </div>
            </div>

            {/* Optimized Terminal History rendering */}
            <div className="space-y-2" role="log" aria-label="Command history">
              {renderedHistory}
            </div>

            {/* Command Input */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-green-400 font-mono" aria-hidden="true">
                $
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleCommand}
                className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-600 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                placeholder="Type 'help' for commands, or try 'ls', 'ping', or even 'hack'..."
                autoFocus
                aria-label="Terminal command input"
                aria-describedby="terminal-help"
              />
            </div>

            <div id="terminal-help" className="sr-only">
              Terminal command interface. Type commands and press Enter to execute. Use arrow keys to navigate command
              history. Type 'help' to see available commands.
            </div>
          </div>
        </div>
      </div>

      {/* Added performance monitor */}
      <PerformanceMonitor visible={showPerformanceMonitor} />

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg) saturate(2); }
          50% { filter: hue-rotate(180deg) saturate(3); }
          100% { filter: hue-rotate(360deg) saturate(2); }
        }
      `}</style>
    </div>
  )
}
