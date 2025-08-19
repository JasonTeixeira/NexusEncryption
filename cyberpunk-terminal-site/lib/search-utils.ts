export function highlightSearchTerms(text: string, query: string): string {
  if (!query.trim()) return text

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0)
  let highlightedText = text

  terms.forEach((term) => {
    const regex = new RegExp(`(${term})`, "gi")
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-400/20 text-yellow-400">$1</mark>')
  })

  return highlightedText
}

export function extractSearchExcerpt(content: string, query: string, maxLength = 150): string {
  if (!query.trim()) return content.slice(0, maxLength) + (content.length > maxLength ? "..." : "")

  const lowerContent = content.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const terms = lowerQuery.split(/\s+/).filter((term) => term.length > 0)

  // Find the first occurrence of any search term
  let bestIndex = -1
  let bestTerm = ""

  for (const term of terms) {
    const index = lowerContent.indexOf(term)
    if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
      bestIndex = index
      bestTerm = term
    }
  }

  if (bestIndex === -1) {
    return content.slice(0, maxLength) + (content.length > maxLength ? "..." : "")
  }

  // Extract excerpt around the found term
  const start = Math.max(0, bestIndex - 50)
  const end = Math.min(content.length, start + maxLength)

  let excerpt = content.slice(start, end)

  if (start > 0) excerpt = "..." + excerpt
  if (end < content.length) excerpt = excerpt + "..."

  return excerpt
}

export function calculateRelevanceScore(content: string, title: string, query: string, type: string): number {
  const lowerContent = content.toLowerCase()
  const lowerTitle = title.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const terms = lowerQuery.split(/\s+/).filter((term) => term.length > 0)

  let score = 0

  terms.forEach((term) => {
    // Title matches are worth more
    const titleMatches = (lowerTitle.match(new RegExp(term, "g")) || []).length
    score += titleMatches * 10

    // Content matches
    const contentMatches = (lowerContent.match(new RegExp(term, "g")) || []).length
    score += contentMatches * 2

    // Exact phrase bonus
    if (lowerTitle.includes(lowerQuery)) score += 20
    if (lowerContent.includes(lowerQuery)) score += 10
  })

  // Type-based scoring
  const typeMultipliers = {
    project: 1.2,
    blog: 1.0,
    skill: 0.8,
  }

  score *= typeMultipliers[type as keyof typeof typeMultipliers] || 1.0

  // Normalize to 0-1 range
  return Math.min(1, score / 100)
}
