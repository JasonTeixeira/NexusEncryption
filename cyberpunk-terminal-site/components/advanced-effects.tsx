"use client"

import { useEffect, useRef, useState } from "react"
import { useAccessibility } from "./accessibility-provider"

// Matrix Rain Effect Component
export function MatrixRain({ intensity = 0.5 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { reducedMotion } = useAccessibility()

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Matrix characters
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const charArray = chars.split("")

    const fontSize = 14
    const columns = canvas.width / fontSize

    // Drops array
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    // Animation function
    const animate = () => {
      // Black background with opacity for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Green text
      ctx.fillStyle = "#00ff88"
      ctx.font = `${fontSize}px monospace`

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Reset drop randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(animate, 50 / intensity)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [intensity, reducedMotion])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{ mixBlendMode: "screen" }}
    />
  )
}

// Particle Field Effect
export function ParticleField({ count = 50 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { reducedMotion } = useAccessibility()
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    if (reducedMotion) return

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10,
    }))
    setParticles(newParticles)
  }, [count, reducedMotion])

  if (reducedMotion) return null

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `float 6s ease-in-out infinite ${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// Holographic Card Effect
export function HolographicCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-lg transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered
          ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 255, 136, 0.1) 0%, transparent 50%)`
          : "transparent",
      }}
    >
      {/* Holographic overlay */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: isHovered
            ? `linear-gradient(45deg, transparent 30%, rgba(0, 255, 136, 0.1) 50%, transparent 70%)`
            : "transparent",
          opacity: isHovered ? 1 : 0,
          transform: `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)`,
        }}
      />
      
      {/* Glitch effect border */}
      <div className="absolute inset-0 border border-cyan-500/20 rounded-lg">
        <div className="absolute inset-0 border border-cyan-500/40 rounded-lg transform translate-x-0.5 translate-y-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      
      {children}
    </div>
  )
}

// Neural Network Background
export function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { reducedMotion } = useAccessibility()

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Nodes
    const nodes: Array<{ x: number; y: number; vx: number; vy: number }> = []
    const nodeCount = 50

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 255, 136, 0.6)"
        ctx.fill()

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
            )

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(otherNode.x, otherNode.y)
              ctx.strokeStyle = `rgba(0, 255, 136, ${0.2 * (1 - distance / 100)})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
      style={{ mixBlendMode: "screen" }}
    />
  )
}

// Glitch Text Effect
export function GlitchText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isGlitching, setIsGlitching] = useState(false)
  const { reducedMotion } = useAccessibility()

  useEffect(() => {
    if (reducedMotion) return

    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [reducedMotion])

  return (
    <span
      className={`relative inline-block ${className} ${
        isGlitching && !reducedMotion ? "animate-pulse" : ""
      }`}
      style={{
        textShadow: isGlitching && !reducedMotion
          ? "2px 0 #ff0000, -2px 0 #00ffff, 0 0 #ffffff"
          : "none",
      }}
    >
      {children}
      {isGlitching && !reducedMotion && (
        <>
          <span
            className="absolute inset-0 text-red-500 opacity-70"
            style={{ transform: "translate(2px, 0)" }}
          >
            {children}
          </span>
          <span
            className="absolute inset-0 text-cyan-500 opacity-70"
            style={{ transform: "translate(-2px, 0)" }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  )
}

// Cyber Grid Background
export function CyberGrid() {
  const { reducedMotion } = useAccessibility()

  if (reducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          animation: "gridMove 20s linear infinite",
        }}
      />
    </div>
  )
}