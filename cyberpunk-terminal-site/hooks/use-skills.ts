"use client"

import { useState, useEffect } from "react"

interface Skill {
  id: string
  name: string
  category: string
  proficiency_level: number
  description: string
  years_experience: number
  last_used: string
  created_at: string
  updated_at: string
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/skills")

      if (!response.ok) {
        throw new Error("Failed to fetch skills")
      }

      const data = await response.json()
      setSkills(data.skills || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch skills")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const getSkillsByCategory = (category: string) => {
    return skills.filter((skill) => skill.category === category)
  }

  const getTopSkills = (limit = 10) => {
    return skills.sort((a, b) => b.proficiency_level - a.proficiency_level).slice(0, limit)
  }

  return {
    skills,
    loading,
    error,
    refetch: fetchSkills,
    getSkillsByCategory,
    getTopSkills,
  }
}
