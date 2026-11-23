# GoDaddy DNS for perfai.in → Vercel

Site is live on Vercel: **https://perfai-one.vercel.app**

Add these records in GoDaddy → **My Products → perfai.in → DNS**.

## 1. Domain verification (required first)

| Type | Name / Host | Value | TTL |
|------|-------------|-------|-----|
| TXT | `_vercel` | `vc-domain-verify=perfai.in,562b783b3e30fbcb2ffe` | 600 |

If GoDaddy already has a `_vercel` TXT for `www`, keep **both** TXT values on `_vercel` (GoDaddy supports multiple TXT on the same host), or verify apex first then add `www`.

Optional second verification for www:

| Type | Name / Host | Value | TTL |
|------|-------------|-------|-----|
| TXT | `_vercel` | `vc-domain-verify=www.perfai.in,ef5e6b71e023c434a0b4` | 600 |

## 2. Point traffic to Vercel

Remove any old **A / CNAME / forwarding** that send `@` or `www` elsewhere.

| Type | Name / Host | Value | TTL |
|------|-------------|-------|-----|
| A | `@` | `76.76.21.21` | 600 |
| CNAME | `www` | `cname.vercel-dns.com` | 600 |

## 3. After saving

Wait 5–60 minutes, then open **https://perfai.in**.

In Vercel → Project **perfai** → **Domains**, click **Refresh** if still pending.

## Note

Contact form and admin need a production database later (SQLite is not used on Vercel). Marketing pages work now on the Vercel URL.
