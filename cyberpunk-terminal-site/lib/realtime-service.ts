type RealtimeCallback = (data: any) => void
type RealtimeSubscription = {
  id: string
  channel: string
  callback: RealtimeCallback
  filters?: Record<string, any>
}

class RealtimeService {
  private subscriptions: Map<string, RealtimeSubscription> = new Map()
  private eventSource: EventSource | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isConnected = false
  private isInitialized = false
  private fallbackMode = false
  private fallbackInterval: NodeJS.Timeout | null = null

  constructor() {}

  private ensureConnection() {
    if (!this.isInitialized) {
      this.isInitialized = true
      this.connect()
    }
  }

  private connect() {
    if (this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) {
      return
    }

    if (typeof window === "undefined") {
      this.enableFallbackMode()
      return
    }

    try {
      this.eventSource = new EventSource("/api/realtime/stream")

      this.eventSource.onopen = () => {
        console.log("Realtime connection established")
        this.reconnectAttempts = 0
        this.isConnected = true
        this.fallbackMode = false
      }

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error("Failed to parse realtime message:", error)
        }
      }

      this.eventSource.onerror = (error) => {
        console.warn("Realtime connection unavailable, using fallback mode")
        this.isConnected = false
        this.handleReconnect()
      }
    } catch (error) {
      console.warn("Real-time features unavailable, using fallback mode")
      this.enableFallbackMode()
    }
  }

  private enableFallbackMode() {
    this.fallbackMode = true
    this.isConnected = false

    this.fallbackInterval = setInterval(() => {
      this.simulateFallbackData()
    }, 3000)
  }

  private simulateFallbackData() {
    const channels = ["dashboard-analytics", "dashboard-performance", "dashboard-security"]

    channels.forEach((channel) => {
      const mockData = this.generateMockData(channel)
      this.handleMessage({
        channel,
        payload: mockData,
        timestamp: new Date().toISOString(),
      })
    })
  }

  private generateMockData(channel: string) {
    switch (channel) {
      case "dashboard-analytics":
        return {
          visitors: Math.floor(Math.random() * 1000) + 500,
          pageViews: Math.floor(Math.random() * 5000) + 2000,
          bounceRate: (Math.random() * 20 + 30).toFixed(1),
          avgSessionDuration: Math.floor(Math.random() * 300) + 120,
        }
      case "dashboard-performance":
        return {
          responseTime: Math.floor(Math.random() * 100) + 50,
          uptime: (99.5 + Math.random() * 0.5).toFixed(2),
          errorRate: (Math.random() * 2).toFixed(2),
          throughput: Math.floor(Math.random() * 1000) + 500,
        }
      case "dashboard-security":
        return {
          threats: Math.floor(Math.random() * 10),
          blockedIPs: Math.floor(Math.random() * 50) + 20,
          securityScore: Math.floor(Math.random() * 20) + 80,
          lastScan: new Date().toISOString(),
        }
      default:
        return { timestamp: new Date().toISOString() }
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        this.disconnect()
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.warn("Real-time connection unavailable, switching to fallback mode")
      this.enableFallbackMode()
    }
  }

  private handleMessage(data: any) {
    const { channel, payload, filters } = data

    this.subscriptions.forEach((subscription) => {
      if (subscription.channel === channel) {
        if (subscription.filters) {
          const matchesFilters = Object.entries(subscription.filters).every(([key, value]) => payload[key] === value)
          if (!matchesFilters) return
        }

        subscription.callback(payload)
      }
    })
  }

  subscribe(channel: string, callback: RealtimeCallback, filters?: Record<string, any>): string {
    this.ensureConnection()

    const id = `${channel}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const subscription: RealtimeSubscription = {
      id,
      channel,
      callback,
      filters,
    }

    this.subscriptions.set(id, subscription)

    if (this.isConnected && !this.fallbackMode) {
      this.sendMessage({
        type: "subscribe",
        channel,
        filters,
        subscriptionId: id,
      })
    }

    return id
  }

  unsubscribe(subscriptionId: string) {
    const subscription = this.subscriptions.get(subscriptionId)
    if (subscription) {
      this.subscriptions.delete(subscriptionId)

      this.sendMessage({
        type: "unsubscribe",
        subscriptionId,
      })
    }
  }

  private sendMessage(message: any) {
    fetch("/api/realtime/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    }).catch((error) => {
      console.error("Failed to send realtime message:", error)
      if (this.isConnected) {
        setTimeout(() => this.sendMessage(message), 1000)
      }
    })
  }

  broadcast(channel: string, data: any, filters?: Record<string, any>) {
    this.sendMessage({
      type: "broadcast",
      channel,
      data,
      filters,
    })
  }

  notify(type: "info" | "warning" | "error" | "success", message: string, data?: any) {
    this.broadcast("notifications", {
      type,
      message,
      data,
      timestamp: new Date().toISOString(),
    })
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval)
      this.fallbackInterval = null
    }
    this.isConnected = false
    this.isInitialized = false
    this.fallbackMode = false
    this.subscriptions.clear()
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      subscriptionCount: this.subscriptions.size,
      fallbackMode: this.fallbackMode,
    }
  }
}

export const realtimeService = new RealtimeService()
