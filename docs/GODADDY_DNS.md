# GoDaddy DNS for perfai.in → Vercel

**Live now:** https://perfai-one.vercel.app  

`perfai.in` is already on Vercel under another project. To move it to this **perfai** project, verify ownership in GoDaddy DNS.

## 1. Verify ownership (required)

GoDaddy → **My Products → perfai.in → DNS** → Add:

| Type | Name / Host | Value | TTL |
|------|-------------|-------|-----|
| TXT | `_vercel` | `vc-domain-verify=perfai.in,562b783b3e30fbcb2ffe` | 600 |

Then run (or click Refresh in Vercel Domains):

```bash
npx vercel domains verify perfai.in
```

Optional www verification TXT (same host `_vercel`, second value):

| Type | Name / Host | Value |
|------|-------------|-------|
| TXT | `_vercel` | `vc-domain-verify=www.perfai.in,ef5e6b71e023c434a0b4` |

## 2. Point traffic (after verify)

Keep/update:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Remove conflicting old A/CNAME/forwarding for `@` / `www` if they do not match the above.

## 3. Note

Contact form and admin need a production database later. Marketing pages work on the Vercel URL today.
