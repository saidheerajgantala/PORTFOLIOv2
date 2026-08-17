# Deployment

This site auto-deploys to Vercel from the `main` branch. There are two supported paths — pick whichever fits your workflow.

> **Note:** Git commit author email must belong to the Vercel team. This repo uses `x5ud0kn1gh7x@gmail.com` as the author email so CI-triggered production deploys pass Vercel's team-access check. Your `git config user.email` should match.

---

## Option A — Vercel native GitHub integration (recommended, zero secrets)

Vercel watches the repo directly. Every push to `main` becomes a production deploy; every PR gets a preview URL.

### One-time setup (≈ 5 min)

1. Go to https://vercel.com/new
2. Click **Import Git Repository** → select `dheeraj-gantala-projects/portfolio-website`
3. Framework: **Next.js** (auto-detected)
4. Root directory: `./`
5. Build command: `next build` (default)
6. **Install Command:** `npm ci` (default; ensures lockfile parity)
7. Click **Deploy**

The first deploy uses a `*.vercel.app` URL. Once it succeeds:

- **CI workflow** (`.github/workflows/ci.yml`) keeps running on every push — it gates PRs and catches regressions
- **Vercel integration** independently builds and deploys the same commits

If you only want this path, **delete `.github/workflows/deploy.yml`**. The GitHub Actions workflow is dormant without Vercel secrets and adds nothing useful alongside the native integration.

### Custom domain — saidheerajgantala.me

1. Vercel project → **Settings** → **Domains** → add `saidheerajgantala.me` and `www.saidheerajgantala.me`
2. Add these DNS records at your registrar:

   | Type  | Name | Value                |
   | ----- | ---- | -------------------- |
   | A     | @    | `76.76.21.21`        |
   | CNAME | www  | `cname.vercel-dns.com` |

3. Wait for DNS to propagate (usually < 30 min). Vercel auto-issues a Let's Encrypt cert.

---

## Option B — Custom GitHub Actions deploy.yml (advanced)

The repo includes `.github/workflows/deploy.yml` which calls `amondnet/vercel-action`. Use this if you want CI to gate deploys, or you want deployment logic (env-specific builds, smoke tests, etc.) under your own control.

### When does it run?

- `workflow_run` after `CI` succeeds on a `push` to `main`
- `workflow_dispatch` for manual triggers

It does **not** run on PRs — PRs get preview URLs from the native integration (Option A) or from a separate preview workflow.

### One-time secrets setup

Generate Vercel credentials:

```bash
# Install Vercel CLI and login
npm i -g vercel
vercel login

# Link the project locally once (creates .vercel/, which is gitignored)
vercel link

# Read the org/project IDs that Vercel just wrote to .vercel/project.json
cat .vercel/project.json
```

Then add three secrets at https://github.com/dheeraj-gantala-projects/portfolio-website/settings/secrets/actions:

| Secret | Source |
| ------ | ------ |
| `VERCEL_TOKEN`     | `vercel tokens create` (or https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID`    | `orgId` field from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` field from `.vercel/project.json` |

The `vercel tokens create` command output gives you a single token; the other two IDs come from `vercel link`.

If you use **Option B exclusively**, also disable the native GitHub integration in Vercel project settings → **Git** → toggle off **Connected Git Repository**, otherwise you'll get duplicate deploys.

---

## Recommendation

Start with **Option A** (native integration). It works out of the box with no secrets. If you later need CI-gated deploys or want to add smoke tests before deploy, switch to **Option B** by adding the secrets and removing the native integration.

You can use both simultaneously if you like — Vercel will produce two deploys per push, which is harmless but noisy.

---

## Environment variables

None required for the current build. If you add Resend or Discord webhooks later, set them at:

- **Vercel:** Project → Settings → Environment Variables
- **GitHub Actions (Option B):** Repo → Settings → Secrets and variables → Actions

Common keys for future use:

- `RESEND_API_KEY`
- `DISCORD_WEBHOOK_URL`

## Local development

```bash
npm install
npm run dev
```

Dev server runs on http://localhost:3000.

## Useful commands

- `npm run build` — production build
- `npm run start` — run production build locally
- `npm test` — run vitest unit tests
- `npx tsc --noEmit` — type check
- `npx playwright test` — run E2E tests
- `vercel --prod` — manual deploy via CLI (requires `vercel login`)
