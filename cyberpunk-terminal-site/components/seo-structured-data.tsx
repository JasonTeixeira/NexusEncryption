"use client"

import { useEffect } from "react"

interface StructuredDataProps {
  type: "Person" | "WebSite" | "Article" | "SoftwareApplication"
  data?: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"

    let structuredData = {}

    switch (type) {
      case "Person":
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Jason Teixeira",
          jobTitle: "Senior Cloud Architect & Full-Stack Developer",
          url: "https://jasonteixeira.dev",
          sameAs: ["https://linkedin.com/in/jason-teixeira", "https://github.com/JasonTeixeira"],
          knowsAbout: [
            "Cloud Architecture",
            "Kubernetes",
            "Dashboard Development",
            "DevOps",
            "Full-Stack Development",
            "AI Integration",
            "Infrastructure as Code",
            "Microservices",
            "Container Orchestration",
            "Cyberpunk UI Design",
          ],
          hasOccupation: {
            "@type": "Occupation",
            name: "Cloud Architect",
            occupationLocation: {
              "@type": "Place",
              name: "Remote",
            },
          },
          alumniOf: {
            "@type": "Organization",
            name: "Cloud Architecture Certification",
          },
        }
        break

      case "WebSite":
        structuredData = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Jason Teixeira - Cloud Architect Portfolio",
          url: "https://jasonteixeira.dev",
          description:
            "Professional portfolio showcasing cloud architecture, dashboard development, and full-stack engineering expertise with AI integration",
          author: {
            "@type": "Person",
            name: "Jason Teixeira",
          },
          potentialAction: {
            "@type": "SearchAction",
            target: "https://jasonteixeira.dev/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
          mainEntity: {
            "@type": "Person",
            name: "Jason Teixeira",
          },
        }
        break

      case "SoftwareApplication":
        structuredData = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "NEXUS AI Assistant",
          description: "AI-powered portfolio assistant with cyberpunk terminal interface",
          applicationCategory: "WebApplication",
          operatingSystem: "Web Browser",
          author: {
            "@type": "Person",
            name: "Jason Teixeira",
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }
        break
    }

    script.innerHTML = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [type, data])

  return null
}
