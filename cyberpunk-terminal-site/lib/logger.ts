type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, any>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
    }

    if (this.isDevelopment) {
      console[level === "debug" ? "log" : level](
        `[${entry.timestamp.toISOString()}] ${level.toUpperCase()}: ${message}`,
        context || "",
      )
    }

    // In production, send to logging service
    if (!this.isDevelopment && level !== "debug") {
      this.sendToLoggingService(entry)
    }
  }

  private async sendToLoggingService(entry: LogEntry) {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      })
    } catch (error) {
      // Fallback to console in case of logging service failure
      console.error("Failed to send log to service:", error)
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log("debug", message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log("info", message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log("warn", message, context)
  }

  error(message: string, context?: Record<string, any>) {
    this.log("error", message, context)
  }
}

export const logger = new Logger()
