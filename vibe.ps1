#!/usr/bin/env pwsh

# PowerShell wrapper for vibe-cli.js on Windows
# Usage: .\vibe.ps1 "your prompt here"

param(
    [string]$Prompt
)

if ($Prompt -eq "") {
    & node vibe-cli.js
} else {
    & node vibe-cli.js "$Prompt"
}
