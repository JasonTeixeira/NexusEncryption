---
id: architecture
title: Architecture Deep Dive
---

At runtime, the React UI (Next.js 15 + React 19) runs inside Tauri’s webview. A slim Rust layer exposes only the commands we need.

System map
----------

```mermaid
graph TD
  A[React UI] --> B[InputValidator]
  A --> C[CryptoUtils]
  A --> D[ErrorHandler]
  C <--> E[SecureStore]
  E <--> F{{Tauri Commands}}
  F <--> G[(OS Keychain)]
```

Sequence: Encrypt one message
-----------------------------

```mermaid
sequenceDiagram
  participant U as UI
  participant V as InputValidator
  participant C as CryptoUtils
  U->>V: validate(passphrase, text)
  V-->>U: ok
  U->>C: encrypt(text, passphrase)
  C->>C: deriveKey(PBKDF2)
  C->>C: iv = random(12)
  C->>C: AES-GCM encrypt
  C-->>U: envelope(JSON)
```

Error strategy
--------------

- Guard clauses, typed errors, and severity levels.
- Auth failures (bad GCM tag) short‑circuit with a user‑friendly message.
- Non‑fatal issues route through `ErrorHandler` and can be surfaced via a global listener.

Performance notes
-----------------

- WebCrypto is hardware‑accelerated on most platforms.
- Long‑running tests in CI use limits suitable for JSDOM; desktop runs are much faster.


