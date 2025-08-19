## Testing Strategy

### Commands
- All tests: `npm run test:all`
- Soak test: `npm run soak`

### Suites
- Unit: crypto utils, validators, rate limiter, errors
- Component/integration: main UI flows
- Performance: encryption, validation, rate limit timing
- Chaos: injected failures + burst limiter
- Soak: Node worker_threads running parallel AES‑GCM (16k ops baseline)

### Results Snapshot
- Core: 81/81 passing
- Chaos: 2/2 passing
- Soak: 16k ops, 0 failures, ~159 ops/sec


