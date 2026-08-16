# Deployment

This site auto-deploys to Vercel from the `main` branch of the GitHub repo.

## One-time setup

### 1. Connect the repo to Vercel

1. Go to https://vercel.com/new
2. Import the GitHub repo `dheeraj-gantala-projects/portfolio-website`
3. Framework: Next.js (auto-detected)
4. Root directory: `./`
5. Build command: `next build` (default)
6. Click Deploy — first deploy will use the default `*.vercel.app` URL

### 2. Connect the custom domain saidheerajgantala.me

1. In Vercel project settings → Domains → Add `saidheerajgantala.me` and `www.saidheerajgantala.me`
2. Vercel will show DNS records. Add them at your registrar (e.g. Cloudflare, Namecheap, GoDaddy):

   | Type | Name | Value |
   |------|------|-------|
   | A | @ | 76.76.21.21 |
   | CNAME | www | cname.vercel-dns.com |

3. Wait for DNS to propagate (usually < 30 min). Vercel will auto-issue a Let's Encrypt cert.

### 3. Continuous deployment

After the initial setup, every push to `main` triggers a production deploy automatically. Every PR gets a preview URL.

To trigger a manual deploy: `vercel --prod` from the project root (requires `vercel login` first).

## Environment variables

None required for the current build. If you add Resend or Discord webhooks later, set:

- `RESEND_API_KEY`
- `DISCORD_WEBHOOK_URL`

…in Vercel project settings → Environment Variables.

## Local development

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:3000.

## Useful commands

- `npm run build` — production build
- `npm run start` — run production build locally
- `npm test` — run vitest
- `npx tsc --noEmit` — type check