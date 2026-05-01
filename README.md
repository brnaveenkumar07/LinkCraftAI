# LinkCraft AI

LinkCraft AI is an AI-assisted LinkedIn growth workspace for students, developers, and early-career professionals who want to improve their profile, plan content, and manage networking outreach without automating LinkedIn actions.

The app helps users turn their resume, projects, skills, and career goals into profile insights, LinkedIn post drafts, connection notes, direct message drafts, and a lightweight content calendar. Every workflow is designed for manual review, editing, approval, copying, and manual use on LinkedIn.

## Features

- Profile onboarding for resume text, headline, skills, projects, portfolio links, GitHub links, LinkedIn links, interests, target roles, and career goals.
- AI profile analyzer that returns positioning insights, content pillars, target audience, suggested headline/about text, strengths, improvement areas, and weekly strategy.
- LinkedIn post generator with support for post type, topic, goal, audience, tone, length, hashtags, emojis, and calls to action.
- Connection CRM for manually researched networking targets, including relevance scoring, notes, tags, status tracking, and generated connection-note drafts.
- Direct message draft generator for thank-you notes, career guidance, referrals, collaboration, project feedback, alumni networking, and recruiter outreach.
- Content calendar for planning ideas, drafts, ready posts, and posts that were published manually.
- Dashboard metrics for profile strength, content consistency, networking pipeline activity, draft queue, and next actions.
- Prompt run logging for traceability of AI outputs.
- Rate limiting for AI endpoints.
- Safety-first design: no LinkedIn scraping, no LinkedIn password storage, no stealth automation, no CAPTCHA bypass, and no automated sending.

## Tech Stack

- **Framework:** Next.js 15 App Router
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS, Radix UI primitives, lucide-react
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** Auth.js / NextAuth credentials provider
- **AI Providers:** Google Gemini or local Ollama
- **Validation:** Zod
- **Charts:** Recharts

## Project Structure

```text
app/                  Next.js routes, layouts, pages, and API handlers
app/api/ai/           AI routes for profile analysis, posts, connections, and messages
components/           Shared UI and product components
components/ui/        Reusable UI primitives
lib/                  Server actions, Prisma client, LLM providers, validation, utilities
lib/ai/               Prompt builders
lib/llm/              Gemini and Ollama provider implementations
prisma/               Prisma schema, migrations, and seed script
types/                Type declarations
```

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- PostgreSQL database, such as Neon, Supabase, Railway, or a local Postgres instance
- Gemini API key or a local Ollama installation

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Configure the required environment variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"

LLM_PROVIDER="gemini"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"

OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="mistral"
AI_RATE_LIMIT_PER_MINUTE="8"
```

4. Generate the Prisma client:

```bash
npm run prisma:generate
```

5. Apply database migrations:

```bash
npm run prisma:migrate
```

6. Optionally seed the database:

```bash
npm run db:seed
```

7. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser. The root route redirects to `/dashboard`.

## AI Provider Options

### Gemini

Use Gemini for hosted AI generation:

```env
LLM_PROVIDER="gemini"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"
```

### Ollama

Use Ollama for local development:

```env
LLM_PROVIDER="ollama"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="mistral"
```

Make sure Ollama is running and the selected model is available locally.

## Available Scripts

```bash
npm run dev              Start the Next.js development server
npm run build            Build the production app
npm run start            Start the production server
npm run lint             Run ESLint
npm run typecheck        Run TypeScript type checking
npm run prisma:generate  Generate Prisma client
npm run prisma:migrate   Run Prisma migrations in development
npm run prisma:studio    Open Prisma Studio
npm run db:seed          Seed the database
```

## Database Models

The Prisma schema includes models for:

- Users, accounts, sessions, and verification tokens
- User profiles, skills, interests, projects, and past posts
- Connection targets and generated connection drafts
- Message drafts
- LinkedIn post drafts
- Content ideas and calendar items
- Prompt runs and AI insights

## Current Auth Behavior

Auth.js credentials authentication is configured in `auth.ts`. The current app also includes a demo-friendly fallback in `lib/user.ts`: if no authenticated session exists, the app uses a seeded user when available or creates a local demo workspace. This keeps the product usable during development while a fuller sign-in/register flow can be added later.

## Safety Notes

LinkCraft AI is built as a manual-assist tool, not a LinkedIn automation bot. It does not:

- Store LinkedIn credentials
- Scrape LinkedIn
- Send connection requests automatically
- Send messages automatically
- Bypass platform restrictions or CAPTCHA
- Perform stealth browser automation

Generated drafts should always be reviewed, edited, approved, copied, and used manually by the user.

## Deployment

The app can be deployed to Vercel or any platform that supports Next.js and PostgreSQL-backed Prisma apps.

Before deploying, configure these production environment variables:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `LLM_PROVIDER`
- `GEMINI_API_KEY` and `GEMINI_MODEL`, if using Gemini
- `OLLAMA_BASE_URL` and `OLLAMA_MODEL`, if using Ollama from a reachable server
- `AI_RATE_LIMIT_PER_MINUTE`

After deployment, run Prisma migrations against the production database as part of your release process.

## License

This project is currently private and does not include a license file.
#
