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
| `app/studio/ai/beauty/page.tsx` | Route `/studio/ai/beauty` — Beauty AI two-column workspace (tool picker, source image, choose look, result panel). |
| `app/studio/ai/fashion/page.tsx` | Route `/studio/ai/fashion` — Fashion AI workspace (clothes, bag, shoes, hat VTO). |
| `lib/fashion-studio.ts` | Fashion tool definitions, per-tool test images (`public/fashion-samples`, headshots). |
| `lib/fashion-looks.ts` | Reference looks (`public/fashion-looks/*`) + YouCam clothes sample URLs. |
| `lib/fashion-generation.ts` | Server pipeline: YouCam `cloth-v4`, `bag`, `shoes-transfer`, `hat` → `fashion-results` + `fashion_generations`. |
| `lib/studio-credits.ts` | Shared upfront `deduct_user_credits` / `refund_user_credits` for beauty + fashion runs. |
| `lib/fashion-youcam-settings.ts` | Clothes garment category / multi-person; accessory gender & style. |
| `components/dashboard/fashion/` | Fashion studio UI (`FashionStudioWorkspace`, tool picker, looks, settings). |
| `app/api/studio/fashion/generate/route.ts` | POST multipart fashion generate (auth required). |
| `app/api/studio/fashion/result/[generationId]/route.ts` | GET authenticated proxy for private `fashion-results` images. |
| `app/studio/ai/extras/page.tsx` | Route `/studio/ai/extras` — AI Extras workspace (object remove, BG remove, colorize, extend, headshot). |
| `lib/extras-studio.ts` | Extras tool cards, sample sources (`public/extras-samples/`). |
| `lib/extras-presets.ts` | Per-tool presets (headshot templates from YouCam, extender directions). |
| `lib/extras-generation.ts` | YouCam `generative-fill`, `sod`, `colorize`, `out-paint`, `headshot` → `extras-results` + `extras_generations`. |
| `lib/extras-youcam-payload.ts` | Task bodies per extras tool (mask upload for object remover). |
| `components/dashboard/extras/` | Extras studio UI (gradient hero, tool grid, presets, settings). |
| `app/api/studio/extras/generate/route.ts` | POST multipart extras generate (auth required). |
| `app/api/studio/extras/result/[generationId]/route.ts` | GET authenticated proxy for private `extras-results` images. |
| `app/studio/projects/page.tsx` | Route `/studio/projects` — My Projects gallery (merged `*_generations`, 20/page, tool icons). |
| `lib/studio-projects.ts` | Gallery labels, preview paths, Lucide icons per studio tool. |
| `lib/studio-projects-data.ts` | Server fetch: merge beauty/fashion/extras rows, newest first, paginate. |
| `components/dashboard/projects/` | Projects banner, generation cards, pagination. |
| `app/studio/billing/page.tsx` | Route `/studio/billing` — credits summary, Free/Basic/Pro plans, Stripe Checkout + Billing Portal. |
| `lib/billing-plans.ts` | Plan catalog, highlights, server mapping to `STRIPE_PRICE_ID_*`. |
| `app/actions/billing.ts` | Server actions: `startSubscriptionCheckout`, `openBillingPortal` via `@insforge/sdk` payments.stripe. |
| `components/dashboard/billing/` | `BillingWorkspace` client UI for upgrades and manage billing. |
| `app/studio/ai/*` (other), `templates` | Placeholder section pages behind the same layout. |
| `lib/beauty-studio.ts` | Beauty tool definitions, test images, look options (from `lib/beauty-looks.ts`). |
| `lib/beauty-looks.ts` | Look presets: local `public/makeup-transfer/` + `public/eye-lens/` refs; YouCam Look VTO template ids for makeup try-on. |
| `public/normal-headshot/` | Studio test source portraits (same faces across tools). |
| `public/makeup-transfer/` | Makeup transfer reference looks. |
| `public/makeup-try-on/` | Local UI thumbnails for Look VTO presets (generation still uses YouCam `templateId`). |
| `public/eye-lens/` | Eye color VTO lens reference images. |
| `lib/beauty-generation.ts` | Server pipeline: YouCam upload/task/poll, InsForge storage + `beauty_generations` row, credit deduct. |
| `lib/beauty-youcam-settings.ts` | YouCam API defaults + parsing for eye lens / makeup VTO UI settings. |
| `lib/makeup-addon-effects.ts` | Makeup VTO `effects` stacks per addon look id (MCP pattern names). |
| `components/dashboard/beauty/beauty-tool-settings.tsx` | Per-tool YouCam parameter sliders in the beauty workspace. |
| `lib/youcam/` | YouCam S2S REST client (`YOUCAM_API_SECRET_KEY`, task polling). |
| `app/api/studio/beauty/generate/route.ts` | POST multipart generate endpoint (auth required). |
| `app/api/studio/beauty/result/[generationId]/route.ts` | GET authenticated proxy for private `beauty-results` images (studio preview). |
| `components/dashboard/beauty/` | Beauty studio UI (`BeautyStudioWorkspace`, source upload, result panel). |
| `components/dashboard/` | Sidebar nav, header, user menu/avatar, `DashboardLayout` server wrapper. |
| `lib/dashboard.ts` | Nav config; `DEFAULT_REMAINING_CREDITS` (25), `DashboardUser` billing fields, generation credit cost (5). |
| `lib/dashboard-session.ts` | Server helper: auth user + `public.users` profile for dashboard UI. |
| `app/api/auth/refresh/route.ts` | InsForge SSR session refresh (`createRefreshAuthRouter`). |
| `app/api/auth/callback/route.ts` | OAuth callback; exchanges `insforge_code` for cookies. |
| `lib/auth/get-app-url.ts` | `getAppUrl()` from env; `resolveAppUrl()` server helper uses request host when env is localhost (deployed OAuth/Stripe). |
| `app/actions/auth.ts` | Server Actions: sign-in, sign-up, verify email, OAuth start, sign-out. |
| `components/auth/` | Auth shell, forms, OAuth button, header auth state. |
| `lib/insforge/client.ts` | `createBrowserClient()` for client session reads. |
| `lib/insforge/server.ts` | `createServerClient()` for RSC / actions. |
| `proxy.ts` | `updateSession()` from `@insforge/sdk/ssr/middleware`. |
| `migrations/` | InsForge SQL migrations (e.g. `public.users` + `auth.users` trigger). |
| `insforge.toml` | Committed project config (auth redirect URLs incl. Netlify production, etc.). |
| `.env.local` | `NEXT_PUBLIC_INSFORGE_*`, `NEXT_PUBLIC_APP_URL`, `YOUCAM_API_*`, `STRIPE_PAYMENT_ENV`, `STRIPE_PRICE_ID_BASIC`, `STRIPE_PRICE_ID_PRO` (gitignored; see `.env.example`). |
| `.insforge/project.json` | Linked CLI project (gitignored). |
| `.cursor/rules/update-agents-md.mdc` | Always-on rule: keep this briefing updated. |

## Current state (2026-10-24)

- **Landing UI:** Mockup-style marketing page at `/` composed from `components/landing/*` (`LandingPage` server-fetches session for header; hero + interactive before/after showcase, feature strip, studio highlights, smart closet grid, blog teaser, testimonials, pricing CTA, footer).
- **Brand:** Display name **Get Ready AI** (`lib/landing.ts`); Playfair headings, teal/gold CTAs, Unsplash hero/showcase images.
- **Auth:** InsForge SSR auth via `@insforge/sdk` — `/sign-in`, `/sign-up`, Google OAuth, email/password with 6-digit verification on sign-up. Header shows Log In / Get Started when signed out, or **Studio** → `/studio` when signed in.
- **Database:** `public.users` (`id` → `auth.users`, `credits` default **25** on sign-up, `billing_plan`, subscription mirror columns) populated by `handle_new_user` trigger. RLS: owners select/update own row. `public.subscription_credit_grants` idempotent Stripe `invoice.paid` fulfillment (+350 Basic / +1000 Pro per invoice). Trigger on `payments.webhook_events` updates plan/credits; RLS on `payments.stripe_checkout_sessions` and `payments.stripe_customer_portal_sessions` for `subject_type=user`. `public.beauty_generations`, `public.fashion_generations`, and `public.extras_generations` store completed studio runs. Credits via `deduct_studio_credits` / `refund_studio_credits`.
- **Storage:** Private buckets `beauty-results`, `fashion-results`, and `extras-results` with path-scoped RLS (`{user_id}/*`); generation results uploaded from the server with the user session.
- **Env:** `.env.local` with InsForge URL, anon key, `NEXT_PUBLIC_APP_URL=http://localhost:3000`, YouCam API keys (`YOUCAM_API_*`), and Stripe plan price IDs (`STRIPE_PRICE_ID_*` from InsForge CLI catalog). Optional `YOUCAM_API_BASE`. Production Netlify **stylesync-ab.netlify.app** must set `NEXT_PUBLIC_APP_URL` to the live HTTPS origin and list the same URLs in `insforge.toml` `allowed_redirect_urls` (OAuth uses `resolveAppUrl()` from request host when env is still localhost). InsForge project has Stripe test connected + webhook to `…/api/webhooks/stripe/test`.
- **Billing:** `/studio/billing` — **Free** (25 signup credits), **Basic** (₹999/mo INR, +350 credits per paid invoice), **Pro** (₹2,499/mo INR, +1000 per invoice). Stripe Prices are **INR** (Indian accounts: USD = export/international and needs a registered business). Checkout via `insforge.payments.stripe.createCheckoutSession` (`metadata.plan`); manage via Billing Portal. Unused credits carry over on renewal.
- **Studio dashboard:** Authenticated `/studio/*` shell; sidebar shows live `users.credits` balance. `/studio` overview shows hero banner, AI tool cards, recent projects placeholder. **My Projects** at `/studio/projects` lists completed generations from beauty, fashion, and extras in a responsive grid (category + tool badges/icons, download, link to studio tool), teal/gold banner, pagination **20** per page (`?page=`).
- **Beauty studio:** `/studio/ai/beauty` runs **Makeup Transfer** (`mu-transfer`), **Makeup Virtual Try-On** via YouCam **Makeup VTO** (`makeup-vto`, per-addon `effects` + UI skin_smooth sliders), and **Eye Color Lens VTO** (`eye-color-vto` with UI `effect` sliders). Settings POST as `youcamSettings` JSON on generate. Test sources from `public/normal-headshot/`; transfer/lens refs from `public/makeup-transfer/` and `public/eye-lens/` (uploaded to YouCam when local). Generate POSTs to `/api/studio/beauty/generate` (YouCam file upload → task → poll → save to InsForge, **5 credits** per success). UI preview uses same-origin `previewUrl` → `/api/studio/beauty/result/[id]` because raw InsForge storage URLs require auth (401 in `<img>`). Result panel: compact preview (`max-h` ~22rem), **Compare** slider (source vs result via `BeforeAfterSlider`), **After**-only view, and **Download**.
- **Fashion studio:** `/studio/ai/fashion` (sidebar **Fashion**) — **Clothes VTO** (`cloth-v4`), **Bag** (`bag`), **Shoes** (`shoes-transfer`), **Hat** (`hat`) via YouCam S2S (slugs from MCP `Get-Upload-API-Info`). Reference looks in `public/fashion-looks/`; full-body samples in `public/fashion-samples/source/` (includes YouCam clothes sample `clothes_03_*`). Accessory tools use headshots from `public/normal-headshot/`. **5 credits** per run; `previewUrl` → `/api/studio/fashion/result/[id]`. Reuses beauty result panel and two-column layout.
- **AI Extras studio:** `/studio/ai/extras` (sidebar **AI Extras**) — **Object Remover** (`generative-fill` + auto ellipse mask), **Background Remove** (`sod`), **Photo Colorize** (`colorize`), **Photo Extender** (`out-paint` presets), **Headshot Generator** (`headshot` + live template ids). Sample sources under `public/extras-samples/`; headshot templates from YouCam API. **5 credits** per run; upfront deduct + refund on failure; `previewUrl` → `/api/studio/extras/result/[id]`. Teal/gold studio layout with tool grid cards; reuses `SourceImageSection` and `BeautyResultPanel`.
- **Routes:** `/`, `/sign-in`, `/sign-up`, `/studio` (+ `/studio/billing`, `/studio/ai/*`, …), `/api/auth/*`, `/api/studio/beauty/*`, `/api/studio/fashion/*`, `/api/studio/extras/*`.

## Session log

- **2026-10-19:** Confirmed InsForge link + installed official skills. Added briefing + `.cursor/rules/update-agents-md.mdc`.
- **2026-10-20:** Built Luminary-style landing with small reusable section components; fixed build (lucide v1.59 has no `Instagram`/`Twitter` icons — use `components/landing/social-icons.tsx`).
- **2026-10-20:** Added InsForge authentication (SSR cookies, OAuth, email verify), `public.users` migration + trigger, branded auth pages, header auth state.
- **2026-10-21:** Header swaps Log In / Get Started for Studio when authenticated; added `/studio` shell with auth guard.
- **2026-10-21:** Landing header auth reads session on the server (`SiteHeaderWithAuth` → `SiteHeader` `initialUser`); signed-in header shows Sign out + Studio (no client `getCurrentUser` overwrite); `revalidatePath("/")` on auth actions.
- **2026-10-21:** Added studio dashboard layout with sidebar navigation, top header avatar menu, and placeholder routes for AI tools and workspace pages.
- **2026-10-21:** Implemented `/studio` overview page (banner, AI tool cards from `dashboardAiToolCards`, recent projects placeholder).
- **2026-10-24:** Built Beauty AI studio layout at `/studio/ai/beauty` (`components/dashboard/beauty/*`, `lib/beauty-studio.ts`) — two-column controls + result preview; generation not connected yet.
- **2026-10-24:** Documented YouCam API credentials in `.env.example` / local `.env.local` as `YOUCAM_API_SECRET_KEY` and `YOUCAM_API_PUBLIC_KEY`.
- **2026-10-24:** Wired Beauty AI to YouCam S2S APIs with look presets, credit balance (50 on signup, 5 per generation), `beauty_generations` + `beauty-results` storage, and `/api/studio/beauty/generate`.
- **2026-10-24:** Swapped beauty test portraits and makeup/eye reference looks to bundled `public/normal-headshot`, `public/makeup-transfer`, and `public/eye-lens` assets.
- **2026-10-24:** Fixed beauty result preview — private storage URLs returned 401 in the browser; generate API now returns `previewUrl` and new GET `/api/studio/beauty/result/[generationId]` streams the image for signed-in owners.
- **2026-10-24:** Beauty result panel — shorter preview height, before/after compare slider (`BeforeAfterSlider` supports distinct URLs), Compare/After toggle, download button; clearing result when source image changes.
- **2026-10-24:** Makeup try-on look grid thumbs moved from hotlinked `cdn.perfectcorp.com` to illustrated SVGs in `public/makeup-try-on/` (addon-style labels: Natural Blush, Rose Glam, …).
- **2026-10-24:** Aligned beauty tools with YouCam MCP: Makeup VTO addon effects (`makeup-vto`), eye lens `effect` + makeup `skin_smooth` exposed in **YouCam settings** UI; `youcamSettings` on generate API.
- **2026-10-24:** Fixed Makeup VTO `invalid_parameter` — normalize required `eyebrows.pattern.*` and gloss `transparencyIntensity` (validated via YouCam MCP); addon-specific sliders in UI.
- **2026-10-24:** Implemented Fashion studio at `/studio/ai/fashion` — four YouCam VTO tools (clothes, bag, shoes, hat), bundled sample/reference assets, `fashion_generations` + private `fashion-results` bucket, generate/result API routes mirroring beauty studio UX.
- **2026-10-24:** Studio credits — deduct upfront via `lib/studio-credits.ts` + `refund_user_credits` RPC on YouCam/storage failure (fixes post-generation deduct null / misleading “Could not deduct credits after generation”).
- **2026-10-24:** Added `deduct_studio_credits` / `refund_studio_credits` (single `p_amount` arg, `auth.uid()`) to fix PostgREST “function deduct_user_credits(p_user_id)” schema-cache RPC errors; fashion YouCam payloads centralized in `lib/fashion-youcam-payload.ts`.
- **2026-10-24:** Implemented AI Extras at `/studio/ai/extras` — five YouCam photo tools, `extras_generations` + `extras-results` bucket, generate/result APIs, bundled samples and headshot template presets.
- **2026-10-24:** Fixed colorize (and multi-output tasks) — YouCam returns `results.output[].url`; `extractResultUrl` in `lib/youcam/client.ts` now walks nested result shapes. Extras tool picker uses full-width stacked cards (no clipped titles in narrow sidebar).
- **2026-10-24:** Implemented **My Projects** (`/studio/projects`) — unified gallery from `beauty_generations`, `fashion_generations`, and `extras_generations` with card UI, tool/category icons, and paginated history (20 per page).
- **2026-10-24:** InsForge Stripe billing — test catalog (Basic/Pro monthly prices), migration `20261024163300_billing-subscriptions.sql`, `/studio/billing` UI, server actions for Checkout + Portal, webhook credit grants (25 free signup).
- **2026-10-24:** Fixed Indian Stripe checkout — replaced USD Prices with INR recurring Prices via InsForge CLI; updated `STRIPE_PRICE_ID_*` and billing plan labels (archived old USD prices).
- **2026-11-03:** Fixed production auth redirect to localhost — `resolveAppUrl()` derives HTTPS origin from request on Netlify when `NEXT_PUBLIC_APP_URL` is localhost; added `stylesync-ab.netlify.app` to InsForge `allowed_redirect_urls`.
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
