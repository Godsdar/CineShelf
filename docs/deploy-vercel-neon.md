# Deploy CineShelf for free: Vercel + Neon

Stack: Next.js on **Vercel Hobby** (free) + PostgreSQL on **Neon Free** (free). No paid services, no card required on the free tiers.

## 1. Neon (database)

1. Sign up at https://neon.com and create a project (region closest to you).
2. Copy the **connection string**. Use the **pooled** string and keep `?sslmode=require`:
   `postgres://<user>:<pass>@<host>/<db>?sslmode=require`
3. Keep it as `DATABASE_URL` (do not commit it).

## 2. Vercel (hosting)

1. Sign up at https://vercel.com with GitHub.
2. **Add New → Project → Import** `Godsdar/CineShelf`.
3. Framework preset: **Next.js** (detected automatically; `vercel.json` also pins it).
4. Build command: default `bun run build`. Install command: default (Bun detected).

## 3. Environment variables (Vercel → Settings → Environment Variables)

Add for **Production** (and Preview if you want):

| Name | Value |
|---|---|
| `DATABASE_URL` | pooled Neon string with `?sslmode=require` |
| `AUTH_SECRET` | output of `openssl rand -base64 32` |
| `AUTH_URL` | `https://<project>.vercel.app` (your real URL) |
| `AUTH_TRUST_HOST` | `true` (Auth.js behind Vercel's proxy) |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | optional GitHub OAuth |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | optional Google OAuth |
| `EMAIL_SERVER` / `EMAIL_FROM` | optional magic link via Resend free tier |

Notes:
- Magic-link email: without `EMAIL_SERVER` the link is only printed in logs, which is not useful in production. Either set a free SMTP (e.g. Resend) or leave only OAuth providers enabled.
- Do not put real secrets in the repo; they live only in the Vercel dashboard.

## 4. Migrations (once, from your machine)

Point your local `DATABASE_URL` at Neon and apply the schema:

```bash
export DATABASE_URL="postgres://<user>:<pass>@<host>/<db>?sslmode=require"
bun install
bun run db:migrate      # creates tables
bun run db:seed         # optional: 30 films
bun run db:posters      # optional: download posters into public/ (commit them)
```

Vercel's filesystem is ephemeral, so any downloaded posters must be committed to `public/` to appear in production.

## 5. OAuth callbacks

If you enable GitHub/Google, set the callback URL to:
`https://<project>.vercel.app/api/auth/callback/github` (and `/google`).

## 6. Redeploy

After adding or changing env vars, trigger **Redeploy** in Vercel so the new values apply.

## Cost guardrails

- Stay on Vercel **Hobby** and Neon **Free**; do not enable paid add-ons.
- Neon Free suspends idle databases automatically — first request after a pause is slower, which is fine.
- No custom domain needed: use the `*.vercel.app` URL.
- Keep `db:posters` manual; do not run scraping on every deploy.

## Troubleshooting

- `NEXT_PUBLIC`-style 500 on auth: `AUTH_URL` must exactly match the deployed URL, and `AUTH_TRUST_HOST=true` must be set.
- DB connection errors: ensure `?sslmode=require` and use the pooled connection string.
- Empty pages after first deploy: run `bun run db:migrate` (and `db:seed`) against Neon.
