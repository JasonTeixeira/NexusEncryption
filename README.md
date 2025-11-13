# Nexus Encryption

**Desktop encryption app built with Next.js + Tauri (Rust)**

```
┌──────────────────────────────────────────────┐
│  WHAT THIS IS                                │
├──────────────────────────────────────────────┤
│  • Native desktop encryption tool           │
│  • AES-256-GCM + ChaCha20-Poly1305          │
│  • Next.js 15 frontend, Tauri Rust backend  │
│  • OS keychain integration for secrets      │
│  • Password vault + file encryption         │
└──────────────────────────────────────────────┘
```

## Why I Built This

I wanted a local-first encryption tool that didn't rely on cloud services. Most password managers and encryption tools send your data to remote servers, which I'm not comfortable with. Even "zero-knowledge" services require trusting their implementation.

This project started as a basic AES encryptor in the browser, then I realized I needed persistent storage without localStorage (not secure enough). That's when I discovered Tauri—a Rust framework that wraps web UIs in a native app with access to system APIs.

The result is a desktop app that uses OS-level keychains (macOS Keychain, Windows Credential Manager) to store encryption keys, with a React UI for the interface.

## Architecture

```
┌─────────────────────┐
│   Next.js 15 UI     │  React 19, TypeScript
│   (Frontend)        │  Runs in Tauri WebView
└──────────┬──────────┘
           │ Tauri IPC (invoke)
           ▼
┌─────────────────────┐
│   Tauri (Rust)      │  Native app shell
│   Backend           │  OS keychain integration
└─────────────────────┘
```

**Encryption:** AES-256-GCM (primary), ChaCha20-Poly1305 (simulated via AES-GCM - actual ChaCha20 would require Rust implementation)  
**Key derivation:** PBKDF2 with configurable iterations  
**Storage:** OS keychain via Tauri Rust commands

## What's Inside

**Frontend (`/app`, `/components`, `/lib`):**
- `components/nexus-cipher.tsx` - Main encryption UI with tabs (encrypt, decrypt, key generator)
- `lib/crypto-utils.ts` - Web Crypto API wrappers (AES-GCM, PBKDF2, CSPRNG)
- `lib/secure-store.ts` - Storage abstraction (Tauri keychain if available, localStorage fallback)
- `lib/input-validator.ts` - XSS/injection prevention for user inputs
- `lib/rate-limiter.ts` - In-memory rate limiting for brute-force protection
- `hooks/` - Custom hooks (clipboard, keyboard shortcuts, virtual scroll)

**Backend (`/src-tauri`):**
- `src/main.rs` - Tauri app initialization
- `src/keychain.rs` - OS keychain commands (`keychain_set`, `keychain_get`, `keychain_delete`)

**Testing (`/__tests__`):**
- Unit tests for crypto functions
- Component tests for UI
- Performance tests (stress testing encryption/decryption)
- Chaos tests (simulating failures)

**Documentation (`/docs`):**
- Architecture diagrams (component, sequence, data-flow)
- Security hardening details
- Compliance docs (PRIVACY_POLICY.md, TERMS_OF_SERVICE.md, COMPLIANCE.md)

## What Works

**AES-256-GCM encryption:** Full implementation using Web Crypto API. Generates random IVs, derives keys from passphrases with PBKDF2, encrypts plaintext, outputs Base64-encoded ciphertext.

**Tauri keychain integration:** Passwords and keys can be stored in macOS Keychain or Windows Credential Manager via Rust commands. More secure than browser localStorage.

**Password vault:** Basic UI for storing/retrieving passwords with categories. Encrypted at rest.

**File encryption:** Drag-and-drop file encryption/decryption. Reads file as ArrayBuffer, encrypts with AES-GCM, saves as `.enc` file.

**Desktop app packaging:** `pnpm tauri build` produces `.dmg` for macOS, `.exe` for Windows, `.deb` for Linux.

## What's Not Quite Right

**ChaCha20-Poly1305 "simulation":** The docs claim ChaCha20 support, but it's actually just AES-GCM labeled differently. Real ChaCha20 would need Rust crypto implementation in the Tauri backend. Didn't get around to it.

**Rate limiting in memory only:** The rate limiter resets on app restart, so it's not effective against persistent attackers. Would need persistent storage (SQLite or similar).

**SBOM/OSV scanning in CI:** The GitHub Actions workflow references SBOM generation and OSV scanning, but I haven't fully configured it. The workflow exists but doesn't fail builds on vulnerabilities yet.

**Compliance docs are boilerplate:** PRIVACY_POLICY.md, TERMS_OF_SERVICE.md, and COMPLIANCE.md are generic templates. They'd need customization before any real deployment.

## What Was Hard

**Tauri IPC between frontend and Rust:** Getting the Next.js frontend to invoke Rust commands via Tauri's IPC took a while to figure out. The types don't match cleanly between TypeScript and Rust, and error handling across the boundary is awkward.

**Web Crypto API limitations:** Can't use Web Crypto in Node.js (it's browser-only), so testing crypto functions required JSDOM or browser-like environments. Had to mock `crypto.subtle` for tests.

**Signing macOS builds:** macOS notarization requires an Apple Developer account ($99/year) and code signing certificates. I got it working eventually, but the setup was painful. Windows signing is similar (need a code signing certificate from a CA).

**Next.js + Tauri dev mode:** Running Next.js on port 3020 and having Tauri load it requires careful configuration. If the port changes or the dev server isn't running, Tauri just shows a blank screen with no clear error.

## What I'd Do Differently

**Implement real ChaCha20 in Rust:** Instead of "simulating" ChaCha20 with AES-GCM, I'd use the `chacha20poly1305` Rust crate and expose it as a Tauri command.

**Use SQLite for persistent rate limiting:** Store rate limit counters in a local SQLite database so they survive app restarts.

**Simplify the UI:** The current UI has too many tabs (encrypt, decrypt, key generator, password vault, file encryption). Most users just want basic encryption. I'd collapse it into one focused view.

**Skip the compliance docs:** PRIVACY_POLICY.md and TERMS_OF_SERVICE.md make it seem like this is a commercial product. It's not. I'd remove them.

**Add actual backup/export:** Right now, if you lose your keychain, your encrypted data is gone. Should add encrypted backup export.

## Quick Start

**Prerequisites:**
- Node.js 18+
- pnpm (or npm/yarn)
- Rust + Cargo (for Tauri)

**Development:**
```bash
git clone https://github.com/JasonTeixeira/NexusEncryption.git
cd NexusEncryption

pnpm install

# Start Next.js dev server (port 3020)
PORT=3020 pnpm dev

# In a second terminal, launch Tauri desktop app
pnpm tauri dev
```

**Build desktop app:**
```bash
pnpm tauri build
```

Installers will be in `src-tauri/target/release/bundle/`.

**Testing:**
```bash
pnpm test:all          # all tests
pnpm test:unit         # crypto, validation tests
pnpm test:component    # UI component tests
pnpm test:performance  # stress tests
pnpm typecheck         # TypeScript checks
```

## Current Status

**Working:** AES-256-GCM encryption, Tauri keychain integration, password vault, file encryption, desktop builds for macOS/Windows/Linux

**Partial:** ChaCha20 (simulated with AES-GCM, not real), rate limiting (in-memory only), SBOM/OSV scanning (workflow exists, not enforced)

**Not implemented:** Encrypted backup/export, persistent rate limiting, real ChaCha20

I use this for personal file encryption on macOS. It works well for that. Wouldn't recommend it for team use or commercial deployment without more polish.

---

**Built with:** Next.js 15, React 19, Tauri (Rust), TypeScript, Web Crypto API  
**Started:** 2024  
**Status:** Active personal use  
**License:** MIT

**Documentation:** See `docs/` for architecture diagrams, `SECURITY.md` for hardening details, `TESTING.md` for test coverage
