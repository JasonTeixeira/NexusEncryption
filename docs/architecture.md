## Architecture

### Frontend (Next.js App Router)
- React 19 with functional components and hooks
- Tailwind CSS + Radix UI for accessible components
- Global error listener and theme provider

### Crypto Layer
- AES‑256‑GCM via Web Crypto API
- PBKDF2 key derivation (SHA‑256, 100k iterations default)
- Utilities in `lib/crypto-utils.ts` (encoding helpers, hashing, IV/salt generation)

### Desktop (Tauri)
- Rust backend exposes minimal commands for keychain storage
- CSP and strict headers in `next.config.mjs`
- Updater integration (endpoints + pubkey in `src-tauri/tauri.conf.json`)

### State & Data
- Secure storage helper in `lib/secure-store.ts` delegates to OS keychain via Tauri, falls back to `localStorage` in web dev


