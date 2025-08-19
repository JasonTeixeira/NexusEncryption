## Overview

Nexus Encryption is a desktop-first encryption platform built with Next.js + React (UI) and Tauri (desktop shell). It provides AES‑256‑GCM encryption, secure key storage, password vault features, and a hardened runtime with strong testing coverage.

### Key Capabilities
- Text and file encryption (AES‑256‑GCM; ChaCha20 simulated via AES‑GCM)
- Key generation, validation, and strength analysis
- Password vault with strength checks
- Security auditing and rate limiting
- Desktop packaging via Tauri (macOS, Windows, Linux)

### Technology Stack
- UI: Next.js 15, React 19, TypeScript, Tailwind, Radix UI
- Desktop: Tauri 1.x (Rust backend + WebView front-end)
- Tests: Vitest (+ chaos and stress tests), optional soak test (Node worker_threads)
- CI/CD: GitHub Actions (Tauri builds, SBOM, OSV scan)

### Folder Map
- `app/`, `components/`, `hooks/` – React app (App Router)
- `lib/` – encryption utilities, security helpers, logging
- `src-tauri/` – Tauri app (Rust, config, bundling)
- `__tests__/` – unit/component/perf/chaos/stress tests
- `scripts/` – icon generation, deployment, soak tests
- `docs/` – documentation

### Entry Points
- Desktop dev: `npx tauri dev`
- Desktop build: `npx tauri build`
- Web dev (for UI-only work): `npm run dev`


