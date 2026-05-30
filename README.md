
<div align="center">

# 🌌 NebulaForge

### AI Agent Studio — Modular, Intelligent, Elegant

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-Integration-412991?style=for-the-badge&logo=openai)](https://openai.com)

**Build intelligent conversational AI agents with pluggable tools, persistent memory, and a production-ready interface.**

[🚀 Get Started](#quick-start) • [📚 Documentation](#how-it-works) • [⚙️ Configuration](#configuration)

</div>

---

## ✨ What is NebulaForge?

NebulaForge is a **full-stack AI agent framework** that empowers you to build intelligent assistants without the complexity. Whether you need a chatbot that can fetch weather data, execute API calls, or interact with custom knowledge bases, NebulaForge handles the heavy lifting.

It's designed for developers who want powerful AI capabilities without sacrificing code clarity or production readiness.

---

## 🎯 Core Features

<table>
<tr>
<td width="33%">

### 🔧 Modular Tools
Plug-and-play tool integration. Add external services (weather APIs, calculators, databases) with minimal configuration.

</td>
<td width="33%">

### 💾 Conversation Memory
Full conversation history with intelligent state management. Choose between file-based or SQLite backing for persistence.

</td>
<td width="33%">

### 🧠 LLM Agnostic
Built for OpenAI but extensible to any LLM provider. Swap providers without rewriting core logic.

</td>
</tr>
<tr>
<td width="33%">

### 🛡️ Production Ready
Rate limiting, payload guards, and error handling built-in. Safe for demos and production use.

</td>
<td width="33%">

### ⚡ Real-time Response
Stream agent responses as they happen. Beautiful UI keeps users engaged during processing.

</td>
<td width="33%">

### 🎨 Designer-Friendly
Clean, modern interface with intuitive tool selection. No cryptic command lines—just chat naturally.

</td>
</tr>
</table>

---

## 🏗️ How It Works

**Your Workflow:**

1. **You write a message** → The UI sends it to the agent API
2. **The agent analyzes** → It decides which tools (if any) are needed
3. **Tools execute** → External APIs run, data is gathered
4. **Memory updates** → Conversation context is stored for future reference
5. **Response streams** → The AI responds in real-time, and you see it unfold

The entire flow is managed by TypeScript with type safety at every layer. No surprises. No data loss.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm
- **OpenAI API key** (optional, for LLM functionality)

### Installation

```bash
# Clone and install dependencies
git clone https://github.com/YOUR_USERNAME/nebula-forge.git
cd nebula-forge
npm install
```

### Environment Setup

```bash
# Create .env.local file
echo "OPENAI_API_KEY=sk-your-key-here" > .env.local
```

For Windows users without native SQLite, enable file-based memory:

```bash
echo "FORCE_FILE_MEMORY=1" >> .env.local
```


## ⚙️ Configuration

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `OPENAI_API_KEY` | OpenAI LLM access | Optional (feature-gated) |
| `FORCE_FILE_MEMORY` | Use JSON instead of SQLite | Optional (Windows) |

### Memory Backends

**File Mode** (default for Windows):
- Stores conversations in `data/memory.json`
- No native dependencies
- Suitable for small to medium workloads

**SQLite Mode** (default on macOS/Linux):
- Uses `better-sqlite3` for persistence
- Faster queries on large datasets
- Requires native build tools

### Deployment

Deploy to **Vercel**, **Netlify**, or any Node-compatible host:

1. Push to GitHub
2. Connect your repo to Vercel/Netlify
3. Add `OPENAI_API_KEY` to environment variables
4. Deploy with one click

---

## 🔧 Architecture

**Frontend** → Next.js + React (TypeScript)  
**Backend** → Next.js API routes  
**State** → Conversation memory (file or SQLite)  
**LLM** → OpenAI API (pluggable)  
**Tools** → Modular, extensible system

---

## 📁 Project Structure

```
nebula-forge/
├── pages/
│   ├── index.tsx           # Main UI entry point
│   ├── _app.tsx            # App configuration
│   └── api/
│       └── agent.ts        # Agent logic & LLM calls
├── lib/
│   ├── agent.ts            # Core agent implementation
│   ├── memory.ts           # Memory management
│   ├── tools.ts            # Tool definitions
│   └── utils.ts            # Utilities
├── data/
│   └── memory.json         # Persistent conversation data
├── styles/
│   └── globals.css         # Global styling
└── public/                 # Static assets
```

---

## 🛠️ Extending NebulaForge

### Adding a New Tool

Edit [lib/tools.ts](lib/tools.ts) and define your tool:

```typescript
export const myTool = {
  name: "my_tool",
  description: "Does something useful",
  run: async (params) => {
    // Your logic here
    return result;
  }
};
```

### Changing the LLM Provider

Edit [pages/api/agent.ts](pages/api/agent.ts) and swap the LLM initialization:

```typescript
// Replace OpenAI with your provider
const response = await yourLLM.call(messages, tools);
```

---

## 📦 Tech Stack

- **Framework**: Next.js 13+ (React 18)
- **Language**: TypeScript 5
- **Styling**: CSS Modules / Tailwind-ready
- **Storage**: File JSON or SQLite
- **Deployment**: Vercel, Netlify, any serverless host

---

## 🤝 Contributing

Have ideas? Found a bug? Open an issue or submit a PR—we'd love your input.

---

## 📄 License

MIT

---

<div align="center">

**Built with ❤️ for developers who love elegant AI.**

[GitHub](https://github.com) • [Report Issues](https://github.com) • [Discussions](https://github.com)

</div>


