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

### 5. Phases Plan
1. **Audit & Decisions (Current Phase)**
2. **Foundation:** Setup Next.js, Tailwind tokens, fonts, site-config, layouts, Navbar, Footer.
3. **Home Page (Static & Responsive)**
4. **3D Signature Experience:** BuildingScene, Orbit/Scroll camera, fallback posters.
5. **Application & Partner Pages**
6. **Forms, API, Database, and Admin Portal**
7. **SEO, Performance & Accessibility Audit**
8. **QA & Build Verification**
9. **Deployment Preparation for perfai.in**

