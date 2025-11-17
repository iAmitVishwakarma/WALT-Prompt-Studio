


# 🎨 WALT Prompt Studio MVP

A modern, production-ready AI prompt optimizer and vault built with Next.js, Tailwind CSS, and Framer Motion.

---

## ✨ Features

- **Prompt Improviser/Optimizer** — Profession-aware prompt enhancement with style frameworks (WALT, RACE, CCE)
- **Prompt Vault** — Save, version, tag, and search your best prompts
- **Glassmorphism UI** — Aurora gradients, subtle grain overlay, clay/neumorphic controls
- **Smooth Animations** — Framer Motion micro-interactions, reveal-on-scroll, magnetic buttons
- **Fully Responsive** — Mobile-first design with adaptive layouts

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router, JavaScript)
- **Styling:** Tailwind CSS (custom config with glassmorphism & gradients)
- **Animations:** Framer Motion
- **API:** Mock server routes (no external LLM keys required for MVP)

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3️⃣ Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
walt-prompt-studio/
├── app/
│   ├── layout.jsx                    # Root layout + Navbar
│   ├── page.jsx                      # Landing page (Hero, Features, Pricing)
│   ├── globals.css                   # Tailwind + CSS variables + grain overlay
│   ├── (app)/
│   │   └── dashboard/
│   │       └── page.jsx              # Dashboard (Composer + Vault preview)
│   └── api/
│       ├── prompt/optimize/route.js  # Mock optimizer API
│       └── vault/route.js            # Mock vault storage API
├── components/
│   ├── Navbar.jsx                    # Responsive nav with magnetic CTA
│   ├── Composer.jsx                  # Prompt composer UI
│   ├── VaultCard.jsx                 # Single vault card with spotlight hover
│   ├── VaultList.jsx                 # Vault index grid
│   └── motion/
│       └── variants.js               # Reusable Framer Motion presets
├── tailwind.config.js                # Custom Tailwind config
└── package.json
```

---

## 🎨 Design System

### Color Palette (CSS Variables)

```css
--accent-1: #4F46E5;    /* Deep Indigo */
--accent-2: #EC4899;    /* Warm Magenta */
--accent-3: #F59E0B;    /* Golden Amber */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
```

### Typography

- **Headlines:** Space Grotesk (bold, geometric)
- **Body:** Inter (16px base, readable)

### Effects

- **Glassmorphism:** `backdrop-blur-xl` + semi-transparent backgrounds
- **Clay/Neumorphism:** Soft box shadows on primary CTAs
- **Grain Overlay:** Subtle noise texture (`opacity: 0.03`)

---

## 🔌 Mock API Routes

### `POST /api/prompt/optimize`

**Request:**
```json
{
  "prompt": "Make a landing page",
  "profession": "Developer",
  "style": "WALT"
}
```

**Response:**
```json
{
  "success": true,
  "original": "Make a landing page",
  "optimized": "As a Developer, create a responsive landing page using the WALT framework...",
  "tokensUsed": 45,
  "costUsd": 0.0009,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### `GET /api/vault`

Returns array of saved prompts.

### `POST /api/vault`

**Request:**
```json
{
  "title": "Landing Page Prompt",
  "prompt": "Optimized prompt text...",
  "profession": "Developer",
  "style": "WALT",
  "tags": ["web", "frontend"]
}
```

**Response:**
```json
{
  "success": true,
  "id": "vault_123",
  "version": 1
}
```

---

## 🔧 Customization

### Connect Real OpenAI API

In `app/api/prompt/optimize/route.js`, replace mock logic with:

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  const { prompt, profession, style } = await request.json();
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a prompt engineer. Optimize prompts using ${style} framework for ${profession}.`
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return Response.json({
    success: true,
    optimized: completion.choices[0].message.content,
    tokensUsed: completion.usage.total_tokens,
    // ... calculate cost
  });
}
```

### Add Database (Postgres + Prisma)

Replace in-memory storage in `app/api/vault/route.js` with Prisma queries:

```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const prompts = await prisma.prompt.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return Response.json(prompts);
}
```

---

## 🎯 Roadmap (Post-MVP)

- [ ] User authentication (Clerk/NextAuth)
- [ ] Workspace management
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Prompt templates library
- [ ] Export prompts (JSON, Markdown)

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^14.1.0 | React framework |
| react | ^18.2.0 | UI library |
| framer-motion | ^11.0.3 | Animations |
| tailwindcss | ^3.4.1 | Styling |

---

## 📄 License

MIT License - feel free to use for commercial projects.

---

## 🤝 Contributing

This is an MVP. For v2 features, open an issue or PR.

---

## 💬 Support

Questions? Open a GitHub issue or contact support@waltprompt.studio

---

###
**Built with ❤️ using Next.js, Tailwind CSS, and Framer Motion**
