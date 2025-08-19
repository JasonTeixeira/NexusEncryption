# Deployment Guide - Nexus Cipher

## Build and Export

The app uses Next.js static export (`output: 'export'`).

1) Local build
```bash
npm install --legacy-peer-deps
npm run build
```
The static site is generated in `out/`.

## Docker Image

Build and run with Docker + Nginx (with security headers):

```bash
# Build image
docker build -t nexuscipher:latest .

# Run container
docker run -p 8080:80 --name nexuscipher nexuscipher:latest

# Open
open http://localhost:8080
```

## GitHub Actions CI

A CI workflow is provided at `.github/workflows/ci.yml`:
- Installs dependencies
- Type-checks
- Runs tests (jsdom)
- Builds static export
- Uploads `out/` as an artifact

## Static Hosting Options

- Vercel: Import repo and set `next.config.mjs` with `output: 'export'`. Use `Static` output.
- Netlify: Publish directory `out/`.
- Cloudflare Pages: Set build command `npm run build` and output directory `out/`.
- S3 + CloudFront: Upload `out/` to S3 with proper caching; serve via CloudFront.

## Nginx

The included `nginx.conf` sets strong security headers and caching. Adjust CSP if external resources are needed.

## Tauri/Desktop

Tauri builds are separate from the static export. Use:
```bash
npm run tauri:build
```
See `src-tauri/tauri.conf.json` for configuration.

## Environment Variables

The static app avoids dynamic server-side env. For client-side env (if needed), inject at build time with `NEXT_PUBLIC_*` variables.

## Notes

- When using `output: 'export'`, Next.js `headers()` do not apply. Security headers are provided via `nginx.conf`.
- Review CSP and allowed sources before production.
- Ensure TLS (HTTPS) termination in your hosting stack.
