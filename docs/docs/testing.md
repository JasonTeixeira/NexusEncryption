---
id: testing
title: Testing & Quality
---

Test matrix
-----------

- Unit (Vitest): crypto utils, validators, helpers
- Component (Testing Library): main UI, Key Generator interactions
- Performance: timed encrypt/decrypt batches
- Chaos: rate-limiter abuse, random failures
- Stress/soak: thousands of crypto ops (note JSDOM limits)

Run it all
---------

```bash
pnpm test:all
pnpm test:unit
pnpm test:component
pnpm test:performance
pnpm test:security
```

Environments
------------

- JSDOM for browser‑like unit/component tests
- Node worker threads for heavy soak tests
- Desktop (Tauri) for realistic crypto throughput


