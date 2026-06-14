# Gram Sahyog Niti Marg ⚖️🌾

**Gram Sahyog Niti Marg** is an accessible, bilingual legal intelligence portal designed specifically to empower rural communities. It simplifies understanding complex legal documents, connects citizens with local advocates, and guides local entrepreneurs through corporate compliance and patent registration processes.

---

## Key Features

1. **Multilingual (English & Hindi) Toggle**: Toggle the entire interface between Hindi and English. The language state is globally synchronized across all components using persistent `localStorage` and a custom browser event emitter (`languageChange`).
2. **Clean Markdown Renderer**: Features a custom line-by-line Markdown parsing system (`renderMarkdown`) that maps headers (`###`), lists, and bold text (`**`) into styled React JSX components, ensuring clean UI presentation free of raw formatting characters.
3. **Robust Bilingual Text-to-Speech (TTS)**: 
   - **Hindi Speech**: Powered by a custom sequential segment player utilizing the Google Translate TTS engine, ensuring high-quality, natural-sounding audio even when native browser voices fail.
   - **English Speech**: Utilizes standard browser speech synthesis with a custom Google TTS fallback.
   - **Formatting Filter**: Pre-processes text to automatically strip layout markers (`*`, `#`, etc.) before speech generation to ensure clean voice output.
4. **Interactive PDF Document Analyzer (RAG)**: Upload legal agreements or land records, ask questions, and receive localized legal explanations. Features a dual-mode engine: direct context forwarding for fast analysis of smaller files and Chroma-based similarity search for larger documents.
5. **Fuzzy & Synonym-Tolerant Lawyer Finder**: 
   - Searches are resolved using a **Hybrid Location Layer** that queries a Llama-3 model on Groq and falls back to a custom Levenshtein string distance algorithm (threshold $\ge 75\%$) and a city synonym dictionary.
   - Handles typos (e.g. `"Mumbay"` ➔ `"Mumbai"`) and queries for states containing cities in the database (e.g. `"Bihar"` ➔ `"Patna"`).
6. **Conversational Legal AI Chat ("Gramin Nyay Mitra")**: An interactive legal Q&A chatbot that maintains context and session history across turns using a client-assigned `session_id`. It automatically injects matched advocate details from the database when it detects queries looking for legal representation.
7. **Rate Limit Protections**: In-memory sliding-window token rate limiters (10 requests/min for general chat, 5 uploads/min for PDF processing) per client IP address to prevent Groq API key exhaustion.
8. **Patent Registration & Tracking**: A dedicated module for rural innovators to file patent descriptions, upload supporting files, generate a tracking ticket (`PAT-XXXXXX`), and monitor the application status.
9. **Corporate Compliance Manager**: Simplifies understanding state regulatory compliance, licensing, and business registrations for rural entrepreneurs.

---

## Tech Stack & Design

### Frontend Architecture
- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) for fluid responsive styling + Custom premium gradient backdrops.
- **Component Library**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/) (using core components like Button, Card, Select, Badge, Progress, Toaster, Sonner, and Tooltip).
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management & Queries**: [TanStack Query v5](https://tanstack.com/query) (`@tanstack/react-query`)

### Backend Architecture
- A Python FastAPI server handling text extraction, embedding generation (`sentence-transformers/all-MiniLM-L6-v2`), vector similarity queries (`Chroma DB`), Groq LLM logic (`llama-3.3-70b-versatile`), and machine translation. See [backend/README.md](file:///C:/Gram/gram-sahyog-niti-marg/backend/README.md) for details.

---

## Directory Structure

```text
gram-sahyog-niti-marg/
├── backend/                   # FastAPI Backend service
├── src/                       # Frontend application code
│   ├── components/            # Reusable UI sections
│   │   ├── ui/                # Core Shadcn/Radix components
│   │   ├── CorporateManager.jsx
│   │   ├── DocumentUploadV2.jsx
│   │   ├── LawyerMatching.jsx
│   │   ├── QASection.jsx
│   │   ├── Hero.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Profile.jsx
│   ├── hooks/                 # Custom React hooks (use-toast, etc.)
│   ├── lib/                   # Utility helpers (utils.ts)
│   ├── pages/                 # Main route pages (Index.jsx, Patent.jsx, NotFound.jsx)
│   ├── App.jsx                # Main App entry routes setup
│   └── main.jsx               # React DOM rendering root
├── index.html                 # HTML entrypoint
├── package.json               # NPM scripts and dependencies
├── vite.config.ts             # Vite configuration with proxy settings
└── README.md                  # This file
```

---

## Setup & Running Instructions

### 1. Run the Frontend

#### Prerequisites
- Install **Node.js** (v18 or higher) and **npm**.

#### Steps
1. Navigate to the project root:
   ```bash
   cd gram-sahyog-niti-marg
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to **`http://localhost:5173`** (or the port specified in your console).

*Note: Vite dev server compiles typescript and runs proxy configuration rules to rewrite relative requests starting with `/api` to the backend server running at `http://localhost:8000` automatically.*

### 2. Run the Backend
For setting up the Python FastAPI backend, please refer to the detailed instructions in [backend/README.md](file:///C:/Gram/gram-sahyog-niti-marg/backend/README.md).

---

## Deployment & Bundling

To package the frontend application for production deployment, run:
```bash
npm run build
```
This generates a production-optimized build directory named `dist/` containing all static assets.
