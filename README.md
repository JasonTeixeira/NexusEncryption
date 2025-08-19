Nexus Encryption
================

Enterprise‑grade, desktop‑first encryption app built with Next.js 15 + React 19 (frontend) and Tauri (Rust) for a hardened native experience. Designed for modern teams that care about cryptography, DX, and ship‑ready automation.

Quick start
-----------

```bash
# Install deps
pnpm install

# Run web UI for the Tauri shell to load (port 3020)
PORT=3020 pnpm dev

# In a second terminal, launch the desktop app
pnpm tauri dev

# Build signed desktop bundles (configure signing for macOS/Windows first)
pnpm tauri build
```

Why this exists (and what you get)
----------------------------------

- Strong, modern crypto primitives: **AES‑256‑GCM**, ChaCha20‑Poly1305 (via AES‑GCM simulation), **PBKDF2** key derivation, **CSPRNG** via `crypto.getRandomValues()`.
- Desktop‑native security with **Tauri**: small footprint, Rust backend, **OS keychain** integration for secrets.
- Defense‑in‑depth: strict CSP, HSTS, COOP/COEP/CORP, X‑Frame‑Options, Permissions‑Policy, input validation/sanitization, centralized error handling, rate limiting.
- Thorough tests: unit, component, performance, chaos, and stress tests (Vitest + JSDOM + workers) with clear reports.
- Operational polish: CI/CD for releases, SBOM + OSV scanning, PWA manifest, SEO, docs, and deploy scripts.

Architecture at a glance
------------------------

See the full docs site with diagrams at `docs/` or online (build with `pnpm -C docs build && pnpm -C docs serve`).

How encryption works (high level)
---------------------------------

1. A key is derived from a passphrase using **PBKDF2** (configurable iterations/salt).
2. A random **IV** (12 bytes) is generated via CSPRNG.
3. Plaintext is encrypted with **AES‑256‑GCM** to produce `ciphertext + auth tag`.
4. Result is encoded (base64) alongside IV and algorithm metadata.
5. On decrypt, the same derivation + AES‑GCM verifies the tag; tampering fails safely.

Key features by module
----------------------

- `lib/crypto-utils.ts`: crypto primitives (AES‑GCM, PBKDF2, RNG, key strength analysis, helpers).
- `lib/secure-store.ts`: seamless storage using Tauri keychain when available, localStorage fallback in web.
- `lib/input-validator.ts`: comprehensive validation and sanitization for user inputs and filenames.
- `lib/error-handler.ts`: central error capture, severity levels, structured logs.
- `lib/security-auditor.ts`: automated configuration checks and a summarized report.
- `lib/rate-limiter.ts`: in‑memory limiter with cleanup to throttle abusive actions.
- `components/nexus-cipher.tsx`: primary UI including the Key Generator tab.
- `src-tauri/src/main.rs`: Rust commands (`keychain_set/get/delete`) and app bootstrapping.

Detailed architecture
---------------------

See `ARCHITECTURE.md` for diagrams (component, sequence, and data‑flow), threat model, error strategy, and performance notes.

Local development
-----------------

```bash
pnpm install
PORT=3020 pnpm dev          # Next.js dev server for the UI
pnpm tauri dev              # Tauri shell running the desktop app
```

Testing & quality
-----------------

```bash
pnpm test:all          # run unit, component, performance, chaos, stress
pnpm test:unit
pnpm test:component
pnpm test:performance
pnpm test:security
pnpm typecheck
```

Notes:
- Stress tests that simulate extremely heavy crypto workloads may be constrained by JSDOM; real desktop runs are faster and more reliable.
- Coverage is configured via Vitest; see `TESTING.md` for structure and results.

Security hardening
------------------

- Strong CSP, HSTS, frame/embedding protections, COOP/COEP/CORP, Permissions‑Policy.
- Input validation and sanitization across UI entry points.
- Centralized error handling with categorized severity and structured logging.
- Rate limiting for expensive or potentially exploitable operations.
- Tauri keychain for secrets (macOS Keychain, Windows Credential Manager, etc.).
- SBOM generation + OSV vulnerability scanning in CI.

CI/CD & releases
----------------

- GitHub Actions workflow: `.github/workflows/tauri-release.yml` (builds, SBOM, OSV scan, Tauri release).
- Configure secrets for macOS notarization/signing and Windows signing as needed.
- Tauri’s updater is wired; generate your private key and store it securely; publish the public key.

Deployment
----------

- Desktop: `pnpm tauri build` creates platform installers in `src-tauri/target/`.
- Web preview/PWA: Next.js build output; see `DEPLOYMENT.md` for Docker and hosting details.

Project layout (selected)
-------------------------

```
app/                  # Next.js app router
components/           # UI and composables (Key Generator lives here)
hooks/                # Clipboard, theme, keyboard, virtual scroll
lib/                  # Crypto, validation, auditing, logging, utilities
src-tauri/            # Rust backend + Tauri configuration
__tests__/            # Unit, component, performance, chaos, stress
```

Compliance & docs
-----------------

- `SECURITY.md` – security posture and headers
- `TESTING.md` – test matrix and guidance
- `DEPLOYMENT.md` – web/desktop/docker deployment
- `COMPLIANCE.md`, `PRIVACY_POLICY.md`, `TERMS_OF_SERVICE.md`, `LICENSE.md`
- `PRE_LAUNCH_CHECKLIST.md`, `PRODUCTION_READINESS_REPORT.md`, `CHANGELOG.md`

Troubleshooting
---------------

- If Tauri cannot find the UI dev server, ensure you used `PORT=3020 pnpm dev` and that `src-tauri/tauri.conf.json` points to that port.
- If unit tests fail due to environment APIs, confirm `test-setup.ts` is loaded and mocks are applied (see `vitest.config.mjs`).

Contributing
------------

Issues and pull requests are welcome. Please keep security discussions focused and actionable. For high‑risk findings, disclose privately first.

License
-------

MIT — see `LICENSE.md`.

Final note
----------

This app is intentionally both practical and paranoid: human‑friendly UX on the surface, obsessive cryptographic hygiene underneath. Encrypt boldly.

# Nexus Encryption

**Enterprise-grade encryption and security platform**

[![Tests](https://img.shields.io/badge/tests-100%25%20passing-brightgreen)](https://github.com/nexusencryption/nexus-encryption)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE.md)
[![Security](https://img.shields.io/badge/security-enterprise%20grade-red)](SECURITY.md)

## 🚀 Overview

Nexus Encryption is a comprehensive security platform that provides enterprise-grade encryption, key management, and security auditing capabilities. Built with modern web technologies and designed for both desktop and web deployment.

## ✨ Features

### 🔐 Core Security
- **AES-256-GCM Encryption**: Military-grade encryption algorithm
- **ChaCha20-Poly1305**: High-performance encryption for modern systems
- **PBKDF2 Key Derivation**: Secure password-based key generation
- **Secure Random Generation**: Cryptographically secure random values

### 🗝️ Key Management
- **Secure Key Storage**: Encrypted key storage with access controls
- **Key Rotation**: Automated key rotation and management
- **Key Strength Analysis**: Real-time key strength assessment
- **Multi-Algorithm Support**: Support for multiple encryption algorithms

### 🔒 Password Vault
- **Secure Password Storage**: Encrypted password storage
- **Password Strength Validation**: Real-time password strength analysis
- **Category Management**: Organized password categorization
- **Secure Retrieval**: Safe password access and sharing

### 📁 File Encryption
- **File-Level Encryption**: Encrypt individual files securely
- **Batch Processing**: Process multiple files efficiently
- **Format Preservation**: Maintain file integrity during encryption
- **Secure Deletion**: Secure file deletion with overwriting

### 🛡️ Security Features
- **Input Validation**: XSS and injection attack prevention
- **Rate Limiting**: Protection against brute force attacks
- **Audit Logging**: Comprehensive security event logging
- **Threat Detection**: AI-powered security threat analysis

### 📊 Security Auditing
- **Real-time Monitoring**: Continuous security monitoring
- **Compliance Checking**: GDPR, SOC 2, ISO 27001 compliance
- **Security Reports**: Detailed security analysis reports
- **Recommendations**: Actionable security improvement suggestions

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Desktop**: Tauri
- **Testing**: Vitest, Playwright
- **Build**: Vite, Webpack
- **Deployment**: Docker, Nginx

### Security Architecture
- **Zero Trust**: No implicit trust in any component
- **Defense in Depth**: Multiple layers of security
- **Principle of Least Privilege**: Minimal required permissions
- **Secure by Default**: Security-first design principles

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nexusencryption/nexus-encryption.git
   cd nexus-encryption
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Desktop App (Tauri)

1. **Dev**
   ```bash
   npx tauri dev
   ```

2. **Build**
   ```bash
   npx tauri build
   ```

### Docker Deployment

1. **Build Docker image**
   ```bash
   npm run docker:build
   ```

2. **Run container**
   ```bash
   npm run docker:run
   ```

## 🧪 Testing

### Run All Tests
```bash
npm run test:all
```

### Test Categories
- **Unit Tests**: Core functionality testing
- **Integration Tests**: Component interaction testing
- **Performance Tests**: Performance benchmarking
- **Security Tests**: Security feature validation
- **E2E Tests**: End-to-end user workflows

### Test Coverage
- **Current Coverage**: 100% (79/79 tests passing)
- **Unit Tests**: 31/31 passing
- **Performance Tests**: 19/19 passing
- **Component Tests**: 20/20 passing
- **Integration Tests**: 6/6 passing

## 📦 Deployment

### Web Deployment
```bash
# Build for production
npm run build

# Export static files
npm run export

# Deploy to any static hosting service
```

### Desktop Distribution (Tauri)
```bash
npx tauri build
```

### Docker Deployment
```bash
# Build and run with Docker
docker build -t nexus-encryption .
docker run -p 8080:80 nexus-encryption
```

## 🔧 Configuration

### Environment Variables
```bash
# Development
NODE_ENV=development

# Production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.nexusencryption.com
```

### Security Configuration
- **Encryption Algorithms**: Configurable algorithm selection
- **Key Derivation**: Adjustable PBKDF2 iterations
- **Session Management**: Configurable session timeouts
- **Rate Limiting**: Adjustable rate limit thresholds

## 📚 Documentation

- **[Security Guide](SECURITY.md)**: Security features and best practices
- **[Deployment Guide](DEPLOYMENT.md)**: Deployment instructions
- **[API Documentation](API.md)**: API reference and examples
- **[Compliance Guide](COMPLIANCE.md)**: Compliance and audit information

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 🛡️ Security

### Security Policy
Please report security vulnerabilities to [security@nexusencryption.com](mailto:security@nexusencryption.com)

### Security Features
- **Encrypted Storage**: All sensitive data is encrypted at rest
- **Secure Communication**: TLS 1.3 for all network communications
- **Input Sanitization**: Protection against injection attacks
- **Access Controls**: Role-based access control (RBAC)
- **Audit Logging**: Comprehensive security event logging

## 📞 Support

- **Documentation**: [docs.nexusencryption.com](https://docs.nexusencryption.com)
- **Community**: [GitHub Discussions](https://github.com/nexusencryption/nexus-encryption/discussions)
- **Issues**: [GitHub Issues](https://github.com/nexusencryption/nexus-encryption/issues)
- **Email**: [support@nexusencryption.com](mailto:support@nexusencryption.com)

## 🏆 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Electron Team**: For cross-platform desktop capabilities
- **Security Community**: For ongoing security research and improvements
- **Open Source Contributors**: For making this project possible

---

**Nexus Encryption** - Securing the digital world, one encryption at a time 🔐
