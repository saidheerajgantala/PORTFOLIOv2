# Hero Redesign (Brittany Spine) + Certifications Split

**Date:** 2026-08-21
**Status:** Approved (Option A from research)

## Goal

Two changes:

1. **Redesign the hero** to a Brittany Chiang–style identity spine with a Rauno Freiberg–style inline-accent bio. Static, one paragraph, no JS state. Serves all four audiences by letting each latch onto a different line. Replace the current typewriter + WebGL particle hero.
2. **Split Certifications out of Recognition** into its own section. Recognition keeps awards; a new Certifications section shows the certs as a badge grid with Credly links.

## Background

The current hero (`components/hero/ParticleHero.tsx`, `HeroFallback.tsx`, `ParticleField.tsx`, `particle-text.ts`) has shipped in three states — particle-text bug, additive-saturation bug, simplified particle swarm — and is still considered visually noisy relative to the rest of the page. The greeting cycle (Hello/Hi/Hey/Namaste/Howdy) is warm but generic; for an SDE2 it underperforms a static identity block.

Research (see brainstorming notes in this conversation) surveyed Bruno Simon, Rauno Freiberg, Cassidy Williams, Lee Robinson, Josh Comeau, Brittany Chiang, Max Böck, Tobias van Schneider, Guillermo Rauch, Linear. Selected four (Brittany, Lee, Max, Rauno) and recommended a hybrid: **Brittany spine + Rauno inline-accent bio**. User picked this option.

Recognition currently bundles awards + certifications together (5 certs in `components/sections/Recognition.tsx`). For a backend engineer, certs (AWS DevOps Pro, AWS ML Associate, GCP PCA, Ethical Hacker, Infosys CSP) are a separate trust signal from awards (Xebia GEM, BigBasket HoF, Cipher Combat). Splitting makes both more scannable.

## Non-goals

- No new audience-reactive headline (the spec says role-reactive copy was picked; this is implemented as a *bio line* below the static name, not the headline itself — see "Headline" below).
- No WebGL, no particle field, no motion beyond a brief CSS-only reveal.
- No URL-fragment state for the hero (Option B was rejected).
- No manifesto block (Option C was rejected).
- No new design tokens or color system changes.
- No change to other sections beyond removing `'writing'` (already done) and adding `'certifications'`.

## Architecture

### Hero structure

Single column, centered, max-w-5xl, full viewport height. Three blocks, in order:

1. **Identity block** — name (h1, display weight, large) + role line (h2, monospace, muted).
2. **Bio paragraph** — one sentence with inline-accent spans linking to anchors / routes. The accent spans swap per role (this is the "role-reactive copy").
3. **CTA row** — primary CTA + secondary "Available for / @ EPAM / Notes" inline links.

No tab strip, no JS-driven variant swap, no greeting animation, no WebGL. A single short reveal animation (≤600ms) on initial mount; respects `prefers-reduced-motion`.

### Role-reactive bio copy

The bio paragraph reads "Backend engineer building agent platforms with: *LangGraph · Temporal · Google ADK · AWS · Azure*". The accent spans (currently all 5 tech names) swap per role so each audience sees a different ordered list:

| Role | Accent spans (in order) |
|---|---|
| recruiter | EPAM · Bengaluru · AWS · LangGraph · 30% rev lift |
| peer | LangGraph · Temporal · Google ADK · RBAC · Backstage |
| founder | Hiiired · Noxstack · 30% rev lift · 35% cost out |
| client | AWS · Azure · 70% fraud cut · 35% cost out |

Each span is a link: the four role-specific spans link to anchors (`#career-arc`, `#multi-cloud`, `#ventures`, `#recognition`) so the paragraph doubles as a table of contents. The middle dot separators are inert.

### CTA row

- Primary: existing role-aware CTA (already in `HERO_VARIANT[role].cta`) — keeps current "Book a 30-min intro →" / "Read the case study →" / etc.
- Secondary inline links: `Available for platform engagements →` (mailto), `Currently @ EPAM` (anchor to career-arc), `Notes on agent reliability` (anchor to a future `/notes` page; for now anchor to `#currently-building` until the notes route exists).

### Headline (static)

```
H1:  Saidheeraj Gantala
H2:  Backend Engineer · Agent Platforms · Bengaluru
```

`Backend Engineer · Agent Platforms · Bengaluru` is the static role line. Same across all 4 audiences.

### Layout

- Container: `<section id="hero" className="relative w-full min-h-[80vh] flex items-center justify-center px-6 py-24">`.
- Max width: `max-w-5xl`.
- Headline font-size: `clamp(48px, 10vw, 128px)`.
- Bio font-size: `clamp(18px, 1.6vw, 22px)`.
- CTA row: monospace, uppercase tracking.
- Decorative background: keep the existing radial backdrop + grid mask pattern from `HeroFallback.tsx`, simplify to a single static layer (no scanning beam, no floating dots, no typewriter).
- No accent color variants baked into the hero — the accent (lime) is global; per-role accent tinting on the hero is removed.

### Files

- **Delete:**
  - `components/hero/ParticleHero.tsx` (replaced by Hero)
  - `components/hero/ParticleField.tsx` (no longer used)
  - `components/hero/particle-text.ts` (no longer used)
  - `content/hero-variants.ts` (the greeting cycle + HERO_VARIANT move into a smaller, role-bio-only module)

- **Create:**
  - `components/hero/Hero.tsx` — server component, renders the identity + bio + CTA. Accepts `role: Role` prop; reads bio copy from `content/hero-bio.ts`. Has a thin `'use client'` child component for the reveal animation.
  - `components/hero/HeroReveal.tsx` — `'use client'`, applies a 400ms opacity+translateY reveal on first paint, skips for `prefers-reduced-motion`.
  - `content/hero-bio.ts` — typed map of `Role → { bioSpans: { label: string; href: string }[] }`.
  - `components/sections/Certifications.tsx` — section component, signature `(props: { index: number; total: number })`. Renders certs as a 2-column badge grid with issuer, date, and Credly link where present.

- **Modify:**
  - `app/page.tsx` — import `Hero` instead of `ParticleHero`; pass `role` only (no variant).
  - `components/RoleReshapedPage.tsx` — the hero `<section>` is rendered directly by `app/page.tsx`, not through the section switch. (Currently the hero is in SECTION_ORDER but never selected by `SectionById`; this stays the same. The switch stays as-is.)
  - `lib/types.ts` — add `'certifications'` to `SECTION_IDS`.
  - `content/sections.ts` — add `'certifications'` to each role's `SECTION_ORDER` (slotted per role).
  - `components/sections/Recognition.tsx` — drop the `kind: 'cert'` items (AWS ML Associate, AWS DevOps Pro, Ethical Hacker, GCP PCA, Infosys CSP). Keep only the 3 awards.
  - `tests/unit/case-studies.test.ts` and `tests/unit/editorial-sections.test.tsx` — update for the renamed/removed structure.
  - `tests/unit/types.test.ts` — add `'certifications'` to the expected SECTION_IDS array.
  - `tests/unit/sections.test.ts` — update length check from 8 to 9.
  - `tests/unit/MultiCloud.test.tsx` and any other test touching section counts — leave alone (no impact).
  - `tests/unit/ParticleHero.test.tsx` — delete (the component is gone; replacement tests cover the new Hero).
  - Add `tests/unit/Hero.test.tsx` and `tests/unit/Certifications.test.tsx`.

## Data

### `content/hero-bio.ts`

```ts
import type { Role } from '@/lib/types';

export interface BioSpan {
  label: string;
  href: string;
}

export interface HeroBio {
  intro: string;       // e.g. "Backend engineer building agent platforms with:"
  spans: BioSpan[];    // 4–6 items, rendered as inline accents
  outro?: string;      // trailing fragment after the last span (rarely used)
}

export const HERO_BIO: Record<Role, HeroBio> = {
  recruiter: {
    intro: 'Backend engineer at',
    spans: [
      { label: 'EPAM',         href: '#career-arc' },
      { label: 'Bengaluru',    href: '#career-arc' },
      { label: 'AWS',          href: '#multi-cloud' },
      { label: 'LangGraph',    href: '#currently-building' },
      { label: '30% rev lift', href: '#career-arc' },
    ],
  },
  peer: {
    intro: 'Building agent platforms with',
    spans: [
      { label: 'LangGraph',    href: '#currently-building' },
      { label: 'Temporal',     href: '#currently-building' },
      { label: 'Google ADK',   href: '#currently-building' },
      { label: 'RBAC',         href: '#currently-building' },
      { label: 'Backstage',    href: '#currently-building' },
    ],
  },
  founder: {
    intro: 'Shipped:',
    spans: [
      { label: 'Hiiired',         href: '#ventures' },
      { label: 'Noxstack',        href: '#ventures' },
      { label: '30% rev lift',    href: '#career-arc' },
      { label: '35% cost out',    href: '#career-arc' },
      { label: '80% backup out',  href: '#career-arc' },
    ],
  },
  client: {
    intro: 'AWS · Azure platforms that deliver',
    spans: [
      { label: '70% fraud cut',   href: '#multi-cloud' },
      { label: '35% cost out',    href: '#multi-cloud' },
      { label: '30% MTTD out',    href: '#multi-cloud' },
    ],
  },
};
```

### `content/certifications.ts` (new)

```ts
import type { CertificationMeta } from '@/lib/types';

export const CERTIFICATIONS: CertificationMeta[] = [
  {
    slug: 'aws-ml-associate',
    title: 'AWS Certified Machine Learning Engineer — Associate',
    issuer: 'Amazon Web Services',
    issued: '2025-01',
    href: undefined,
  },
  {
    slug: 'aws-devops-pro',
    title: 'AWS Certified DevOps Engineer — Professional',
    issuer: 'Amazon Web Services',
    issued: '2025-01',
    href: 'https://www.credly.com/badges/beaba153-e27f-4e66-ae75-adb1d8b9810b/public_url',
  },
  {
    slug: 'cisco-ethical-hacker',
    title: 'Ethical Hacker',
    issuer: 'Cisco',
    issued: '2025-01',
    href: undefined,
  },
  {
    slug: 'gcp-architect',
    title: 'Google Professional Cloud Architect',
    issuer: 'Google',
    issued: '2024-01',
    href: 'https://www.credly.com/badges/1ffec24f-c758-4b83-abac-ca1218ff6b11',
  },
  {
    slug: 'infosys-csp',
    title: 'Infosys Certified Software Programmer',
    issuer: 'Infosys',
    issued: '2022-01',
    href: undefined,
  },
];
```

### `lib/types.ts` additions

```ts
export const SECTION_IDS = [
  'hero',
  'recognition',
  'currently-building',
  'career-arc',
  'ventures',
  'multi-cloud',
  'certifications',   // NEW
  'principles',
  'contact',
] as const;

export interface CertificationMeta {
  slug: string;
  title: string;
  issuer: string;
  issued: string;     // ISO YYYY-MM
  href?: string;
}
```

### `content/sections.ts` changes

Insert `'certifications'` into each role's `SECTION_ORDER` (slot depends on role — peer gets it right after `currently-building`, recruiter right before `contact`, founder between `career-arc` and `multi-cloud`, client between `multi-cloud` and `principles`).

## Component sketches

### `Hero.tsx` (server component)

```tsx
import { HeroReveal } from '@/components/hero/HeroReveal';
import { HERO_BIO } from '@/content/hero-bio';
import { HERO_VARIANT } from '@/content/hero-variants';
import type { Role } from '@/lib/types';

export function Hero({ role }: { role: Role }) {
  const bio = HERO_BIO[role];
  const variant = HERO_VARIANT[role];
  return (
    <section
      id="hero"
      className="relative w-full min-h-[80vh] flex items-center justify-center px-6 py-24"
    >
      <HeroReveal>
        <h1 className="font-display font-bold leading-none tracking-[-0.04em] text-text"
            style={{ fontSize: 'clamp(48px, 10vw, 128px)' }}>
          Saidheeraj Gantala
        </h1>
        <h2 className="mt-4 font-mono text-sm uppercase tracking-[0.3em] text-muted">
          Backend Engineer · Agent Platforms · Bengaluru
        </h2>

        <p className="mt-12 max-w-3xl text-text"
           style={{ fontSize: 'clamp(18px, 1.6vw, 22px)' }}>
          {bio.intro}{' '}
          {bio.spans.map((s, i) => (
            <span key={s.label}>
              {i > 0 && <span className="mx-2 text-muted">·</span>}
              <a href={s.href} className="text-accent hover:underline">{s.label}</a>
            </span>
          ))}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-sm uppercase tracking-[0.2em]">
          <a href="#contact"
             className="text-text border-b-2 border-accent pb-1 hover:opacity-80">
            {variant.cta}
          </a>
          <a href="mailto:gantala.saidheeraj@gmail.com"
             className="text-muted hover:text-text">
            Available for platform engagements →
          </a>
          <a href="#career-arc" className="text-muted hover:text-text">
            Currently @ EPAM
          </a>
          <a href="#currently-building" className="text-muted hover:text-text">
            Notes on agent reliability
          </a>
        </div>
      </HeroReveal>
    </section>
  );
}
```

### `HeroReveal.tsx` (client component)

```tsx
'use client';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';

export function HeroReveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

### `Certifications.tsx`

```tsx
import { SectionNumber } from '@/components/layout/SectionNumber';
import { CERTIFICATIONS } from '@/content/certifications';

export function Certifications({ index, total }: { index: number; total: number }) {
  return (
    <section id="certifications" aria-labelledby="certifications-heading"
             className="mx-auto w-full max-w-3xl px-6 py-24">
      <SectionNumber index={index} total={total} className="block" />
      <h2 id="certifications-heading"
          className="mt-4 font-display text-4xl text-text">Certifications</h2>
      <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {CERTIFICATIONS.map((c) => (
          <li key={c.slug} className="border border-border p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {c.issuer} · {c.issued}
            </p>
            <h3 className="mt-3 font-display text-lg text-text">
              {c.href
                ? <a href={c.href} target="_blank" rel="noopener noreferrer"
                     className="hover:text-accent">{c.title}</a>
                : c.title}
            </h3>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

## Data flow

`app/page.tsx` reads role from cookie, passes `role` to `Hero`. `Hero` reads `HERO_BIO[role]` and `HERO_VARIANT[role]` server-side. No client-side state for the bio copy. `HeroReveal` is the only client component in the hero tree.

`RoleReshapedPage` continues to render non-hero sections via the `SectionById` switch. A new case `'certifications'` is added.

## Error handling

No new error paths. `HERO_BIO[role]` is always defined for any `Role` (TypeScript enforces exhaustiveness). `CERTIFICATIONS` is a static list, no runtime fetch.

## Testing

- **Unit:**
  - `tests/unit/Hero.test.tsx` (new): renders name, renders the static role line, renders the per-role bio intro, renders at least one accent span for each of the 4 roles, renders the primary CTA link, does NOT render any greeting words ("Hello.", "Hi.", "Hey.", "Namaste.", "Howdy.").
  - `tests/unit/Certifications.test.tsx` (new): renders heading, renders all 5 certs, links Credly URLs for `aws-devops-pro` and `gcp-architect`, leaves other certs as plain text.
  - `tests/unit/Recognition.test.tsx` (move into `editorial-sections.test.tsx`): no longer mentions any cert issuer strings (no "Amazon Web Services", no "Cisco", no "Google", no "Infosys").
  - `tests/unit/hero-bio.test.ts` (new): every `Role` has 3+ `BioSpan`s; every `BioSpan.href` starts with `#` or `mailto:`.
  - `tests/unit/hero-variants.test.ts` (rename from `audience-variants.test.ts`): drop HERO_HEADLINE assertion; keep CONTACT_CTA + HERO_VARIANT.sub/cta/tint assertions.
  - `tests/unit/types.test.ts`: SECTION_IDS now has 9 members including `'certifications'`.
  - `tests/unit/sections.test.ts`: SECTION_ORDER rows are now length 9.
  - Delete `tests/unit/ParticleHero.test.tsx`.

- **E2E (Playwright):** existing E2E checks the hero contains "Saidheeraj Gantala". Add an assertion that the bio intro is one of the four role-specific intros.

## Open questions

None — Option A was fully specified.

## Risks

- **Reveal animation feels cheap.** Mitigation: 400ms opacity+translateY with the same easing used by the current `HeroFallback`; reuse the `[0.16, 1, 0.3, 1]` curve. No bouncing, no looping.
- **Accent span links feel like marketing badges.** Mitigation: keep them as plain text with `text-accent` color and underline-on-hover only. No background fills, no pill shapes.
- **Removing the particle field loses the only JS-heavy hero element.** Mitigation: that's the goal. The page now loads faster and is more accessible. The reveal animation is the only motion.
- **CTA row duplicates links.** Mitigation: the primary CTA is visually distinct (border-bottom + accent color); secondary links are muted and turn text-color on hover. Hierarchy preserved.
- **`Notes on agent reliability` has no real destination.** Mitigation: links to `#currently-building` for now; revisit when a `/notes` route exists.

## Spec self-review

- Placeholder scan: no TBDs.
- Internal consistency: hero data lives in `content/hero-bio.ts`; section data lives in `content/certifications.ts`; both are imported from components. TypeScript exhaustiveness enforced.
- Scope check: one design change + one content split + one types change + test updates. Focused.
- Ambiguity: none — all four role-specific bio lists are spelled out.

## Approval gate

Spec committed → user reviews → writing-plans skill invoked.
