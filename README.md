# PerfAI × Senatria Corporate Website (perfai.in)

Official corporate web portal for **PerfAI**, an authorised technology reseller and business partner of **Senatria** (https://senatria.ai).

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS** under the **Future Green** enterprise design system.

---

## 1. Brand & Partnership Architecture

- **PerfAI:** Technology reseller, business partner, and deployment coordinator.
- **Senatria:** Physical AI provider and creator of the **ATRIA** platform and Shield applications (**BuildingShield**, **GridShield**, **ComputeShield**, and the **VERITAS** ledger).
- **Domain:** [https://perfai.in](https://perfai.in)

> **Important:** PerfAI is an authorised reseller and never claims ownership or invention of Senatria technology. All public copy strictly adheres to verified facts from [senatria.ai](https://senatria.ai).

---

## 2. Design System: Future Green

Minimalist, calm, enterprise B2B aesthetics:
- Primary Background (`bg-deep`): `#071B17`
- Surface Background (`bg-surface`): `#102C25`
- Primary Green (`green-primary`): `#23A875`
- Mint Accent (`mint-accent`): `#75E6AE`
- Light Background (`bg-light`): `#F5FAF7`
- Typography: **Manrope** (headings) + **Inter** (body) via `next/font`

---

## 3. Site Architecture & Routes

| Route | Purpose |
|---|---|
| `/` | Homepage: Hero with Physical AI environment, Senatria technology & 6 concepts, 5 industry sectors, Why PerfAI value props, and Demo request band |
| `/application` | Interactive facility tour detailing what the Senatria application does zone by zone |
| `/partner` | About PerfAI as reseller: 4-step deployment methodology and commercial partnership enquiry |
| `/admin` | Protected lead management console with search, status workflow, and CSV export |
| `/privacy`, `/terms`, `/cookies` | Legal pages with draft disclosures flagged for legal counsel review |
| `/api/leads` | Lead submission endpoint with Zod validation and honeypot anti-spam defense |

---

## 4. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 10+

### Setup Commands
```bash
# Install dependencies
npm.cmd install

# Run development server
npm.cmd run dev

# Run type check
npx.cmd tsc --noEmit

# Run linter
npm.cmd run lint

# Production build
npm.cmd run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. How to Edit Content

All text and copy are strictly separated into typed data objects:
- `content/site-content.ts`: Hero text, 6 Physical AI concepts, 4 Shield products, 5 industry solutions, and Why PerfAI value propositions.
- `lib/site-config.ts`: Company contact details, domain, social links, and reseller verification flag (`RESELLER_VERIFIED`).

---

## 6. Admin Console Access

Visit `/admin` on your local or deployed environment:
- **Default Dev Passkey:** `perfai2026` (configurable via `ADMIN_PASSWORD` in `.env.local`)
- Features: View leads submitted via the demo form, filter by status (New, Contacted, Qualified, Closed), search across leads, and export to CSV.

---

## 7. Launch Readiness Checklist

See [TODO.md](TODO.md) for pre-launch verification tasks (official email accounts, legal review, and reseller contract verification).
