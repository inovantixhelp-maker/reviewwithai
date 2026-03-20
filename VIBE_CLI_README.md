# 🎨 VIBE CODING CLI

A desktop CLI tool that generates code from prompts using Claude AI. Write prompts, get code instantly—like `antigravity.google` but for real code!

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Your API Key
Make sure your `.env.local` has:
```
VITE_CLAUDE_API_KEY=your-api-key-here
```

### 3. Run the CLI

**Windows (CMD):**
```bash
vibe "create a function to validate email"
```

**Windows (PowerShell):**
```powershell
.\vibe.ps1 "create a function to validate email"
```

**Mac/Linux:**
```bash
node vibe-cli.js "create a function to validate email"
```

## 📝 Examples

```bash
# Generate a React hook
vibe "create a useLocalStorage hook"

# Generate a utility function
vibe "write a function to deep clone an object"

# Generate a class
vibe "create a Logger class with info, warn, error methods"

# Generate a sorting algorithm
vibe "implement quicksort algorithm"
```

## 💾 Generated Code
All generated code is saved to `./generated/` folder with timestamps:
- `vibe_code_1234567890.js`
- Open directly in your IDE: `code generated/vibe_code_123.js`

## 🎯 Pro Tips

1. **Be specific** - "React hook for fetching data with caching" generates better code than "make hook"
2. **Include language** - "write TypeScript function..." for type safety
3. **Chain commands** - Save code, then modify with another prompt

## 📚 Environment Setup

### Create a Windows Desktop Shortcut
1. Right-click desktop → New → Shortcut
2. Target: `cmd /k "cd /d C:\Users\RR Enterprises\Desktop\smartreview && vibe "write hello world in React""`
3. Name: "Vibe Coder"
4. You can now vibe code from your desktop!

### Add to PATH (Optional)
Make `vibe` command globally available:
1. Copy full path: `C:\Users\RR Enterprises\Desktop\smartreview`
2. Windows → Edit environment variables
3. Add to PATH → Edit → New → Paste path
4. Restart terminal
5. Now use: `vibe "your prompt"` from anywhere

## 🔧 Troubleshooting

- **API Key not found?** Check `.env.local` is in project root with `VITE_CLAUDE_API_KEY`
- **Node command not recognized?** Install [Node.js](https://nodejs.org/)
- **Permission denied on .bat?** Run PowerShell as admin, then: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## 🎨 Features

✅ AI-powered code generation
✅ Auto-save to timestamped files
✅ Works with React, TypeScript, JavaScript, Python, etc.
✅ Beautiful CLI output
✅ IDE-ready code
✅ Windows/Mac/Linux support

Enjoy the vibe! 🚀
