<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **get-ready-with-ai** (API base `https://cc8aen5z.us-east.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->

<!-- PROJECT-BRIEFING:START -->
# Project briefing (read this first)

Keep this section current at the end of every session. Treat it as the index of what exists; only open files that this briefing does not already answer.

## How agents should use this file

1. Read this briefing before scanning the repo.
2. After any meaningful change (routes, schema, env, skills, UI surfaces, decisions), update **Current state**, **Map**, and **Session log** below.
3. Do not rewrite the Next.js or InsForge managed blocks above.
4. Prefer CLI `npx -y @insforge/cli` for backend work. Do not invent InsForge APIs.

## Stack

- Next.js **16.4.2** App Router, React **19.3**, TypeScript, Tailwind **v4**.
- UI: shadcn (`base-vega`, RSC, lucide) in `components/ui/`. Alias `@/*` → project root.
- Backend: InsForge, linked project **get-ready-with-ai**, appkey `cc8aen5z`, region `us-east`.
- Path: `D:\Arnav Projects\a\get-ready-with-ai`.

## Map

| Path | Role |
| --- | --- |
| `app/layout.tsx` | Root layout (Geist, Inter, Playfair). App metadata for Get Ready AI. |
| `app/page.tsx` | Route `/` — renders `LandingPage`. |
| `app/globals.css` | Tailwind v4 + shadcn + brand tokens (`brand-teal`, `brand-gold`, etc.). |
| `components/landing/` | Reusable marketing sections (header, hero, showcase, footer, …). `site-header-with-auth.tsx` loads session for header CTA. Barrel: `index.ts`. |
| `lib/landing.ts` | Nav links, showcase data, testimonials, footer columns, brand copy. |
| `components/ui/` | Generated shadcn primitives. |
| `lib/utils.ts` | Re-exports `cn` from `cn`. |
| `next.config.ts` | `images.remotePatterns` for `images.unsplash.com`. |
| `hooks/` | `use-mobile.ts`, `use-highlighted-code.ts`. |
| `app/(auth)/sign-in/page.tsx` | Route `/sign-in` — email/password + Google OAuth. |
| `app/(auth)/sign-up/page.tsx` | Route `/sign-up` — register, 6-digit email verification, Google OAuth. |
| `app/studio/layout.tsx` | Shared dashboard shell (sidebar + top bar) for all `/studio/*` routes. |
| `app/studio/page.tsx` | Route `/studio` — overview banner, AI tool cards grid, recent projects. |
| `components/dashboard/studio-overview.tsx` | Studio home: banner, tool grid, recent projects section. |
| `lib/dashboard.ts` | Nav config + `dashboardAiToolCards` (images under `public/ai-photo-editing-images/`). |
| `app/studio/ai/*`, `projects`, `templates`, `billing` | Placeholder section pages behind the same layout. |
| `components/dashboard/` | Sidebar nav, header, user menu/avatar, `DashboardLayout` server wrapper. |
| `lib/dashboard.ts` | Nav config (AI tool categories, workspace links); placeholder credits constant. |
| `lib/dashboard-session.ts` | Server helper: auth user + `public.users` profile for dashboard UI. |
| `app/api/auth/refresh/route.ts` | InsForge SSR session refresh (`createRefreshAuthRouter`). |
| `app/api/auth/callback/route.ts` | OAuth callback; exchanges `insforge_code` for cookies. |
| `app/actions/auth.ts` | Server Actions: sign-in, sign-up, verify email, OAuth start, sign-out. |
| `components/auth/` | Auth shell, forms, OAuth button, header auth state. |
| `lib/insforge/client.ts` | `createBrowserClient()` for client session reads. |
| `lib/insforge/server.ts` | `createServerClient()` for RSC / actions. |
| `proxy.ts` | `updateSession()` from `@insforge/sdk/ssr/middleware`. |
| `migrations/` | InsForge SQL migrations (e.g. `public.users` + `auth.users` trigger). |
| `insforge.toml` | Committed project config (auth redirect URLs, etc.). |
| `.env.local` | `NEXT_PUBLIC_INSFORGE_*`, `NEXT_PUBLIC_APP_URL` (gitignored; see `.env.example`). |
| `.insforge/project.json` | Linked CLI project (gitignored). |
| `.cursor/rules/update-agents-md.mdc` | Always-on rule: keep this briefing updated. |

## Current state (2026-10-21)

- **Landing UI:** Mockup-style marketing page at `/` composed from `components/landing/*` (`LandingPage` server-fetches session for header; hero + interactive before/after showcase, feature strip, studio highlights, smart closet grid, blog teaser, testimonials, pricing CTA, footer).
- **Brand:** Display name **Get Ready AI** (`lib/landing.ts`); Playfair headings, teal/gold CTAs, Unsplash hero/showcase images.
- **Auth:** InsForge SSR auth via `@insforge/sdk` — `/sign-in`, `/sign-up`, Google OAuth, email/password with 6-digit verification on sign-up. Header shows Log In / Get Started when signed out, or **Studio** → `/studio` when signed in.
- **Database:** `public.users` (`id` → `auth.users`) populated on first sign-up by `on_auth_user_created` trigger (`handle_new_user`). RLS: owners can select/update own row.
- **Env:** `.env.local` with InsForge URL, anon key, `NEXT_PUBLIC_APP_URL=http://localhost:3000`. Backend `allowed_redirect_urls` includes localhost sign-in/sign-up/callback.
- **Studio dashboard:** Authenticated `/studio/*` uses shadcn `Sidebar` (brand teal/gold/blush), grouped nav (dashboard options, AI tools, projects/templates/billing), credits + profile in sidebar footer, profile menu in top bar. Credits are a placeholder (`DEFAULT_REMAINING_CREDITS`) until billing schema exists. `/studio` overview shows hero banner, up to 6 AI tool cards (3-column grid, local images), and recent projects empty state until projects schema exists.
- **Routes:** `/`, `/sign-in`, `/sign-up`, `/studio` (+ `/studio/ai/*`, `/studio/projects`, `/studio/templates`, `/studio/billing`), `/api/auth/refresh`, `/api/auth/callback`.

## Session log

- **2026-10-19:** Confirmed InsForge link + installed official skills. Added briefing + `.cursor/rules/update-agents-md.mdc`.
- **2026-10-20:** Built Luminary-style landing with small reusable section components; fixed build (lucide v1.59 has no `Instagram`/`Twitter` icons — use `components/landing/social-icons.tsx`).
- **2026-10-20:** Added InsForge authentication (SSR cookies, OAuth, email verify), `public.users` migration + trigger, branded auth pages, header auth state.
- **2026-10-21:** Header swaps Log In / Get Started for Studio when authenticated; added `/studio` shell with auth guard.
- **2026-10-21:** Landing header auth reads session on the server (`SiteHeaderWithAuth` → `SiteHeader` `initialUser`); signed-in header shows Sign out + Studio (no client `getCurrentUser` overwrite); `revalidatePath("/")` on auth actions.
- **2026-10-21:** Added studio dashboard layout with sidebar navigation, top header avatar menu, and placeholder routes for AI tools and workspace pages.
- **2026-10-21:** Implemented `/studio` overview page (banner, AI tool cards from `dashboardAiToolCards`, recent projects placeholder).
<!-- PROJECT-BRIEFING:END -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
