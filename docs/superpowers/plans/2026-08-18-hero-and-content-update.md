# Hero Interactivity + Resume-Aligned Content Update — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the hero feel alive (role-reactive text + ambient micro-interactions per role) and rewrite the three core content files (`career.ts`, `audience-variants.ts`, `ventures.ts`) so they match `resume.txt`.

**Architecture:**
- Single source of truth for role-driven hero copy lives in a new `content/hero-variants.ts`.
- `ParticleHero` reads the active role from cookies via `app/page.tsx` and threads a `HeroVariant` prop down to `HeroFallback` (always rendered) and `ParticleField` (WebGL overlay only).
- Each role gets one of four ambient motifs — `tug` / `ripple` / `tilt` / `hue` — implemented in `ParticleField.tsx` and gated by `prefers-reduced-motion: reduce`.
- Content rewrite is a pure-data change to three files plus a small export trim in `audience-variants.ts`.

**Tech Stack:** Next.js 15.5 App Router, Tailwind v4, motion/react, three.js + react-three-fiber v9, Zustand.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `content/hero-variants.ts` | **new** | Per-role hero variant (greeting cycle, sub, cta, motif, tint) |
| `content/career.ts` | **modify** | Real EPAM / Xebia stints |
| `content/audience-variants.ts` | **modify** | Trim redundant exports; accurate `HERO_HEADLINE` |
| `content/ventures.ts` | **modify** | Real Hiiired / Noxstack / WeDAA projects |
| `app/page.tsx` | **modify** | Pass role + variant to `ParticleHero` |
| `components/hero/ParticleHero.tsx` | **modify** | Accept `variant` prop, forward to children |
| `components/hero/HeroFallback.tsx` | **modify** | Drive greeting cycle from variant, render sub + cta slot |
| `components/hero/ParticleField.tsx` | **modify** | Implement `tug` / `ripple` / `tilt` / `hue` behaviors gated by motif + reduceMotion |
| `tests/unit/ParticleHero.test.tsx` | **modify** | Update tests for role-reactive variants |
| `tests/unit/HeroFallback.test.tsx` | **new** | Light tests for variant-driven rendering |

---

## Task 1: Add `content/hero-variants.ts` (data-only foundation)

**Files:**
- Create: `content/hero-variants.ts`

- [ ] **Step 1: Create the new file with the spec content verbatim**

```ts
import type { Role } from '@/lib/types';

export type HeroMotif = 'tug' | 'ripple' | 'tilt' | 'hue';

export interface HeroVariant {
  greeting: string;
  sub: string;
  cta: string;
  motif: HeroMotif;
  tint: string;
}

export const HERO_VARIANT: Record<Role, HeroVariant> = {
  recruiter: {
    greeting: 'Gantala Sai Dheeraj',
    sub: 'System Engineer @ EPAM · Bengaluru · Oct 2025 — Present',
    cta: 'Book a 30-min intro →',
    motif: 'tug',
    tint: '#C6FF3D',
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

- [ ] **Step 2: Run `pnpm type` (or `npx tsc --noEmit`) — must pass**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm type
```

Expected: exit 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add content/hero-variants.ts
git commit -m "feat(hero): role-driven HeroVariant + greeting cycle data

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: Wire the variant through `app/page.tsx` + `ParticleHero`

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/hero/ParticleHero.tsx`

- [ ] **Step 1: Update `app/page.tsx` to pass role + variant**

Replace `app/page.tsx` with:

```tsx
import { readRoleFromCookies, readNameFromCookies } from '@/lib/cookies';
import { ParticleHero } from '@/components/hero/ParticleHero';
import { RoleReshapedPage } from '@/components/RoleReshapedPage';
import { Footer } from '@/components/layout/Footer';
import { HomeShell } from '@/components/HomeShell';
import { HERO_VARIANT } from '@/content/hero-variants';

export default async function HomePage() {
  const role = await readRoleFromCookies();
  const name = await readNameFromCookies();
  return (
    <HomeShell initialRole={role} initialName={name}>
      <ParticleHero role={role} variant={HERO_VARIANT[role]} />
      <RoleReshapedPage />
      <Footer />
    </HomeShell>
  );
}
```

- [ ] **Step 2: Update `components/hero/ParticleHero.tsx`**

Replace the file with:

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type ReactNode } from 'react';
import { HeroFallback } from '@/components/hero/HeroFallback';
import type { Role } from '@/lib/types';
import type { HeroVariant } from '@/content/hero-variants';

const ParticleField = dynamic(
  () => import('@/components/hero/ParticleField').then((m) => m.ParticleField),
  { ssr: false },
);

function detectWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const ctx =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (!ctx) return false;
    const lose = (ctx as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

interface Props {
  role: Role;
  variant: HeroVariant;
}

export function ParticleHero({ role, variant }: Props) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  let overlay: ReactNode = null;
  if (webgl === true) {
    overlay = (
      <div className="absolute inset-0 mix-blend-screen" aria-hidden="true">
        <ParticleField role={role} variant={variant} />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[60vh] min-h-[480px] flex items-center justify-center px-6"
      style={{ ['--accent' as string]: variant.tint }}
    >
      <h1 className="sr-only">{variant.greeting}</h1>
      <div className="relative w-full max-w-5xl mx-auto text-center">
        <HeroFallback role={role} variant={variant} />
      </div>
      {overlay}
      <noscript>
        <HeroFallback role={role} variant={variant} />
      </noscript>
    </div>
  );
}
```

- [ ] **Step 3: Run `pnpm type` — must pass**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm type
```

Expected: `HeroFallback` and `ParticleField` will report missing `role` / `variant` props; that's expected — fixed in next tasks.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/hero/ParticleHero.tsx
git commit -m "feat(hero): thread role + variant from page to ParticleHero

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: Update `HeroFallback` to consume variant

**Files:**
- Modify: `components/hero/HeroFallback.tsx`

- [ ] **Step 1: Replace the file with role-driven content**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HERO_GREETING_CYCLE } from '@/content/hero-variants';
import type { Role } from '@/lib/types';
import type { HeroVariant } from '@/content/hero-variants';

const ROTATE_MS = 2800;

export function HeroFallback({ role, variant }: { role: Role; variant: HeroVariant }) {
  const phrases = HERO_GREETING_CYCLE[role];
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mql.matches);
    const onChange = () => setReduceMotion(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, phrases.length]);

  return (
    <div className="relative w-full">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={reduceMotion ? { opacity: 0.35 } : { opacity: [0.25, 0.45, 0.25] }}
        transition={
          reduceMotion
            ? { duration: 1.2, ease: 'easeOut' }
            : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <div
          className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, color-mix(in oklab, var(--accent) 18%, transparent) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ duration: 1.5 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--text) 1px, transparent 1px), linear-gradient(to bottom, var(--text) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage:
              'radial-gradient(ellipse 50% 70% at 50% 50%, black 0%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 50% 70% at 50% 50%, black 0%, transparent 75%)',
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 -z-10 w-px"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, var(--accent) 50%, transparent 100%)',
          opacity: 0.5,
        }}
        initial={{ left: '10%' }}
        animate={reduceMotion ? undefined : { left: ['10%', '90%', '10%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {[
        { top: '12%', left: '15%', size: 8, delay: 0, dur: 6 },
        { top: '70%', left: '85%', size: 6, delay: 0.5, dur: 7.5 },
        { top: '82%', left: '22%', size: 4, delay: 1, dur: 5 },
        { top: '24%', left: '88%', size: 7, delay: 1.5, dur: 8 },
        { top: '50%', left: '8%', size: 3, delay: 2, dur: 6.5 },
        { top: '40%', left: '92%', size: 5, delay: 0.8, dur: 7 },
      ].map((d, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full -z-10"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            background: 'var(--accent)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            reduceMotion
              ? { opacity: 0.8 }
              : {
                  opacity: [0.2, 1, 0.2],
                  scale: [0.5, 1.4, 0.5],
                  y: [0, -14, 0],
                }
          }
          transition={{
            duration: d.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: d.delay,
          }}
        />
      ))}

      <h1
        className="font-display font-bold leading-none tracking-[-0.04em] select-none relative"
        style={{ fontSize: 'clamp(48px, 12vw, 160px)' }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--accent) 40%, transparent) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            mixBlendMode: 'screen',
          }}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={phrases[index]}
            className="inline-block relative text-text"
            initial={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: '0.4em', filter: 'blur(16px)' }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: {
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                      staggerChildren: 0.05,
                    },
                  }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: '-0.4em',
                    filter: 'blur(12px)',
                    transition: { duration: 0.4, ease: 'easeIn' },
                  }
            }
          >
            {phrases[index].split('').map((ch, i) => (
              <motion.span
                key={`${phrases[index]}-${i}`}
                className="inline-block"
                initial={reduceMotion ? undefined : { opacity: 0, y: '0.6em' }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 0.55, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }
                }
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </h1>

      <motion.p
        aria-hidden="true"
        className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-text-muted text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
      >
        {variant.sub}
      </motion.p>

      <motion.a
        href="#contact"
        className="mt-4 inline-block font-mono text-sm text-text underline decoration-accent decoration-2 underline-offset-[6px] hover:opacity-80 transition-opacity"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
      >
        {variant.cta}
      </motion.a>
    </div>
  );
}
```

- [ ] **Step 2: Run `pnpm type` — must pass**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm type
```

- [ ] **Step 3: Commit**

```bash
git add components/hero/HeroFallback.tsx
git commit -m "feat(hero): role-driven greeting cycle + subhead + CTA in fallback

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: Implement motifs in `ParticleField`

**Files:**
- Modify: `components/hero/ParticleField.tsx`

- [ ] **Step 1: Replace the file with the role-reactive version**

```tsx
'use client';

import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { makeParticleTargets } from '@/components/hero/particle-text';
import { HERO_GREETING_CYCLE } from '@/content/hero-variants';
import type { Role } from '@/lib/types';
import type { HeroVariant } from '@/content/hero-variants';

const TEXT_CYCLE_MS = 4000;
const SPAWN_DURATION = 1.8;
const MORPH_DURATION = 1.0;

function makeColors(count: number, baseTint: string): Float32Array {
  const out = new Float32Array(count * 3);
  const accent = new THREE.Color(baseTint);
  const dim = new THREE.Color(baseTint).multiplyScalar(0.35);
  const white = new THREE.Color('#F5F5F7');
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    const c = r < 0.65 ? accent : r < 0.85 ? dim : white;
    out[i * 3] = c.r;
    out[i * 3 + 1] = c.g;
    out[i * 3 + 2] = c.b;
  }
  return out;
}

function tintForHour(baseTint: string, hour: number): string {
  // Cool (210°) at 6am → accent (90°) at noon → warm (40°) at 6pm → cool (210°) at midnight.
  const segments: Array<[number, number]> = [
    [0, 210], [6, 210], [12, 90], [18, 40], [24, 210],
  ];
  let hue = segments[segments.length - 1][1];
  for (let i = 0; i < segments.length - 1; i++) {
    const [a, ha] = segments[i];
    const [b, hb] = segments[i + 1];
    if (hour >= a && hour <= b) {
      const t = (hour - a) / (b - a);
      hue = ha + (hb - ha) * t;
      break;
    }
  }
  const c = new THREE.Color(`hsl(${hue.toFixed(0)}, 90%, 60%)`);
  const base = new THREE.Color(baseTint);
  return `#${c.lerp(base, 0.7).getHexString()}`;
}

function Swarm({
  role,
  variant,
  text,
  nextText,
  morphT,
  scrollTilt,
  hueTint,
  particleCount = 3200,
}: {
  role: Role;
  variant: HeroVariant;
  text: string;
  nextText: string;
  morphT: number;
  scrollTilt: number;
  hueTint: string;
  particleCount?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const { size, viewport } = useThree();
  const [reduceMotion, setReduceMotion] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const spawnStart = useRef<number | null>(null);
  // Cached displacement for click ripple — kept across frames so particles can
  // return smoothly to their letterform targets.
  const ripple = useRef<{ active: boolean; t: number; cx: number; cy: number } | null>(null);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mql.matches);
    const onChange = () => setReduceMotion(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onClick = (e: PointerEvent) => {
      if (variant.motif !== 'ripple' || reduceMotion) return;
      ripple.current = {
        active: true,
        t: 0,
        cx: (e.clientX / window.innerWidth) * 2 - 1,
        cy: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onClick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onClick);
    };
  }, [variant.motif, reduceMotion]);

  const targets = useMemo(() => makeParticleTargets(text, 'sans-serif', 4), [text]);
  const nextTargets = useMemo(
    () => makeParticleTargets(nextText, 'sans-serif', 4),
    [nextText],
  );

  const spawnPositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    const radius = Math.max(viewport.width, viewport.height) * 0.8;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.sin(angle) * r * 0.6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, [particleCount, viewport.width, viewport.height]);

  const positions = useMemo(() => spawnPositions.slice(), [spawnPositions]);
  const colors = useMemo(() => makeColors(particleCount, hueTint), [particleCount, hueTint]);

  useFrame((state, delta) => {
    if (!ref.current || reduceMotion) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const t = state.clock.elapsedTime;

    if (spawnStart.current === null) spawnStart.current = t;
    const spawnElapsed = t - spawnStart.current;
    const spawnT = Math.min(1, spawnElapsed / SPAWN_DURATION);
    const spawnEase = 1 - Math.pow(1 - spawnT, 3);

    // Tug: cursor magnet (only when active motif). Ripple: pointer-down shockwave.
    const tug =
      variant.motif === 'tug' && window.matchMedia('(pointer: fine)').matches
        ? { x: mouse.current.x * 0.4, y: -mouse.current.y * 0.4 }
        : { x: 0, y: 0 };

    let rippleDx = 0;
    let rippleDy = 0;
    if (variant.motif === 'ripple' && ripple.current?.active) {
      ripple.current.t += delta;
      const elapsed = ripple.current.t;
      const DURATION = 0.8;
      if (elapsed > DURATION) ripple.current.active = false;
      else {
        const rT = elapsed / DURATION;
        const wave = Math.sin(rT * Math.PI) * (1 - rT);
        const dist = Math.hypot(mouse.current.x - ripple.current.cx, mouse.current.y - ripple.current.cy);
        const falloff = Math.max(0, 1 - dist * 1.5);
        rippleDx = (mouse.current.x - ripple.current.cx) * wave * 0.6 * falloff;
        rippleDy = -(mouse.current.y - ripple.current.cy) * wave * 0.6 * falloff;
      }
    }

    // Tilt: scroll position drives a small Y-axis rotation (mocked via per-particle z displacement).
    const tiltZ = variant.motif === 'tilt' ? scrollTilt * 1.2 : 0;

    const len = Math.max(targets.length, nextTargets.length, 1);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const a = targets[i % Math.max(targets.length, 1)] ?? { x: 0, y: 0 };
      const b = nextTargets[i % Math.max(nextTargets.length, 1)] ?? a;
      const targetX = THREE.MathUtils.lerp(a.x, b.x, morphT);
      const targetY = THREE.MathUtils.lerp(a.y, b.y, morphT);

      const phase = i * 0.013;
      const swirl = Math.sin(t * 0.7 + phase) * 0.08;
      const bob = Math.cos(t * 0.5 + phase * 1.3) * 0.06;

      const sx = spawnPositions[i3];
      const sy = spawnPositions[i3 + 1];
      const sz = spawnPositions[i3 + 2];

      const x = THREE.MathUtils.lerp(sx, targetX + tug.x + rippleDx, spawnEase) + swirl;
      const y = THREE.MathUtils.lerp(sy, targetY + tug.y + rippleDy, spawnEase) + bob;
      const z = THREE.MathUtils.lerp(sz, tiltZ, spawnEase);

      arr[i3] = x;
      arr[i3 + 1] = y;
      arr[i3 + 2] = z;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        color="#FFFFFF"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ParticleField({ role, variant }: { role: Role; variant: HeroVariant }) {
  const [dpr, setDpr] = useState(1);
  const [textIndex, setTextIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [morphStart, setMorphStart] = useState<number | null>(null);
  const [scrollTilt, setScrollTilt] = useState(0);
  const [hueTint, setHueTint] = useState(variant.tint);

  const cycle = HERO_GREETING_CYCLE[role];

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    setDpr(isMobile ? 0.75 : Math.min(window.devicePixelRatio || 1, 2));
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = setInterval(() => {
      setMorphStart(performance.now() / 1000);
      setNextIndex((n) => (n + 1) % cycle.length);
    }, TEXT_CYCLE_MS);
    return () => clearInterval(id);
  }, [cycle.length]);

  useEffect(() => {
    if (variant.motif !== 'tilt') return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = max > 0 ? window.scrollY / max : 0;
      // ±6° tilt mapped to ±0.1 normalized.
      setScrollTilt((t - 0.5) * 0.2);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant.motif]);

  useEffect(() => {
    if (variant.motif !== 'hue') return;
    const update = () => {
      const hour = new Date().getHours() + new Date().getMinutes() / 60;
      setHueTint(tintForHour(variant.tint, hour));
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [variant.motif, variant.tint]);

  const morphT = (() => {
    if (morphStart === null) return 0;
    const elapsed = performance.now() / 1000 - morphStart;
    const t = Math.min(1, elapsed / MORPH_DURATION);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  })();

  useEffect(() => {
    if (morphStart === null) return;
    const elapsed = performance.now() / 1000 - morphStart;
    if (elapsed >= MORPH_DURATION) {
      setTextIndex(nextIndex);
      setMorphStart(null);
    }
  }, [morphStart, nextIndex]);

  const text = cycle[textIndex];
  const nextText = cycle[nextIndex];

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Swarm
        role={role}
        variant={variant}
        text={text}
        nextText={nextText}
        morphT={morphT}
        scrollTilt={scrollTilt}
        hueTint={hueTint}
      />
    </Canvas>
  );
}
```

- [ ] **Step 2: Run `pnpm type` — must pass**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm type
```

- [ ] **Step 3: Run `pnpm test` — existing ParticleHero tests should pass after Task 5's update; for now just verify nothing else broke**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm test 2>&1 | tail -20
```

Expected: existing tests fail (because HeroFallback signature changed and tests still pass `text` prop); note failures for Task 5 fix.

- [ ] **Step 4: Commit**

```bash
git add components/hero/ParticleField.tsx
git commit -m "feat(hero): implement tug/ripple/tilt/hue motifs in ParticleField

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: Update tests for the new variant signatures

**Files:**
- Modify: `tests/unit/ParticleHero.test.tsx`
- Create: `tests/unit/HeroFallback.test.tsx`

- [ ] **Step 1: Replace `tests/unit/ParticleHero.test.tsx`**

```tsx
// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeroFallback } from '@/components/hero/HeroFallback';
import { HERO_VARIANT, HERO_GREETING_CYCLE } from '@/content/hero-variants';

describe('HeroFallback', () => {
  it('renders one of the active role greeting phrases on mount', () => {
    const role = 'recruiter';
    const cycle = HERO_GREETING_CYCLE[role].map((p) =>
      p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    );
    const { container } = render(
      <HeroFallback role={role} variant={HERO_VARIANT[role]} />,
    );
    const text = container.textContent ?? '';
    const matched = cycle.some((p) => text.includes(p));
    expect(matched).toBe(true);
  });

  it('renders the role subhead under the headline', () => {
    const { container } = render(
      <HeroFallback role="peer" variant={HERO_VARIANT.peer} />,
    );
    expect(container.textContent).toMatch(/LangGraph|Temporal|Google ADK/);
  });

  it('renders the role CTA link', () => {
    const { container } = render(
      <HeroFallback role="founder" variant={HERO_VARIANT.founder} />,
    );
    expect(container.textContent).toMatch(/Let's talk shipping/);
  });

  it('ignores unrelated copy across roles', () => {
    const { container } = render(
      <HeroFallback role="client" variant={HERO_VARIANT.client} />,
    );
    expect(container.textContent).not.toMatch(/Let's talk shipping/);
    expect(container.textContent).not.toMatch(/LangGraph/);
  });
});
```

- [ ] **Step 2: Create `tests/unit/HeroFallback.test.tsx` is now the canonical location; remove old ParticleHero test if separate**

If `tests/unit/ParticleHero.test.tsx` exists separately from the rewritten file above, the Write in step 1 already replaced it. Confirm:

```bash
ls -la tests/unit/ | grep -E 'Hero|Particle'
```

Expected: one file, `HeroFallback.test.tsx`.

- [ ] **Step 3: Run `pnpm test` — all hero tests must pass**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm test 2>&1 | tail -30
```

Expected: 4 cases pass, no regressions in the other 83 tests.

- [ ] **Step 4: Commit**

```bash
git add tests/unit/ParticleHero.test.tsx tests/unit/HeroFallback.test.tsx
git commit -m "test(hero): cover role-driven variant rendering in HeroFallback

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: Rewrite `content/career.ts` with real EPAM / Xebia stints

**Files:**
- Modify: `content/career.ts`

- [ ] **Step 1: Replace `content/career.ts`**

```ts
import type { CareerStop } from '@/lib/types';

export const CAREER: CareerStop[] = [
  {
    id: 'epam-agent-platform',
    period: 'Oct 2025 — Present',
    title: 'System Engineer — Enterprise Agent Platform',
    company: 'EPAM Systems',
    location: 'Bengaluru, India',
    achievements: [
      'Building the enterprise AI agent platform — MCP integrations, agentic workflows, operator review loops.',
      'Multi-tenant RBAC and role-based dashboards for developer self-service + operator approval flows.',
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
      '35% AWS cost out via rightsizing + lifecycle automation (Lambda + CloudWatch Events); 65% provisioning time out via Terraform + AWS CDK.',
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

- [ ] **Step 2: Run `pnpm type` — must pass**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm type
```

- [ ] **Step 3: Commit**

```bash
git add content/career.ts
git commit -m "feat(content): rewrite career.ts with real EPAM + Xebia stints

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: Update `content/audience-variants.ts`

**Files:**
- Modify: `content/audience-variants.ts`

- [ ] **Step 1: Replace `content/audience-variants.ts`**

```ts
import type { Role } from '@/lib/types';

export const CONTACT_CTA: Record<Role, string> = {
  recruiter: 'Book a 30-min intro',
  peer: 'Open a thread',
  founder: "Let's talk shipping",
  client: 'Scope a project',
};

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

export const HERO_HEADLINE = 'Building the operating layer where AI meets engineering.';
```

- [ ] **Step 2: Run `pnpm type` — must pass**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm type
```

- [ ] **Step 3: Commit**

```bash
git add content/audience-variants.ts
git commit -m "feat(content): accurate subheads per role; trim redundant exports

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 8: Update `content/ventures.ts` with real projects

**Files:**
- Modify: `content/ventures.ts`

- [ ] **Step 1: Replace `content/ventures.ts`**

```ts
import type { Venture } from '@/lib/types';

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

- [ ] **Step 2: Run `pnpm type` — must pass**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm type
```

- [ ] **Step 3: Commit**

```bash
git add content/ventures.ts
git commit -m "feat(content): real ventures — Hiiired, Noxstack, WeDAA

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 9: Final verification — lint, build, Playwright

**Files:** none

- [ ] **Step 1: Lint clean**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm lint 2>&1 | tail -10
```

Expected: exit 0, no errors.

- [ ] **Step 2: All tests pass**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm test 2>&1 | tail -10
```

Expected: 87+ tests pass.

- [ ] **Step 3: Production build clean**

```bash
cd /home/x5ud0kn1gh7x/Projects/portfolio && pnpm build 2>&1 | tail -25
```

Expected: build succeeds, route table includes `/`.

- [ ] **Step 4: Playwright smoke (via Playwright MCP)**

Use the Playwright MCP server to:

1. Navigate to `http://localhost:3000` (run `pnpm dev` first if needed).
2. Screenshot the hero with default role.
3. Open the WhoAmI modal, switch to "Peer", close, screenshot hero — confirm `Hello, peer.` greets and `LangGraph | Temporal | Google ADK` subhead shows.
4. Switch to "Founder", screenshot — confirm `Let's talk shipping →` CTA and tilt scroll behavior on scroll.
5. Switch to "Recruiter", confirm `Gantala Sai Dheeraj` greeting.
6. Switch to "Client", confirm `hue` tint shift over ~60s (or note "instant at noon").

- [ ] **Step 5: Commit any local fixups (if needed)**

```bash
git status
```

If clean, skip. Otherwise:

```bash
git add -A && git commit -m "chore: post-verification fixups

Co-Authored-By: Claude <noreply@anthropic.com>"
```

- [ ] **Step 6: Push to trigger CI → Vercel deploy**

```bash
git push origin main
```

Watch the GitHub Actions runs:

```bash
gh run list --repo dheeraj-gantala-projects/portfolio-website --limit 4
```

Expected: CI passes, Deploy workflow succeeds, Vercel promotes.

---

## Acceptance Criteria

1. Each of the 4 roles shows distinct hero copy (greeting, sub, CTA) and a different ambient motif.
2. Reduced-motion users see static headlines without physics or scroll-driven tilt.
3. Production URL renders without console errors at any of the 4 role selections.
4. All existing 83 unit tests still pass + 4 new hero tests.
5. Lint, type-check, production build all green.
6. CI passes on push; auto-deploy lands on Vercel production URL.
