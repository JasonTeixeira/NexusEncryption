// Web Worker for heavy cryptographic operations
class CryptoWorkerManager {
  private worker: Worker | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.initWorker()
    }
  }

  private initWorker() {
    const workerCode = `
      // Worker context - no exports needed
      self.onmessage = async function(e) {
        const { type, data, id } = e.data
        
        try {
          let result
          
          switch (type) {
            case 'encrypt':
              result = await performEncryption(data)
              break
            case 'decrypt':
              result = await performDecryption(data)
              break
            case 'generateKey':
              result = generateSecureKey(data.keySize || 32)
              break
            case 'hashData':
              result = await hashData(data.input, data.algorithm)
              break
            default:
              throw new Error('Unknown operation type')
          }
          
          self.postMessage({ id, success: true, result })
        } catch (error) {
          self.postMessage({ id, success: false, error: error.message })
        }
      }
      
      async function performEncryption(data) {
        // Simulate heavy encryption work
        await new Promise(resolve => setTimeout(resolve, 50))
        
        const encoder = new TextEncoder()
        const dataBuffer = encoder.encode(data.inputData)
        
        // Use Web Crypto API for real encryption
        const keyBuffer = encoder.encode(data.key.padEnd(32, '0').slice(0, 32))
        const key = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM' },
          false,
          ['encrypt']
        )
        
        const iv = crypto.getRandomValues(new Uint8Array(12))
        const salt = crypto.getRandomValues(new Uint8Array(16))
        
        const encrypted = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv },
          key,
          dataBuffer
        )
        
        return {
          encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
          iv: btoa(String.fromCharCode(...iv)),
          salt: btoa(String.fromCharCode(...salt))
        }
      }
      
      async function performDecryption(data) {
        await new Promise(resolve => setTimeout(resolve, 50))
        
        const encoder = new TextEncoder()
        const decoder = new TextDecoder()
        
        const keyBuffer = encoder.encode(data.key.padEnd(32, '0').slice(0, 32))
        const key = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM' },
          false,
          ['decrypt']
        )
        
        const encryptedBuffer = Uint8Array.from(atob(data.encrypted), c => c.charCodeAt(0))
        const ivBuffer = Uint8Array.from(atob(data.iv), c => c.charCodeAt(0))
        
        const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: ivBuffer },
          key,
          encryptedBuffer
        )
        
        return { decrypted: decoder.decode(decrypted) }
      }
      
      function generateSecureKey(keySize) {
        const keyBytes = crypto.getRandomValues(new Uint8Array(keySize))
        return { key: btoa(String.fromCharCode(...keyBytes)) }
      }
      
      async function hashData(input, algorithm) {
        const encoder = new TextEncoder()
        const data = encoder.encode(input)
        
        const hashBuffer = await crypto.subtle.digest(algorithm, data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      }
    `

    const blob = new Blob([workerCode], { type: "application/javascript" })
    this.worker = new Worker(URL.createObjectURL(blob))
  }

  async performOperation(type: string, data: any): Promise<any> {
    if (!this.worker) {
      throw new Error("Worker not initialized")
    }

    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substr(2, 9)

      const timeout = setTimeout(() => {
        reject(new Error("Operation timeout"))
      }, 30000)

      const handleMessage = (e: MessageEvent) => {
        if (e.data.id === id) {
          clearTimeout(timeout)
          this.worker!.removeEventListener("message", handleMessage)

          if (e.data.success) {
            resolve(e.data.result)
          } else {
            reject(new Error(e.data.error))
          }
        }
      }

      if (this.worker) {
        this.worker.addEventListener("message", handleMessage)
        this.worker.postMessage({ type, data, id })
      }
    })
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }
}

export const cryptoWorker = new CryptoWorkerManager()
export { CryptoWorkerManager as CryptoWorker }
