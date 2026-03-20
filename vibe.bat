@echo off
REM Windows wrapper for vibe-cli.js
REM Usage: vibe "your prompt here"

if "%1"=="" (
    node vibe-cli.js
    exit /b 0
)

node vibe-cli.js %*
