"use client"

interface DataStream {
  id: string
  type: string
  isActive: boolean
  interval: number
  lastUpdate: number
  subscribers: Set<(data: any) => void>
}

class MockDataService {
  private streams: Map<string, DataStream> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  // Analytics Data Generator
  generateAnalyticsData() {
    const baseVisitors = 12847
    const variation = Math.random() * 200 - 100
    const timeOfDay = new Date().getHours()
    const dayMultiplier = timeOfDay >= 9 && timeOfDay <= 17 ? 1.2 : 0.8

    return {
      visitors: {
        total: Math.floor((baseVisitors + variation) * dayMultiplier),
        unique: Math.floor((baseVisitors + variation) * 0.73 * dayMultiplier),
        returning: Math.floor((baseVisitors + variation) * 0.27 * dayMultiplier),
        trend: Math.random() * 20 - 5,
      },
      pageViews: {
        total: Math.floor((baseVisitors + variation) * 2.4 * dayMultiplier),
        perSession: Math.random() * 1.5 + 2.1,
        trend: Math.random() * 15 - 3,
      },
      sessions: {
        total: Math.floor((baseVisitors + variation) * 0.85 * dayMultiplier),
        avgDuration: `${Math.floor(Math.random() * 2 + 2)}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`,
        bounceRate: Math.random() * 20 + 35,
        trend: Math.random() * 10 - 5,
      },
      devices: {
        desktop: Math.random() * 20 + 45,
        mobile: Math.random() * 20 + 35,
        tablet: Math.random() * 10 + 8,
      },
      realTimeUsers: Math.floor(Math.random() * 50 + 25),
      conversionRate: Math.random() * 5 + 12,
      timestamp: Date.now(),
    }
  }

  // System Monitoring Data Generator
  generateSystemData() {
    const cpuBase = 35
    const memoryBase = 8
    const diskBase = 450

    // Simulate realistic system load patterns
    const loadFactor = Math.sin(Date.now() / 300000) * 0.3 + 0.7 // 5-minute cycle

    return {
      cpu: {
        usage: Math.max(5, Math.min(95, cpuBase + (Math.random() * 30 - 15) * loadFactor)),
        cores: 8,
        temperature: Math.random() * 20 + 45,
        processes: Math.floor(Math.random() * 50 + 150),
      },
      memory: {
        used: Math.max(2, Math.min(15, memoryBase + (Math.random() * 4 - 2) * loadFactor)),
        total: 16,
        cached: Math.random() * 2 + 1,
        buffers: Math.random() * 0.5 + 0.2,
      },
      disk: {
        used: diskBase + Math.random() * 50 - 25,
        total: 1000,
        iops: Math.floor(Math.random() * 500 + 100),
        throughput: Math.random() * 100 + 50,
      },
      network: {
        inbound: Math.random() * 50 + 10,
        outbound: Math.random() * 30 + 5,
        connections: Math.floor(Math.random() * 500 + 200),
        packets: Math.floor(Math.random() * 10000 + 5000),
      },
      timestamp: Date.now(),
    }
  }

  // Security Data Generator
  generateSecurityData() {
    const threatLevel = Math.random()
    const isHighThreat = threatLevel > 0.8

    return {
      threats: {
        blocked: Math.floor(Math.random() * (isHighThreat ? 1000 : 500) + 1200),
        detected: Math.floor(Math.random() * (isHighThreat ? 200 : 100) + 50),
        quarantined: Math.floor(Math.random() * (isHighThreat ? 40 : 20) + 5),
        trend: isHighThreat ? Math.random() * 50 + 10 : Math.random() * 30 - 10,
      },
      firewall: {
        blocked: Math.floor(Math.random() * 10000 + 5000),
        allowed: Math.floor(Math.random() * 50000 + 100000),
        rules: 247,
        countries: Math.floor(Math.random() * 20 + 45),
      },
      authentication: {
        successful: Math.floor(Math.random() * 5000 + 8000),
        failed: Math.floor(Math.random() * (isHighThreat ? 500 : 200) + 50),
        suspicious: Math.floor(Math.random() * (isHighThreat ? 60 : 30) + 10),
        mfa: Math.floor(Math.random() * 3000 + 6000),
      },
      vulnerabilities: {
        critical: Math.floor(Math.random() * (isHighThreat ? 6 : 3) + 1),
        high: Math.floor(Math.random() * 8 + 2),
        medium: Math.floor(Math.random() * 15 + 5),
        low: Math.floor(Math.random() * 25 + 10),
      },
      alertLevel: isHighThreat ? "high" : threatLevel > 0.6 ? "medium" : "low",
      timestamp: Date.now(),
    }
  }

  // Financial Data Generator
  generateFinancialData() {
    const baseRevenue = 425000
    const monthlyGrowth = 1.05 // 5% monthly growth trend
    const seasonality = Math.sin((Date.now() / (1000 * 60 * 60 * 24 * 30)) * Math.PI * 2) * 0.1 + 1

    const currentRevenue = baseRevenue * monthlyGrowth * seasonality + (Math.random() * 50000 - 25000)

    return {
      revenue: {
        total: currentRevenue,
        monthly: currentRevenue / 12,
        growth: Math.random() * 30 + 5,
        recurring: currentRevenue * 0.75,
      },
      expenses: {
        total: currentRevenue * 0.65,
        operational: currentRevenue * 0.35,
        marketing: currentRevenue * 0.15,
        development: currentRevenue * 0.15,
      },
      profit: {
        gross: currentRevenue * 0.35,
        net: currentRevenue * 0.22,
        margin: 22 + Math.random() * 8,
        ebitda: currentRevenue * 0.28,
      },
      cashFlow: {
        operating: currentRevenue * 0.25,
        investing: -currentRevenue * 0.08,
        financing: -currentRevenue * 0.05,
        free: currentRevenue * 0.18,
      },
      timestamp: Date.now(),
    }
  }

  // Sales Data Generator
  generateSalesData() {
    const quarterProgress = (Date.now() % (1000 * 60 * 60 * 24 * 90)) / (1000 * 60 * 60 * 24 * 90)
    const quotaProgress = quarterProgress * 0.8 + Math.random() * 0.4

    return {
      pipeline: {
        total: Math.floor(Math.random() * 500000 + 1200000),
        qualified: Math.floor(Math.random() * 200000 + 400000),
        proposal: Math.floor(Math.random() * 150000 + 300000),
        negotiation: Math.floor(Math.random() * 100000 + 200000),
        closed: Math.floor(Math.random() * 80000 + 150000),
      },
      performance: {
        quota: 250000,
        achieved: Math.floor(250000 * quotaProgress),
        deals: Math.floor(Math.random() * 5 + 12),
        revenue: Math.floor(250000 * quotaProgress),
      },
      conversion: {
        leadToCustomer: Math.random() * 10 + 15,
        proposalToClose: Math.random() * 20 + 60,
        averageDealSize: Math.random() * 5000 + 12000,
        salesCycle: Math.random() * 20 + 45,
      },
      timestamp: Date.now(),
    }
  }

  // Performance Data Generator
  generatePerformanceData() {
    const timeOfDay = new Date().getHours()
    const isBusinessHours = timeOfDay >= 9 && timeOfDay <= 17
    const loadMultiplier = isBusinessHours ? 1.3 : 0.7

    return {
      coreWebVitals: {
        lcp: (Math.random() * 1000 + 1200) * loadMultiplier,
        fid: (Math.random() * 50 + 10) * loadMultiplier,
        cls: Math.random() * 0.1 + 0.05,
        fcp: (Math.random() * 800 + 600) * loadMultiplier,
        ttfb: (Math.random() * 200 + 100) * loadMultiplier,
      },
      pageSpeed: {
        desktop: Math.max(60, Math.min(100, 85 - (loadMultiplier - 1) * 20)),
        mobile: Math.max(50, Math.min(95, 75 - (loadMultiplier - 1) * 25)),
      },
      uptime: {
        current: Math.random() > 0.95 ? 99.5 + Math.random() * 0.5 : 99.97,
        last24h: Math.random() * 0.5 + 99.5,
        last7d: Math.random() * 1 + 99,
        last30d: Math.random() * 2 + 98,
      },
      errors: {
        total: Math.floor(Math.random() * (isBusinessHours ? 100 : 30) + 10),
        js: Math.floor(Math.random() * (isBusinessHours ? 40 : 15) + 5),
        network: Math.floor(Math.random() * (isBusinessHours ? 30 : 10) + 3),
        server: Math.floor(Math.random() * (isBusinessHours ? 20 : 5) + 2),
      },
      timestamp: Date.now(),
    }
  }

  // IoT Data Generator
  generateIoTData() {
    return {
      devices: {
        total: 1247 + Math.floor(Math.random() * 20 - 10),
        online: Math.floor((1247 + Math.random() * 20 - 10) * (0.95 + Math.random() * 0.04)),
        offline: Math.floor(Math.random() * 15 + 5),
        maintenance: Math.floor(Math.random() * 8 + 2),
      },
      sensors: {
        temperature: Math.random() * 10 + 20, // 20-30°C
        humidity: Math.random() * 20 + 40, // 40-60%
        pressure: Math.random() * 50 + 1000, // 1000-1050 hPa
        vibration: Math.random() * 5 + 2, // 2-7 Hz
      },
      energy: {
        consumption: Math.random() * 1000 + 2000, // 2-3 kW
        efficiency: Math.random() * 15 + 80, // 80-95%
        cost: Math.random() * 50 + 150, // $150-200/day
      },
      timestamp: Date.now(),
    }
  }

  // Subscribe to a data stream
  subscribe(streamId: string, callback: (data: any) => void) {
    if (!this.streams.has(streamId)) {
      this.createStream(streamId)
    }

    const stream = this.streams.get(streamId)!
    stream.subscribers.add(callback)

    // Send initial data
    const data = this.generateDataForStream(streamId)
    callback(data)

    return () => {
      stream.subscribers.delete(callback)
      if (stream.subscribers.size === 0) {
        this.stopStream(streamId)
      }
    }
  }

  // Create a new data stream
  private createStream(streamId: string) {
    const streamType = this.getStreamType(streamId)
    const interval = this.getStreamInterval(streamType)

    const stream: DataStream = {
      id: streamId,
      type: streamType,
      isActive: true,
      interval,
      lastUpdate: Date.now(),
      subscribers: new Set(),
    }

    this.streams.set(streamId, stream)
    this.startStream(streamId)
  }

  // Start a data stream
  private startStream(streamId: string) {
    const stream = this.streams.get(streamId)
    if (!stream || this.intervals.has(streamId)) return

    const intervalId = setInterval(() => {
      if (stream.isActive && stream.subscribers.size > 0) {
        const data = this.generateDataForStream(streamId)
        stream.lastUpdate = Date.now()

        stream.subscribers.forEach((callback) => {
          try {
            callback(data)
          } catch (error) {
            console.error(`Error in data stream callback for ${streamId}:`, error)
          }
        })
      }
    }, stream.interval)

    this.intervals.set(streamId, intervalId)
  }

  // Stop a data stream
  private stopStream(streamId: string) {
    const intervalId = this.intervals.get(streamId)
    if (intervalId) {
      clearInterval(intervalId)
      this.intervals.delete(streamId)
    }
    this.streams.delete(streamId)
  }

  // Generate data for a specific stream
  private generateDataForStream(streamId: string) {
    const streamType = this.getStreamType(streamId)

    switch (streamType) {
      case "analytics":
        return this.generateAnalyticsData()
      case "system":
        return this.generateSystemData()
      case "security":
        return this.generateSecurityData()
      case "financial":
        return this.generateFinancialData()
      case "sales":
        return this.generateSalesData()
      case "performance":
        return this.generatePerformanceData()
      case "iot":
        return this.generateIoTData()
      default:
        return { timestamp: Date.now(), error: `Unknown stream type: ${streamType}` }
    }
  }

  // Get stream type from stream ID
  private getStreamType(streamId: string): string {
    if (streamId.includes("analytics")) return "analytics"
    if (streamId.includes("system")) return "system"
    if (streamId.includes("security")) return "security"
    if (streamId.includes("financial")) return "financial"
    if (streamId.includes("sales")) return "sales"
    if (streamId.includes("performance")) return "performance"
    if (streamId.includes("iot")) return "iot"
    return "generic"
  }

  // Get update interval for stream type
  private getStreamInterval(streamType: string): number {
    const intervals = {
      analytics: 3000, // 3 seconds
      system: 2000, // 2 seconds
      security: 3000, // 3 seconds
      financial: 5000, // 5 seconds
      sales: 4000, // 4 seconds
      performance: 4000, // 4 seconds
      iot: 2500, // 2.5 seconds
      generic: 3000, // 3 seconds
    }
    return intervals[streamType as keyof typeof intervals] || 3000
  }

  // Pause/Resume stream
  pauseStream(streamId: string) {
    const stream = this.streams.get(streamId)
    if (stream) {
      stream.isActive = false
    }
  }

  resumeStream(streamId: string) {
    const stream = this.streams.get(streamId)
    if (stream) {
      stream.isActive = true
    }
  }

  // Get stream status
  getStreamStatus(streamId: string) {
    const stream = this.streams.get(streamId)
    return stream
      ? {
          isActive: stream.isActive,
          subscribers: stream.subscribers.size,
          lastUpdate: stream.lastUpdate,
          type: stream.type,
        }
      : null
  }

  // Get all active streams
  getAllStreams() {
    return Array.from(this.streams.entries()).map(([id, stream]) => ({
      id,
      type: stream.type,
      isActive: stream.isActive,
      subscribers: stream.subscribers.size,
      lastUpdate: stream.lastUpdate,
    }))
  }

  // Cleanup all streams
  cleanup() {
    this.intervals.forEach((intervalId) => clearInterval(intervalId))
    this.intervals.clear()
    this.streams.clear()
  }
}

// Export singleton instance
export const mockDataService = new MockDataService()

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    mockDataService.cleanup()
  })
}
