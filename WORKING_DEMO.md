# Working Demo

This file contains instructions for the included working demo script.

Script location:

- `demo/demo.ps1` — PowerShell script that signs up a demo user (if needed), logs in, creates a note, and lists notes.

Quick run:

1. Start the backend server (see `README.md`).
2. From the repository root run:

```powershell
powershell -ExecutionPolicy Bypass -File .\demo\demo.ps1
```

Notes:
- If your backend runs on a different host or port, edit the `$base` variable at the top of `demo/demo.ps1`.
- The script uses `Invoke-RestMethod`; run it in PowerShell on Windows. If you want a cross-platform demo, consider `demo/demo.js` (Node) — ask me to add it.
