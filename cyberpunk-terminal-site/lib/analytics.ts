export interface AnalyticsEvent {
  id: string
  type: "pageview" | "interaction" | "error" | "performance"
  page: string
  userId?: string
  sessionId: string
  timestamp: string
  data: Record<string, any>
  userAgent: string
  ip: string
  country?: string
  city?: string
}

export interface PageView {
  id: string
  page: string
  sessionId: string
  userId?: string
  timestamp: string
  referrer?: string
  duration?: number
  userAgent: string
  ip: string
  country?: string
  city?: string
}

export interface PerformanceMetric {
  id: string
  page: string
  sessionId: string
  timestamp: string
  metrics: {
    loadTime: number
    domContentLoaded: number
    firstContentfulPaint: number
    largestContentfulPaint: number
    cumulativeLayoutShift: number
    firstInputDelay: number
  }
}

export interface AnalyticsSummary {
  totalPageViews: number
  uniqueVisitors: number
  averageSessionDuration: number
  bounceRate: number
  topPages: Array<{ page: string; views: number }>
  topCountries: Array<{ country: string; visitors: number }>
  performanceMetrics: {
    averageLoadTime: number
    averageFCP: number
    averageLCP: number
    errorRate: number
  }
  realTimeVisitors: number
  dailyStats: Array<{
    date: string
    pageViews: number
    uniqueVisitors: number
    averageSessionDuration: number
  }>
}

// Mock analytics database
class AnalyticsDatabase {
  private events: AnalyticsEvent[] = []
  private pageViews: PageView[] = []
  private performanceMetrics: PerformanceMetric[] = []

  // Generate mock data for demonstration
  constructor() {
    this.generateMockData()
  }

  private generateMockData() {
    const pages = ["/", "/about", "/projects", "/skills", "/contact"]
    const countries = ["US", "UK", "CA", "DE", "FR", "JP", "AU"]
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    ]

    // Generate last 30 days of data
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const dailyViews = Math.floor(Math.random() * 200) + 50
      for (let j = 0; j < dailyViews; j++) {
        const sessionId = `session_${Date.now()}_${Math.random()}`
        const page = pages[Math.floor(Math.random() * pages.length)]
        const country = countries[Math.floor(Math.random() * countries.length)]
        const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)]

        const pageView: PageView = {
          id: `pv_${Date.now()}_${j}`,
          page,
          sessionId,
          timestamp: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          referrer: Math.random() > 0.5 ? "https://google.com" : undefined,
          duration: Math.floor(Math.random() * 300) + 30,
          userAgent,
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          country,
          city: `City_${country}`,
        }

        this.pageViews.push(pageView)

        // Add performance metrics
        const perfMetric: PerformanceMetric = {
          id: `perf_${Date.now()}_${j}`,
          page,
          sessionId,
          timestamp: pageView.timestamp,
          metrics: {
            loadTime: Math.floor(Math.random() * 2000) + 500,
            domContentLoaded: Math.floor(Math.random() * 1500) + 300,
            firstContentfulPaint: Math.floor(Math.random() * 1000) + 200,
            largestContentfulPaint: Math.floor(Math.random() * 2500) + 800,
            cumulativeLayoutShift: Math.random() * 0.1,
            firstInputDelay: Math.floor(Math.random() * 100) + 10,
          },
        }

        this.performanceMetrics.push(perfMetric)
      }
    }
  }

  async trackEvent(event: Omit<AnalyticsEvent, "id" | "timestamp">): Promise<AnalyticsEvent> {
    const newEvent: AnalyticsEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
    }
    this.events.push(newEvent)
    return newEvent
  }

  async trackPageView(pageView: Omit<PageView, "id" | "timestamp">): Promise<PageView> {
    const newPageView: PageView = {
      ...pageView,
      id: `pv_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
    }
    this.pageViews.push(newPageView)
    return newPageView
  }

  async trackPerformance(metric: Omit<PerformanceMetric, "id" | "timestamp">): Promise<PerformanceMetric> {
    const newMetric: PerformanceMetric = {
      ...metric,
      id: `perf_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
    }
    this.performanceMetrics.push(newMetric)
    return newMetric
  }

  async getAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const recentPageViews = this.pageViews.filter((pv) => new Date(pv.timestamp) >= cutoffDate)
    const recentPerformance = this.performanceMetrics.filter((pm) => new Date(pm.timestamp) >= cutoffDate)

    // Calculate unique visitors
    const uniqueVisitors = new Set(recentPageViews.map((pv) => pv.sessionId)).size

    // Calculate average session duration
    const sessionDurations = recentPageViews.reduce(
      (acc, pv) => {
        if (pv.duration) {
          acc[pv.sessionId] = (acc[pv.sessionId] || 0) + pv.duration
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const averageSessionDuration =
      Object.values(sessionDurations).reduce((sum, duration) => sum + duration, 0) /
      Object.keys(sessionDurations).length

    // Calculate bounce rate (sessions with only one page view)
    const sessionPageCounts = recentPageViews.reduce(
      (acc, pv) => {
        acc[pv.sessionId] = (acc[pv.sessionId] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const singlePageSessions = Object.values(sessionPageCounts).filter((count) => count === 1).length
    const bounceRate = (singlePageSessions / Object.keys(sessionPageCounts).length) * 100

    // Top pages
    const pageCounts = recentPageViews.reduce(
      (acc, pv) => {
        acc[pv.page] = (acc[pv.page] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([page, views]) => ({ page, views }))

    // Top countries
    const countryCounts = recentPageViews.reduce(
      (acc, pv) => {
        if (pv.country) {
          acc[pv.country] = (acc[pv.country] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const topCountries = Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([country, visitors]) => ({ country, visitors }))

    // Performance metrics
    const averageLoadTime =
      recentPerformance.reduce((sum, pm) => sum + pm.metrics.loadTime, 0) / recentPerformance.length

    const averageFCP =
      recentPerformance.reduce((sum, pm) => sum + pm.metrics.firstContentfulPaint, 0) / recentPerformance.length

    const averageLCP =
      recentPerformance.reduce((sum, pm) => sum + pm.metrics.largestContentfulPaint, 0) / recentPerformance.length

    // Daily stats
    const dailyStats = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const dayViews = recentPageViews.filter((pv) => pv.timestamp.startsWith(dateStr))
      const dayUnique = new Set(dayViews.map((pv) => pv.sessionId)).size

      const daySessionDurations = dayViews.reduce(
        (acc, pv) => {
          if (pv.duration) {
            acc[pv.sessionId] = (acc[pv.sessionId] || 0) + pv.duration
          }
          return acc
        },
        {} as Record<string, number>,
      )

      const dayAverageSession =
        Object.values(daySessionDurations).reduce((sum, duration) => sum + duration, 0) /
        Math.max(Object.keys(daySessionDurations).length, 1)

      dailyStats.unshift({
        date: dateStr,
        pageViews: dayViews.length,
        uniqueVisitors: dayUnique,
        averageSessionDuration: dayAverageSession || 0,
      })
    }

    return {
      totalPageViews: recentPageViews.length,
      uniqueVisitors,
      averageSessionDuration: averageSessionDuration || 0,
      bounceRate: bounceRate || 0,
      topPages,
      topCountries,
      performanceMetrics: {
        averageLoadTime: averageLoadTime || 0,
        averageFCP: averageFCP || 0,
        averageLCP: averageLCP || 0,
        errorRate: Math.random() * 2, // Mock error rate
      },
      realTimeVisitors: Math.floor(Math.random() * 50) + 10,
      dailyStats,
    }
  }

  async getRealTimeData() {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    const recentViews = this.pageViews.filter((pv) => new Date(pv.timestamp) >= oneHourAgo)

    return {
      activeVisitors: Math.floor(Math.random() * 50) + 10,
      recentPageViews: recentViews.slice(-10),
      topActivePages: recentViews.reduce(
        (acc, pv) => {
          acc[pv.page] = (acc[pv.page] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }
  }
}

export const analytics = new AnalyticsDatabase()
