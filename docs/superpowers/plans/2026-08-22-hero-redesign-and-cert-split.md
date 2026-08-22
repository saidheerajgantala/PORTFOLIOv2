# Hero Redesign (Brittany Spine) + Certifications Split — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the WebGL hero with a Brittany Chiang–style identity spine (static name + role + per-role bio paragraph + CTA row), and split Certifications out of Recognition into its own section.

**Architecture:** Server-component hero reads per-role bio copy from `content/hero-bio.ts`; a thin `'use client'` child (`HeroReveal`) applies a 400ms CSS-only reveal. No JS state for hero content, no greeting cycle, no typewriter, no particle field. Certifications is a new section slotted into each role's `SECTION_ORDER`.

**Tech Stack:** Next.js 15.5.23 (App Router, RSC), React 19, Tailwind v4, motion/react, Vitest + Testing Library, TypeScript strict.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `components/hero/Hero.tsx` | create | Server component. Renders identity + bio + CTA row. |
| `components/hero/HeroReveal.tsx` | create | Client component. 400ms reveal animation. |
| `components/hooks/useReducedMotion.ts` | create | React hook reading `prefers-reduced-motion`. |
| `content/hero-bio.ts` | create | Per-role `HERO_BIO` map. |
| `content/certifications.ts` | create | Static `CERTIFICATIONS` list. |
| `content/hero-variants.ts` | modify | Drop `HERO_GREETING_CYCLE`; keep `HERO_VARIANT` (sub/cta/tint). |
| `lib/types.ts` | modify | Add `'certifications'` to `SECTION_IDS`; add `CertificationMeta` interface. |
| `content/sections.ts` | modify | Add `'certifications'` to each `SECTION_ORDER`. |
| `components/sections/Recognition.tsx` | modify | Drop cert items; awards only. |
| `components/sections/Certifications.tsx` | create | New section component. |
| `components/RoleReshapedPage.tsx` | modify | Add `case 'certifications'`. |
| `app/page.tsx` | modify | Import `Hero` instead of `ParticleHero`; drop `HERO_VARIANT` import. |
| `components/hero/ParticleHero.tsx` | delete | Replaced by `Hero`. |
| `components/hero/HeroFallback.tsx` | delete | Replaced by `HeroReveal` (used inline). |
| `components/hero/ParticleField.tsx` | delete | No longer used. |
| `components/hero/particle-text.ts` | delete | No longer used. |
| `tests/unit/Hero.test.tsx` | create | Renders name, role line, per-role bio intro, CTA. |
| `tests/unit/Certifications.test.tsx` | create | Renders 5 certs, links Credly URLs for 2. |
| `tests/unit/hero-bio.test.ts` | create | Every role has 3+ spans; every href starts with `#` or `mailto:`. |
| `tests/unit/Recognition.test.tsx` | create (move from editorial-sections) | Renders awards only, no cert issuer strings. |
| `tests/unit/ParticleHero.test.tsx` | delete | Component is gone. |
| `tests/unit/editorial-sections.test.tsx` | modify | Remove Recognition block (moved). |
| `tests/unit/types.test.ts` | modify | SECTION_IDS now has 9 members including `'certifications'`. |
| `tests/unit/sections.test.ts` | modify | SECTION_ORDER rows are length 9. |

---

## Task 1: Add `useReducedMotion` hook + test

**Files:**
- Create: `components/hooks/useReducedMotion.ts`
- Test: `tests/unit/useReducedMotion.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';

describe('useReducedMotion', () => {
  it('returns false when prefers-reduced-motion is no-preference', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npx vitest run tests/unit/useReducedMotion.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the hook**

```ts
// components/hooks/useReducedMotion.ts
'use client';
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mql.matches);
    const onChange = () => setReduce(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return reduce;
}
```

- [ ] **Step 4: Run test, expect pass**

Run: `npx vitest run tests/unit/useReducedMotion.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/hooks/useReducedMotion.ts tests/unit/useReducedMotion.test.ts
git commit -m "feat(hero): add useReducedMotion hook"
```

---

## Task 2: Add `HERO_BIO` data + test

**Files:**
- Create: `content/hero-bio.ts`
- Test: `tests/unit/hero-bio.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/hero-bio.test.ts
import { describe, it, expect } from 'vitest';
import { HERO_BIO } from '@/content/hero-bio';
import { ROLES } from '@/lib/types';

describe('HERO_BIO', () => {
  it('has an entry for every role', () => {
    for (const role of ROLES) {
      expect(HERO_BIO[role]).toBeDefined();
      expect(HERO_BIO[role].intro.length).toBeGreaterThan(0);
    }
  });

  it('every role has 3+ spans', () => {
    for (const role of ROLES) {
      expect(HERO_BIO[role].spans.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('every span href is an in-page anchor or mailto', () => {
    for (const role of ROLES) {
      for (const span of HERO_BIO[role].spans) {
        expect(span.href.startsWith('#') || span.href.startsWith('mailto:')).toBe(true);
      }
    }
  });

  it('every span label is non-empty', () => {
    for (const role of ROLES) {
      for (const span of HERO_BIO[role].spans) {
        expect(span.label.length).toBeGreaterThan(0);
      }
    }
  });

  it('roles have distinct intro text', () => {
    const intros = new Set(ROLES.map((r) => HERO_BIO[r].intro));
    expect(intros.size).toBe(ROLES.length);
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npx vitest run tests/unit/hero-bio.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the data**

```ts
// content/hero-bio.ts
import type { Role } from '@/lib/types';

export interface BioSpan {
  label: string;
  href: string;
}

export interface HeroBio {
  intro: string;
  spans: BioSpan[];
  outro?: string;
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

- [ ] **Step 4: Run test, expect pass**

Run: `npx vitest run tests/unit/hero-bio.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add content/hero-bio.ts tests/unit/hero-bio.test.ts
git commit -m "feat(hero): add HERO_BIO role-specific bio spans"
```

---

## Task 3: Trim `hero-variants.ts` (drop greeting cycle)

**Files:**
- Modify: `content/hero-variants.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/hero-variants.test.ts (modify existing)
// Replace the file with:
import { describe, it, expect } from 'vitest';
import { HERO_VARIANT } from '@/content/hero-variants';
import { ROLES } from '@/lib/types';

describe('hero variants', () => {
  it('has a variant for every role', () => {
    for (const role of ROLES) {
      const v = HERO_VARIANT[role];
      expect(v.sub.length).toBeGreaterThan(0);
      expect(v.cta.length).toBeGreaterThan(0);
      expect(v.tint).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('does not export a greeting cycle (removed in redesign)', async () => {
    const mod = await import('@/content/hero-variants');
    expect((mod as Record<string, unknown>).HERO_GREETING_CYCLE).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npx vitest run tests/unit/hero-variants.test.ts`
Expected: FAIL — `HERO_GREETING_CYCLE` still exported.

- [ ] **Step 3: Drop `HERO_GREETING_CYCLE` from `hero-variants.ts`**

Remove the `HERO_GREETING_CYCLE` declaration and its export. Keep `HeroVariant` interface and `HERO_VARIANT` map.

- [ ] **Step 4: Run test, expect pass**

Run: `npx vitest run tests/unit/hero-variants.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add content/hero-variants.ts tests/unit/hero-variants.test.ts
git commit -m "refactor(hero): drop greeting cycle from hero-variants"
```

---

## Task 4: Add `CertificationMeta` type + `'certifications'` to `SECTION_IDS`

**Files:**
- Modify: `lib/types.ts`
- Modify: `tests/unit/types.test.ts`

- [ ] **Step 1: Write the failing test**

Update `tests/unit/types.test.ts`:

```ts
it('SectionId has 9 members', () => {
  expect(SECTION_IDS).toHaveLength(9);
  expect(SECTION_IDS).toEqual([
    'hero',
    'recognition',
    'currently-building',
    'career-arc',
    'ventures',
    'multi-cloud',
    'certifications',
    'principles',
    'contact',
  ]);
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npx vitest run tests/unit/types.test.ts`
Expected: FAIL — SECTION_IDS still has 8.

- [ ] **Step 3: Modify `lib/types.ts`**

Add `'certifications'` to `SECTION_IDS` (between `'multi-cloud'` and `'principles'`). Add the interface:

```ts
export interface CertificationMeta {
  slug: string;
  title: string;
  issuer: string;
  issued: string;     // ISO YYYY-MM
  href?: string;
}
```

- [ ] **Step 4: Run test, expect pass**

Run: `npx vitest run tests/unit/types.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts tests/unit/types.test.ts
git commit -m "feat(types): add certifications section id + CertificationMeta"
```

---

## Task 5: Add `CERTIFICATIONS` data + test

**Files:**
- Create: `content/certifications.ts`
- Test: `tests/unit/certifications-data.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/certifications-data.test.ts
import { describe, it, expect } from 'vitest';
import { CERTIFICATIONS } from '@/content/certifications';

describe('CERTIFICATIONS', () => {
  it('has 5 entries', () => {
    expect(CERTIFICATIONS).toHaveLength(5);
  });

  it('slugs are unique', () => {
    const slugs = CERTIFICATIONS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every entry has non-empty title, issuer, issued', () => {
    for (const c of CERTIFICATIONS) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.issuer.length).toBeGreaterThan(0);
      expect(c.issued).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it('Credly links point at credly.com', () => {
    for (const c of CERTIFICATIONS) {
      if (c.href) expect(c.href).toMatch(/^https:\/\/(www\.)?credly\.com\//);
    }
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npx vitest run tests/unit/certifications-data.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the data**

```ts
// content/certifications.ts
import type { CertificationMeta } from '@/lib/types';

export const CERTIFICATIONS: CertificationMeta[] = [
  {
    slug: 'aws-ml-associate',
    title: 'AWS Certified Machine Learning Engineer — Associate',
    issuer: 'Amazon Web Services',
    issued: '2025-01',
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
  },
];
```

- [ ] **Step 4: Run test, expect pass**

Run: `npx vitest run tests/unit/certifications-data.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add content/certifications.ts tests/unit/certifications-data.test.ts
git commit -m "feat(content): add certifications registry"
```

---

## Task 6: Slot `'certifications'` into each role's `SECTION_ORDER`

**Files:**
- Modify: `content/sections.ts`
- Modify: `tests/unit/sections.test.ts`

- [ ] **Step 1: Write the failing test**

Update `tests/unit/sections.test.ts` — change `toHaveLength(9)` and add a per-role slot check:

```ts
it('every role has 9 sections', () => {
  for (const order of Object.values(SECTION_ORDER)) {
    expect(order).toHaveLength(9);
  }
});

it('certifications is in every role order', () => {
  for (const order of Object.values(SECTION_ORDER)) {
    expect(order).toContain('certifications');
  }
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npx vitest run tests/unit/sections.test.ts`
Expected: FAIL — length is 8, `'certifications'` not in any order.

- [ ] **Step 3: Modify `content/sections.ts`**

Insert `'certifications'` into each `SECTION_ORDER` entry:

| Role | Position |
|---|---|
| recruiter | between `'recognition'` and `'currently-building'` |
| peer | between `'currently-building'` and `'multi-cloud'` |
| founder | between `'career-arc'` and `'multi-cloud'` |
| client | between `'multi-cloud'` and `'principles'` |

- [ ] **Step 4: Run test, expect pass**

Run: `npx vitest run tests/unit/sections.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content/sections.ts tests/unit/sections.test.ts
git commit -m "feat(sections): slot certifications into role orders"
```

---

## Task 7: Trim `Recognition.tsx` to awards only + test

**Files:**
- Modify: `components/sections/Recognition.tsx`
- Modify: `tests/unit/editorial-sections.test.tsx` (remove Recognition block)
- Create: `tests/unit/Recognition.test.tsx` (move it here)

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/Recognition.test.tsx
// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Recognition } from '@/components/sections/Recognition';

describe('Recognition', () => {
  it('renders heading', () => {
    render(<Recognition index={2} total={9} />);
    expect(screen.getByRole('heading', { name: /^recognition$/i })).toBeInTheDocument();
  });

  it('lists all 3 awards', () => {
    render(<Recognition index={2} total={9} />);
    expect(screen.getByText(/GEM Award/i)).toBeInTheDocument();
    expect(screen.getByText(/Hall of Fame/i)).toBeInTheDocument();
    expect(screen.getByText(/Cipher Combat/i)).toBeInTheDocument();
  });

  it('does not list any certification issuer', () => {
    const { container } = render(<Recognition index={2} total={9} />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/Amazon Web Services/);
    expect(text).not.toMatch(/Cisco/);
    expect(text).not.toMatch(/Google/);
    expect(text).not.toMatch(/Infosys/);
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npx vitest run tests/unit/Recognition.test.tsx`
Expected: FAIL — Cisco/Google/Infosys issuers still present in Recognition.

- [ ] **Step 3: Trim `Recognition.tsx`**

Remove the 5 `kind: 'cert'` items from the `ITEMS` array. Keep the 3 `kind: 'award'` items.

- [ ] **Step 4: Run test, expect pass**

Run: `npx vitest run tests/unit/Recognition.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Remove Recognition block from `editorial-sections.test.tsx`**

Edit `tests/unit/editorial-sections.test.tsx` to remove the `describe('Recognition', ...)` block. Remove `Recognition` from imports.

- [ ] **Step 6: Run editorial-sections test**

Run: `npx vitest run tests/unit/editorial-sections.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/sections/Recognition.tsx tests/unit/Recognition.test.tsx tests/unit/editorial-sections.test.tsx
git commit -m "refactor(recognition): split certs out, keep awards only"
```

---

## Task 8: Create `Certifications.tsx` section + test

**Files:**
- Create: `components/sections/Certifications.tsx`
- Test: `tests/unit/Certifications.test.tsx`
- Modify: `components/RoleReshapedPage.tsx`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/Certifications.test.tsx
// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Certifications } from '@/components/sections/Certifications';

describe('Certifications', () => {
  it('renders heading', () => {
    render(<Certifications index={7} total={9} />);
    expect(screen.getByRole('heading', { name: /^certifications$/i })).toBeInTheDocument();
  });

  it('renders all 5 certs', () => {
    render(<Certifications index={7} total={9} />);
    expect(screen.getByText(/AWS Certified Machine Learning/i)).toBeInTheDocument();
    expect(screen.getByText(/AWS Certified DevOps Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Ethical Hacker/i)).toBeInTheDocument();
    expect(screen.getByText(/Google Professional Cloud Architect/i)).toBeInTheDocument();
    expect(screen.getByText(/Infosys Certified Software Programmer/i)).toBeInTheDocument();
  });

  it('links Credly URLs for aws-devops-pro and gcp-architect', () => {
    const { container } = render(<Certifications index={7} total={9} />);
    const credlyLinks = Array.from(container.querySelectorAll('a'))
      .filter((a) => (a.getAttribute('href') ?? '').includes('credly.com'));
    expect(credlyLinks).toHaveLength(2);
  });

  it('does not link non-Credly certs', () => {
    const { container } = render(<Certifications index={7} total={9} />);
    const text = container.textContent ?? '';
    expect(text).toContain('Ethical Hacker');
    const ethicalHackerH3 = Array.from(container.querySelectorAll('h3'))
      .find((h) => h.textContent?.includes('Ethical Hacker'));
    expect(ethicalHackerH3?.querySelector('a')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npx vitest run tests/unit/Certifications.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `Certifications.tsx`**

```tsx
// components/sections/Certifications.tsx
import { SectionNumber } from '@/components/layout/SectionNumber';
import { CERTIFICATIONS } from '@/content/certifications';

export function Certifications({ index, total }: { index: number; total: number }) {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="mx-auto w-full max-w-3xl px-6 py-24"
    >
      <SectionNumber index={index} total={total} className="block" />
      <h2 id="certifications-heading" className="mt-4 font-display text-4xl text-text">
        Certifications
      </h2>
      <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {CERTIFICATIONS.map((c) => (
          <li key={c.slug} className="border border-border p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {c.issuer} · {c.issued}
            </p>
            <h3 className="mt-3 font-display text-lg text-text">
              {c.href ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  {c.title}
                </a>
              ) : (
                c.title
              )}
            </h3>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Wire `certifications` into `RoleReshapedPage`**

Add to imports:
```ts
import { Certifications } from '@/components/sections/Certifications';
```

Add case:
```ts
case 'certifications': return <Certifications index={index} total={total} />;
```

- [ ] **Step 5: Run test, expect pass**

Run: `npx vitest run tests/unit/Certifications.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add components/sections/Certifications.tsx components/RoleReshapedPage.tsx tests/unit/Certifications.test.tsx
git commit -m "feat(sections): add Certifications section"
```

---

## Task 9: Create `Hero.tsx` server component + test

**Files:**
- Create: `components/hero/Hero.tsx`
- Create: `components/hero/HeroReveal.tsx`
- Test: `tests/unit/Hero.test.tsx`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/Hero.test.tsx
// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/hero/Hero';
import { ROLES } from '@/lib/types';
import type { Role } from '@/lib/types';

const GREETING_WORDS = ['Hello.', 'Hi.', 'Hey.', 'Namaste.', 'Howdy.'];

describe('Hero', () => {
  it('renders the static name', () => {
    render(<Hero role="recruiter" />);
    expect(screen.getByRole('heading', { level: 1, name: /saidheeraj gantala/i })).toBeInTheDocument();
  });

  it('renders the static role line', () => {
    render(<Hero role="recruiter" />);
    expect(screen.getByRole('heading', { level: 2, name: /backend engineer.*agent platforms.*bengaluru/i })).toBeInTheDocument();
  });

  it('renders the role-specific bio intro', () => {
    const { rerender } = render(<Hero role="recruiter" />);
    expect(screen.getByText(/Backend engineer at/i)).toBeInTheDocument();
    rerender(<Hero role="peer" />);
    expect(screen.getByText(/Building agent platforms with/i)).toBeInTheDocument();
    rerender(<Hero role="founder" />);
    expect(screen.getByText(/Shipped:/i)).toBeInTheDocument();
    rerender(<Hero role="client" />);
    expect(screen.getByText(/AWS · Azure platforms that deliver/i)).toBeInTheDocument();
  });

  it.each(ROLES)('renders at least one bio accent span for %s', (role: Role) => {
    const { container } = render(<Hero role={role} />);
    const accents = Array.from(container.querySelectorAll('a.text-accent'));
    expect(accents.length).toBeGreaterThan(0);
  });

  it('renders the primary CTA link to #contact', () => {
    const { container } = render(<Hero role="founder" />);
    const cta = container.querySelector('a[href="#contact"]');
    expect(cta).toBeTruthy();
    expect(cta?.textContent).toMatch(/shipping/i);
  });

  it('does not render any greeting words', () => {
    const { container } = render(<Hero role="recruiter" />);
    const text = container.textContent ?? '';
    for (const word of GREETING_WORDS) {
      expect(text).not.toContain(word);
    }
  });

  it('renders three secondary links (mailto, EPAM anchor, notes anchor)', () => {
    const { container } = render(<Hero role="recruiter" />);
    const mailto = container.querySelector('a[href^="mailto:"]');
    const epam = container.querySelector('a[href="#career-arc"]');
    const notes = container.querySelector('a[href="#currently-building"]');
    expect(mailto).toBeTruthy();
    expect(epam).toBeTruthy();
    expect(notes).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npx vitest run tests/unit/Hero.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `HeroReveal.tsx`**

```tsx
// components/hero/HeroReveal.tsx
'use client';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import type { ReactNode } from 'react';

export function HeroReveal({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Implement `Hero.tsx`**

```tsx
// components/hero/Hero.tsx
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
        <div className="w-full max-w-5xl mx-auto">
          <h1
            className="font-display font-bold leading-none tracking-[-0.04em] text-text"
            style={{ fontSize: 'clamp(48px, 10vw, 128px)' }}
          >
            Saidheeraj Gantala
          </h1>
          <h2 className="mt-4 font-mono text-sm uppercase tracking-[0.3em] text-muted">
            Backend Engineer · Agent Platforms · Bengaluru
          </h2>

          <p
            className="mt-12 max-w-3xl text-text"
            style={{ fontSize: 'clamp(18px, 1.6vw, 22px)' }}
          >
            {bio.intro}{' '}
            {bio.spans.map((s, i) => (
              <span key={s.label}>
                {i > 0 && <span className="mx-2 text-muted">·</span>}
                <a href={s.href} className="text-accent hover:underline">
                  {s.label}
                </a>
              </span>
            ))}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-sm uppercase tracking-[0.2em]">
            <a
              href="#contact"
              className="text-text border-b-2 border-accent pb-1 hover:opacity-80"
            >
              {variant.cta}
            </a>
            <a
              href="mailto:gantala.saidheeraj@gmail.com"
              className="text-muted hover:text-text"
            >
              Available for platform engagements →
            </a>
            <a href="#career-arc" className="text-muted hover:text-text">
              Currently @ EPAM
            </a>
            <a href="#currently-building" className="text-muted hover:text-text">
              Notes on agent reliability
            </a>
          </div>
        </div>
      </HeroReveal>
    </section>
  );
}
```

- [ ] **Step 5: Run test, expect pass**

Run: `npx vitest run tests/unit/Hero.test.tsx`
Expected: PASS (7 tests for the parameterized run = 11 effective test cases).

- [ ] **Step 6: Commit**

```bash
git add components/hero/Hero.tsx components/hero/HeroReveal.tsx tests/unit/Hero.test.tsx
git commit -m "feat(hero): Brittany-spine hero with per-role bio spans"
```

---

## Task 10: Swap `app/page.tsx` to use `Hero`

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Modify `app/page.tsx`**

Replace:
```ts
import { ParticleHero } from '@/components/hero/ParticleHero';
import { HERO_VARIANT } from '@/content/hero-variants';
```

With:
```ts
import { Hero } from '@/components/hero/Hero';
```

Replace:
```tsx
<ParticleHero role={role} variant={HERO_VARIANT[role]} />
```

With:
```tsx
<Hero role={role} />
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean (the deleted `ParticleHero.tsx` is no longer referenced).

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "refactor(page): use new Hero component"
```

---

## Task 11: Delete old hero files + tests

**Files:**
- Delete: `components/hero/ParticleHero.tsx`
- Delete: `components/hero/HeroFallback.tsx`
- Delete: `components/hero/ParticleField.tsx`
- Delete: `components/hero/particle-text.ts`
- Delete: `tests/unit/ParticleHero.test.tsx`

- [ ] **Step 1: Delete files**

```bash
rm components/hero/ParticleHero.tsx \
   components/hero/HeroFallback.tsx \
   components/hero/ParticleField.tsx \
   components/hero/particle-text.ts \
   tests/unit/ParticleHero.test.tsx
```

- [ ] **Step 2: Type-check + tests**

Run: `npx tsc --noEmit && npx vitest run`
Expected: clean (no leftover imports).

- [ ] **Step 3: Commit**

```bash
git add -u
git commit -m "chore(hero): remove old particle hero files"
```

---

## Task 12: Verify with build + dev server + Playwright

**Files:** none (verification only)

- [ ] **Step 1: Full test run**

Run: `npx vitest run`
Expected: all tests pass (target: ~95 tests across ~28 files).

- [ ] **Step 2: Production build**

Run: `npx next build`
Expected: build succeeds, 8+ static pages generated, `/work/agent-platform` still present.

- [ ] **Step 3: Dev server smoke test**

Run: `PORT=3030 npm run dev` (background).
Then check:
- `curl -s http://localhost:3030/?whoami=recruiter | grep -c "Saidheeraj Gantala"` → 1+
- `curl -s http://localhost:3030/?whoami=peer | grep -c "LangGraph"` → 1+
- `curl -s http://localhost:3030/?whoami=founder | grep -c "Hiiired"` → 1+
- `curl -s http://localhost:3030/?whoami=client | grep -c "70% fraud cut"` → 1+

- [ ] **Step 4: Playwright E2E**

Run: `npx playwright test`
Expected: existing E2E checks for "Saidheeraj Gantala" still pass.

- [ ] **Step 5: Commit (if any fixes)**

If anything was tweaked in Steps 1–4, commit it. Otherwise proceed.

```bash
git status
git add -u
git commit -m "chore(hero): post-build cleanup" || echo "nothing to commit"
```

---

## Task 13: Push to main

- [ ] **Step 1: Push**

```bash
git push origin main
```

- [ ] **Step 2: Confirm Vercel auto-deploy**

Wait ~60s, then check Vercel dashboard for the deployment.

---

## Self-review

1. **Spec coverage:**
   - Brittany spine identity (Task 9) ✓
   - Per-role bio spans (Tasks 2 + 9) ✓
   - CTA row with primary + 3 secondary (Task 9) ✓
   - HeroReveal 400ms reveal (Task 9) ✓
   - Drop WebGL particle field (Task 11) ✓
   - Drop greeting cycle (Task 3) ✓
   - Drop typewriter / scanning beam / floating dots (Task 11 deletes those files) ✓
   - Certifications section (Tasks 5 + 8) ✓
   - Recognition awards only (Task 7) ✓
   - SECTION_IDS + SECTION_ORDER updated (Tasks 4 + 6) ✓
   - Tests updated (Tasks 1, 2, 3, 4, 5, 6, 7, 8, 9) ✓

2. **Placeholder scan:** none.

3. **Type consistency:**
   - `HERO_BIO[role]` always defined — exhaustiveness enforced.
   - `BioSpan.href` always starts with `#` or `mailto:` — tested.
   - `CertificationMeta.href` optional — tested.
   - `'certifications'` slotted into every role order — tested.
   - `Hero` signature `(props: { role: Role })` — single prop, simpler than old `ParticleHero`.

## Execution Handoff

Plan complete. 13 tasks. Recommend subagent-driven execution (mechanical, isolated changes per task). Say "go" and I'll dispatch implementer subagents.
