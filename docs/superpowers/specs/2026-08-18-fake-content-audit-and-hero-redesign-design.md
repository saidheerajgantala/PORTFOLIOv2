# Hero Redesign + Fake Content Removal — Design

**Status:** Draft for review · **Owner:** Sai Dheeraj Gantala

## Scope

Two coupled cleanups after the resume-aligned content pass:

1. **Hero redesign** — restore the original greeting cycle (`Hello / Hi / Hey / Namaste / Howdy`), add a typewriter-style per-character animation, and a subtle cursor parallax on the particles. Drop the role-reactive greeting variants and the four ambient motifs (tug/ripple/tilt/hue) that came with them — those made the hero too loud and broke what you liked.
2. **Fake content audit** — every section that still has placeholder copy or unverifiable metrics gets rewritten from the resume. Recognition gets folded with the real Awards + Certifications from the resume. Writing section is removed.

## Decisions Locked In (from intake)

- **Hero animation:** typewriter per-character (60ms/char), 1.4s hold, 300ms fade out, next phrase starts.
- **Hero particles:** subtle cursor drift (lerp 0.05) — much softer than the old `tug` motif. Always-on, not role-gated.
- **Greeting cycle:** the original 5 phrases, identical for all roles.
- **Subhead + CTA:** still role-aware (the resume-shaped headline + CTA per role are useful and accurate).
- **Writing:** merged into Recognition as Awards + Certifications (resume's real ones).
- **Out of scope:** Section ordering for `founder` and `client` — they currently put `ventures` and `multi-cloud` early. We keep that.

## Hero Design

### Greeting cycle

```ts
// content/hero-variants.ts (simplified)
export const HERO_GREETING_CYCLE = ['Hello.', 'Hi.', 'Hey.', 'Namaste.', 'Howdy.'];

export interface HeroVariant {
  sub: string;        // role-aware subhead
  cta: string;        // role-aware CTA label
  tint: string;       // accent color (CSS variable)
}

export const HERO_VARIANT: Record<Role, HeroVariant> = {
  recruiter: {
    sub: 'System Engineer @ EPAM · Bengaluru · Oct 2025 — Present',
    cta: 'Book a 30-min intro →',
    tint: '#C6FF3D',
  },
  peer: {
    sub: 'LangGraph · Temporal · Google ADK · RBAC · Backstage · Multi-cloud',
    cta: 'Read the case study →',
    tint: '#9DFF66',
  },
  founder: {
    sub: 'Three shipped products · 30% rev lift · 35% cost out · 80% backup time out',
    cta: "Let's talk shipping →",
    tint: '#E6FF66',
  },
  client: {
    sub: 'AWS · GCP · Azure · Designed for teams of 20+ · Reliability + cost discipline',
    cta: 'See how I work →',
    tint: '#C6FF3D',
  },
};
```

`greeting` is gone from the variant — there's now a single cycle used for everyone.

### Typewriter animation

`HeroFallback` types each greeting character by character on mount and on each cycle tick. Per character:
- Type-in: 60ms stagger between letters (motion/react `staggerChildren`)
- Hold: 1400ms after the last character lands
- Fade out: 300ms exit
- Next phrase: 0ms gap (or short 80ms settle)

`ParticleField` reads the current phrase from the same cycle, morphs between them as today. Particles drift toward the cursor at 0.05 lerp (subtle — particles never fully reach the cursor, they just lean). All other particles keep the existing swirl/bob noise.

### Files changed (hero)

| File | Change |
|---|---|
| `content/hero-variants.ts` | Drop `motif`, `greeting`, `HERO_GREETING_CYCLE` map. Top-level `HERO_GREETING_CYCLE` const. |
| `app/page.tsx` | No change — still passes `role` + `HERO_VARIANT[role]`. |
| `components/hero/ParticleHero.tsx` | Drop `motif` prop forwarding. Bake `variant.tint` into `--accent`. |
| `components/hero/HeroFallback.tsx` | Use single greeting cycle. Replace `AnimatePresence` letter-stagger with typewriter + hold + fade. Render `variant.sub` + `variant.cta`. |
| `components/hero/ParticleField.tsx` | Drop motif system. Add subtle cursor drift (0.05 lerp, always-on). |
| `tests/unit/ParticleHero.test.tsx` | Update for new signature (single cycle; no role-dependent greetings). |

## Content Design

### Fake → real replacement table

| File | What was fake | What it becomes |
|---|---|---|
| `components/sections/CurrentlyBuilding.tsx` | "Production agent platform shipping to enterprise clients. LangSmith..." (LangSmith isn't in resume) | Two cards: (a) "Enterprise Agent Platform @ EPAM" — MCP / LangGraph / Temporal / Google ADK / Backstage, (b) "Personal builds in flight" — Hiiired (RAG recruiting) + Noxstack (local services). |
| `components/sections/MultiCloud.tsx` | "Migrated 40+ services from EC2-classic to EKS", "Cut RDS costs 30%", "Cloud Run deployment platform", "Batch processing from VMs to Dataflow", "AKS adoption", "FinOps practices" — none in resume | Two cards (not three): **AWS** (PostgreSQL→MSSQL via DMS, 35% cost out, Cognito OIDC, WAF + reCAPTCHA, CDK, CloudWatch/ELK/APM) and **Azure** (DMS target DB, AD/OIDC integration). GCP dropped from this section since resume has no shipped GCP work; it's mentioned only in intern skills. |
| `components/sections/Recognition.tsx` | "EPAM Spotlight Award", "PyConf India talk", "The New Stack mention" — fabricated | Real awards + certs: GEM Award (Xebia, Jan 2024), Hall of Fame (BigBasket, Jan 2022), Cipher Combat 3.0 17th place (Jan 2020); AWS ML Engineer, AWS DevOps Pro, Cisco Ethical Hacker (Jan 2025); Google Cloud Architect (Jan 2024); Infosys CSP (Jan 2022). |
| `components/sections/Writing.tsx` | Three fabricated blog posts | **Removed.** Drop the file. |
| `content/sections.ts` | All four SECTION_ORDER arrays include 'writing' | Remove 'writing' from each. |
| `components/sections/Contact.tsx` | Fallback `hello@example.com` | Real email `gantala.saidheeraj@gmail.com`. |
| `content/case-studies.ts` | "12+ clients, 99.9% uptime, 35% cost reduction" — fabricated metrics | Agent platform: trim to verifiable framing ("Multi-tenant RBAC, Temporal-orchestrated workflows, MCP integration"); drop the made-up numbers. |
| `content/work/jobharvester.mdx` (case study file) | Title "JobHarvester" but the project isn't in the resume | Remove the case study file. Update `/work/[slug]` page or its `generateStaticParams` to drop the slug. |

### Resume-derived copy (concrete)

**CurrentlyBuilding.tsx → BUILDS:**
```ts
{
  name: 'Enterprise Agent Platform @ EPAM',
  description: 'MCP-integrated agent workflows, multi-tenant RBAC, Temporal orchestration, LangGraph + Google ADK agents. Operator review + approval loops.',
  stack: ['Python', 'FastAPI', 'LangGraph', 'Temporal', 'Google ADK', 'Backstage'],
  status: 'active',
},
{
  name: 'Hiiired + Noxstack (personal)',
  description: 'AI-powered recruiting (RAG + CrewAI) and local service discovery (FastAPI + LangChain). Solo builds, weekend hours.',
  stack: ['FastAPI', 'Next.js', 'RAG', 'OpenAI', 'LangChain'],
  status: 'active',
},
```

**MultiCloud.tsx → CLOUDS (drop GCP):**
```ts
{ name: 'AWS',  achievements: [
  'PostgreSQL → Azure MSSQL pipeline via AWS DMS, custom triggers, +30% revenue lift.',
  '35% AWS cost out via rightsizing + Lambda lifecycle automation; 65% provisioning time out via Terraform + AWS CDK.',
  'AWS WAF + reCAPTCHA cut fraudulent activity 70%; ELK + Elastic APM cut MTTD/MTTR 30%.',
  'AWS Cognito (OIDC) integrated with Ruby on Rails + Azure AD for SSO.',
]},
{ name: 'Azure', achievements: [
  'Azure MSSQL hosted target of the cross-cloud DMS pipeline.',
  'Azure AD (OIDC) wired into the SSO flow.',
  'Bash + parallel processing for cross-cloud backup/restore — 80% manual setup time out, 40% perf gain.',
]},
```

**Recognition.tsx → ITEMS:**
```ts
// Awards
{ kind: 'award', title: 'GEM Award — Xebia', period: 'Jan 2024', href: 'https://media.licdn.com/dms/image/v2/D562DAQFNqIwJgaZG6Q/profile-treasury-image-shrink_1280_1280/.../0/1738944384902', body: 'Quarterly engineering excellence award at Xebia.' },
{ kind: 'award', title: 'Hall of Fame — BigBasket', period: 'Jan 2022', href: 'https://tech.bigbasket.com/security-at-bigbasket-5eaaa6fa7c89', body: 'Listed on BigBasket\'s security hall of fame.' },
{ kind: 'award', title: 'Cipher Combat 3.0 — 17th place', period: 'Jan 2020', body: 'National-level CTF-style competition.' },
// Certifications
{ kind: 'cert', title: 'AWS Certified ML Engineer — Associate', period: 'Jan 2025', body: 'Issued by Amazon Web Services.' },
{ kind: 'cert', title: 'AWS Certified DevOps Engineer — Professional', period: 'Jan 2025', href: 'https://www.credly.com/badges/beaba153-e27f-4e66-ae75-adb1d8b9810b/public_url', body: 'Issued by Amazon Web Services.' },
{ kind: 'cert', title: 'Ethical Hacker — Cisco', period: 'Jan 2025', body: 'Issued by Cisco.' },
{ kind: 'cert', title: 'Google Professional Cloud Architect', period: 'Jan 2024', href: 'https://www.credly.com/badges/1ffec24f-c758-4b83-abac-ca1218ff6b11', body: 'Issued by Google.' },
{ kind: 'cert', title: 'Infosys Certified Software Programmer', period: 'Jan 2022', body: 'Issued by Infosys.' },
```

**case-studies.ts:**
- Agent Platform: keep the slug but rewrite copy with resume-derived facts. Drop fabricated 12+ clients / 99.9% / 35% metrics.
- JobHarvester: **remove** — the project is not in the resume and the resume's ventures (Hiiired, Noxstack, WeDAA) don't have case studies yet.

### Files changed (content)

| File | Change |
|---|---|
| `components/sections/CurrentlyBuilding.tsx` | Two resume-shaped builds |
| `components/sections/MultiCloud.tsx` | AWS + Azure only, resume-derived bullets |
| `components/sections/Recognition.tsx` | Awards + certs from resume |
| `components/sections/Writing.tsx` | **delete** |
| `content/sections.ts` | Drop 'writing' from each role's SECTION_ORDER |
| `components/sections/Contact.tsx` | Real fallback email |
| `content/case-studies.ts` | Drop JobHarvester entry; rewrite Agent Platform with no fabricated metrics |
| `content/work/jobharvester.mdx` | **delete** |
| `app/work/[slug]/page.tsx` (or static params) | Drop `jobharvester` from `generateStaticParams` |

## Risks / Trade-offs

- **Greeting cycle is now identical across roles.** Trade-off: less personalized, but it's what you wanted. Subhead + CTA still tailor to role.
- **ParticleField loses the four motifs.** Trade-off: less "interactive" in the noisy sense, but the typewriter + cursor drift are the actually-interactive parts. Motifs were an over-build.
- **Recognition gets longer (8 entries).** Visual layout unchanged — still `<li>` list — but the section is now denser. Acceptable since these are all real.
- **Dropping JobHarvester case study** removes a `/work/jobharvester` route. The link in Writing was the only outbound reference, and Writing is gone too. No 404 risk after we remove the static param.
- **MultiCloud goes from 3 to 2 cards.** The section feels lighter — that's fine, it matches the resume (AWS-heavy; Azure as a target; no shipped GCP work).

## Verification

- `pnpm type` clean
- `pnpm test` — 92+ existing tests still pass + 4 new hero tests
- `pnpm build` clean (no broken `/work/jobharvester` route)
- Dev server smoke: hit each of 4 roles, confirm single greeting cycle + role-aware subhead/CTA
- `/work/agent-platform` still loads; `/work/jobharvester` returns 404 (acceptable since we removed the route)

## Out of Scope

- Section ordering refactor beyond removing 'writing'
- Adding Hiiired/Noxstack/WeDAA case studies (none exist; would need MDX content from user)
- Resume API route update (resume.txt is the source)
- Twitter card / OG image metadata (already pending followup #93, #94)
