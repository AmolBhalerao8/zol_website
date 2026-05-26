# ZOL Website

AI employee platform for customer-facing businesses. ZOL answers calls, captures conversations, remembers customers, syncs shop data, searches operational data, and proactively detects follow-ups and business issues.

**Production:** [tryzol.com](https://tryzol.com)

## Tech stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** + Framer Motion
- **Clerk** — authentication
- **Prisma** + **Supabase Postgres** — database
- **Vapi** — voice channel / AI phone calls
- **OpenAI** — conversation intelligence, workflow reasoning & operational answers
- **Vercel** — hosting

## Platform capabilities

| Step | Capability | Route / area |
|------|------------|--------------|
| 1 | Authentication | `/sign-in`, `/sign-up` |
| 2 | Workspace onboarding | `/onboarding` |
| 3 | AI employee setup | `/setup/ai-employee` |
| 4 | Vapi voice channel | `/setup/voice-channel` |
| 5 | Conversation capture | `/conversations` |
| 6 | Customer memory | `/customers` |
| 7 | Tekmetric integration foundation | `/integrations` |
| 8 | Tekmetric data sync | `/integrations/tekmetric` |
| 9 | Operational intelligence search | `/intelligence` |
| 10 | **Proactive operational workflows** | `/workflows`, `/dashboard` |

## Features

| Area | Route | Description |
|------|-------|-------------|
| Marketing | `/` | Landing page, book-a-demo form |
| Auth | `/sign-in`, `/sign-up` | Clerk sign-in / sign-up |
| Onboarding | `/onboarding` | Workspace setup |
| Dashboard | `/dashboard` | Operations overview, workflow alerts, daily summary |
| AI Employee | `/setup/ai-employee` | Business profile & AI settings |
| Voice Channel | `/setup/voice-channel` | Phone number, voice, Vapi activation |
| Conversations | `/conversations` | Call & message history |
| Customers | `/customers` | Customer profiles & memory |
| Intelligence | `/intelligence` | Chat-style operational search |
| Workflows | `/workflows` | Proactive operational workflows & alerts |
| Integrations | `/integrations` | Tekmetric & other connectors |
| Tekmetric sync | `/integrations/tekmetric` | Sync status & manual sync |

## Operational workflows (Step 10)

ZOL proactively detects operational issues and generates workflows — not a rule builder or Zapier-style automation.

**Workflow types:** follow-up, urgent issue, missed callback, appointment reminder, customer escalation, repeated issue, operational alert, daily summary.

**Detection sources:**
- Conversations & urgency
- Open / stale action items
- Customer memory patterns
- Tekmetric appointments & repair orders

**Scan triggers:**
- After conversation processing (Vapi webhook)
- After successful Tekmetric sync
- Dashboard and `/workflows` page load
- Manual **Refresh scan** on the workflows page

**User actions:** mark complete, dismiss (admins only), view linked conversation or customer.

**Dashboard cards:** Active Workflows, Urgent Operational Alerts, Daily Operational Summary.

## Prerequisites

- Node.js 20+
- npm
- Supabase project (Postgres)
- Clerk application (development keys are fine for testing)
- Optional: Vapi, OpenAI, Resend (for full feature set)

## Local setup

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd ZOL_Website
   npm install
   ```

2. **Environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in values in `.env.local`. See [Environment variables](#environment-variables) below.

3. **Database**

   ```bash
   npm run db:push
   npm run smoke:db
   ```

4. **Run dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `DATABASE_URL` | Yes | Supabase **transaction pooler** (port **6543**, `?pgbouncer=true&connection_limit=1`) |
| `DIRECT_URL` | Yes | Supabase **direct** connection (port **5432**) for migrations |
| `NEXT_PUBLIC_APP_URL` | Prod | Public app URL, e.g. `https://tryzol.com` |
| `OPENAI_API_KEY` | For AI features | Intelligence search, workflow reasoning & conversation extraction |
| `ENCRYPTION_KEY` | For integrations | 32+ char secret for stored credentials |
| `VAPI_PRIVATE_KEY` or `VAPI_API_KEY` | For voice | Vapi assistant & phone |
| `VAPI_WEBHOOK_SECRET` | For voice | Validates inbound Vapi webhooks |
| `TEKMETRIC_MOCK_MODE` | Optional | `true` uses mock Tekmetric data |
| `DEMO_NOTIFICATION_EMAIL` | Optional | Email alert for demo form submissions |
| `RESEND_API_KEY` | Optional | Sends demo request notifications |

Never commit `.env.local` or real secrets.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |
| `npm run db:push` | Sync Prisma schema to database |
| `npm run db:migrate` | Create / apply migrations (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run smoke:db` | Quick database connectivity check |

## Deploying to Vercel

1. Connect the GitHub repo to Vercel.
2. Add all environment variables from `.env.example` (use production values where applicable).
3. Set `NEXT_PUBLIC_APP_URL=https://tryzol.com` (or your domain).
4. Use Supabase **pooler** URL for `DATABASE_URL` on Vercel.
5. Deploy. After deploy, run `npm run db:push` locally if new schema changes were added (same Supabase project).

### Custom domain

- Add the domain in Vercel → **Settings → Domains**.
- If the domain was on another Vercel account, add the `_vercel` TXT record GoDaddy/Vercel provides to verify ownership.
- Point root **A** record to Vercel (or keep existing records if Vercel shows **Valid Configuration**).

### Clerk

- **Development** keys work for testing on `tryzol.com`.
- For public launch, create a Clerk **Production** instance, configure [Domains](https://dashboard.clerk.com/~/domains), and use `pk_live_` / `sk_live_` keys in Vercel.

### Vapi webhook

The webhook URL is set from `NEXT_PUBLIC_APP_URL` when the voice assistant is created or synced:

`https://tryzol.com/api/webhooks/vapi`

After changing the app URL, visit **Voice Channel** or save **AI Employee** settings once to push the new URL to Vapi.

## Project structure

```
app/
  (marketing)/     Landing page
  (auth)/          Sign-in / sign-up
  (platform)/      Dashboard & authenticated app
    workflows/     Operational workflows page
  api/             Webhooks & API routes
features/
  workflows/       Detection engine, scan orchestration, workflow UI
  intelligence/    Operational search
  integrations/    Tekmetric & connectors
  conversations/   Vapi capture & processing
  dashboard/       Shell, overview, sidebar
components/ui/     Shared UI primitives
prisma/            Schema & migrations (incl. Workflow model)
```

## Not yet implemented

- Billing
- Multi-workspace switching
- Live call streaming
- Cron / scheduled workflow scans
- Autonomous write-back (Tekmetric updates, auto-email/SMS to customers)
- External notification infrastructure beyond demo email placeholders

## License

Private — CSU Chico / ZOL project.
