# Knowly Project Context

This document is a handoff for AI agents working on the repository. Read it before changing product behavior, billing, authentication, document processing, or the public widget.

## Product Goal

Knowly is an MVP SaaS product that turns a company's documents into an AI support chatbot. Users can:

- sign up and log in;
- create and customize chatbots;
- upload PDF, TXT, and Markdown knowledge files;
- ask questions in an in-app ChatGPT-like interface;
- publish the chatbot through a JavaScript website widget;
- inspect usage and basic analytics;
- switch between Free, Pro, and Business plans through mock billing.

The original technical exercise asks for a landing page, functioning web app, Supabase-backed storage/auth/vector search, AI chat, pricing and billing, and a presentation or written tutorial with screenshots.

## Stack and Conventions

- Next.js 16.3.3 App Router, React 19, TypeScript, Tailwind CSS 4.
- Supabase handles Auth, Postgres, Storage, RLS, and pgvector.
- OpenAI handles embeddings and streamed chat responses.
- `lucide-react` supplies UI icons; shared primitives live in `components/ui`.
- Use the existing App Router and route-handler patterns. Keep server credentials server-side.
- Validate request bodies with Zod and enforce plan limits on the server, not only in the UI.
- Preserve existing user changes in a dirty worktree. Do not commit, reset, or broadly reformat files unless explicitly requested.
- The repository's `AGENTS.md` contains a generated Next.js instruction block. Read the relevant Next.js guide in `node_modules/next/dist/docs/` before making framework-specific changes.

## Main Routes

Public routes:

- `/` landing page with features, pricing, and CTA sections.
- `/pricing` pricing details and FAQ.
- `/login` and `/signup` authentication screens.
- `/chat?chatbotId=<uuid>` public test chat page.

Authenticated dashboard routes:

- `/dashboard` overview and usage counters.
- `/dashboard/knowledge` document upload and deletion.
- `/dashboard/chatbot` chatbot CRUD and customization.
- `/dashboard/embed` embed code generator and live chat preview.
- `/dashboard/analytics` question and conversation analytics.
- `/dashboard/billing` plan, limits, usage, and Stripe test checkout with mock fallback.
- `/dashboard/settings` account settings.

## Important API Behavior

- `POST /api/auth/signup` creates a Supabase user, profile, and free subscription.
- `POST /api/chatbots` creates a chatbot and currently sets `status` to `published` immediately.
- `PATCH /api/chatbots/[id]` can change chatbot settings and status.
- `POST /api/documents/upload` authenticates the owner, validates type and 10 MB size, stores the file, extracts text, chunks it, creates embeddings, and stores chunks.
- `POST /api/chat` only serves published chatbots, retrieves relevant chunks through `match_documents`, streams the OpenAI answer, stores messages, and increments monthly usage.
- `GET /api/public/chatbot/[id]` exposes only public chatbot display fields for `widget.js`.
- `POST /api/billing/upgrade` uses Stripe Checkout for configured Pro/Business prices, updates an existing Stripe subscription when switching paid plans, and falls back to `lib/billing/mock-billing.ts` when Stripe is not configured.
- `POST /api/billing/webhook` verifies Stripe signatures and synchronizes checkout/subscription events into Supabase.

The embeddable widget is `public/widget.js`. It derives the API origin from its own script URL, fetches public chatbot settings, renders a floating chat window, streams `/api/chat`, and escapes user/model content before inserting it into HTML.

## Data Model

The initial schema is in `supabase/migrations/001_initial_schema.sql`; vector search is in `002_match_documents_function.sql`. Core tables are:

- `profiles`, `subscriptions`, `usage`;
- `chatbots`, `documents`, `document_chunks`;
- `conversations`, `messages`.

RLS is enabled for the tables. Service-role access is used for public chatbot reads, vector chunk writes, and public chat operations, so every service-role query must have an explicit ownership, chatbot, status, or conversation authorization check.

## Billing Rules

Plan definitions are centralized in `lib/billing/config.ts`:

- Free: 1 chatbot, 10 documents, 100 questions/month.
- Pro: 5 chatbots, 100 documents, 2,000 questions/month, custom branding and advanced analytics.
- Business: 20 chatbots, 500 documents, 10,000 questions/month, branding removal and advanced usage insights.

`lib/billing/feature-gating.ts` is the server-side source of feature access decisions. `lib/billing/usage.ts` calculates counters and the current period as `YYYY-MM`.

## Verified State (2026-08-28)

- `npm run build` passes. The production build compiles and exposes the expected public, dashboard, and API routes.
- `npm run lint` fails with existing errors: 30 errors and 2 warnings, mainly explicit `any`, JSX apostrophe/quote escaping, and `this` aliasing in the plain JavaScript widget.
- No automated tests are present.
- Supabase and OpenAI functionality requires a correctly configured `.env.local` and a migrated Supabase project.
- `README.md` references `.env.example`, but no `.env.example` is currently present.

## Known Risks and Next Priorities

Address these before calling the product launch-ready:

1. In `app/api/chat/route.ts`, validate a supplied `conversationId` belongs to the requested chatbot and is permitted for the current anonymous/authenticated user before reading or writing messages. This endpoint uses the service-role client.
2. Resolve the lint failures, then rerun `npm run lint` and `npm run build`.
3. Make landing-page pricing buttons and the `Watch Demo` CTA functional, or change their copy to match their actual behavior.
4. Add the required written tutorial with screenshots or record the requested demo presentation.
5. Consider moving document extraction and embedding to a background job before increasing upload size or allowing many documents; current processing is synchronous and embeds chunks sequentially.
6. Add focused automated tests for auth, ownership checks, plan limits, upload validation, public chatbot access, and conversation authorization.

Do not weaken RLS or expose system prompts, document contents, service credentials, or private chatbot data in public responses while fixing these items.

## Recommended Demo Flow

1. Configure Supabase and OpenAI environment variables and run the migrations.
2. Start the app with `npm run dev`.
3. Sign up, create a chatbot, and upload a small Markdown FAQ.
4. Open the chatbot test page and ask a question answered by the FAQ; verify sources appear.
5. Open Embed, copy the generated script, and test it on a separate HTML page or site.
6. Open Analytics to verify the conversation and question count.
7. Open Billing and switch plans to demonstrate gated limits and mock billing.