# Launch Readiness & Verification Checklist (TODO.md)

This document tracks all unverified claims, placeholders, contact information, credentials, and assets that require human confirmation prior to deploying [perfai.in](https://perfai.in).

---

### 1. Reseller & Partnership Verification
- [ ] **Reseller Status:** Confirm whether `RESELLER_VERIFIED=true` can be set (official documentation/agreement with Senatria). Currently defaults to `false` ("Authorised partner").
- [ ] **Brand Logos:** Verify if official vector SVG logos from Senatria are approved for placement in `/public/brand/senatria/`.

### 2. Business Details & Placeholders (`lib/site-config.ts`)
- [ ] **Contact Email:** Replace placeholder `contact@perfai.in` / `sales@perfai.in` with official operational mailbox.
- [ ] **Contact Phone:** Replace placeholder phone number with registered business phone.
- [ ] **Physical Address:** Replace registered office address placeholder.
- [ ] **Social Profiles:** Add official LinkedIn / X profiles for PerfAI.
- [ ] **Certifications / Accreditations:** Replace placeholders with actual ISO/industry credentials if applicable.

### 3. Legal & Compliance
- [ ] **Privacy Policy (`/privacy`):** Legal counsel review and replacement of draft placeholder text.
- [ ] **Terms of Service (`/terms`):** Review commercial terms and partner disclaimer.
- [ ] **Cookie Policy (`/cookies`):** Review cookie consent tracking disclosures.

### 4. 3D Model & Visual Assets
- [ ] **Building GLB Model:** Acquire or approve production `.glb` model (< 3 MB, Draco/meshopt compressed, morning lighting).
- [ ] **Industry Photography:** Source or confirm licenses for industry hero photography in `/public/images/industries/` (logged in `IMAGE_CREDITS.md`).

### 5. Infrastructure & Integrations
- [ ] **Database Connection:** Configure production Postgres connection string (e.g., Neon Postgres).
- [ ] **Email Dispatch:** Configure Resend or SMTP provider API keys for demo enquiry notifications.
- [ ] **Cloudflare Turnstile:** Provide `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` if bot challenge is required.
- [ ] **Admin Credentials:** Seed initial secure admin password for `/admin`.
