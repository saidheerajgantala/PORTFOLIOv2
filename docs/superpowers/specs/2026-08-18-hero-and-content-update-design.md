# Hero Interactivity + Resume-Aligned Content Update — Design

**Status:** Draft for review · **Owner:** Sai Dheeraj Gantala

## Scope

Two coupled asks:

1. **Hero interactivity bump.** Make the opening section do more than greet. Today it cycles through five generic greetings on a fixed timeline; we want it to feel alive and tailored.
2. **Resume-aligned content rewrite.** `content/career.ts`, `content/audience-variants.ts`, and `content/ventures.ts` currently describe fictional stops and unverifiable metrics. The copy should match `resume.txt`.

## Decisions Locked In (from intake)

- Hero: **role-reactive text + ambient micro-interactions** (option C).
- Content: **faithful rewrite** (option A) — keep the existing four-pillar structure, replace placeholder copy with real entries.

## Out of Scope (Not Changing)

- Recognition section's award/certification entries — task is "faithful rewrite" of the three core content files, not recognition.
- Projects outside the three "real" ventures from the resume.
- Section ordering, role store, who-am-i cookie flow.
- Performance budget beyond what's needed to keep the hero responsive.

## Hero Design

### Role-reactive text

Source-of-truth table at `content/hero-variants.ts`:

```ts
import type { Role } from '@/lib/types';

export interface HeroVariant {
  greeting: string;     // particle headline (a noun or fragment)
  sub: string;          // monospaced subhead under the headline
  cta: string;          // CTA label shown in non-WebGL fallback
  motif: 'tug' | 'ripple' | 'tilt' | 'hue';   // ambient micro-interaction
  tint: string;         // accent color (CSS variable) — slight shift per role
}

export const HERO_VARIANT: Record<Role, HeroVariant> = {
  recruiter: {
    greeting: 'Gantala Sai Dheeraj',
    sub: 'System Engineer @ EPAM · Bengaluru · Oct 2025 — Present',
    cta: 'Book a 30-min intro →',
    motif: 'tug',
    tint: '#C6FF3D',  // default accent
  },
  peer: {
    greeting: 'Hello, peer.',
    sub: 'LangGraph · Temporal · Google ADK · RBAC · Backstage · Multi-cloud',
    cta: 'Read the case study →',
    motif: 'ripple',
    tint: '#9DFF66',
  },
  founder: {
    greeting: 'Hey.',
    sub: 'Three shipped products · 30% rev lift · 35% cost out · 80% backup time out',
    cta: "Let's talk shipping →",
    motif: 'tilt',
    tint: '#E6FF66',
  },
  client: {
    greeting: 'Building the operating layer where AI meets engineering.',
    sub: 'AWS · GCP · Azure · Designed for teams of 20+ · Reliability + cost discipline',
    cta: 'See how I work →',
    motif: 'hue',
    tint: '#C6FF3D',
  },
};

export const HERO_GREETING_CYCLE: Record<Role, string[]> = {
  recruiter: ['Gantala Sai Dheeraj', 'SDE2 at EPAM', 'Bengaluru, India'],
  peer:      ['Hello, peer.', 'Hey, builder.', 'Ship it.'],
  founder:   ['Hey.', "Let's talk shipping.", 'Show me the receipts.'],
  client:    ['Building the operating layer.', 'Reliability + cost discipline.', 'AI in production.'],
};
```

The `ParticleHero` cycles through `HERO_GREETING_CYCLE[role]` instead of the hardcoded `['Hello.', 'Hi.', ...]` list. `HeroFallback` does the same, plus renders `sub` and `cta` under the headline so non-WebGL visitors get the role-aware copy too.

### Ambient micro-interactions

Each role gets one motif. All four reduce gracefully when `prefers-reduced-motion: reduce` is set; the greeting still cycles but no interactive physics run.

| Motif | What it looks like | Where it lives |
|---|---|---|
| `tug` | Cursor magnetically attracts particles within a 220px radius. Particles relax back to letterform over ~600ms after the cursor leaves. | `ParticleField.tsx` |
| `ripple` | Click anywhere in the hero → particle displacement radiating outward, 800ms shockwave, then settle. | `ParticleField.tsx` + a new `HeroRipple` controller component |
| `tilt` | Scroll position rotates the particle field ±6° on Y-axis with eased lerp (mocked 3D parallax). Particles also drift 0–4% on Z with scroll. | `ParticleHero.tsx` wrapper, listens to `window.scrollY` |
| `hue` | Accent hue interpolates across the day: cool (210°) at 6am → accent lime (90°) at noon → warm (40°) at 6pm → cool (210°) at midnight. Tint = `color-mix` blend toward hue. | `ParticleField.tsx` reads `Date.now()` once + a 60s tick |

`motif` + `tint` are passed into `ParticleHero` as props. `ParticleHero` reads them, forwards to `ParticleField`. `HeroFallback` reads `tint` and applies it to the lime sweep + scanning beam + floating dots.

### File-level changes (hero)

| File | Change |
|---|---|
| `content/hero-variants.ts` | **NEW.** HERO_VARIANT map + greeting cycle. |
| `app/page.tsx` | Reads role from cookies, passes role + matching HeroVariant to `ParticleHero`. |
| `components/hero/ParticleHero.tsx` | Accepts `variant: HeroVariant`; forwards `tint` + `motif` to `ParticleField`. |
| `components/hero/HeroFallback.tsx` | Accepts `variant: HeroVariant`; greets from `greeting` cycle; renders `sub` and `cta` slot. |
| `components/hero/ParticleField.tsx` | Accepts `tint` and `motif` props. Implements the four behaviors, all gated by `reduceMotion`. |
| `tests/unit/ParticleHero.test.tsx` | Update existing 3 cases — call sites now pass `variant`. Add 2 cases: (a) cycling greetings match the active role's cycle, (b) reduced-motion skips ambient physics. |
| `tests/unit/HeroFallback.test.tsx` (new) | Light tests for variant-driven greeting/sub/cta rendering. |

## Content Design

### `content/career.ts` — faithful rewrite

Three stops, in reverse chronological order. Achievement bullets limited to 3 per stop (UI shows 3 max).

```ts
export const CAREER: CareerStop[] = [
  {
    id: 'epam-agent-platform',
    period: 'Oct 2025 — Present',
    title: 'System Engineer — Enterprise Agent Platform',
    company: 'EPAM Systems',
    location: 'Bengaluru, India',
    achievements: [
      'Building the enterprise AI agent platform — MCP integrations, agentic workflows, operator review loops.',
      'Multi-tenant RBAC and role-based dashboards for developer-self-service + operator approval flows.',
      'Orchestrated long-running workflows on Temporal; LangGraph + Google ADK agents in production.',
    ],
  },
  {
    id: 'premium-parking-xebia',
    period: 'Jul 2023 — Sep 2025',
    title: 'Software Engineer — Cloud, Data & DevOps',
    company: 'Premium Parking (Xebia)',
    location: 'Hyderabad, India',
    achievements: [
      '30% revenue lift via end-to-end PostgreSQL→MSSQL data pipeline (AWS DMS + custom triggers powering BI).',
      '35% AWS cost out via rightsizing, lifecycle automation (Lambda + CloudWatch Events); 65% provisioning time out via Terraform + AWS CDK.',
      '70% fraud reduction via reCAPTCHA + AWS WAF; ELK + Elastic APM cut MTTD/MTTR by 30%.',
    ],
  },
  {
    id: 'xebia-intern',
    period: 'Mar 2022 — Jun 2022',
    title: 'Engineer Intern',
    company: 'Xebia',
    location: 'Hyderabad, India',
    achievements: [
      'Tripled deployment frequency via GitHub Actions CI/CD; containerized apps, 30% deploy-time reduction.',
      'Hands-on Go, Docker, Java, Rails, Python, AWS, GCP across backend and cloud projects.',
    ],
  },
];
```

### `content/audience-variants.ts` — accurate subhead, matching headline

```ts
export const HERO_HEADLINE = 'Building the operating layer where AI meets engineering.';

export const HERO_SUBHEAD: Record<Role, string> = {
  recruiter:
    'System Engineer @ EPAM. 4+ years across cloud-native, data pipelines, and AI. Bengaluru.',
  peer:
    'MCP · LangGraph · Temporal · Google ADK · Backstage · RBAC. Multi-tenant. Operator-in-the-loop.',
  founder:
    'Three shipped products. 30% revenue lift, 35% cost out, 80% backup-time out — outcomes, not slogans.',
  client:
    'AWS, GCP, Azure. CI/CD, observability, IaC, AI in production. Designed for teams of 20+.',
};

export const HERO_CTA: Record<Role, string> = {
  recruiter: 'Book a 30-min intro →',
  peer: 'Read the case study →',
  founder: "Let's talk shipping →",
  client: 'See how I work →',
};
```

The `HERO_HEADLINE` stays as a fallback (used by `client` variant when role isn't set). `HERO_CTA` in `audience-variants.ts` is removed — single source of truth lives in `hero-variants.ts`. `HERO_SUBHEAD` is also removed here (subsumed by `hero-variants.ts`'s `sub`). `HERO_HEADLINE` stays exported because it's the only canonical default-name string and may be referenced from elsewhere.

### `content/ventures.ts` — real projects

```ts
export const VENTURES: Venture[] = [
  {
    slug: 'hiiired',
    name: 'Hiiired',
    role: 'Solo builder',
    period: '2024 — Present',
    status: 'active',
    tagline:
      'AI-powered recruitment: resume tailoring, job matching, authentication, workflows.',
    href: 'https://www.hiiired.cv/',
    tags: ['FastAPI', 'Next.js', 'RAG', 'OpenAI', 'CrewAI'],
  },
  {
    slug: 'noxstack',
    name: 'Noxstack',
    role: 'Solo builder',
    period: '2024 — Present',
    status: 'active',
    tagline:
      'Community-driven local service discovery — find and book neighborhood pros.',
    href: 'https://www.noxstack.com/',
    tags: ['FastAPI', 'PostgreSQL', 'AWS', 'Terraform', 'LangChain'],
  },
  {
    slug: 'wedaa',
    name: 'WeDAA',
    role: 'Co-founder',
    period: '2023 — Present',
    status: 'active',
    tagline:
      'Cloud-native app prototyping + backend code generation. Scaffold to deploy in minutes.',
    href: 'https://www.wedaa.tech/',
    tags: ['Spring Boot', 'Terraform', 'Kubernetes', 'AWS'],
  },
];
```

(`HERO_CTA` in `audience-variants.ts` no longer duplicates `HERO_VARIANT[*].cta` — single source: hero-variants.ts for hero; audience-variants.ts only owns the subhead used by the role-reshaped sections downstream.)

## Risks / Trade-offs

- **ParticleField cycles vs role cycle.** Current ParticleField morphs between texts and re-samples letter targets. Switching source of truth to per-role arrays is mechanical — already parameterized by `text`. No GPU/scene rework expected.
- **Cursor magnet / scroll tilt on mobile.** `tug` is gated behind `(pointer: fine)` (no hover on touch). `tilt` listens to scroll which fires on all devices, but uses small angles.
- **`tint` cascading into HeroFallback.** Every place that currently uses `var(--accent)` doesn't need to change if we leave `--accent` alone and only apply the tint on the ParticleField overlay plus fallback's lime sweep. Decision: tint gets baked into a `style={{ '--accent': variant.tint }}` on the hero root; CSS variables cascade. The accent stays default for everything else on the page.
- **Resume drift.** Adding more bulleted achievements risks creeping length. We cap at 3 per stop on `career.ts` and keep copy self-contained (no marketing embellishment).

## Verification

- **Unit tests:** updated `ParticleHero.test.tsx` + new `HeroFallback.test.tsx` — all pass (`pnpm test`).
- **Lint + type-check:** `pnpm lint` and `pnpm type` — clean.
- **Production build:** `pnpm build` — clean.
- **Playwright smoke:** open `/`, switch role via WhoAmI modal, screenshot hero at each of 4 roles via Playwright MCP. Confirm role-specific copy + motif is different per role.
- **Local dev:** `pnpm dev`, visit `/` in browser, switch roles, click-drag in hero to feel `tug`/`ripple`.

## Out of Scope (Confirmed)

- No changes to recognition, certifications, awards (resume's "Awards" + "Certifications" sections not requested by "faithful" option).
- No changes to case study copy beyond what's needed to keep them compiling.
- No changes to type definitions beyond extending `HeroVariant` (new interface, no breaking change).
