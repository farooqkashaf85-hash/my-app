# Demo

This folder contains a simple PowerShell demo script that exercises the backend API.

Files:
- `demo.ps1` — PowerShell script that signs up a demo user, logs in, creates a note, and lists notes.

Usage:

1. Start the backend server (see root README).
2. From the repository root run:

```powershell
powershell -ExecutionPolicy Bypass -File .\demo\demo.ps1
```

If your backend runs on a different host or port, edit the `$base` variable at the top of `demo.ps1`.
