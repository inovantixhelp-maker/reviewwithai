#!/usr/bin/env node

/**
 * 🎨 VIBE CODING CLI
 * Like antigravity.google, but for actual code generation
 * Usage: node vibe-cli.js "your code prompt"
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const CLAUDE_API_KEY = process.env.VITE_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY;

if (!CLAUDE_API_KEY) {
  console.error("❌ Error: VITE_CLAUDE_API_KEY not found in .env.local");
  process.exit(1);
}

const client = new Anthropic({
  apiKey: CLAUDE_API_KEY,
});

async function vibeCoding(prompt) {
  console.log("\n✨ Generating code with vibes...\n");

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a vibe coder. Generate clean, production-ready code based on this prompt. Include comments explaining the logic. Code only, no markdown formatting:\n\n${prompt}`,
        },
      ],
    });

    const codeContent = message.content[0];
    if (codeContent.type === "text") {
      const code = codeContent.text;

      // Display with style
      console.log("━".repeat(60));
      console.log("💻 GENERATED CODE:");
      console.log("━".repeat(60));
      console.log(code);
      console.log("━".repeat(60));

      // Ask if user wants to save
      const timestamp = Date.now();
      const filename = `vibe_code_${timestamp}.js`;
      const filepath = path.join(__dirname, "generated", filename);

      // Create generated folder if it doesn't exist
      const generatedDir = path.join(__dirname, "generated");
      if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir, { recursive: true });
      }

      fs.writeFileSync(filepath, code);
      console.log(`\n✅ Code saved to: generated/${filename}`);
      console.log(`📂 Open with: code generated/${filename}\n`);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Main
const prompt = process.argv.slice(2).join(" ");

if (!prompt) {
  console.log(`
╔════════════════════════════════════════════╗
║         🎨 VIBE CODING CLI v1.0            ║
║    Like antigravity.google but for code    ║
╚════════════════════════════════════════════╝

Usage:
  node vibe-cli.js "describe what code you want"

Examples:
  node vibe-cli.js "create a function to validate email"
  node vibe-cli.js "generate a react hook for http requests"
  node vibe-cli.js "write a sort algorithm"

Generated code is saved to: ./generated/
`);
  process.exit(0);
}

vibeCoding(prompt);
