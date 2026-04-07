# Fahhh Agent Sound — Claude Code Hook

Plays a custom sound (`Fahhh.mp3`) in Claude Code when:
- **Claude asks for permission** to run a tool (`PermissionRequest`)
- **Claude finishes responding** and waits for your input (`Stop`)

## Requirements

- Windows 10/11
- Claude Code
- PowerShell (included in Windows)

## Installation

1. Clone or download this repo.
2. Copy `Fahhh.mp3` to a folder of your choice (e.g. `C:\sounds\`).
3. Open your Claude Code global settings file:
   ```
   C:\Users\<YourUser>\.claude\settings.json
   ```
4. Add the following hooks inside the `"hooks"` key (adjust the MP3 path):

```json
"hooks": {
  "PermissionRequest": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "Add-Type -AssemblyName presentationCore; $mp = New-Object system.windows.media.mediaplayer; $mp.open([uri]'file:///C:/sounds/Fahhh.mp3'); $mp.Volume = 1.0; $mp.Play(); Start-Sleep 4",
          "shell": "powershell",
          "async": true
        }
      ]
    }
  ],
  "Stop": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "Add-Type -AssemblyName presentationCore; $mp = New-Object system.windows.media.mediaplayer; $mp.open([uri]'file:///C:/sounds/Fahhh.mp3'); $mp.Volume = 1.0; $mp.Play(); Start-Sleep 4",
          "shell": "powershell",
          "async": true
        }
      ]
    }
  ]
}
```

## Customize

- **Volume**: Change `$mp.Volume = 1.0` to any value between `0.0` and `1.0`.
- **Sound**: Replace `Fahhh.mp3` with any MP3 file you want.
- **Trigger**: Remove `PermissionRequest` or `Stop` block if you only want one trigger.

## How it works

Claude Code supports [hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) — shell commands that run at specific lifecycle events. This hook uses PowerShell's built-in `System.Windows.Media.MediaPlayer` to play an MP3 without any external dependencies.

---

Made with Claude Code by [@renatopuente](https://github.com/renatopuente)
