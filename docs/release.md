## Release & Distribution

### Tauri Build
```bash
npx tauri build
```
Artifacts are created under `src-tauri/target/release/bundle`.

### Updater Signing
1. Generate Tauri keys: `npx @tauri-apps/cli signer generate`
2. Set `TAURI_PRIVATE_KEY` & `TAURI_KEY_PASSWORD` in GitHub Secrets
3. Paste public key into `src-tauri/tauri.conf.json` (`tauri > updater > pubkey`)

### Notarization (optional)
Add APPLE_ID/APPLE_PASSWORD/APPLE_TEAM_ID secrets; CI will notarize macOS builds.


