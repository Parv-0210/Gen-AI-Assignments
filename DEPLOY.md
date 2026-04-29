# Scaler Persona Chatbot — Deployment Guide

## Step 1: Get a Gemini API Key (Free)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key

## Step 2: Test Locally
1. Open `.env.local` in the project root
2. Replace `your_gemini_api_key_here` with your actual key
3. Run `npm run dev` — the chatbot should now respond

## Step 3: Push to GitHub
```bash
cd scaler-persona-chatbot
git add .
git commit -m "Initial commit — Scaler Persona Chatbot"
git remote add origin https://github.com/YOUR_USERNAME/scaler-persona-chatbot.git
git push -u origin main
```
> ✅ `.env.local` is in `.gitignore` — your API key will NOT be committed.

## Step 4: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub)
2. Click **"New Project"** → Import your GitHub repo
3. In **Environment Variables**, add:
   - Name: `GEMINI_API_KEY`
   - Value: your actual Gemini API key
4. Click **Deploy**

Done! Your live URL will be something like `https://scaler-persona-chatbot.vercel.app`

## Step 5: Update README
Replace the placeholder URL in `README.md` with your actual Vercel URL.
