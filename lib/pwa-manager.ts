export class PWAManager {
  private static serviceWorker: ServiceWorkerRegistration | null = null

  static async initialize(): Promise<void> {
    // Skip SW in Tauri packaged app (file:// scheme) to avoid scope/path issues
    if (typeof window !== "undefined" && (location.protocol === "file:" || (window as any).__TAURI__)) {
      return
    }

    if ("serviceWorker" in navigator) {
      try {
        // Use root-scoped SW for web builds to control the whole app
        this.serviceWorker = await navigator.serviceWorker.register("/sw.js")
        console.log("Service Worker registered successfully")
      } catch (error) {
        console.error("Service Worker registration failed:", error)
      }
    }
  }

  static async enableOfflineMode(): Promise<boolean> {
    if (!this.serviceWorker) return false

    // Cache critical resources for offline use
    const cache = await caches.open("nexus-cipher-v1")
    await cache.addAll(["/", "/app/globals.css", "/components/nexus-cipher.tsx", "/lib/crypto-utils.ts"])

    return true
  }

  static async syncWhenOnline(data: any): Promise<void> {
    if ("serviceWorker" in navigator && "sync" in (window as any).ServiceWorkerRegistration.prototype) {
      // Register background sync
      const registration = await navigator.serviceWorker.ready
      if ("sync" in registration) {
        await (registration as any).sync.register("background-sync")
      }

      // Store data for sync
      localStorage.setItem("pending-sync", JSON.stringify(data))
    }
  }

  static addTouchGestures(element: HTMLElement): void {
    let startX = 0
    let startY = 0

    element.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    })

    element.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const diffX = startX - endX
      const diffY = startY - endY

      // Swipe detection
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            // Swipe left - next tab
            element.dispatchEvent(new CustomEvent("swipe-left"))
          } else {
            // Swipe right - previous tab
            element.dispatchEvent(new CustomEvent("swipe-right"))
          }
        }
      }
    })
  }
}
