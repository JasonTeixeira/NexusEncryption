## Troubleshooting

### Port in use (3000)
Kill the process holding the port:
```bash
lsof -i:3000 | awk 'NR>1{print $2}' | xargs kill -9
```

### Tauri build fails on icon or identifier
- Ensure `src-tauri/icons/icon.png` exists.
- Ensure `bundle.identifier` is set in `tauri.conf.json`.

### Updater complaining about missing private key
- Add `TAURI_PRIVATE_KEY`/`TAURI_KEY_PASSWORD` secrets or disable updater during local testing.


