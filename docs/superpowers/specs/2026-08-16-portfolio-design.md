# Portfolio Redesign — Design Spec

**Date:** 2026-08-16
**Subject:** Sai Dheeraj Gantala's portfolio site (`saidheerajgantala.vercel.app`)
**Direction:** "The Agent Console" — portfolio-as-agent-platform
**Status:** Approved by user, awaiting implementation plan

---

## 1. The single idea

The portfolio IS an agentic command surface. The audience-selection popup isn't marketing theater — it's the entry point to a live, personalized view of his work. The site behaves like the control plane he ships at EPAM: pick your role, the page re-shapes itself to surface what's relevant to you. This is the most direct expression of his current work as a portfolio experience.

**Audience-aware transformation is the signature.** Nothing on the Awwwards front page does this.

---

## 2. Audience transformation

### 2.1 Entry modal (`WhoAmIModal`)

A terminal-styled modal appears on first visit with a hairline above each role option styled as a shell command:

```
$ whoami --role=[recruiter|peer|founder|client]
$ whoami --name="<optional>"
$ whoami --skip    # defaults to peer, no name
```

| Element | Behavior |
|---|---|
| Role cards | 4 selectable: Recruiter, Peer, Founder, Client. Each card has a 1-line value-prop ("Outcome metrics & resume", "Architecture depth", "Builder track record", "Business outcomes & reliability"). |
| Name input | Optional single text field. Stored locally, never sent anywhere. |
| Skip button | Sets role = `peer`, name = `null`. |
| Keyboard nav | Tab between cards, arrow keys to select, Enter to confirm, Esc to skip. |
| Persistence | `{ role, name }` stored in `localStorage` AND mirrored to cookies `whoami-role` + `whoami-name` so SSR is correct on first paint. |
| Re-edit | A small `whoami --edit` link in the footer re-opens the modal. |

### 2.2 Per-role section ordering

| Role | Section order |
|---|---|
| **recruiter** | hero → recognition → currently-building → career-arc → ventures → multi-cloud → principles → writing → contact |
| **peer** (default) | hero → career-arc → currently-building → multi-cloud → ventures → principles → recognition → writing → contact |
| **founder** | hero → ventures → currently-building → career-arc → multi-cloud → principles → recognition → writing → contact |
| **client** | hero → multi-cloud → principles → ventures → career-arc → currently-building → recognition → writing → contact |

### 2.3 Per-role CTA copy

| Role | Hero CTA | Contact CTA |
|---|---|---|
| Recruiter | "Book a 30-min intro →" | "Book a 30-min intro" |
| Peer | "Read the case study →" | "Open a thread" |
| Founder | "Let's talk shipping →" | "Let's talk shipping" |
| Client | "See how I work →" | "Scope a project" |

### 2.4 Per-role first-fold content

| Role | Above-the-fold emphasis |
|---|---|
| Recruiter | Outcome metrics ribbon (35% cost reduction, 70% boot time, 99.9% uptime, 35% latency reduction) |
| Peer | WebGL agent-topology hero, technical depth visible |
| Founder | Three venture cards + "shipped solo or co-founded" line |
| Client | Business-outcome callouts, before/after framing |

---

## 3. Site map

**Primary domain:** `saidheerajgantala.me`
**Vercel deployment URL:** `saidheerajgantala.vercel.app` (kept as fallback/redirect source)

```
/                          → Entry modal → personalized single-page
/work/agent-platform       → MDX case study (EPAM LangGraph + Temporal)
/work/jobharvester         → MDX case study (solo AI/ML venture)
/work/[slug]               → Reserved for future case studies
/api/contact               → Vercel serverless route → email + Discord webhook
/api/resume.pdf            → Server route that renders PDF from content.ts
/resume.pdf                → Convenience static path (mirror of /api/resume.pdf)
```

**Domain setup (Vercel):**
- Custom domain `saidheerajgantala.me` configured on Vercel project
- Apex `saidheerajgantala.me` and `www.saidheerajgantala.me` both resolve to Vercel
- SSL via Vercel auto-provisioning
- `saidheerajgantala.vercel.app` retained as a 301 redirect to the new apex for backwards compatibility

Two deep case studies for v1, chosen because they represent the highest-leverage, most distinct work. Other ventures (Noxtag, WeDAA) and full Xebia timeline live as cards on the main page.

---

## 4. Single-page sections

| # | Section | Purpose |
|---|---|---|
| 01 | **Hero** | WebGL particle headline + live agent-trace ambient panel + role-aware CTA |
| 02–09 | Dynamic order | See §2.2 |

### 4.1 Hero

- **Headline:** "Building the operating layer where AI meets engineering." rendered as a cloud of ~3,000 GPU particles that resolve into glyph shapes
- **Subhead:** role-aware (see §2.4)
- **CTA:** role-aware (see §2.3)
- **Ambient trace:** persistent right-rail of synthetic LangGraph run logs (see §6.2)
- **On scroll past:** particles condense into a smaller, denser cluster that becomes a sticky nav indicator

### 4.2 Career Arc

Horizontal timeline ribbon. Each node expands inline (no modals) to show 3-4 representative achievements.

| Stop | Period | Title |
|---|---|---|
| 01 | Mar 2022 – Jun 2022 | Engineer Intern, Xebia |
| 02 | Jul 2022 – Jun 2023 | Associate Software Engineer, Xebia |
| 03 | Jul 2023 – Oct 2025 | Software Engineer, Xebia |
| 04 | Oct 2025 – Present | System Engineer, EPAM Systems |

### 4.3 Currently Building

EPAM AI agent platform — the lead case study. 4 mini-cards:
1. **RCA agent** — root cause analysis over telemetry
2. **Backstage portal** — multi-tenant RBAC, role-based dashboards
3. **Temporal workflows** — durable orchestration for agentic pipelines
4. **Google ADK pipelines** — multi-step agentic workflows

A hand-drawn SVG architecture diagram links them: `RCA agent → LangGraph → Temporal → Backstage`.

### 4.4 Venture Portfolio

Three cards with **real status indicators** (not fake metrics):
- ● green pulse = active
- ● amber = paused
- ● grey = archived

| Venture | Status | One-liner |
|---|---|---|
| Noxtag | ● active | Geo-fenced event notifications (serverless, AWS) |
| WeDAA | ● archived | Cloud-native application prototyping + code generation |
| JobHarvester | ● active | AI agents for job-description extraction + resume tailoring |

### 4.5 Multi-Cloud Work

Three "before / after" callouts:
- AWS migration (Heroku → AWS): 70% boot time reduction
- Azure ↔ AWS integration: 35% cross-platform data latency reduction
- AWS cost audit: 35% cost reduction via rightsizing + Lambda lifecycle policies

Each with a one-line architecture diagram (AWS / GCP / Azure logos + arrows).

### 4.6 Operating Principles

Three principles as set type (not cards):
1. Automate everything possible.
2. Build resilient architectures.
3. Keep security at the core.

### 4.7 Recognition

Certifications + awards as a compact, type-led block:
- Google Cloud Certified Professional Cloud Architect
- AWS Certified Machine Learning
- GEM Award (Xebia, 2022)
- Hall of Fame (BigBasket, 2021, security disclosure)

### 4.8 Writing

2 Medium posts + a "more on Medium →" link:
- How I won $400 just by coding and playing games
- No Infrastructure, Just Code: Learn the Simplicity of Serverless

### 4.9 Contact

Form (name, email, message) → POST `/api/contact` → email + Discord webhook. Plus role-aware CTA button. Email + LinkedIn + GitHub + Medium always visible as fallback.

---

## 5. Visual design system

### 5.1 Color tokens

```
--bg         #0A0A0B
--surface    #14141A
--surface-2  #1C1C24
--border     #26262F
--text       #F5F5F7
--text-muted #8A8A93
--accent     #C6FF3D
--accent-dim #C6FF3D26  /* 15% opacity */
--signal-ok  #4ADE80
--signal-pause #FBBF24
```

**Rule:** accent (#C6FF3D) ≤5% of any viewport. Reserved for: hover/focus/selection, role badges, current-nav indicator. The acid lime is what makes the dark page feel like an operator console.

### 5.2 Typography

```
--display: 'Space Grotesk', weight 700, optical sizing 12-144
--body:    'Inter', weight 400/500, optical sizing 14-32
--mono:    'JetBrains Mono', weight 400/500
```

| Token | Size / line | Use |
|---|---|---|
| display-xl | 128–160px / 0.92 | Hero headline (WebGL) |
| display-lg | 96px / 1.0 | Section labels |
| display-md | 64px / 1.05 | Career arc, project titles |
| heading-lg | 40px / 1.15 | Sub-section |
| heading-md | 24px / 1.3 | Card titles |
| body-lg | 18px / 1.55 | Section openers |
| body | 16px / 1.6 | Default body |
| body-sm | 14px / 1.5 | Captions, tags |
| mono-sm | 13px / 1.4 | System labels, agent traces |
| mono-xs | 11px / 1.3 | Eyebrows, file paths, timestamps |

**Letter-spacing:** display -0.04em, body default, mono +0.02em. The contrast is the typographic personality.

### 5.3 Layout grid

12-column, max-width 1280px, 24px gutters. Sections break with 120px vertical rhythm. Asymmetric: left-aligned headings, ragged-right body. No centered hero.

### 5.4 Motion language

| Trigger | Animation |
|---|---|
| Modal entry | Slide up 24px + backdrop fade, internal stagger 600ms |
| Scroll reveal | Section fade + translate-y 24px on intersect, 400ms cubic-bezier(0.2, 0.8, 0.2, 1) |
| Role re-shape | LayoutGroup reflow, ~700ms |
| Hover | translate-x 2px + accent ring, 120ms |
| Reduced motion | Opacity-only, 200ms |

---

## 6. Signature elements

### 6.1 WebGL particle hero

- ~3,000 particles, `InstancedMesh`, renders at 0.75× DPR on mobile / full DPR desktop
- Particles drift at ~0.05 units/sec
- Cursor proximity (80px) pushes particles radially — subtle, not explosive
- Pauses when off-screen (IntersectionObserver)
- **Fallback:** static SVG glyph render if WebGL absent or `prefers-reduced-motion: reduce`

### 6.2 Ambient agent-trace panel

Persistent right-rail of synthetic-but-plausible LangGraph run logs. Never interactive. Appends every 2-4s with fade-in.

```
▸ 12:04:18  RCA agent · started (run 0x9a2f)
▸ 12:04:19  Temporal · workflow "incident-triage" queued
▸ 12:04:21  Backstage · template "agent-service" scaffolded
▸ 12:04:24  LangGraph · node "log_summary" complete (240ms)
▸ 12:04:25  Google ADK · tool "fetch_metrics" invoked
```

**Mobile:** collapses to single status line below hero. **Reduced motion:** no auto-append, static snapshot.

### 6.3 Audience-aware re-shape

The page physically re-orders via `LayoutGroup` + `AnimatePresence`. On role change, the viewer watches the page re-compose itself in ~700ms. This is the Awwwards-tier moment.

### 6.4 Cursor glow trail

Custom canvas cursor: 16px ring + 200ms-decay accent trail. Disables to native cursor on touch + `prefers-reduced-motion`.

### 6.5 Section divider with running text

Hairline rule with right→left scrolling text, ~30s/loop:
`▸ saidheeraj@portfolio  ~/work  ▸ currently building: enterprise agent platform  ▸ langgraph · temporal · google adk  ▸ open to staff/principal conversations  ▸`

### 6.6 Venture status indicators

Real signals, not decoration: ● active (green pulse), ● paused (amber), ● archived (grey). Always paired with a label — color is never the only signal.

---

## 7. Technical architecture

### 7.1 Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, RSC) |
| Language | TypeScript strict |
| Styling | Tailwind v4 + CSS custom properties |
| UI primitives | Radix UI (Dialog, RadioGroup, Tooltip) |
| Animation | Motion (Framer Motion successor) |
| WebGL | Three.js + React Three Fiber + drei |
| Fonts | next/font (self-hosted Space Grotesk, Inter, JetBrains Mono) |
| Forms | React Hook Form + Zod |
| Case studies | MDX |
| Analytics | Vercel Analytics |
| Deploy | Vercel |
| Lint/format | ESLint flat + Prettier + tsc |

### 7.2 Project structure

```
portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── work/
│   │   ├── agent-platform/page.mdx
│   │   └── jobharvester/page.mdx
│   ├── api/
│   │   ├── contact/route.ts
│   │   └── resume/route.ts
│   └── resume.pdf
├── components/
│   ├── entry/{WhoAmIModal,RoleCard,whoami-store}.tsx
│   ├── hero/{ParticleHero,ParticleField,particle-text}.tsx
│   ├── ambient/{AgentTrace,trace-generator,SectionDivider}.tsx
│   ├── sections/{CareerArc,CurrentlyBuilding,VenturePortfolio,MultiCloud,OperatingPrinciples,Recognition,Writing,Contact}.tsx
│   ├── layout/{CursorTrail,SectionNumber,StatusDot}.tsx
│   └── ui/  # Radix-wrapped primitives
├── content/
│   ├── audience-variants.ts
│   ├── sections.ts
│   └── case-studies/{agent-platform,jobharvester}.mdx
├── lib/
│   ├── motion.ts
│   ├── types.ts
│   └── utils.ts
├── public/{og.png,resume.pdf,particles/}
├── styles/{globals.css,fonts.css}
└── tests/
```

### 7.3 State management

- `whoami-store.ts` (Zustand + persist middleware) holds `{ role, name }` in `localStorage`
- Server reads via cookies (`whoami-role`, `whoami-name`) set by modal on confirm
- Skip → defaults to `'peer'`, no name, sets the cookie
- Case-study routes read role via server-side cookie so they stay consistent

### 7.4 Section-order config (canonical example)

```ts
// content/sections.ts
export type Role = 'recruiter' | 'peer' | 'founder' | 'client';

export const SECTION_ORDER: Record<Role, SectionId[]> = {
  recruiter: ['hero','recognition','currently-building','career-arc','ventures','multi-cloud','principles','writing','contact'],
  peer:      ['hero','career-arc','currently-building','multi-cloud','ventures','principles','recognition','writing','contact'],
  founder:   ['hero','ventures','currently-building','career-arc','multi-cloud','principles','recognition','writing','contact'],
  client:    ['hero','multi-cloud','principles','ventures','career-arc','currently-building','recognition','writing','contact'],
};
```

### 7.5 API routes

| Route | Method | Behavior |
|---|---|---|
| `/api/contact` | POST | Validates with Zod, sends email via Resend AND posts to a Discord webhook (both fire-and-forget; either succeeding is enough). Returns `{ ok: true }`. Rate-limited at 5 req/IP/hr. |
| `/api/resume` | GET | Server-side renders PDF from `content.ts` using `@react-pdf/renderer`. Returns `application/pdf`. |

### 7.6 WebGL performance budget

- 3,000 particles max (auto-reduces to 1,500 if FPS < 50)
- `InstancedMesh`
- DPR: 0.75 mobile, full desktop
- Pause when off-screen
- Static SVG fallback for WebGL-absent / `prefers-reduced-motion`

### 7.7 Accessibility

- WCAG AA on all accent text on dark bg
- Visible keyboard focus (2px accent outline + 4px offset)
- Skip-to-content link
- Full keyboard nav through audience modal
- `prefers-reduced-motion` honored throughout
- Color never the only signal (status indicators always have a shape + label)
- All WebGL has a non-WebGL fallback

### 7.8 Out of scope (v1)

- No blog CMS — hard-coded Medium links
- No dark/light toggle — dark-only by design
- No i18n
- No headless CMS — content lives in MDX + TS, versioned in git
- No A/B testing framework
- No iOS/Android app

---

## 8. Success criteria

A v1 ship is "done" when all of the following are true:

1. Site loads under 2.5s LCP on a 4G mobile profile (Lighthouse mobile ≥ 90)
2. Audience modal opens on first visit, persists across reloads and case-study routes
3. Section re-order animation completes in <800ms with no layout shift (CLS < 0.05)
4. WebGL particle hero renders at ≥50 FPS on a 2020-era MacBook, falls back gracefully otherwise
5. `prefers-reduced-motion` users see no auto-animation and a static SVG hero
6. Contact form successfully delivers a test message to email + Discord
7. PDF resume route generates a PDF that matches the content on the site
8. All four role variants are visually distinct (different first-fold emphasis + different CTA copy)
9. Keyboard-only navigation works end-to-end
10. WCAG AA passes on all text
11. Lighthouse accessibility ≥ 95
12. Site is responsive down to 360px width

---

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Role re-shape feels like marketing theater | Make re-shaping feel functional: per-role content genuinely changes, not just label swaps. Test with users from each audience. |
| WebGL particles too heavy on low-end devices | Auto-reduce count, DPR scaling, IntersectionObserver pause, static SVG fallback. |
| Scope creep into v2 features | Spec is explicit on "out of scope". Any addition requires user re-approval. |
| Resume PDF styling fights `@react-pdf/renderer` | Use minimal styling; test early on `/api/resume` shape. |
| Tailwind v4 instability | Pin a stable minor; have a v3 escape hatch documented. |
| Content drift between site and resume PDF | Both render from same `content.ts` source of truth. |

---

## 10. Open questions (none remaining for v1)

All decisions locked during brainstorming. No open items.
