import { Worker } from 'worker_threads'
import os from 'os'

const threads = Math.max(2, Math.min(os.cpus().length, 8))
const opsPerThread = 2000
const password = 'K'.repeat(64)

function runThread() {
  return new Promise((resolve) => {
    const w = new Worker(new URL('./soak-worker.mjs', import.meta.url), {
      workerData: { ops: opsPerThread, textMin: 64, textVar: 4096, password }
    })
    w.on('message', (msg) => resolve(msg))
    w.on('error', (e) => resolve({ ok: 0, fail: opsPerThread, err: e.message }))
  })
}

const start = Date.now()
const results = await Promise.all(Array.from({ length: threads }, runThread))
const elapsed = Date.now() - start
const ok = results.reduce((a, b) => a + (b.ok || 0), 0)
const fail = results.reduce((a, b) => a + (b.fail || 0), 0)
const total = ok + fail
const throughput = (total / (elapsed / 1000)).toFixed(1)

console.log(`Soak AES-GCM: threads=${threads} total=${total} ok=${ok} fail=${fail} time=${elapsed}ms throughput=${throughput} ops/s`)
process.exit(fail === 0 ? 0 : 1)


