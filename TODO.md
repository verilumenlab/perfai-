# Launch Readiness & Verification Checklist (TODO.md)

This document tracks all unverified claims, placeholders, contact information, credentials, and assets that require human confirmation prior to deploying [perfai.in](https://perfai.in).

---

### 1. Reseller & Partnership Verification
- [ ] **Reseller Status:** Confirm whether `RESELLER_VERIFIED=true` can be set in `lib/site-config.ts` (official signed agreement with Senatria). Currently defaults to `false` ("Authorised partner of SENATRIA").
- [ ] **Brand Logos:** Verify if official vector SVG logos from Senatria are approved for placement in `/public/brand/senatria/`.

### 2. Business Details & Placeholders (`lib/site-config.ts`)
- [ ] **Contact Email:** Replace placeholder `sales@perfai.in` / `support@perfai.in` with official operational mailbox.
- [ ] **Contact Phone:** Replace placeholder phone number with registered business phone.
- [ ] **Physical Address:** Replace registered office address placeholder.
- [ ] **Social Profiles:** Add official LinkedIn / X profiles for PerfAI.

### 3. Legal & Compliance
- [ ] **Privacy Policy (`/privacy`):** Legal counsel review and replacement of draft placeholder text. Currently set to `noindex`.
- [ ] **Terms of Service (`/terms`):** Review commercial terms and partner disclaimer. Currently set to `noindex`.
- [ ] **Cookie Policy (`/cookies`):** Review cookie consent tracking disclosures. Currently set to `noindex`.

### 4. 3D Model & Visual Assets
- [ ] **Building GLB Model (Phase 4):** Acquire or approve production `.glb` model (< 3 MB, Draco/meshopt compressed, morning lighting, sea/beach context).
- [ ] **Industry Photography:** Source and license high-resolution photography for:
  - Commercial Buildings (`/public/images/industries/commercial-buildings.webp`)
  - Hospitality (`/public/images/industries/hospitality.webp`)
  - Data Centres (`/public/images/industries/data-centres.webp`)
  - Industrial Infrastructure (`/public/images/industries/industrial.webp`)
  - Energy & Grid (`/public/images/industries/energy-grid.webp`)

### 5. Forms & Backend (Phase 6)
- [ ] **Database Connection:** Configure production Postgres connection string.
- [ ] **Notification Dispatch:** Configure email dispatch API keys (e.g. Resend).
- [ ] **Partner Scope Verification:** Confirm boundary between PerfAI commercial coordination vs Senatria/VERITAS autonomous performance verification and certified audit delivery.
