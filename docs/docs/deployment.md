---
id: deployment
title: Deployment & Releases
---

Local
-----

```bash
PORT=3020 pnpm dev
pnpm tauri dev
```

Desktop builds
--------------

```bash
pnpm tauri build
```

CI/CD
-----

- GitHub Actions workflow builds Tauri bundles, generates SBOM, and runs OSV scan.
- Configure signing/notarization secrets for macOS and Windows as needed.
- Tauri updater: keep the private key offline; publish the public key for update verification.

Docker (web preview)
--------------------

```bash
pnpm run docker:build
pnpm run docker:run
```


