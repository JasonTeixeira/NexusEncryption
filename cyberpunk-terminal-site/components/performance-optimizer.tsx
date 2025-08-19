"use client"

import { useEffect, useCallback } from "react"

// Performance optimization utilities
export function usePerformanceOptimizer() {
  const optimizeImages = useCallback(() => {
    // Lazy load images that are not in viewport
    const images = document.querySelectorAll("img[data-src]")
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || ""
          img.removeAttribute("data-src")
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  }, [])

  const optimizeAnimations = useCallback(() => {
    // Reduce animations for users who prefer reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty("--animation-duration", "0.1s")
    }
  }, [])

  const preloadCriticalResources = useCallback(() => {
    // Preload critical fonts and assets
    const criticalFonts = ["/fonts/geist-sans.woff2", "/fonts/geist-mono.woff2"]

    criticalFonts.forEach((font) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = font
      link.as = "font"
      link.type = "font/woff2"
      link.crossOrigin = "anonymous"
      document.head.appendChild(link)
    })
  }, [])

  useEffect(() => {
    // Run optimizations after component mount
    const timeoutId = setTimeout(() => {
      optimizeImages()
      optimizeAnimations()
      preloadCriticalResources()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [optimizeImages, optimizeAnimations, preloadCriticalResources])
}

export default function PerformanceOptimizer() {
  usePerformanceOptimizer()
  return null
}
