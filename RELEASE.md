# Release Guide – Nexus Encryption (Tauri)

This guide describes how to produce signed desktop installers and automate releases.

## One-time setup

- Apple Developer (macOS signing/notarization)
  - Create an Apple ID and enroll in the Apple Developer Program
  - Generate an App-Specific Password or use a notarytool keychain profile
  - Collect: APPLE_ID, APPLE_PASSWORD (or NOTARYTOOL JSON), APPLE_TEAM_ID
- Windows (optional signing)
  - Obtain a code-signing certificate (.pfx)
  - Base64-encode and store in WINDOWS_CERTIFICATE; store password in WINDOWS_CERTIFICATE_PASSWORD

## Local production build

```bash
# Build static web assets (Next.js output: export)
npm run build
# Build desktop bundles (Tauri)
source "$HOME/.cargo/env" && npx tauri build
# Output
ls -la src-tauri/target/release/bundle
```

## CI release (recommended)

- Push a tag like `v1.0.0` or run the workflow manually
- Workflow: `.github/workflows/tauri-release.yml`
- Secrets (set in GitHub repo settings > Secrets and variables > Actions):
  - APPLE_ID, APPLE_PASSWORD, APPLE_TEAM_ID (optional, for macOS notarization)
  - WINDOWS_CERTIFICATE, WINDOWS_CERTIFICATE_PASSWORD (optional, for Windows signing)

## Notarization (macOS) – optional but recommended

If you want CI to notarize automatically, add the Apple secrets above. For local notarization using `notarytool`:

```bash
xcrun notarytool store-credentials "nexus-notary" \
  --apple-id "you@example.com" \
  --team-id "TEAMID1234" \
  --password "app-specific-password"

xcrun notarytool submit "src-tauri/target/release/bundle/dmg/Nexus Encryption_*.dmg" \
  --keychain-profile "nexus-notary" --wait
```

Staple the ticket:
```bash
xcrun stapler staple "src-tauri/target/release/bundle/macos/Nexus Encryption.app"
xcrun stapler staple "src-tauri/target/release/bundle/dmg/Nexus Encryption_*.dmg"
```

## Verification

- macOS: open the `.dmg` and `.app` on a clean machine/VM
- Windows: run the `.msi`/`.exe`; verify SmartScreen
- Linux: run `.AppImage` and check `chmod +x` if needed

## Versioning

- Update `package.json` and `src-tauri/tauri.conf.json` versions together
- Tag releases as `vX.Y.Z`

---

You’re set. CI will create multi-platform installers on each release tag, and you can add signing secrets any time without code changes.
