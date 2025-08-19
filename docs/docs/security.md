---
id: security
title: Security Posture
---

Defense-in-depth
----------------

- Content Security Policy (tight by default)
- HSTS (with preload), X-Frame-Options deny, Referrer-Policy strict
- COOP/COEP/CORP isolation
- Permissions-Policy denies unused sensors/APIs
- Input validation + sanitization across entry points
- Rate limiting for sensitive/high-cost operations
- OS keychain for secrets via Tauri commands
- SBOM + OSV scanning wired into CI

Headers quick reference
-----------------------

```text
Content-Security-Policy, Strict-Transport-Security, X-Frame-Options,
X-Content-Type-Options, Referrer-Policy, Cross-Origin-Opener-Policy,
Cross-Origin-Embedder-Policy, Cross-Origin-Resource-Policy, Permissions-Policy
```

Threats and mitigations (abridged)
----------------------------------

- XSS: strict CSP + sanitized inputs + no unsafe HTML sinks
- Clickjacking: frame-ancestors 'none'
- Secret leakage: OS keychain, avoid localStorage when in Tauri
- Supply chain: SBOM + OSV scan
- Brute force: KDF iterations + rate limiting


