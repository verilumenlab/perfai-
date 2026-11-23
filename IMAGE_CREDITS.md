# Image & Media Asset Credits (IMAGE_CREDITS.md)

This log documents all visual assets, poster fallbacks, and placeholders used across the PerfAI × Senatria website.

---

### 1. Home Hero Beachfront Plates (`public/images/hero/`)

Generated cinematic architectural plates for the layered home hero (not a UI mockup screenshot).

| File | Role | Source | Licence |
|---|---|---|---|
| `hero-composite.webp` | LCP static poster / reduced-motion composite | AI-generated (Cursor GenerateImage), 2026 | Project original — illustrative only |
| `hero-composite-mobile.webp` | Mobile LCP src (~960w) | Same source, Sharp WebP | Project original — illustrative only |
| `sky-sunset.webp` | Layer 0 sky / sunset | AI-generated | Project original — illustrative only |
| `ocean-horizon.webp` | Layer 1 ocean | AI-generated | Project original — illustrative only |
| `beach-foreground.webp` | Layer 2 beach / palms / rocks | AI-generated | Project original — illustrative only |
| `building-glass.webp` | Layer 3 glass building | AI-generated | Project original — illustrative only |

**Note:** These are illustrative architectural concepts for marketing presentation. They do not depict a specific real property or Senatria-owned facility.

---

### 2. 3D Scene Poster Fallback (`components/three/BuildingPoster.tsx`)

- **Asset Type:** Uses `hero-composite` (hero variant) or CSS architectural grid (default/walkthrough).
- **Purpose:** Static LCP placeholder before interactive WebGL scene loading.
- **Status:** Active.

---

### 3. Industry Sectors (`components/sections/IndustryCard.tsx`)

The following 5 sector cards currently utilize clean neutral vector grid placeholders:
1. **Commercial Buildings** — Pending licensed photography.
2. **Hospitality** — Pending licensed photography.
3. **Data Centres** — Pending licensed photography.
4. **Industrial Infrastructure** — Pending licensed photography.
5. **Energy & Grid** — Pending licensed photography.

---

### 4. Future GLB

- `MODEL_URL` in `components/three/BuildingModel.tsx` remains `null` until a production Draco/meshopt `.glb` is supplied.
