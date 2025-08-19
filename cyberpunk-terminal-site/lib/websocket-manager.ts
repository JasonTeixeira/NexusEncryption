import { logger } from "./logger"

class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map()
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()
  private reconnectAttempts: Map<string, number> = new Map()
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(endpoint: string, protocols?: string[]) {
    if (this.connections.has(endpoint)) {
      return this.connections.get(endpoint)!
    }

    const ws = new WebSocket(endpoint, protocols)
    this.connections.set(endpoint, ws)
    this.reconnectAttempts.set(endpoint, 0)

    ws.onopen = () => {
      logger.info(`WebSocket connected: ${endpoint}`)
      this.reconnectAttempts.set(endpoint, 0)
    }

    ws.onmessage = (event) => {
      const subscribers = this.subscribers.get(endpoint)
      if (subscribers) {
        const data = JSON.parse(event.data)
        subscribers.forEach((callback) => callback(data))
      }
    }

    ws.onclose = () => {
      logger.info(`WebSocket disconnected: ${endpoint}`)
      this.connections.delete(endpoint)
      this.attemptReconnect(endpoint, protocols)
    }

    ws.onerror = (error) => {
      logger.error(`WebSocket error: ${endpoint}`, { error })
    }

    return ws
  }

  private attemptReconnect(endpoint: string, protocols?: string[]) {
    const attempts = this.reconnectAttempts.get(endpoint) || 0

    if (attempts < this.maxReconnectAttempts) {
      this.reconnectAttempts.set(endpoint, attempts + 1)

      setTimeout(() => {
        logger.info(`Attempting to reconnect: ${endpoint} (${attempts + 1}/${this.maxReconnectAttempts})`)
        this.connect(endpoint, protocols)
      }, this.reconnectDelay * Math.pow(2, attempts))
    }
  }

  subscribe(endpoint: string, callback: (data: any) => void) {
    if (!this.subscribers.has(endpoint)) {
      this.subscribers.set(endpoint, new Set())
    }

    this.subscribers.get(endpoint)!.add(callback)

    // Ensure connection exists
    if (!this.connections.has(endpoint)) {
      this.connect(endpoint)
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(endpoint)
      if (subscribers) {
        subscribers.delete(callback)
        if (subscribers.size === 0) {
          this.disconnect(endpoint)
        }
      }
    }
  }

  send(endpoint: string, data: any) {
    const ws = this.connections.get(endpoint)
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data))
    }
  }

  disconnect(endpoint: string) {
    const ws = this.connections.get(endpoint)
    if (ws) {
      ws.close()
      this.connections.delete(endpoint)
      this.subscribers.delete(endpoint)
      this.reconnectAttempts.delete(endpoint)
    }
  }

  disconnectAll() {
    this.connections.forEach((ws, endpoint) => {
      this.disconnect(endpoint)
    })
  }
}

export const wsManager = new WebSocketManager()
