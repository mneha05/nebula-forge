
# NebulaForge — AI Agent Studio

> NebulaForge is a modular, design-first AI tool-calling agent: pluggable tools, conversation memory, and a sleek UI-ready demo built with Next.js.

--------------------------------------------------------------------------------

🎛️  Live Preview

- Local: `http://localhost:3000`
- Deploy: import to Vercel or any static + serverless host

--------------------------------------------------------------------------------

🚀 Highlights

- **Modular tools:** Easily add/remove external tools (weather, converters, knowledge bases).
- **Memory-first:** Conversation memory with optional file or SQLite backing.
- **Pluggable LLMs:** Swap OpenAI or other LLMs in server-side code.
- **Production-minded:** Rate-limits and payload guards for safer demos.

--------------------------------------------------------------------------------

📐 Project UI Design (README Mockup)

Below is a compact UI mockup and flow to help visualize the product. Use it as a blueprint for the actual front-end implementation.

```mermaid
flowchart LR
	subgraph Sidebar
		A[App Logo\nNebulaForge] -->|nav| B(Conversations)
		A --> C(Tools)
		A --> D(Settings)
	end
	subgraph Main
		E[Conversation Header\n(User, Model, Memory state)]
		F[Message List]\n+    G[Composer \n(Input, Tool hints, Attachments)]
		H[Tool Drawer \n(Select tool, params)]
	end
	Sidebar --> Main
	E --> F --> G
	G --> H
```

Mockup notes:

- Top-left hero shows the current conversation and quick actions.
- Composer supports tool suggestions inline and automatic tool-call previews.
- Tool Drawer exposes structured parameter forms for safe tool calls.

--------------------------------------------------------------------------------

🎨 README UI Layout (Markdown + HTML)

Use this layout in the README to make a modern, scannable presentation:

- Hero (ASCII/graphic banner)
- One-line tagline + badges
- Quick demo GIF (placeholder)
- Features grid (3 columns)
- Architecture + mermaid diagrams
- Installation + Config (copy/paste commands)
- UI Mockups + Accessibility notes

Example hero (copy into README):

```
███████╗███████╗███████╗██████╗ ██╗     ██╗      ██████╗ ███████╗███████╗
██╔════╝██╔════╝██╔════╝██╔══██╗██║     ██║     ██╔═══██╗██╔════╝██╔════╝
█████╗  ███████╗█████╗  ██████╔╝██║     ██║     ██║   ██║█████╗  ███████╗
██╔══╝  ╚════██║██╔══╝  ██╔══██╗██║     ██║     ██║   ██║██╔══╝  ╚════██║
███████╗███████║███████╗██║  ██║███████╗███████╗╚██████╔╝███████╗███████║
╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝╚══════╝

NebulaForge — AI Agent Studio • Modular tools • Memory • Designer-friendly
```

--------------------------------------------------------------------------------

🧩 Architecture & Tech

- Framework: Next.js 13
- Language: TypeScript
- Server: Next API routes for the agent logic
- Optional LLM: OpenAI (configurable via `OPENAI_API_KEY`)
- Memory: `data/memory.json` (file mode) or `better-sqlite3` for SQLite
- Optional hosting: Vercel / Netlify / any Node-compatible host

```mermaid
graph TD
	Client[Browser UI] --> API[Next.js API: /api/agent]
	API --> Memory[(File / SQLite Memory)]
	API --> Tools[External Tools]
	API --> LLM[LLM Provider (OpenAI / other)]
```

--------------------------------------------------------------------------------

⚡ Quick Start

1. Install deps

```bash
npm install
```

2. Set environment (optional for OpenAI)

```bash
echo "OPENAI_API_KEY=sk-..." > .env.local
```

3. Run locally

```bash
npm run dev
```

4. Open the app

```bash
open http://localhost:3000
```

--------------------------------------------------------------------------------

🔧 Configuration tips

- To avoid native-build issues on Windows, set `FORCE_FILE_MEMORY=1` to use JSON memory instead of `better-sqlite3`.
- Add `OPENAI_API_KEY` to your environment or Vercel project settings to enable LLM calls.

--------------------------------------------------------------------------------

📁 Rename the project folder (local)

If you want the folder itself renamed on your machine to match the project name (`nebula-forge`), run this from the parent directory in PowerShell:

```powershell
Move-Item -Path "project" -Destination "nebula-forge"
```

Or in Command Prompt / bash:

```bash
mv project nebula-forge
```

I did not rename the workspace folder directly. If you want, I can create a script to move files for you—say the word and I'll prepare it.

--------------------------------------------------------------------------------

✨ Want more?

- I can generate a themed SVG hero, embed a demo GIF, or scaffold a polished landing page from the UI mockup.
- Tell me which screens you want first (Conversations, Tools, Settings) and I will scaffold components.

---

Happy building — NebulaForge awaits.


