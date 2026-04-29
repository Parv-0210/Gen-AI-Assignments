# Scaler Persona Chat 🎓

An AI-powered persona chatbot that lets you have real conversations with three Scaler/InterviewBit personalities — **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra**.

Built for Scaler Academy's Prompt Engineering Assignment (Assignment 01).

## 🚀 Live Demo

> **[https://scaler-persona-chatbot.vercel.app](https://scaler-persona-chatbot.vercel.app)**  
> *(Replace with your Vercel deployment URL after deploying)*

## ✨ Features

- 🎭 **3 distinct AI personas** — each with a deeply researched system prompt
- 💬 **Real LLM conversations** via Google Gemini 1.5 Flash API
- ⚡ **Instant persona switching** — conversation resets automatically
- 💡 **Suggestion chips** — quick-start questions per persona
- ⏳ **Typing indicator** — animated dots while the AI is thinking
- 📱 **Fully responsive** — mobile and desktop
- 🔒 **Secure** — API key stored in environment variable only

## 🖼️ Screenshots

> Add screenshots here after deployment.

## 🛠️ Tech Stack

| Layer    | Technology                           |
|----------|--------------------------------------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling  | Tailwind CSS + Custom CSS            |
| AI API   | Google Gemini 1.5 Flash              |
| Deploy   | Vercel                               |

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key (free tier works)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/scaler-persona-chatbot.git
cd scaler-persona-chatbot

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Gemini API key:
# GEMINI_API_KEY=your_actual_key_here

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Set environment variable on Vercel:
vercel env add GEMINI_API_KEY
```

Or use the Vercel dashboard → Project Settings → Environment Variables.

## 📁 Project Structure

```
scaler-persona-chatbot/
├── app/
│   ├── api/chat/route.ts    # Gemini API backend route
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout + SEO metadata
│   └── page.tsx             # Main chat interface
├── lib/
│   └── personas.ts          # All 3 persona definitions + system prompts
├── .env.example             # Template for environment variables
├── .env.local               # Your actual API key (NOT committed)
├── prompts.md               # All system prompts with annotations
├── reflection.md            # 300–500 word reflection
└── README.md
```

## 🔐 Security

- ✅ API key is **never** hardcoded in source code
- ✅ `.env.local` is in `.gitignore` (never committed)
- ✅ `.env.example` shows the required variables without values
- ✅ All AI calls are made server-side in `/api/chat`

## 📚 Documentation

- [`prompts.md`](./prompts.md) — All three system prompts with inline annotations explaining design decisions
- [`reflection.md`](./reflection.md) — Personal reflection on GIGO, what worked, and improvements

## 👤 Author

Built by [Your Name] for Scaler Academy — Prompt Engineering Assignment 01.
