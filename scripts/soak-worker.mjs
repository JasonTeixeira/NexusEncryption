import { parentPort, workerData } from 'worker_threads'

function strToBytes(str) {
  return new TextEncoder().encode(str)
}

function bytesToBase64(buf) {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return Buffer.from(bin, 'binary').toString('base64')
}

function base64ToBytes(b64) {
  return new Uint8Array(Buffer.from(b64, 'base64')).buffer
}

async function deriveKey(password, salt, iterations, lengthBits) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    strToBytes(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: lengthBits },
    false,
    ['encrypt', 'decrypt']
  )
}

function randomString(len) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[];:\"|,.<>/?'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

async function run() {
  const { ops, textMin, textVar, password } = workerData
  let ok = 0
  let fail = 0
  for (let i = 0; i < ops; i++) {
    const msg = randomString(textMin + Math.floor(Math.random() * textVar))
    const salt = crypto.getRandomValues(new Uint8Array(16)).buffer
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const key = await deriveKey(password, salt, 100000, 256)
    const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, strToBytes(msg))
    const params = {
      ciphertext: enc,
      iv: iv.buffer,
      salt
    }
    try {
      const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: params.iv }, key, params.ciphertext)
      const msgOut = new TextDecoder().decode(dec)
      if (msgOut === msg) ok++
      else fail++
    } catch {
      fail++
    }
  }
  parentPort.postMessage({ ok, fail })
}

run()


