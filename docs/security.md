## Security & Hardening

### Implemented
- AES‑256‑GCM encryption, PBKDF2 key derivation
- Strict headers: COOP/COEP/CORP, HSTS, Referrer-Policy, XFO=DENY, X‑CTO=nosniff
- Tauri allowlist minimized; keychain-backed storage via Rust commands
- Input validation, rate limiting, error handling and audit logging
- CI supply‑chain: SBOM (CycloneDX) + OSV scanning

### Recommended Next Steps
- Replace inline style allowance with nonce‑based CSP
- Add macOS notarization, Windows code signing in CI
- Add ZAP baseline scan step
- Threat model doc + periodic external pentest


