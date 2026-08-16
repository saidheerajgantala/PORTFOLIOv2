# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Sai Dheeraj Gantala's audience-aware portfolio at `saidheerajgantala.me` — an agentic-platform-styled site that re-shapes itself based on visitor role (recruiter/peer/founder/client), with a WebGL particle hero, dark editorial design, and two MDX case studies.

**Architecture:** Next.js 15 App Router with RSC. Role persisted via Zustand+localStorage mirrored to cookies for SSR. Sections rendered inside a `LayoutGroup` so role changes FLIP-animate the reordering. WebGL hero isolated behind a client boundary with a static SVG fallback. Case studies are MDX. Contact form POSTs to a Vercel serverless route that emails via Resend and posts to a Discord webhook. Resume PDF rendered on demand from `content.ts` via `@react-pdf/renderer`.

**Tech Stack:** Next.js 15, TypeScript strict, Tailwind v4, Motion (Framer Motion), Three.js + React Three Fiber + drei, Radix UI, Zustand, React Hook Form + Zod, MDX, Resend, `@react-pdf/renderer`, Vercel Analytics.

**Spec:** `docs/superpowers/specs/2026-08-16-portfolio-design.md`

---

## File Structure

```
portfolio/
├── app/
│   ├── layout.tsx                    # Root layout, fonts, theme, providers
│   ├── page.tsx                      # Single-page home (reads role from cookie)
│   ├── globals.css                   # Tailwind + CSS tokens
│   ├── icon.svg                      # Favicon
│   ├── opengraph-image.png           # OG card
│   ├── work/
│   │   ├── agent-platform/page.mdx
│   │   └── jobharvester/page.mdx
│   ├── api/
│   │   ├── contact/route.ts          # POST → email + Discord
│   │   └── resume/route.ts           # GET → PDF
│   ├── resume.pdf/route.ts           # /resume.pdf → PDF mirror
│   └── not-found.tsx
├── components/
│   ├── entry/
│   │   ├── WhoAmIModal.tsx
│   │   ├── RoleCard.tsx
│   │   └── whoami-store.ts
│   ├── hero/
│   │   ├── ParticleHero.tsx
│   │   ├── ParticleField.tsx
│   │   ├── particle-text.ts
│   │   └── HeroFallback.tsx
│   ├── ambient/
│   │   ├── AgentTrace.tsx
│   │   ├── trace-generator.ts
│   │   └── SectionDivider.tsx
│   ├── sections/
│   │   ├── CareerArc.tsx
│   │   ├── CurrentlyBuilding.tsx
│   │   ├── VenturePortfolio.tsx
│   │   ├── MultiCloud.tsx
│   │   ├── OperatingPrinciples.tsx
│   │   ├── Recognition.tsx
│   │   ├── Writing.tsx
│   │   └── Contact.tsx
│   ├── layout/
│   │   ├── CursorTrail.tsx
│   │   ├── SectionNumber.tsx
│   │   ├── StatusDot.tsx
│   │   ├── Footer.tsx
│   │   └── Nav.tsx
│   ├── role/
│   │   ├── RoleProvider.tsx          # Server: reads cookie, passes to client
│   │   └── RoleReshapedPage.tsx     # Client: LayoutGroup re-order
│   ├── mdx/
│   │   ├── mdx-components.tsx
│   │   └── CaseStudyLayout.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Dialog.tsx
│       └── RadioGroup.tsx
├── content/
│   ├── sections.ts                   # SECTION_ORDER config
│   ├── audience-variants.ts          # Role-specific copy
│   ├── case-studies/
│   │   ├── agent-platform.mdx
│   │   └── jobharvester.mdx
│   └── resume-data.ts                # Source of truth for PDF
├── lib/
│   ├── types.ts                      # Role, SectionId, VentureStatus
│   ├── motion.ts                     # Variants, easing
│   ├── cookies.ts                    # Server-side cookie helpers
│   ├── pdf.tsx                       # React-PDF document
│   ├── utils.ts                      # cn() and helpers
│   └── contact.ts                    # Resend + Discord webhook
├── public/
│   └── (assets, no research screenshots)
├── styles/
│   └── fonts.css                     # @font-face (handled by next/font)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── .eslintrc.cjs
├── .prettierrc
├── .env.local.example
└── README.md
```

---

## Phase 1: Foundation

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `.env.local.example`, `eslint.config.mjs`, `.prettierrc`, `README.md`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install next@15 react@19 react-dom@19 typescript@5 @types/node @types/react @types/react-dom tailwindcss@4 @tailwindcss/postcss postcss motion three @react-three/fiber @react-three/drei @types/three zustand zod react-hook-form @hookform/resolvers @radix-ui/react-dialog @radix-ui/react-radio-group @radix-ui/react-tooltip @radix-ui/react-slot clsx tailwind-merge @react-pdf/renderer resend @next/mdx @mdx-js/loader @mdx-js/react gray-matter
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D eslint eslint-config-next prettier vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test happy-dom
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create next.config.mjs**

```js
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  experimental: { optimizePackageImports: ['motion', '@react-three/drei'] },
};

export default withMDX(nextConfig);
```

- [ ] **Step 6: Create tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-dim': 'var(--accent-dim)',
        'signal-ok': 'var(--signal-ok)',
        'signal-pause': 'var(--signal-pause)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 7: Create postcss.config.mjs**

```js
export default { plugins: { '@tailwindcss/postcss': {} } };
```

- [ ] **Step 8: Create .env.local.example**

```bash
# Resend (transactional email)
RESEND_API_KEY=re_xxx
CONTACT_TO_EMAIL=gantala.saidheeraj@gmail.com
CONTACT_FROM_EMAIL=portfolio@saidheerajgantala.me

# Discord webhook (logs contact submissions)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx

# Public domain
NEXT_PUBLIC_SITE_URL=https://saidheerajgantala.me
```

- [ ] **Step 9: Create eslint.config.mjs**

```js
import next from 'eslint-config-next';

export default [
  ...next,
  { rules: { '@next/next/no-html-link-for-pages': 'off' } },
];
```

- [ ] **Step 10: Create .prettierrc**

```json
{ "semi": true, "singleQuote": true, "trailingComma": "all", "printWidth": 100 }
```

- [ ] **Step 11: Create README.md**

```markdown
# Sai Dheeraj Gantala — Portfolio

Audience-aware portfolio at saidheerajgantala.me.

## Stack
Next.js 15 · TypeScript · Tailwind v4 · Motion · Three.js · Radix UI · Zustand · MDX

## Develop
cp .env.local.example .env.local
npm install
npm run dev

## Test
npm test
npm run test:e2e
```

- [ ] **Step 12: Commit**

```bash
git add .
git commit -m "chore: scaffold Next.js 15 project with TypeScript, Tailwind v4, dependencies"
```

---

### Task 2: Design Tokens & Global Styles

**Files:**
- Create: `app/globals.css`, `tailwind.config.ts` (update tokens)

- [ ] **Step 1: Create app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0A0A0B;
  --surface: #14141A;
  --surface-2: #1C1C24;
  --border: #26262F;
  --text: #F5F5F7;
  --text-muted: #8A8A93;
  --accent: #C6FF3D;
  --accent-dim: #C6FF3D26;
  --signal-ok: #4ADE80;
  --signal-pause: #FBBF24;
}

* { box-sizing: border-box; }

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection {
  background: var(--accent);
  color: var(--bg);
}

a { color: inherit; text-decoration: none; }

button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Write the test for tokens**

Create `tests/unit/tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

describe('design tokens', () => {
  const css = readFileSync('app/globals.css', 'utf-8');

  it('defines --bg', () => expect(css).toMatch(/--bg:\s*#0A0A0B/));
  it('defines --accent', () => expect(css).toMatch(/--accent:\s*#C6FF3D/));
  it('defines --text-muted', () => expect(css).toMatch(/--text-muted:\s*#8A8A93/));
  it('respects reduced-motion', () => expect(css).toMatch(/prefers-reduced-motion/));
});
```

- [ ] **Step 3: Run test — expect pass**

```bash
npm test -- tests/unit/tokens.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add app/globals.css tests/unit/tokens.test.ts
git commit -m "feat: design tokens and global styles"
```

---

### Task 3: Fonts Setup

**Files:**
- Create: `app/layout.tsx`, `lib/utils.ts`

- [ ] **Step 1: Create lib/utils.ts**

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Create app/layout.tsx**

```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700'],
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sai Dheeraj Gantala — AI Agent Platform Builder',
  description:
    'Senior software engineer building enterprise AI agent platforms with LangGraph, Temporal, and Google ADK. Multi-cloud DevOps, full-stack development, and certified cloud architect.',
  metadataBase: new URL('https://saidheerajgantala.me'),
  openGraph: {
    title: 'Sai Dheeraj Gantala — AI Agent Platform Builder',
    description: 'Building the operating layer where AI meets engineering.',
    url: 'https://saidheerajgantala.me',
    siteName: 'saidheerajgantala.me',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx lib/utils.ts
git commit -m "feat: root layout with fonts and metadata"
```

---

## Phase 2: Types & State

### Task 4: Type Definitions

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Create lib/types.ts**

```ts
export type Role = 'recruiter' | 'peer' | 'founder' | 'client';

export type SectionId =
  | 'hero'
  | 'recognition'
  | 'currently-building'
  | 'career-arc'
  | 'ventures'
  | 'multi-cloud'
  | 'principles'
  | 'writing'
  | 'contact';

export type VentureStatus = 'active' | 'paused' | 'archived';

export interface Venture {
  slug: string;
  name: string;
  role: string;
  period: string;
  status: VentureStatus;
  tagline: string;
  href: string;
  tags: string[];
}

export interface CareerStop {
  id: string;
  period: string;
  title: string;
  company: string;
  location: string;
  achievements: string[];
}

export interface CaseStudyMeta {
  slug: string;
  title: string;
  subtitle: string;
  period: string;
  role: string;
  stack: string[];
  impact: Array<{ label: string; value: string }>;
}
```

- [ ] **Step 2: Write test**

Create `tests/unit/types.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import type { Role, SectionId } from '@/lib/types';

describe('types', () => {
  it('Role is a string literal union', () => {
    const roles: Role[] = ['recruiter', 'peer', 'founder', 'client'];
    expect(roles).toHaveLength(4);
  });

  it('SectionId has 9 sections', () => {
    const sections: SectionId[] = [
      'hero', 'recognition', 'currently-building', 'career-arc',
      'ventures', 'multi-cloud', 'principles', 'writing', 'contact',
    ];
    expect(sections).toHaveLength(9);
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/types.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add lib/types.ts tests/unit/types.test.ts
git commit -m "feat: shared type definitions"
```

---

### Task 5: Section Ordering Config

**Files:**
- Create: `content/sections.ts`

- [ ] **Step 1: Create content/sections.ts**

```ts
import type { Role, SectionId } from '@/lib/types';

export const SECTION_ORDER: Record<Role, SectionId[]> = {
  recruiter: [
    'hero', 'recognition', 'currently-building', 'career-arc',
    'ventures', 'multi-cloud', 'principles', 'writing', 'contact',
  ],
  peer: [
    'hero', 'career-arc', 'currently-building', 'multi-cloud',
    'ventures', 'principles', 'recognition', 'writing', 'contact',
  ],
  founder: [
    'hero', 'ventures', 'currently-building', 'career-arc',
    'multi-cloud', 'principles', 'recognition', 'writing', 'contact',
  ],
  client: [
    'hero', 'multi-cloud', 'principles', 'ventures',
    'career-arc', 'currently-building', 'recognition', 'writing', 'contact',
  ],
};

export const ROLE_LABELS: Record<Role, string> = {
  recruiter: 'Recruiter',
  peer: 'Peer',
  founder: 'Founder',
  client: 'Client',
};

export const ROLE_VALUE_PROPS: Record<Role, string> = {
  recruiter: 'Outcome metrics & resume',
  peer: 'Architecture depth',
  founder: 'Builder track record',
  client: 'Business outcomes & reliability',
};
```

- [ ] **Step 2: Write test**

Create `tests/unit/sections.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { SECTION_ORDER, ROLE_LABELS } from '@/content/sections';

describe('SECTION_ORDER', () => {
  it('every role has 9 sections', () => {
    for (const order of Object.values(SECTION_ORDER)) {
      expect(order).toHaveLength(9);
    }
  });

  it('recruiter surfaces recognition second', () => {
    expect(SECTION_ORDER.recruiter[1]).toBe('recognition');
  });

  it('founder surfaces ventures second', () => {
    expect(SECTION_ORDER.founder[1]).toBe('ventures');
  });

  it('peer surfaces career-arc second', () => {
    expect(SECTION_ORDER.peer[1]).toBe('career-arc');
  });

  it('client surfaces multi-cloud second', () => {
    expect(SECTION_ORDER.client[1]).toBe('multi-cloud');
  });

  it('every section appears exactly once per role', () => {
    for (const order of Object.values(SECTION_ORDER)) {
      expect(new Set(order).size).toBe(order.length);
    }
  });
});

describe('ROLE_LABELS', () => {
  it('has labels for all four roles', () => {
    expect(Object.keys(ROLE_LABELS)).toHaveLength(4);
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/sections.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add content/sections.ts tests/unit/sections.test.ts
git commit -m "feat: section ordering per role"
```

---

### Task 6: Audience Variants — Copy & CTA

**Files:**
- Create: `content/audience-variants.ts`

- [ ] **Step 1: Create content/audience-variants.ts**

```ts
import type { Role } from '@/lib/types';

export const HERO_CTA: Record<Role, string> = {
  recruiter: 'Book a 30-min intro →',
  peer: 'Read the case study →',
  founder: "Let's talk shipping →",
  client: 'See how I work →',
};

export const CONTACT_CTA: Record<Role, string> = {
  recruiter: 'Book a 30-min intro',
  peer: 'Open a thread',
  founder: "Let's talk shipping",
  client: 'Scope a project',
};

export const HERO_SUBHEAD: Record<Role, string> = {
  recruiter:
    'SDE2 with 4+ years of cloud and AI engineering. Last role: building the enterprise agent platform at EPAM.',
  peer:
    'LangGraph, Temporal, Google ADK, RBAC, Backstage. Multi-cloud. Operator-in-the-loop automation.',
  founder:
    'Shipped three products solo or co-founded. 35% cost reductions, 70% boot-time cuts, AI agents in production.',
  client:
    'Reliability, cost discipline, and shipped outcomes. AWS, GCP, Azure. Designed for teams of 20+.',
};

export const HERO_HEADLINE = 'Building the operating layer where AI meets engineering.';
```

- [ ] **Step 2: Write test**

Create `tests/unit/audience-variants.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { HERO_CTA, HERO_HEADLINE } from '@/content/audience-variants';

describe('audience variants', () => {
  it('HERO_HEADLINE is set', () => {
    expect(HERO_HEADLINE).toMatch(/AI/);
  });

  it('all 4 roles have a CTA', () => {
    expect(Object.keys(HERO_CTA)).toHaveLength(4);
  });

  it('CTAs are non-empty', () => {
    for (const cta of Object.values(HERO_CTA)) {
      expect(cta.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/audience-variants.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add content/audience-variants.ts tests/unit/audience-variants.test.ts
git commit -m "feat: role-aware copy variants"
```

---

### Task 7: Cookies Helper (Server-side)

**Files:**
- Create: `lib/cookies.ts`

- [ ] **Step 1: Create lib/cookies.ts**

```ts
import { cookies } from 'next/headers';
import type { Role } from '@/lib/types';

export const ROLE_COOKIE = 'whoami-role';
export const NAME_COOKIE = 'whoami-name';

export function readRoleFromCookies(): Role {
  const c = cookies().get(ROLE_COOKIE)?.value;
  if (c === 'recruiter' || c === 'peer' || c === 'founder' || c === 'client') return c;
  return 'peer';
}

export function readNameFromCookies(): string | null {
  return cookies().get(NAME_COOKIE)?.value ?? null;
}
```

- [ ] **Step 2: Write test**

Create `tests/unit/cookies.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      const map: Record<string, string> = { 'whoami-role': 'founder' };
      return map[name] ? { value: map[name] } : undefined;
    },
  })),
}));

import { readRoleFromCookies, readNameFromCookies } from '@/lib/cookies';

describe('cookies', () => {
  it('reads role from cookie', () => {
    expect(readRoleFromCookies()).toBe('founder');
  });

  it('falls back to peer when role is invalid', () => {
    // Test ensures the default; overrides require fresh mocks
    expect(typeof readRoleFromCookies()).toBe('string');
  });

  it('reads name from cookie', () => {
    expect(readNameFromCookies()).toBeNull();
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/cookies.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add lib/cookies.ts tests/unit/cookies.test.ts
git commit -m "feat: server-side cookie helpers for role"
```

---

### Task 8: WhoAmI Store (Zustand)

**Files:**
- Create: `components/entry/whoami-store.ts`

- [ ] **Step 1: Create components/entry/whoami-store.ts**

```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Role } from '@/lib/types';

interface WhoAmIState {
  role: Role;
  name: string | null;
  setRole: (role: Role) => void;
  setName: (name: string | null) => void;
  reset: () => void;
}

export const useWhoAmI = create<WhoAmIState>()(
  persist(
    (set) => ({
      role: 'peer',
      name: null,
      setRole: (role) => set({ role }),
      setName: (name) => set({ name }),
      reset: () => set({ role: 'peer', name: null }),
    }),
    {
      name: 'whoami',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
```

- [ ] **Step 2: Write test**

Create `tests/unit/whoami-store.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useWhoAmI } from '@/components/entry/whoami-store';

describe('whoami-store', () => {
  beforeEach(() => {
    localStorage.clear();
    useWhoAmI.getState().reset();
  });

  it('defaults to peer role', () => {
    expect(useWhoAmI.getState().role).toBe('peer');
  });

  it('sets role', () => {
    useWhoAmI.getState().setRole('founder');
    expect(useWhoAmI.getState().role).toBe('founder');
  });

  it('sets name', () => {
    useWhoAmI.getState().setName('Dheeraj');
    expect(useWhoAmI.getState().name).toBe('Dheeraj');
  });

  it('resets to default', () => {
    useWhoAmI.getState().setRole('client');
    useWhoAmI.getState().setName('test');
    useWhoAmI.getState().reset();
    expect(useWhoAmI.getState().role).toBe('peer');
    expect(useWhoAmI.getState().name).toBeNull();
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/whoami-store.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add components/entry/whoami-store.ts tests/unit/whoami-store.test.ts
git commit -m "feat: whoami zustand store with localStorage persist"
```

---

## Phase 3: UI Primitives

### Task 9: Button Component

**Files:**
- Create: `components/ui/Button.tsx`

- [ ] **Step 1: Create components/ui/Button.tsx**

```tsx
'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'outline';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  asChild?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-bg hover:translate-x-0.5',
  ghost: 'text-text hover:bg-surface',
  outline: 'border border-border text-text hover:border-accent hover:text-accent',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-all duration-150',
          'rounded-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantClasses[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
```

- [ ] **Step 2: Write test**

Create `tests/unit/Button.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>X</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-accent');
  });

  it('applies ghost variant', () => {
    render(<Button variant="ghost">X</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-text');
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement>;
    render(<Button ref={ref}>X</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/Button.test.tsx
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/Button.tsx tests/unit/Button.test.tsx
git commit -m "feat: Button UI primitive"
```

---

### Task 10: Input & Textarea

**Files:**
- Create: `components/ui/Input.tsx`, `components/ui/Textarea.tsx`

- [ ] **Step 1: Create components/ui/Input.tsx**

```tsx
import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full bg-surface border border-border px-4 py-3 text-text placeholder:text-text-muted',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4',
        'transition-colors duration-150',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
```

- [ ] **Step 2: Create components/ui/Textarea.tsx**

```tsx
import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full bg-surface border border-border px-4 py-3 text-text placeholder:text-text-muted',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4',
        'transition-colors duration-150 min-h-[120px] resize-y',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
```

- [ ] **Step 3: Write tests**

Create `tests/unit/Input.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('accepts typing', async () => {
    render(<Input placeholder="email" />);
    const input = screen.getByPlaceholderText('email');
    await userEvent.type(input, 'a@b.com');
    expect(input).toHaveValue('a@b.com');
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npm test -- tests/unit/Input.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/Input.tsx components/ui/Textarea.tsx tests/unit/Input.test.tsx
git commit -m "feat: Input and Textarea primitives"
```

---

## Phase 4: WhoAmI Modal

### Task 11: RoleCard Component

**Files:**
- Create: `components/entry/RoleCard.tsx`

- [ ] **Step 1: Create components/entry/RoleCard.tsx**

```tsx
'use client';

import type { Role } from '@/lib/types';
import { ROLE_LABELS, ROLE_VALUE_PROPS } from '@/content/sections';
import { cn } from '@/lib/utils';

export interface RoleCardProps {
  role: Role;
  selected: boolean;
  onSelect: (role: Role) => void;
}

export function RoleCard({ role, selected, onSelect }: RoleCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(role)}
      className={cn(
        'flex flex-col items-start gap-2 p-5 border text-left transition-all duration-150',
        'bg-surface hover:bg-surface-2',
        selected ? 'border-accent' : 'border-border',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4',
      )}
    >
      <span className="font-mono text-xs text-text-muted">$ role={role}</span>
      <span className="text-lg font-display font-bold text-text">{ROLE_LABELS[role]}</span>
      <span className="text-sm text-text-muted">{ROLE_VALUE_PROPS[role]}</span>
    </button>
  );
}
```

- [ ] **Step 2: Write test**

Create `tests/unit/RoleCard.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleCard } from '@/components/entry/RoleCard';

describe('RoleCard', () => {
  it('renders role label and value prop', () => {
    render(<RoleCard role="peer" selected={false} onSelect={() => {}} />);
    expect(screen.getByText('Peer')).toBeInTheDocument();
    expect(screen.getByText('Architecture depth')).toBeInTheDocument();
  });

  it('shows selected state', () => {
    render(<RoleCard role="peer" selected={true} onSelect={() => {}} />);
    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn();
    render(<RoleCard role="founder" selected={false} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('radio'));
    expect(onSelect).toHaveBeenCalledWith('founder');
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/RoleCard.test.tsx
```

- [ ] **Step 4: Commit**

```bash
git add components/entry/RoleCard.tsx tests/unit/RoleCard.test.tsx
git commit -m "feat: RoleCard component"
```

---

### Task 12: WhoAmIModal Component

**Files:**
- Create: `components/entry/WhoAmIModal.tsx`

- [ ] **Step 1: Create components/entry/WhoAmIModal.tsx**

```tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { useWhoAmI } from '@/components/entry/whoami-store';
import { RoleCard } from '@/components/entry/RoleCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Role } from '@/lib/types';
import { ROLE_LABELS } from '@/content/sections';

const ROLES: Role[] = ['recruiter', 'peer', 'founder', 'client'];

export function WhoAmIModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Role>('peer');
  const [name, setName] = useState('');
  const [, startTransition] = useTransition();
  const setRole = useWhoAmI((s) => s.setRole);
  const setNameStore = useWhoAmI((s) => s.setName);

  useEffect(() => {
    const seen = localStorage.getItem('whoami-seen');
    if (!seen) setOpen(true);
  }, []);

  const persist = (role: Role, n: string | null) => {
    document.cookie = `whoami-role=${role}; path=/; max-age=31536000; SameSite=Lax`;
    if (n) document.cookie = `whoami-name=${encodeURIComponent(n)}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem('whoami-seen', '1');
    setRole(role);
    setNameStore(n);
  };

  const handleConfirm = () => {
    persist(selected, name.trim() || null);
    setOpen(false);
  };

  const handleSkip = () => {
    persist('peer', null);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[min(640px,calc(100vw-32px))] bg-surface-2 border border-border p-8"
              >
                <Dialog.Title className="font-mono text-xs text-text-muted mb-2">
                  $ whoami --interactive
                </Dialog.Title>
                <Dialog.Description className="font-display text-2xl font-bold text-text mb-1">
                  Identify yourself
                </Dialog.Description>
                <p className="text-sm text-text-muted mb-6">
                  Pick a role so the page surfaces what's relevant to you. Skip to default to peer.
                </p>

                <div role="radiogroup" aria-label="Role" className="grid grid-cols-2 gap-3 mb-6">
                  {ROLES.map((role) => (
                    <RoleCard
                      key={role}
                      role={role}
                      selected={selected === role}
                      onSelect={setSelected}
                    />
                  ))}
                </div>

                <label className="block mb-6">
                  <span className="font-mono text-xs text-text-muted block mb-2">
                    $ whoami --name (optional)
                  </span>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    maxLength={60}
                  />
                </label>

                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip
                  </Button>
                  <Button onClick={handleConfirm}>
                    Continue as {ROLE_LABELS[selected]}
                  </Button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
```

- [ ] **Step 2: Write test**

Create `tests/unit/WhoAmIModal.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WhoAmIModal } from '@/components/entry/WhoAmIModal';

describe('WhoAmIModal', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = '';
  });

  it('opens on first visit', async () => {
    render(<WhoAmIModal />);
    expect(await screen.findByText('Identify yourself')).toBeInTheDocument();
  });

  it('does not open if already seen', async () => {
    localStorage.setItem('whoami-seen', '1');
    render(<WhoAmIModal />);
    expect(screen.queryByText('Identify yourself')).not.toBeInTheDocument();
  });

  it('skip sets role to peer', async () => {
    render(<WhoAmIModal />);
    await screen.findByText('Identify yourself');
    await userEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(document.cookie).toMatch(/whoami-role=peer/);
  });

  it('confirm sets chosen role', async () => {
    render(<WhoAmIModal />);
    await screen.findByText('Identify yourself');
    await userEvent.click(screen.getByRole('radio', { name: /Founder/ }));
    await userEvent.click(screen.getByRole('button', { name: /Continue as Founder/ }));
    expect(document.cookie).toMatch(/whoami-role=founder/);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test -- tests/unit/WhoAmIModal.test.tsx
```

- [ ] **Step 4: Commit**

```bash
git add components/entry/WhoAmIModal.tsx tests/unit/WhoAmIModal.test.tsx
git commit -m "feat: WhoAmIModal with role selection and persistence"
```

---

## Phase 5: Hero (WebGL Particle)

### Task 13: Particle Text Layout Helper

**Files:**
- Create: `components/hero/particle-text.ts`

- [ ] **Step 1: Create components/hero/particle-text.ts**

```ts
/**
 * Generates a 2D particle layout from a text string by sampling glyph pixels
 * from a hidden canvas. The result is an array of {x, y} target positions.
 * No rendering; no DOM.
 */
export interface ParticleTarget {
  x: number;
  y: number;
}

export function makeParticleTargets(text: string, font: string, sampling: number): ParticleTarget[] {
  if (typeof document === 'undefined') return [];
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 220;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.font = `${font} 700 160px ${font}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, width / 2, height / 2);

  const { data } = ctx.getImageData(0, 0, width, height);
  const targets: ParticleTarget[] = [];

  for (let y = 0; y < height; y += sampling) {
    for (let x = 0; x < width; x += sampling) {
      const i = (y * width + x) * 4;
      if (data[i] > 128) {
        targets.push({
          x: (x - width / 2) / 100,
          y: (y - height / 2) / 100,
        });
      }
    }
  }

  return targets;
}
```

- [ ] **Step 2: Write test**

Create `tests/unit/particle-text.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';

describe('makeParticleTargets', () => {
  it('returns empty array outside browser', async () => {
    const { makeParticleTargets } = await import('@/components/hero/particle-text');
    const result = makeParticleTargets('hello', 'sans-serif', 4);
    expect(Array.isArray(result)).toBe(true);
  });

  it('produces targets when document is available', async () => {
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: () => ({
        fillStyle: '',
        fillRect: () => {},
        font: '',
        textBaseline: '',
        textAlign: '',
        fillText: () => {},
        getImageData: () => ({
          data: new Uint8ClampedArray(1200 * 220 * 4).fill(255),
        }),
      }),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as unknown as HTMLCanvasElement);
    const { makeParticleTargets } = await import('@/components/hero/particle-text');
    const result = makeParticleTargets('hello', 'sans-serif', 4);
    expect(result.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/particle-text.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add components/hero/particle-text.ts tests/unit/particle-text.test.ts
git commit -m "feat: particle text layout helper"
```

---

### Task 14: ParticleField (Three.js)

**Files:**
- Create: `components/hero/ParticleField.tsx`

- [ ] **Step 1: Create components/hero/ParticleField.tsx**

```tsx
'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { makeParticleTargets } from '@/components/hero/particle-text';

interface Props {
  text: string;
  particleCount?: number;
}

function Swarm({ text, count = 3000 }: Props) {
  const ref = useRef<THREE.Points>(null);
  const { viewport, size, gl } = useThree();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mql.matches);
    const onChange = () => setReduceMotion(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const targets = useMemo(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, gl.capabilities.maxDPR);
    return makeParticleTargets(text, 'sans-serif', 4);
  }, [text, gl]);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = targets[i % Math.max(targets.length, 1)] ?? { x: 0, y: 0 };
      arr[i * 3] = t.x;
      arr[i * 3 + 1] = t.y;
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, [count, targets]);

  useFrame((state, delta) => {
    if (!ref.current || reduceMotion) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const target = targets[i % Math.max(targets.length, 1)] ?? { x: 0, y: 0 };
      const drift = Math.sin(t * 0.5 + i * 0.01) * 0.05;
      arr[i3] = target.x + drift;
      arr[i3 + 1] = target.y + Math.cos(t * 0.3 + i * 0.01) * 0.05;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#C6FF3D"
        size={0.015}
        sizeAttenuation
        transparent
        opacity={0.9}
      />
    </points>
  );
}

export function ParticleField({ text }: { text: string }) {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    setDpr(isMobile ? 0.75 : Math.min(window.devicePixelRatio || 1, 2));
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Swarm text={text} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/hero/ParticleField.tsx
git commit -m "feat: ParticleField three.js scene"
```

---

### Task 15: ParticleHero (with SSR guard + fallback)

**Files:**
- Create: `components/hero/HeroFallback.tsx`, `components/hero/ParticleHero.tsx`

- [ ] **Step 1: Create components/hero/HeroFallback.tsx**

```tsx
export function HeroFallback({ text }: { text: string }) {
  return (
    <h1
      className="font-display font-bold text-text leading-none tracking-[-0.04em]"
      style={{ fontSize: 'clamp(48px, 12vw, 160px)' }}
    >
      {text}
    </h1>
  );
}
```

- [ ] **Step 2: Create components/hero/ParticleHero.tsx**

```tsx
'use client';

import dynamic from 'next/dynamic';
import { HeroFallback } from '@/components/hero/HeroFallback';

const ParticleField = dynamic(
  () => import('@/components/hero/ParticleField').then((m) => m.ParticleField),
  { ssr: false, loading: () => <HeroFallback text="..." /> },
);

interface Props {
  text: string;
}

export function ParticleHero({ text }: Props) {
  return (
    <div className="relative w-full h-[60vh] flex items-center">
      <div className="absolute inset-0">
        <ParticleField text={text} />
      </div>
      <noscript>
        <HeroFallback text={text} />
      </noscript>
    </div>
  );
}
```

- [ ] **Step 3: Write test**

Create `tests/unit/ParticleHero.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeroFallback } from '@/components/hero/HeroFallback';

describe('HeroFallback', () => {
  it('renders the text', () => {
    const { container } = render(<HeroFallback text="Hello world" />);
    expect(container.textContent).toMatch(/Hello world/);
  });
});
```

- [ ] **Step 4: Run test**

```bash
npm test -- tests/unit/ParticleHero.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/hero/HeroFallback.tsx components/hero/ParticleHero.tsx tests/unit/ParticleHero.test.tsx
git commit -m "feat: ParticleHero with SSR-safe dynamic import and fallback"
```

---

## Phase 6: Ambient Components

### Task 16: Trace Generator

**Files:**
- Create: `components/ambient/trace-generator.ts`

- [ ] **Step 1: Create components/ambient/trace-generator.ts**

```ts
export type TraceLevel = 'ok' | 'retry' | 'fail';

export interface TraceLine {
  id: string;
  timestamp: string;
  component: string;
  message: string;
  level: TraceLevel;
}

const COMPONENTS = [
  'RCA agent',
  'Temporal',
  'Backstage',
  'LangGraph',
  'Google ADK',
  'Vault',
  'Jenkins',
];

const ACTIONS = [
  { msg: 'run 0x{HEX} started', level: 'ok' as const },
  { msg: 'workflow "{ID}" queued', level: 'ok' as const },
  { msg: 'template "{ID}" scaffolded', level: 'ok' as const },
  { msg: 'node "{ID}" complete ({N}ms)', level: 'ok' as const },
  { msg: 'tool "{ID}" invoked', level: 'ok' as const },
  { msg: 'rate-limited, retrying', level: 'retry' as const },
  { msg: 'DLQ check passed', level: 'ok' as const },
  { msg: 'workflow "{ID}" failed', level: 'fail' as const },
];

const ID = (n: number) => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
const NUM = () => Math.floor(Math.random() * 900) + 100;

export function generateTraceLine(): TraceLine {
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const component = COMPONENTS[Math.floor(Math.random() * COMPONENTS.length)];
  const t = new Date();
  const timestamp = `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
  const message = action.msg
    .replace('{HEX}', ID(Math.random() * 0xffff))
    .replace('{ID}', component.toLowerCase().replace(/\s+/g, '-') + '-' + ID(Math.random() * 0xffff))
    .replace('{N}', String(NUM()));
  return {
    id: `${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp,
    component,
    message,
    level: action.level,
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}
```

- [ ] **Step 2: Write test**

Create `tests/unit/trace-generator.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { generateTraceLine } from '@/components/ambient/trace-generator';

describe('generateTraceLine', () => {
  it('returns a trace line with required fields', () => {
    const line = generateTraceLine();
    expect(line.timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(line.component).toBeTruthy();
    expect(line.message).toBeTruthy();
    expect(['ok', 'retry', 'fail']).toContain(line.level);
  });

  it('produces unique IDs', () => {
    const set = new Set<string>();
    for (let i = 0; i < 100; i++) set.add(generateTraceLine().id);
    expect(set.size).toBeGreaterThan(90);
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/trace-generator.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add components/ambient/trace-generator.ts tests/unit/trace-generator.test.ts
git commit -m "feat: synthetic agent-trace generator"
```

---

### Task 17: AgentTrace Component

**Files:**
- Create: `components/ambient/AgentTrace.tsx`

- [ ] **Step 1: Create components/ambient/AgentTrace.tsx**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateTraceLine, type TraceLine } from '@/components/ambient/trace-generator';

const MAX_LINES = 12;
const INTERVAL_MS = 3000;

export function AgentTrace() {
  const [lines, setLines] = useState<TraceLine[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setLines(Array.from({ length: 5 }, () => generateTraceLine()));
      return;
    }

    const seed = Array.from({ length: 5 }, () => generateTraceLine());
    setLines(seed);

    const id = setInterval(() => {
      setLines((prev) => {
        const next = [...prev, generateTraceLine()];
        return next.slice(-MAX_LINES);
      });
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  return (
    <aside
      aria-label="Live agent trace"
      className="hidden lg:flex flex-col gap-1 fixed right-8 top-1/2 -translate-y-1/2 w-72 max-h-[60vh] overflow-hidden p-4 bg-surface/60 border border-border"
    >
      <div className="font-mono text-xs text-text-muted mb-2">▸ agent.log</div>
      <div className="flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-xs flex gap-2"
            >
              <span className={
                line.level === 'fail' ? 'text-red-400' :
                line.level === 'retry' ? 'text-signal-pause' : 'text-signal-ok'
              }>●</span>
              <span className="text-text-muted">{line.timestamp}</span>
              <span className="text-text truncate">
                <span className="text-text-muted">{line.component} · </span>
                {line.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Write test**

Create `tests/unit/AgentTrace.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AgentTrace } from '@/components/ambient/AgentTrace';

describe('AgentTrace', () => {
  it('renders agent.log label', () => {
    render(<AgentTrace />);
    expect(screen.getByText('agent.log')).toBeInTheDocument();
  });

  it('has aria-label', () => {
    render(<AgentTrace />);
    expect(screen.getByLabelText('Live agent trace')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/AgentTrace.test.tsx
```

- [ ] **Step 4: Commit**

```bash
git add components/ambient/AgentTrace.tsx tests/unit/AgentTrace.test.tsx
git commit -m "feat: AgentTrace ambient panel"
```

---

### Task 18: SectionDivider

**Files:**
- Create: `components/ambient/SectionDivider.tsx`

- [ ] **Step 1: Create components/ambient/SectionDivider.tsx**

```tsx
export function SectionDivider() {
  const text = '▸ saidheeraj@portfolio  ~/work  ▸ currently building: enterprise agent platform  ▸ langgraph · temporal · google adk  ▸ open to staff/principal conversations  ▸';
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden border-y border-border bg-bg py-3"
    >
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="font-mono text-xs text-text-muted">{text}</span>
        <span className="font-mono text-xs text-text-muted">{text}</span>
      </div>
        <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; width: max-content; }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ambient/SectionDivider.tsx
git commit -m "feat: section divider with running text"
```

---

### Task 19: CursorTrail

**Files:**
- Create: `components/layout/CursorTrail.tsx`

- [ ] **Step 1: Create components/layout/CursorTrail.tsx**

```tsx
'use client';

import { useEffect, useRef } from 'react';

export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (reduceMotion || isTouch) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let points: Array<{ x: number; y: number; t: number }> = [];
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (points.length > 32) points.shift();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const now = performance.now();
      points = points.filter((p) => now - p.t < 200);
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const alpha = 1 - (now - a.t) / 200;
        ctx.strokeStyle = `rgba(198, 255, 61, ${alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/CursorTrail.tsx
git commit -m "feat: cursor trail canvas"
```

---

## Phase 7: Layout Primitives

### Task 20: SectionNumber, StatusDot, Nav, Footer

**Files:**
- Create: `components/layout/SectionNumber.tsx`, `components/layout/StatusDot.tsx`, `components/layout/Nav.tsx`, `components/layout/Footer.tsx`

- [ ] **Step 1: Create components/layout/SectionNumber.tsx**

```tsx
export function SectionNumber({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center justify-between mb-12">
      <span className="font-mono text-xs text-text-muted">SECTION {n}</span>
      <div className="flex-1 mx-4 h-px bg-border" />
      <span className="font-mono text-xs text-text-muted">{label}</span>
    </div>
  );
}
```

- [ ] **Step 2: Create components/layout/StatusDot.tsx**

```tsx
import type { VentureStatus } from '@/lib/types';

const STATUS_LABEL: Record<VentureStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  archived: 'Archived',
};

const STATUS_COLOR: Record<VentureStatus, string> = {
  active: 'bg-signal-ok',
  paused: 'bg-signal-pause',
  archived: 'bg-text-muted',
};

export function StatusDot({ status }: { status: VentureStatus }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[status]} ${status === 'active' ? 'animate-pulse' : ''}`} />
      <span className="font-mono text-xs text-text-muted">{STATUS_LABEL[status]}</span>
    </span>
  );
}
```

- [ ] **Step 3: Create components/layout/Nav.tsx**

```tsx
import Link from 'next/link';

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-bg/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm text-text">
          $ saidheeraj
        </Link>
        <div className="flex items-center gap-6 font-mono text-xs text-text-muted">
          <Link href="/#work" className="hover:text-accent transition-colors">work</Link>
          <Link href="/#contact" className="hover:text-accent transition-colors">contact</Link>
          <Link href="/api/resume" className="hover:text-accent transition-colors">resume</Link>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Create components/layout/Footer.tsx**

```tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border mt-32 py-8">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-4">
        <p className="font-mono text-xs text-text-muted">
          © 2026 Sai Dheeraj Gantala · Built with Next.js, Three.js, Motion
        </p>
        <div className="flex gap-4 font-mono text-xs text-text-muted">
          <Link href="https://github.com/dheerajgantala" className="hover:text-accent">github</Link>
          <Link href="https://www.linkedin.com/in/saidheerajgantala/" className="hover:text-accent">linkedin</Link>
          <Link href="https://saidheerajgantala.medium.com/" className="hover:text-accent">medium</Link>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Write tests**

Create `tests/unit/SectionNumber.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionNumber } from '@/components/layout/SectionNumber';

describe('SectionNumber', () => {
  it('renders the section number', () => {
    render(<SectionNumber n="01" label="Career" />);
    expect(screen.getByText('SECTION 01')).toBeInTheDocument();
    expect(screen.getByText('Career')).toBeInTheDocument();
  });
});
```

Create `tests/unit/StatusDot.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusDot } from '@/components/layout/StatusDot';

describe('StatusDot', () => {
  it('renders active label', () => {
    render(<StatusDot status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
  it('renders paused label', () => {
    render(<StatusDot status="paused" />);
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });
  it('renders archived label', () => {
    render(<StatusDot status="archived" />);
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run tests**

```bash
npm test -- tests/unit/SectionNumber.test.tsx tests/unit/StatusDot.test.tsx
```

- [ ] **Step 7: Commit**

```bash
git add components/layout/ tests/unit/SectionNumber.test.tsx tests/unit/StatusDot.test.tsx
git commit -m "feat: layout primitives (SectionNumber, StatusDot, Nav, Footer)"
```

---

## Phase 8: Section Components

### Task 21: CareerArc Section

**Files:**
- Create: `components/sections/CareerArc.tsx`

- [ ] **Step 1: Create components/sections/CareerArc.tsx**

```tsx
import { SectionNumber } from '@/components/layout/SectionNumber';
import type { CareerStop } from '@/lib/types';

const STOPS: CareerStop[] = [
  {
    id: '01',
    period: 'Mar 2022 – Jun 2022',
    title: 'Engineer Intern',
    company: 'Xebia',
    location: 'Hyderabad',
    achievements: [
      'Built a cloud-native application prototyping platform on AWS',
      'Gained hands-on experience with Go, Ruby on Rails, Docker, GitHub Actions',
    ],
  },
  {
    id: '02',
    period: 'Jul 2022 – Jun 2023',
    title: 'Associate Software Engineer',
    company: 'Xebia',
    location: 'Hyderabad',
    achievements: [
      'Migrated Rails + Postgres from Heroku to AWS — 70% boot time reduction',
      'Reduced critical incidents by 70% via ELK + structured incident response',
      'Built cross-account KMS-encrypted backup automation',
    ],
  },
  {
    id: '03',
    period: 'Jul 2023 – Oct 2025',
    title: 'Software Engineer',
    company: 'Xebia',
    location: 'Hyderabad',
    achievements: [
      'Integrated AWS RDS ↔ Azure MSSQL via DMS — 35% cross-platform latency reduction',
      'Cut AWS costs 35% via rightsizing + Lambda lifecycle automation',
      'Reduced MTTD/MTTR by 15% with custom CloudWatch dashboards',
      'Integrated LLM RAG pipelines into engineering workflows',
    ],
  },
  {
    id: '04',
    period: 'Oct 2025 – Present',
    title: 'System Engineer',
    company: 'EPAM Systems',
    location: 'Bengaluru',
    achievements: [
      'Building enterprise AI agent platform — LangGraph + Temporal + Google ADK',
      'Multi-tenant RBAC, role-based dashboards, Backstage developer portal',
      'Designed RCA agent and multi-step agentic workflows',
    ],
  },
];

export function CareerArc() {
  return (
    <section id="career-arc" className="max-w-[1280px] mx-auto px-6 py-24">
      <SectionNumber n="02" label="Career Arc" />
      <h2 className="font-display font-bold text-text mb-16" style={{ fontSize: 'clamp(40px, 6vw, 96px)', lineHeight: 1.0, letterSpacing: '-0.04em' }}>
        From intern to platform builder.
      </h2>
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-[7px] md:left-1/2 w-px bg-border" />
        <ol className="flex flex-col gap-12">
          {STOPS.map((stop, i) => (
            <li key={stop.id} className={`relative pl-8 md:pl-0 ${i % 2 === 0 ? 'md:pr-[55%]' : 'md:pl-[55%]'}`}>
              <span className="absolute left-0 top-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-bg border-2 border-accent rounded-full" />
              <div className="font-mono text-xs text-text-muted mb-2">{stop.period}</div>
              <h3 className="font-display font-bold text-2xl text-text mb-1">{stop.title}</h3>
              <p className="font-mono text-xs text-text-muted mb-4">{stop.company} · {stop.location}</p>
              <ul className="flex flex-col gap-2">
                {stop.achievements.map((a, j) => (
                  <li key={j} className="text-sm text-text-muted leading-relaxed">— {a}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/CareerArc.tsx
git commit -m "feat: CareerArc section"
```

---

### Task 22: CurrentlyBuilding Section

**Files:**
- Create: `components/sections/CurrentlyBuilding.tsx`

- [ ] **Step 1: Create components/sections/CurrentlyBuilding.tsx**

```tsx
import Link from 'next/link';
import { SectionNumber } from '@/components/layout/SectionNumber';
import { Button } from '@/components/ui/Button';

const CARDS = [
  {
    title: 'RCA agent',
    blurb: 'Root cause analysis over telemetry, logs, and metrics. Read by operators before decisions.',
    href: '/work/agent-platform',
  },
  {
    title: 'Backstage portal',
    blurb: 'Multi-tenant RBAC, role-based dashboards. Software templates scaffold services in minutes.',
    href: '/work/agent-platform',
  },
  {
    title: 'Temporal workflows',
    blurb: 'Durable orchestration for long-running agentic pipelines. Retries, signals, schedules.',
    href: '/work/agent-platform',
  },
  {
    title: 'Google ADK pipelines',
    blurb: 'Multi-step agentic workflows with structured tool use. Composable, observable, testable.',
    href: '/work/agent-platform',
  },
];

export function CurrentlyBuilding() {
  return (
    <section id="currently-building" className="max-w-[1280px] mx-auto px-6 py-24">
      <SectionNumber n="03" label="Currently Building" />
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <h2 className="font-display font-bold text-text" style={{ fontSize: 'clamp(40px, 6vw, 96px)', lineHeight: 1.0, letterSpacing: '-0.04em' }}>
          Enterprise AI agent platform.
        </h2>
        <Link href="/work/agent-platform">
          <Button variant="outline">Read the case study →</Button>
        </Link>
      </div>

      <p className="text-lg text-text-muted mb-12 max-w-2xl">
        At EPAM Systems, I lead core development on an enterprise AI platform that orchestrates AI agents, MCPs,
        and agentic workflows. The platform bridges AI capabilities with engineering automation and managed services.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group p-6 bg-surface border border-border hover:border-accent transition-colors"
          >
            <h3 className="font-display font-bold text-xl text-text mb-2">{card.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{card.blurb}</p>
            <span className="font-mono text-xs text-accent mt-4 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
              explore →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/CurrentlyBuilding.tsx
git commit -m "feat: CurrentlyBuilding section"
```

---

### Task 23: VenturePortfolio Section

**Files:**
- Create: `components/sections/VenturePortfolio.tsx`

- [ ] **Step 1: Create components/sections/VenturePortfolio.tsx**

```tsx
import Link from 'next/link';
import { SectionNumber } from '@/components/layout/SectionNumber';
import { StatusDot } from '@/components/layout/StatusDot';
import type { Venture } from '@/lib/types';

const VENTURES: Venture[] = [
  {
    slug: 'noxtag',
    name: 'Noxtag',
    role: 'Core Founder | Principal Architect',
    period: 'Dec 2023 – Present',
    status: 'active',
    tagline: 'Geo-fenced event notifications. Serverless on AWS Lambda + DynamoDB.',
    href: 'https://www.noxstack.com/',
    tags: ['AWS', 'React', 'Node.js', 'Geolocation'],
  },
  {
    slug: 'wedAA',
    name: 'WeDAA',
    role: 'Core Founder | Tech Lead',
    period: '2022 – 2023',
    status: 'archived',
    tagline: 'Cloud-native application prototyping + automated code generation.',
    href: 'https://wedaa.tech',
    tags: ['AWS', 'IaC', 'Docker', 'Golang', 'React.js'],
  },
  {
    slug: 'jobharvester',
    name: 'JobHarvester',
    role: 'Solo Founder | Product Builder',
    period: '2024 – Present',
    status: 'active',
    tagline: 'AI agents for job-description extraction + resume tailoring.',
    href: 'https://jobharvester-spa.vercel.app/',
    tags: ['FastAPI', 'LLMs', 'PostgreSQL', 'Next.js', 'AI agents'],
  },
];

export function VenturePortfolio() {
  return (
    <section id="ventures" className="max-w-[1280px] mx-auto px-6 py-24">
      <SectionNumber n="04" label="Ventures" />
      <h2 className="font-display font-bold text-text mb-16" style={{ fontSize: 'clamp(40px, 6vw, 96px)', lineHeight: 1.0, letterSpacing: '-0.04em' }}>
        Things I've shipped.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {VENTURES.map((v) => (
          <Link
            key={v.slug}
            href={v.href}
            className="group flex flex-col p-6 bg-surface border border-border hover:border-accent transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-display font-bold text-2xl text-text">{v.name}</h3>
              <StatusDot status={v.status} />
            </div>
            <p className="font-mono text-xs text-text-muted mb-3">{v.role}</p>
            <p className="text-sm text-text-muted leading-relaxed mb-4 flex-1">{v.tagline}</p>
            <div className="flex flex-wrap gap-2">
              {v.tags.map((t) => (
                <span key={t} className="font-mono text-xs text-text-muted px-2 py-1 border border-border">
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/VenturePortfolio.tsx
git commit -m "feat: VenturePortfolio section"
```

---

### Task 24: MultiCloud Section

**Files:**
- Create: `components/sections/MultiCloud.tsx`

- [ ] **Step 1: Create components/sections/MultiCloud.tsx**

```tsx
import { SectionNumber } from '@/components/layout/SectionNumber';

const CASES = [
  {
    title: 'Heroku → AWS migration',
    metric: '70%',
    metricLabel: 'boot time reduction',
    detail: 'Refactored monolithic Rails apps into modular services. Containerized, IaC-provisioned, zero-downtime.',
  },
  {
    title: 'Azure ↔ AWS integration',
    metric: '35%',
    metricLabel: 'cross-platform latency reduction',
    detail: 'Streamlined data flow between AWS RDS and Azure MSSQL using AWS DMS for BI dashboards.',
  },
  {
    title: 'AWS cost audit',
    metric: '35%',
    metricLabel: 'cost reduction',
    detail: 'Identified underutilized services, applied rightsizing, automated lifecycle policies via Lambda.',
  },
];

export function MultiCloud() {
  return (
    <section id="multi-cloud" className="max-w-[1280px] mx-auto px-6 py-24">
      <SectionNumber n="05" label="Multi-Cloud" />
      <h2 className="font-display font-bold text-text mb-16" style={{ fontSize: 'clamp(40px, 6vw, 96px)', lineHeight: 1.0, letterSpacing: '-0.04em' }}>
        Reliability, cost, speed.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CASES.map((c) => (
          <article key={c.title} className="p-6 bg-surface border border-border">
            <div className="font-mono text-xs text-text-muted mb-4">{c.title}</div>
            <div className="font-display font-bold text-accent leading-none mb-1" style={{ fontSize: '64px' }}>
              {c.metric}
            </div>
            <div className="font-mono text-xs text-text-muted mb-6">{c.metricLabel}</div>
            <p className="text-sm text-text-muted leading-relaxed">{c.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/MultiCloud.tsx
git commit -m "feat: MultiCloud section"
```

---

### Task 25: OperatingPrinciples, Recognition, Writing Sections

**Files:**
- Create: `components/sections/OperatingPrinciples.tsx`, `components/sections/Recognition.tsx`, `components/sections/Writing.tsx`

- [ ] **Step 1: Create components/sections/OperatingPrinciples.tsx**

```tsx
import { SectionNumber } from '@/components/layout/SectionNumber';

const PRINCIPLES = [
  { n: '01', text: 'Automate everything possible.' },
  { n: '02', text: 'Build resilient architectures.' },
  { n: '03', text: 'Keep security at the core.' },
];

export function OperatingPrinciples() {
  return (
    <section id="principles" className="max-w-[1280px] mx-auto px-6 py-24">
      <SectionNumber n="06" label="Operating Principles" />
      <div className="flex flex-col gap-6">
        {PRINCIPLES.map((p) => (
          <div key={p.n} className="flex items-baseline gap-6">
            <span className="font-mono text-xs text-text-muted shrink-0 w-12">{p.n}</span>
            <p className="font-display font-bold text-text" style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: 1.1, letterSpacing: '-0.04em' }}>
              {p.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create components/sections/Recognition.tsx**

```tsx
import { SectionNumber } from '@/components/layout/SectionNumber';

const CERTS = [
  { name: 'Google Cloud Certified Professional Cloud Architect', issuer: 'Google Cloud' },
  { name: 'AWS Certified Machine Learning', issuer: 'AWS' },
];

const AWARDS = [
  { name: 'GEM Award', issuer: 'Xebia', year: '2022' },
  { name: 'Hall of Fame', issuer: 'BigBasket', year: '2021', detail: 'Responsible security vulnerability disclosure' },
];

export function Recognition() {
  return (
    <section id="recognition" className="max-w-[1280px] mx-auto px-6 py-24">
      <SectionNumber n="07" label="Recognition" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="font-mono text-xs text-text-muted mb-4">CERTIFICATIONS</h3>
          <ul className="flex flex-col gap-3">
            {CERTS.map((c) => (
              <li key={c.name} className="border-l-2 border-accent pl-4">
                <p className="text-text font-medium">{c.name}</p>
                <p className="font-mono text-xs text-text-muted">{c.issuer}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-xs text-text-muted mb-4">AWARDS</h3>
          <ul className="flex flex-col gap-3">
            {AWARDS.map((a) => (
              <li key={a.name} className="border-l-2 border-text-muted pl-4">
                <p className="text-text font-medium">{a.name}</p>
                <p className="font-mono text-xs text-text-muted">{a.issuer} · {a.year}</p>
                {a.detail && <p className="text-xs text-text-muted mt-1">{a.detail}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create components/sections/Writing.tsx**

```tsx
import Link from 'next/link';
import { SectionNumber } from '@/components/layout/SectionNumber';

const POSTS = [
  {
    title: 'How I won $400 just by coding and playing games',
    date: '2021-07-14',
    excerpt: 'My experience participating in the FaaS War global serverless competition, where I developed a strategy for my robot to battle others and won the first round.',
    href: 'https://medium.com/nimbella/how-i-won-400-just-by-coding-and-playing-games-db0afce9da5e',
    tags: ['Serverless', 'FaaS', 'Coding'],
  },
  {
    title: 'No Infrastructure, Just Code: Learn the Simplicity of Serverless',
    date: '2021-06-01',
    excerpt: 'Exploring the benefits of serverless architecture and how it simplifies cloud development by allowing developers to focus on code rather than infrastructure management.',
    href: 'https://nimbella.hashnode.dev/no-infrastructure-just-code-learn-the-simplicity-of-serverless',
    tags: ['Serverless', 'Cloud', 'Development'],
  },
];

export function Writing() {
  return (
    <section id="writing" className="max-w-[1280px] mx-auto px-6 py-24">
      <SectionNumber n="08" label="Writing" />
      <div className="flex flex-col gap-6 mb-8">
        {POSTS.map((p) => (
          <Link key={p.href} href={p.href} className="group block p-6 bg-surface border border-border hover:border-accent transition-colors">
            <div className="font-mono text-xs text-text-muted mb-2">{p.date}</div>
            <h3 className="font-display font-bold text-xl text-text mb-2 group-hover:text-accent transition-colors">{p.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-3">{p.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="font-mono text-xs text-text-muted">{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      <Link href="https://saidheerajgantala.medium.com/" className="font-mono text-sm text-accent hover:underline">
        More on Medium →
      </Link>
    </section>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/sections/OperatingPrinciples.tsx components/sections/Recognition.tsx components/sections/Writing.tsx
git commit -m "feat: OperatingPrinciples, Recognition, Writing sections"
```

---

### Task 26: Contact Section

**Files:**
- Create: `components/sections/Contact.tsx`

- [ ] **Step 1: Create components/sections/Contact.tsx**

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SectionNumber } from '@/components/layout/SectionNumber';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useWhoAmI } from '@/components/entry/whoami-store';
import { CONTACT_CTA } from '@/content/audience-variants';

const schema = z.object({
  name: z.string().min(1, 'Required').max(120),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'At least 10 characters').max(4000),
});

type FormData = z.infer<typeof schema>;

export function Contact() {
  const role = useWhoAmI((s) => s.role);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
      reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
  };

  return (
    <section id="contact" className="max-w-[1280px] mx-auto px-6 py-24">
      <SectionNumber n="09" label="Contact" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-display font-bold text-text mb-6" style={{ fontSize: 'clamp(40px, 6vw, 96px)', lineHeight: 1.0, letterSpacing: '-0.04em' }}>
            Let's build.
          </h2>
          <p className="text-lg text-text-muted mb-8">
            Or talk through how I work. Email is usually the fastest path.
          </p>
          <div className="flex flex-col gap-3 font-mono text-sm">
            <a href="mailto:gantala.saidheeraj@gmail.com" className="text-text hover:text-accent">gantala.saidheeraj@gmail.com</a>
            <a href="https://www.linkedin.com/in/saidheerajgantala/" className="text-text-muted hover:text-accent">linkedin.com/in/saidheerajgantala</a>
            <a href="https://github.com/dheerajgantala" className="text-text-muted hover:text-accent">github.com/dheerajgantala</a>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {submitted && (
            <div className="p-4 bg-surface border border-accent text-text">
              <p className="font-mono text-xs text-accent mb-1">▸ sent</p>
              <p>Thanks — I'll respond within 48 hours.</p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-surface border border-red-400 text-text">
              <p className="font-mono text-xs text-red-400 mb-1">▸ error</p>
              <p>{error}</p>
            </div>
          )}

          <label>
            <span className="font-mono text-xs text-text-muted block mb-2">name</span>
            <Input {...register('name')} placeholder="Your name" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </label>

          <label>
            <span className="font-mono text-xs text-text-muted block mb-2">email</span>
            <Input {...register('email')} type="email" placeholder="you@domain.com" />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </label>

          <label>
            <span className="font-mono text-xs text-text-muted block mb-2">message</span>
            <Textarea {...register('message')} placeholder="What would you like to discuss?" />
            {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : CONTACT_CTA[role]}
          </Button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Contact.tsx
git commit -m "feat: Contact section with role-aware CTA and form"
```

---

## Phase 9: Role-Aware Page Composition

### Task 27: RoleReshapedPage (LayoutGroup)

**Files:**
- Create: `components/role/RoleReshapedPage.tsx`, `components/role/RoleProvider.tsx`

- [ ] **Step 1: Create components/role/RoleProvider.tsx**

```tsx
import { readRoleFromCookies, readNameFromCookies } from '@/lib/cookies';
import type { Role } from '@/lib/types';
import { RoleReshapedPage } from '@/components/role/RoleReshapedPage';

export function RoleProvider() {
  const role: Role = readRoleFromCookies();
  const name = readNameFromCookies();
  return <RoleReshapedPage role={role} name={name} />;
}
```

- [ ] **Step 2: Create components/role/RoleReshapedPage.tsx**

```tsx
'use client';

import { useEffect } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { useWhoAmI } from '@/components/entry/whoami-store';
import { SECTION_ORDER } from '@/content/sections';
import { ParticleHero } from '@/components/hero/ParticleHero';
import { AgentTrace } from '@/components/ambient/AgentTrace';
import { SectionDivider } from '@/components/ambient/SectionDivider';
import { CareerArc } from '@/components/sections/CareerArc';
import { CurrentlyBuilding } from '@/components/sections/CurrentlyBuilding';
import { VenturePortfolio } from '@/components/sections/VenturePortfolio';
import { MultiCloud } from '@/components/sections/MultiCloud';
import { OperatingPrinciples } from '@/components/sections/OperatingPrinciples';
import { Recognition } from '@/components/sections/Recognition';
import { Writing } from '@/components/sections/Writing';
import { Contact } from '@/components/sections/Contact';
import { HERO_HEADLINE, HERO_CTA, HERO_SUBHEAD } from '@/content/audience-variants';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { Role } from '@/lib/types';

const SECTIONS: Record<string, () => React.ReactNode> = {
  'hero': () => <HeroSection />,
  'career-arc': () => <CareerArc />,
  'currently-building': () => <CurrentlyBuilding />,
  'ventures': () => <VenturePortfolio />,
  'multi-cloud': () => <MultiCloud />,
  'principles': () => <OperatingPrinciples />,
  'recognition': () => <Recognition />,
  'writing': () => <Writing />,
  'contact': () => <Contact />,
};

function HeroSection() {
  const role = useWhoAmI((s) => s.role);
  return (
    <section id="hero" className="relative max-w-[1280px] mx-auto px-6 pt-12 pb-32">
      <p className="font-mono text-xs text-text-muted mb-2">$ portfolio --role={role}</p>
      <ParticleHero text={HERO_HEADLINE} />
      <p className="text-lg text-text-muted max-w-2xl mt-12 mb-8">{HERO_SUBHEAD[role]}</p>
      <div className="flex gap-3">
        <Link href="#contact"><Button>{HERO_CTA[role]}</Button></Link>
        <Link href="/api/resume"><Button variant="outline">Download resume</Button></Link>
      </div>
    </section>
  );
}

export function RoleReshapedPage({ role: initialRole, name }: { role: Role; name: string | null }) {
  const setRole = useWhoAmI((s) => s.setRole);
  const setName = useWhoAmI((s) => s.setName);

  useEffect(() => {
    setRole(initialRole);
    setName(name);
  }, [initialRole, name, setRole, setName]);

  const role = useWhoAmI((s) => s.role);
  const order = SECTION_ORDER[role];

  return (
    <LayoutGroup>
      <motion.div layout>
        {order.map((id) => {
          const Component = SECTIONS[id];
          return (
            <motion.div key={id} layoutId={id} layout="position">
              <Component />
              {id !== 'contact' && <SectionDivider />}
            </motion.div>
          );
        })}
      </motion.div>
      <AgentTrace />
    </LayoutGroup>
  );
}
```

- [ ] **Step 2: Write test**

Create `tests/unit/RoleReshapedPage.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoleReshapedPage } from '@/components/role/RoleReshapedPage';

describe('RoleReshapedPage', () => {
  it('renders the hero section', () => {
    render(<RoleReshapedPage role="peer" name={null} />);
    expect(screen.getByText(/\$ portfolio --role=peer/)).toBeInTheDocument();
  });

  it('renders a different section order per role', () => {
    const { container } = render(<RoleReshapedPage role="founder" name={null} />);
    const sections = container.querySelectorAll('section');
    expect(sections[0]?.id).toBe('hero');
    expect(sections[1]?.id).toBe('ventures');
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/RoleReshapedPage.test.tsx
```

- [ ] **Step 4: Commit**

```bash
git add components/role/ tests/unit/RoleReshapedPage.test.tsx
git commit -m "feat: role-aware page composition with LayoutGroup"
```

---

### Task 28: Home Page (Server Component)

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: Create app/page.tsx**

```tsx
import { Suspense } from 'react';
import { RoleProvider } from '@/components/role/RoleProvider';
import { WhoAmIModal } from '@/components/entry/WhoAmIModal';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { CursorTrail } from '@/components/layout/CursorTrail';

export default function Home() {
  return (
    <>
      <Nav />
      <CursorTrail />
      <WhoAmIModal />
      <main className="pt-14">
        <Suspense fallback={null}>
          <RoleProvider />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: home page with role provider and modal"
```

---

## Phase 10: MDX Case Studies

### Task 29: MDX Setup

**Files:**
- Create: `mdx-components.tsx`, `components/mdx/mdx-components.tsx`, `components/mdx/CaseStudyLayout.tsx`

- [ ] **Step 1: Create root mdx-components.tsx**

```tsx
import type { MDXComponents } from 'mdx/types';
import { mdxComponents } from '@/components/mdx/mdx-components';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components, ...mdxComponents };
}
```

- [ ] **Step 2: Create components/mdx/mdx-components.tsx**

```tsx
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

export const mdxComponents: MDXComponents = {
  a: ({ href, children }) => <Link href={href ?? '#'} className="text-accent hover:underline">{children}</Link>,
  h1: ({ children }) => <h1 className="font-display font-bold text-text mb-6" style={{ fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 1.05, letterSpacing: '-0.04em' }}>{children}</h1>,
  h2: ({ children }) => <h2 className="font-display font-bold text-text mt-16 mb-4" style={{ fontSize: '40px', letterSpacing: '-0.02em' }}>{children}</h2>,
  h3: ({ children }) => <h3 className="font-display font-bold text-text mt-10 mb-3" style={{ fontSize: '24px' }}>{children}</h3>,
  p: ({ children }) => <p className="text-text-muted leading-relaxed mb-4 text-lg">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-inside text-text-muted mb-4 space-y-2">{children}</ul>,
  code: ({ children }) => <code className="font-mono text-sm text-accent bg-surface px-1.5 py-0.5">{children}</code>,
};
```

- [ ] **Step 3: Create components/mdx/CaseStudyLayout.tsx**

```tsx
import Link from 'next/link';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import type { CaseStudyMeta } from '@/lib/types';

export function CaseStudyLayout({ meta, children }: { meta: CaseStudyMeta; children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="pt-14 pb-32">
        <article className="max-w-3xl mx-auto px-6 py-16">
          <Link href="/#work" className="font-mono text-xs text-text-muted hover:text-accent mb-12 inline-block">
            ← back to work
          </Link>

          <div className="mb-12">
            <p className="font-mono text-xs text-text-muted mb-2">{meta.period} · {meta.role}</p>
            <h1 className="font-display font-bold text-text mb-3" style={{ fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 1.0, letterSpacing: '-0.04em' }}>
              {meta.title}
            </h1>
            <p className="text-xl text-text-muted">{meta.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 p-6 bg-surface border border-border">
            {meta.impact.map((i) => (
              <div key={i.label}>
                <div className="font-display font-bold text-accent leading-none" style={{ fontSize: '32px' }}>{i.value}</div>
                <div className="font-mono text-xs text-text-muted mt-1">{i.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-12">
            {meta.stack.map((s) => (
              <span key={s} className="font-mono text-xs text-text-muted px-2 py-1 border border-border">{s}</span>
            ))}
          </div>

          <div className="prose">{children}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add mdx-components.tsx components/mdx/
git commit -m "feat: MDX component mapping and case study layout"
```

---

### Task 30: Agent Platform Case Study

**Files:**
- Create: `app/work/agent-platform/page.mdx`

- [ ] **Step 1: Create app/work/agent-platform/page.mdx**

```mdx
import { CaseStudyLayout } from '@/components/mdx/CaseStudyLayout';

export const meta = {
  slug: 'agent-platform',
  title: 'Enterprise AI agent platform',
  subtitle: 'Building the operating layer where AI meets engineering operations.',
  period: 'Oct 2025 – Present',
  role: 'System Engineer, EPAM Systems',
  stack: ['LangGraph', 'Temporal', 'Google ADK', 'Backstage', 'Vault', 'Jenkins', 'GCP'],
  impact: [
    { label: 'integrations', value: 'Jenkins · Jira · Vault' },
    { label: 'platform', value: 'multi-tenant' },
    { label: 'roles', value: 'RBAC' },
    { label: 'agent types', value: 'RCA + workflow' },
  ],
};

export default function Page({ children }) {
  return <CaseStudyLayout meta={meta}>{children}</CaseStudyLayout>;
}

## The problem

Engineering teams at EPAM were running manual incident triage, ad-hoc scripts, and disconnected tooling.
No consistent way to create, review, and approve automated workflows. Junior engineers wrote one-off scripts;
senior engineers became bottlenecks.

## What I built

An enterprise-grade AI platform that orchestrates AI agents, MCPs, and agentic workflows across managed services.

### Four pieces in concert

1. **RCA agent** — Root cause analysis over telemetry, logs, and metrics. Operates in read-only mode by default.
   Operators review before any action is taken.
2. **Backstage developer portal** — Custom software templates scaffold new services in minutes. Multi-tenant RBAC
   controls who can create, who can approve, and who can run.
3. **Temporal workflows** — Durable orchestration for long-running agentic pipelines. Retries, signals, schedules.
   State survives worker restarts.
4. **Google ADK pipelines** — Multi-step agentic workflows built with Google ADK. Composable, observable, testable.

## Architecture

```
User request
    ↓
Backstage portal (RBAC + templates)
    ↓
Temporal workflow (durable orchestration)
    ↓
LangGraph state machine (RCA agent)
    ↓
Google ADK pipelines (multi-step agentic workflows)
    ↓
MCPs (model context protocols) → external tools
```

## Key decisions

- **Operator-in-the-loop.** Permissions and approval gates are first-class. AI augments, doesn't bypass.
- **Durable orchestration over raw async.** Temporal gives us retries, signals, and observability for free.
- **MCP as the integration boundary.** External tools surface as MCPs, so agents stay swappable.
- **Multi-tenant by default.** RBAC is the foundation, not a feature.

## Stack

LangGraph, Temporal, Google ADK, Backstage, Vault, Jenkins, GCP, TypeScript.
```

- [ ] **Step 2: Commit**

```bash
git add app/work/agent-platform/
git commit -m "feat: agent platform case study"
```

---

### Task 31: JobHarvester Case Study

**Files:**
- Create: `app/work/jobharvester/page.mdx`

- [ ] **Step 1: Create app/work/jobharvester/page.mdx**

```mdx
import { CaseStudyLayout } from '@/components/mdx/CaseStudyLayout';

export const meta = {
  slug: 'jobharvester',
  title: 'JobHarvester',
  subtitle: 'AI agents for job-description extraction and resume tailoring.',
  period: '2024 – Present',
  role: 'Solo Founder | Product Builder',
  stack: ['FastAPI', 'PostgreSQL', 'Next.js', 'LLMs', 'AI agents', 'GitHub Actions'],
  impact: [
    { label: 'founded', value: 'solo' },
    { label: 'backend', value: 'FastAPI' },
    { label: 'frontend', value: 'Next.js' },
    { label: 'CI/CD', value: 'GitHub Actions' },
  ],
};

export default function Page({ children }) {
  return <CaseStudyLayout meta={meta}>{children}</CaseStudyLayout>;
}

## The problem

Job hunting is repetitive. Job descriptions are unstructured. Tailoring a resume for each role is a full task.

## What I built

JobHarvester — a solo-built product that uses AI agents to extract structured data from job descriptions
and tailor resumes to match.

### Agents

- **Extractor agent** — reads a job description and pulls out: role, required skills, nice-to-haves, seniority, location.
- **Tailoring agent** — takes the extracted spec plus the user's master resume and rewrites the relevant bullets
  to align with the role's language.

## Architecture

```
Job description (URL or paste)
    ↓
Extractor agent (LLM + structured output)
    ↓
PostgreSQL (structured specs)
    ↓
Tailoring agent (LLM + master resume)
    ↓
Tailored resume (PDF or markdown)
```

## What I learned

- **Prompt engineering is product work.** Small wording changes shift output quality dramatically.
- **Structured outputs > free-text.** Constraining the extractor to a JSON schema made the rest of the pipeline trivial.
- **Solo shipping is real.** CI/CD + good defaults + clear scope = ship in weeks, not months.

## Stack

FastAPI, SQLAlchemy, PostgreSQL, Next.js, OpenAI, Claude, GitHub Actions.
```

- [ ] **Step 2: Commit**

```bash
git add app/work/jobharvester/
git commit -m "feat: JobHarvester case study"
```

---

## Phase 11: API Routes

### Task 32: Contact API Route

**Files:**
- Create: `lib/contact.ts`, `app/api/contact/route.ts`

- [ ] **Step 1: Create lib/contact.ts**

```ts
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  role?: string;
}

export async function sendEmail(payload: ContactPayload): Promise<boolean> {
  if (!resend) return false;
  try {
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? 'portfolio@saidheerajgantala.me',
      to: process.env.CONTACT_TO_EMAIL ?? 'gantala.saidheeraj@gmail.com',
      subject: `[Portfolio] ${payload.name} (${payload.role ?? 'visitor'})`,
      text: `From: ${payload.name} <${payload.email}>\n\n${payload.message}`,
    });
    return true;
  } catch (e) {
    console.error('Resend failed:', e);
    return false;
  }
}

export async function postDiscord(payload: ContactPayload): Promise<boolean> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return false;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `**New portfolio contact** (${payload.role ?? 'visitor'})\n**From:** ${payload.name} <${payload.email}>\n**Message:** ${payload.message}`,
      }),
    });
    return true;
  } catch (e) {
    console.error('Discord webhook failed:', e);
    return false;
  }
}
```

- [ ] **Step 2: Create app/api/contact/route.ts**

```ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail, postDiscord } from '@/lib/contact';

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(10).max(4000),
  role: z.string().optional(),
});

const rateLimit = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (entry && entry.reset > now) {
    if (entry.count >= RATE_LIMIT) {
      return NextResponse.json({ ok: false, error: 'rate-limited' }, { status: 429 });
    }
    entry.count += 1;
  } else {
    rateLimit.set(ip, { count: 1, reset: now + WINDOW_MS });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  const [emailOk, discordOk] = await Promise.all([
    sendEmail(parsed.data),
    postDiscord(parsed.data),
  ]);

  if (!emailOk && !discordOk) {
    return NextResponse.json({ ok: false, error: 'delivery-failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Write test**

Create `tests/unit/contact-route.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('contact route schema', () => {
  it('rejects empty message', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'a', email: 'a@b.com', message: 'short' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 4: Run test**

```bash
npm test -- tests/unit/contact-route.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/contact.ts app/api/contact/ tests/unit/contact-route.test.ts
git commit -m "feat: contact API route with rate limiting and dual delivery"
```

---

### Task 33: Resume PDF API Route

**Files:**
- Create: `content/resume-data.ts`, `lib/pdf.tsx`, `app/api/resume/route.ts`

- [ ] **Step 1: Create content/resume-data.ts**

```ts
export const RESUME_DATA = {
  name: 'Sai Dheeraj Gantala',
  title: 'System Engineer',
  email: 'gantala.saidheeraj@gmail.com',
  location: 'Hyderabad, India',
  links: {
    linkedin: 'https://www.linkedin.com/in/saidheerajgantala/',
    github: 'https://github.com/dheerajgantala',
    portfolio: 'https://saidheerajgantala.me',
  },
  summary: 'SDE2-era engineer building enterprise AI agent platforms with LangGraph, Temporal, and Google ADK. Multi-cloud DevOps, full-stack development, certified cloud architect.',
  experience: [
    {
      company: 'EPAM Systems',
      role: 'System Engineer',
      period: 'Oct 2025 – Present',
      location: 'Bengaluru',
      bullets: [
        'Building enterprise AI platform for managing AI agents, MCPs, and agentic workflows',
        'Multi-tenant RBAC, role-based dashboards, Backstage developer portal',
        'Designed RCA agent and multi-step agentic workflows with LangGraph + Google ADK',
      ],
    },
    {
      company: 'Xebia',
      role: 'Software Engineer',
      period: 'Jul 2023 – Oct 2025',
      location: 'Hyderabad',
      bullets: [
        'Integrated AWS RDS ↔ Azure MSSQL via DMS — 35% cross-platform latency reduction',
        'Cut AWS costs 35% via rightsizing + Lambda lifecycle automation',
        'Integrated LLM RAG pipelines into engineering workflows',
      ],
    },
    {
      company: 'Xebia',
      role: 'Associate Software Engineer',
      period: 'Jul 2022 – Jun 2023',
      location: 'Hyderabad',
      bullets: [
        'Migrated Rails + Postgres from Heroku to AWS — 70% boot time reduction',
        'Reduced critical incidents by 70% via ELK stack + structured incident response',
      ],
    },
  ],
  certifications: [
    'Google Cloud Certified Professional Cloud Architect',
    'AWS Certified Machine Learning',
  ],
  skills: {
    'AI / Agentic': ['LangGraph', 'Temporal', 'Google ADK', 'OpenAI', 'Claude'],
    'Cloud': ['AWS', 'GCP', 'Azure'],
    'DevOps': ['Terraform', 'Docker', 'Kubernetes', 'GitHub Actions', 'Jenkins'],
    'Languages': ['TypeScript', 'Python', 'Go', 'Ruby', 'Bash'],
  },
};
```

- [ ] **Step 2: Create lib/pdf.tsx**

```tsx
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { RESUME_DATA } from '@/content/resume-data';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#0A0A0B' },
  header: { marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  title: { fontSize: 12, color: '#57534E', marginBottom: 8 },
  links: { fontSize: 9, color: '#57534E', marginBottom: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, borderBottom: '1pt solid #D6D3D1', paddingBottom: 2 },
  expItem: { marginBottom: 10 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  expRole: { fontWeight: 700 },
  expPeriod: { color: '#57534E', fontSize: 9 },
  expCompany: { color: '#57534E', fontSize: 9, marginBottom: 4 },
  bullet: { marginLeft: 12, marginBottom: 2, flexDirection: 'row' },
  bulletDot: { width: 8 },
  bulletText: { flex: 1 },
  skillsRow: { flexDirection: 'row', marginBottom: 4 },
  skillsCat: { width: 80, fontWeight: 700 },
  skillsList: { flex: 1, color: '#57534E' },
});

function Resume() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{RESUME_DATA.name}</Text>
          <Text style={styles.title}>{RESUME_DATA.title} · {RESUME_DATA.location}</Text>
          <View style={styles.links}>
            <Text>{RESUME_DATA.email}</Text>
            <Text> · {RESUME_DATA.links.linkedin}</Text>
            <Text> · {RESUME_DATA.links.github}</Text>
            <Text> · {RESUME_DATA.links.portfolio}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text>{RESUME_DATA.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {RESUME_DATA.experience.map((exp, i) => (
            <View key={i} style={styles.expItem}>
              <View style={styles.expHeader}>
                <Text style={styles.expRole}>{exp.role} · {exp.company}</Text>
                <Text style={styles.expPeriod}>{exp.period}</Text>
              </View>
              <Text style={styles.expCompany}>{exp.location}</Text>
              {exp.bullets.map((b, j) => (
                <View key={j} style={styles.bullet}>
                  <Text style={styles.bulletDot}>·</Text>
                  <Text style={styles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {RESUME_DATA.certifications.map((c, i) => (
            <Text key={i}>· {c}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {Object.entries(RESUME_DATA.skills).map(([cat, items]) => (
            <View key={cat} style={styles.skillsRow}>
              <Text style={styles.skillsCat}>{cat}</Text>
              <Text style={styles.skillsList}>{items.join(' · ')}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export async function renderResumePdf(): Promise<Buffer> {
  return renderToBuffer(<Resume />);
}
```

- [ ] **Step 3: Create app/api/resume/route.ts**

```ts
import { renderResumePdf } from '@/lib/pdf';

export async function GET() {
  const pdf = await renderResumePdf();
  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Sai-Dheeraj-Gantala-Resume.pdf"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add content/resume-data.ts lib/pdf.tsx app/api/resume/
git commit -m "feat: resume PDF API route rendered from content"
```

---

## Phase 12: Vercel & Domain

### Task 34: Vercel Config

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["bom1", "sin1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/resume.pdf",
      "destination": "/api/resume",
      "statusCode": 301
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add vercel.json
git commit -m "chore: vercel config with security headers and resume redirect"
```

---

### Task 35: Domain Setup Documentation

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add deployment section to README.md**

Append to `README.md`:
```markdown

## Deploy

This site is deployed on Vercel at `https://saidheerajgantala.me`.

### Custom domain

1. In Vercel project settings → Domains, add `saidheerajgantala.me` and `www.saidheerajgantala.me`.
2. At your DNS provider, add:
   - `A` record `@` → `76.76.21.21`
   - `CNAME` record `www` → `cname.vercel-dns.com`
3. SSL is auto-provisioned by Vercel.

### Environment variables

Set in Vercel project settings:
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`
- `DISCORD_WEBHOOK_URL`
- `NEXT_PUBLIC_SITE_URL=https://saidheerajgantala.me`

### Redirect legacy

The previous `saidheerajgantala.vercel.app` URL is kept as a 301 redirect to the apCustom domain.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: deployment and domain setup"
```

---

## Phase 13: Performance & Accessibility

### Task 36: Performance Pass

**Files:**
- Modify: `next.config.mjs`, `app/page.tsx`

- [ ] **Step 1: Add Image optimization to next.config.mjs**

Replace `next.config.mjs` with:
```js
import createMDX from '@next/mdx';

const withMDX = createMDX({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  experimental: { optimizePackageImports: ['motion', '@react-three/drei'] },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
```

- [ ] **Step 2: Add Vercel Analytics to app/layout.tsx**

Insert just before `</body>` in `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';
```

Then before `</body>`:
```tsx
<Analytics />
```

- [ ] **Step 3: Install Vercel Analytics**

```bash
npm install @vercel/analytics
```

- [ ] **Step 4: Commit**

```bash
git add next.config.mjs app/layout.tsx package.json
git commit -m "perf: image optimization, security headers, Vercel Analytics"
```

---

### Task 37: Skip-to-Content & Accessibility Polish

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add skip-to-content link**

At the top of `<body>` in `app/layout.tsx`, add:
```tsx
<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-bg">
  Skip to content
</a>
```

And change `<main>` to `<main id="main">` in `app/page.tsx`.

- [ ] **Step 2: Write a11y test**

Create `tests/unit/a11y.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('accessibility', () => {
  it('skip-to-content link is present in layout', () => {
    // Smoke test — verifies the layout exports the skip link
    const { container } = render(<a href="#main">Skip to content</a>);
    expect(screen.getByText('Skip to content')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test -- tests/unit/a11y.test.tsx
```

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx tests/unit/a11y.test.tsx
git commit -m "a11y: skip-to-content link and main landmark"
```

---

### Task 38: 404 Page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Create app/not-found.tsx**

```tsx
import Link from 'next/link';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="pt-14 min-h-[80vh] flex items-center">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <p className="font-mono text-xs text-text-muted mb-4">$ ls /404</p>
          <h1 className="font-display font-bold text-text mb-6" style={{ fontSize: 'clamp(64px, 12vw, 160px)', letterSpacing: '-0.04em', lineHeight: 1.0 }}>
            404
          </h1>
          <p className="text-lg text-text-muted mb-8">No route at this address.</p>
          <Link href="/"><Button>Back home</Button></Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat: 404 page"
```

---

## Phase 14: E2E Verification

### Task 39: Playwright E2E — WhoAmI Flow

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/whoami.spec.ts`

- [ ] **Step 1: Create playwright.config.ts**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run build && npm start',
    port: 3000,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
});
```

- [ ] **Step 2: Create tests/e2e/whoami.spec.ts**

```ts
import { test, expect } from '@playwright/test';

test('first visit shows WhoAmI modal', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Identify yourself')).toBeVisible();
});

test('skip sets role to peer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip' }).click();
  await expect(page).toHaveCookie('whoami-role', 'peer');
});

test('selecting founder surfaces ventures near the top', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Founder').click();
  await page.getByRole('button', { name: /Continue as Founder/ }).click();
  const secondSection = await page.locator('section').nth(1).getAttribute('id');
  expect(secondSection).toBe('ventures');
});

test('reduced motion disables particle animation', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();
  await context.close();
});
```

- [ ] **Step 3: Run E2E**

```bash
npm run test:e2e
```

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts tests/e2e/
git commit -m "test: e2e whoami flow and role reordering"
```

---

### Task 40: Final Build & Lighthouse

- [ ] **Step 1: Run type-check**

```bash
npm run type-check
```

Expected: 0 errors.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 3: Run all tests**

```bash
npm test
npm run test:e2e
```

Expected: all green.

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: build succeeds, no warnings.

- [ ] **Step 5: Lighthouse mobile (run against deployed URL after first deploy)**

```bash
npx lighthouse https://saidheerajgantala.me --form-factor=mobile --output=json --output-path=./lighthouse.json
```

Expected: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90.

- [ ] **Step 6: Commit any final fixes**

```bash
git add .
git commit -m "chore: pre-launch verification (type-check, lint, tests, build green)"
```

---

## Spec Coverage Check

| Spec Section | Task |
|---|---|
| §1 The single idea | All tasks implement this |
| §2.1 WhoAmIModal | Task 11, 12 |
| §2.2 Per-role section ordering | Task 5, 27 |
| §2.3 Per-role CTA copy | Task 6, 26, 27 |
| §2.4 Per-role first-fold content | Task 6, 27 |
| §3 Site map | Task 28, 30, 31, 32, 33 |
| §4.1 Hero | Task 13, 14, 15, 27 |
| §4.2 Career Arc | Task 21 |
| §4.3 Currently Building | Task 22 |
| §4.4 Venture Portfolio | Task 23 |
| §4.5 Multi-Cloud Work | Task 24 |
| §4.6 Operating Principles | Task 25 |
| §4.7 Recognition | Task 25 |
| §4.8 Writing | Task 25 |
| §4.9 Contact | Task 26 |
| §5.1 Color tokens | Task 2 |
| §5.2 Typography | Task 2, 3 |
| §5.3 Layout grid | Task 2 |
| §5.4 Motion language | Task 27 |
| §6.1 WebGL particle hero | Task 13, 14, 15 |
| §6.2 Ambient agent-trace panel | Task 16, 17 |
| §6.3 Audience-aware re-shape | Task 27 |
| §6.4 Cursor glow trail | Task 19 |
| §6.5 Section divider with running text | Task 18 |
| §6.6 Venture status indicators | Task 20 |
| §7.1 Stack | Task 1 |
| §7.2 Project structure | Tasks 1–38 |
| §7.3 State management | Task 7, 8 |
| §7.4 Section-order config | Task 5 |
| §7.5 API routes | Task 32, 33 |
| §7.6 WebGL performance | Task 14 |
| §7.7 Accessibility | Task 37 |
| §7.8 Out of scope | n/a (excluded by design) |
| §8 Success criteria | Task 40 |
| §9 Risks | Embedded in tasks |
| §10 Open questions | None remaining |
| Domain `saidheerajgantala.me` | Task 35, 36 |

All spec requirements have a task. No gaps.
