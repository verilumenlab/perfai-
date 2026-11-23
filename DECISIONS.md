# Architecture & Technical Decisions (DECISIONS.md)

## Project: PerfAI × Senatria Website (https://perfai.in)
**Date:** November 23, 2026  
**Status:** In Progress — Phase 1 (Audit & Architecture Alignment)

---

### 1. Existing Repository Audit
- **Inspection Result:** Directory `c:\pfai` was completely empty upon start. No legacy dependencies, outdated packages, or conflicting configurations existed.
- **Action:** Initialized fresh git repository. We will scaffold a modern Next.js App Router application in Phase 2 with strict TypeScript, Tailwind CSS, and standard directory conventions.

---

### 2. Execution Environment & Tooling
- **OS / Shell:** Windows 11 / PowerShell.
- **Node & NPM:** Node.js v24.18.0, npm v11.16.0.
- **Script Policy Decision:** Invoking `npm.cmd` and `npx.cmd` directly to guarantee deterministic execution despite Windows PowerShell script execution policy constraints.

---

### 3. Core Tech Stack Selection
- **Framework:** Next.js (App Router, Server Components by default; Client Components isolated for interactive/3D parts).
- **Styling & Design System:** Tailwind CSS configured with the custom "Future Green" theme tokens:
  - `bg-deep`: `#071B17`
  - `bg-surface`: `#102C25`
  - `green-primary`: `#23A875`
  - `mint-accent`: `#75E6AE`
  - `bg-light`: `#F5FAF7`
  - `text-main`: `#14251F`
  - `text-muted`: `#75857D`
  - `border`: `#DCE8E0`
- **Typography:** Self-hosted fonts via `next/font/google`:
  - Headings: Manrope (`display: swap`)
  - Body: Inter (`display: swap`)
- **3D & Scroll Animation:**
  - `@react-three/fiber`, `@react-three/drei`, `three`
  - Smooth scrolling via Lenis
  - Dynamic client-only rendering (`ssr: false`) with lightweight poster fallback
  - Respect `prefers-reduced-motion` and low-power devices (`dpr <= 1.5`, WebGL detection fallback)
- **Forms & Validation:**
  - `zod` for shared schema validation on both client and server
  - `react-hook-form` with `@hookform/resolvers/zod`
  - Spam defenses: honeypot field + IP-based rate limiting + optional Cloudflare Turnstile
- **Database & Lead Management:**
  - Prisma ORM with SQLite for local development (`file:./dev.db`), easily swappable to Neon / PostgreSQL for production via `DATABASE_URL`
  - Models: `Lead`, `LeadNote`, `AdminUser`
  - Pluggable `CrmAdapter` interface with default no-op implementation
  - Pluggable notification service interface (e.g. Resend) with dev mock
- **Admin Authentication:**
  - Session-based admin auth using secure HTTP-only cookies, password hashing with `bcryptjs` or standard crypto, strict credentials check, `noindex` headers.

---

### 4. Content & Brand Positioning Truth
- **Brand Relationship:** PerfAI is an authorized reseller and business partner of Senatria. PerfAI is never presented as the creator of Senatria technology. The relationship is permanently visible on the first screen and footer.
- **Verification Flag:** Controlled via `RESELLER_VERIFIED` in `lib/site-config.ts`. When true, displays "Official Reseller of SENATRIA"; if false, displays "Authorised partner" and logs a TODO.
- **Product Truth (from senatria.ai):**
  - **ATRIA:** Physical AI operating platform for governed infrastructure action. Perceive, Analyse, Optimise, Control, Verify, Learn loop.
  - **BuildingShield:** Building performance and asset optimization (HVAC, BMS, lighting, operational headroom).
  - **GridShield:** Grid flexibility and demand response (unlocking usable capacity to support grid constraints).
  - **ComputeShield:** Distributed compute and power-limited growth (edge / micro-colocation).
  - **VERITAS:** Measurement & Verification ledger, Triple Net Value (Net Profit, Net Zero, Net Positive).
  - **6 Core Concepts:** Physical AI, Digital Twins & World Models, AI Agents, Infrastructure Intelligence, Edge Intelligence, Performance Verification.
- **Zero Hallucination Policy:** All placeholders centralized in `lib/site-config.ts` and unverified items tracked in `TODO.md`.

---

### 7. Phase 7 Decisions: SEO, Performance, Accessibility & Security Hardening
- **Credential Hygiene & Administration:**
  - Default credentials removed across all scripts, tests, and documentation.
  - `npm run admin:create` enforces hidden password masking via TTY, mandatory validation (minimum 12 characters), and safe reading of `ADMIN_EMAIL` / `ADMIN_PASSWORD` from environment variables without logging.
  - Automated tests provision temporary throwaway administrator credentials and clean them up upon test conclusion.
- **Session Architecture & Hashing:**
  - Database persistence stores cryptographic SHA-256 hashes (`tokenHash`) of raw session tokens. Raw tokens are never stored in the database.
  - Multi-tier session timeout: 24-hour absolute expiration combined with a rolling 2-hour idle expiration extending upon active requests.
  - Old sessions rotated and invalidated upon successful login. Revoked immediately on logout.
- **Account Lockout & Brute-Force Defense:**
  - Admin login tracks consecutive failed attempts per email (`failedLoginAttempts`). 5 consecutive failures triggers an automatic 15-minute lockout (`lockedUntil`).
  - IP-based rate limiting enforced on `/api/admin/auth/login` and `/api/leads`.
- **Proxy Header Trust & Distributed Rate Limiting Interface:**
  - Client IP derived safely via `lib/client-ip.ts`: `x-forwarded-for` and `x-real-ip` are ignored unless `TRUST_PROXY="true"` is explicitly set.
  - `RateLimiter` interface abstracted in `lib/rate-limit.ts`. The in-memory limiter serves single-instance development and small deployments. For multi-instance clustered production, a Redis-backed implementation must be supplied via this interface.
- **CSRF Defense on Mutations:**
  - Every mutating endpoint (`PATCH /api/admin/leads/[id]`, `POST /api/admin/auth/logout`) validates Origin/Referer against Host and checks the `x-csrf-token` header against an HMAC-SHA256 signature of the active session token.
- **Next.js 16 Request Guards:**
  - Migrated from deprecated `middleware.ts` convention to Next.js 16 `proxy.ts`. Both `/admin` (redirects to `/admin/login`) and `/api/admin/*` (HTTP 401) are guarded, with independent session validation inside each API route handler.
- **HTTP Security Headers:**
  - Content-Security-Policy (CSP) configured allowing Next.js runtime, WebGL shader compilation, Three.js canvas buffers, and HTTPS connections, with `frame-ancestors 'none'`.
  - HSTS (`Strict-Transport-Security`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
- **Canvas Sizing & WebGL Non-Blank Verification:**
  - Explicit container dimensions and `preserveDrawingBuffer: true` prevent intrinsic 300x150 canvas sizing. Verified non-blank pixel buffers (> 0 non-zero sampled pixels) on both 360px mobile and 1280px desktop.
- **SEO & WCAG 2.2 AA Compliance:**
  - Organization JSON-LD embedded representing PerfAI strictly as an authorized reseller and business partner of Senatria.
  - `axe-core` automated scans across all 7 pages verified 0 WCAG violations.
  - Text-muted color token brightened to `#9EB1A9`, guaranteeing contrast ratios > 6:1 on both `#071B17` and `#102C25`.
  - SkipLink updated with programmatic focus transfer to `#main-content` (`tabIndex={-1}`).

---

### 8. Phase 8 Decisions: Color Palette Realignment & Release-Candidate Verification
- **Unified Future Green Dark Theme:**
  - Standardized the visual presentation across all routes (`/`, `/application`, `/partner`) to the dark "Future Green" design system established by the hero section:
    - Primary background: `#071B17` (`bg-bg-deep`)
    - Surface / Card background: `#102C25` (`bg-bg-surface`)
    - Primary green accent: `#23A875` (`bg-green-primary`, `text-green-primary`)
    - Mint highlight: `#75E6AE` (`text-mint-accent`, focus rings)
    - Primary headings: `#FFFFFF` (pure crisp white)
    - Body and secondary text: `#9EB1A9` (muted sage, contrast > 6:1)
    - Subtle borders: `rgba(220, 232, 224, 0.12)` (`border-border-dark`)
  - Converted previously alternating light-mode sections (`TechnologySection`, `WhyPerfAI`, `/application` architecture pillars, `/partner` delivery process) from `bg-bg-light` to dark `bg-bg-deep` and `bg-bg-surface`, creating a cohesive luxury B2B enterprise look.
- **Fail-Closed Production Environment Configuration:**
  - Implemented `lib/env-check.ts` requiring `DATABASE_URL`, `ADMIN_SESSION_SECRET` (>= 32 chars), and `CSRF_SECRET` (>= 32 chars) in production mode.
  - Integrated into Next.js 16 `proxy.ts` and root layout.
- **Honeypot Interaction & Anti-Bot Hardening:**
  - Honeypot container updated to an accessible hidden wrapper (`absolute opacity-0 -z-50 pointer-events-none h-0 w-0 overflow-hidden`) so spam bots and form engines register input without visual layout impact.
  - Minimum submission time guard (1.2s) in `/api/leads` drops automated submissions silently without database pollution.
- **Full QA Suite Execution (All 6 Suites Verified):**
  - Unit tests: 21/21 passing.
  - Link crawler: 0 broken links across 8 routes and external destinations.
  - Canvas Variance: 4.77 composite variance verifying non-blank WebGL 3D rendering.
  - Form & Attribution Matrix: 4/4 passing (UTM capture, honeypot rejection, validation errors, partner application).
  - Admin Security Matrix: 4/4 passing (unauthenticated redirect, authenticated status/notes mutation, CSV formula injection escaping, account lockout).
  - Responsive Viewports: 0 horizontal overflow across 6 viewports (360px to 1920px), WebGL fallback poster, SkipLink keyboard navigation.
  - Mobile Lighthouse Audit: SEO 100, Accessibility 98-100, Best Practices 96-100, CLS 0 across core routes.
- **Navbar & Hero Section Typography Redesign:**
  - Streamlined navbar brand logo to display strictly `[P] PerfAI` without redundant partner badges or provider suffixes.
  - Implemented a Modern Floating Capsule / Island navbar (`fixed top-3 sm:top-5 inset-x-0`) with rounded-full pill container (`max-w-[1100px] rounded-full bg-bg-surface/80 backdrop-blur-lg border border-border-dark/80 shadow-xl`), centered navigation, and glowing pill CTA.
  - Adjusted top spacing across all pages (`pt-28 pb-20 sm:pt-36 sm:pb-28 md:pt-40 md:pb-32`) to accommodate the floating capsule geometry with 0 content overlap.
  - Enhanced hero headline typography across `/`, `/application`, and `/partner` with crisp white headers and radiant gradient highlights (`bg-gradient-to-r from-mint-accent via-emerald-300 to-green-primary bg-clip-text text-transparent`) for key value statements.






