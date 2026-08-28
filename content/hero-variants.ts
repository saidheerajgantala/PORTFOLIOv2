import type { Role } from '@/lib/types';

export interface HeroCta {
  label: string;
  href: string;
  primary?: boolean; // styling flag — accent border + brighter color
}

export interface HeroVariant {
  sub: string;             // role-aware subhead under the headline
  cta: string;             // primary CTA label (kept for legacy callers)
  tint: string;            // accent color (CSS variable, scoped to the hero container)
  ctas: HeroCta[];         // 4 role-aware CTAs (1 primary + 3 secondary)
}

export const HERO_VARIANT: Record<Role, HeroVariant> = {
  recruiter: {
    sub: 'System Engineer @ EPAM · Bengaluru · Oct 2025 — Present',
    cta: 'Book a 30-min intro →',
    tint: '#C6FF3D',
    ctas: [
      { label: 'Book a 30-min intro →', href: '#contact', primary: true },
      { label: 'Open to roles →', href: 'mailto:gantala.saidheeraj@gmail.com' },
      { label: 'Currently @ EPAM', href: '#career-arc' },
      { label: '7 certs →', href: '#certifications' },
    ],
  },
  peer: {
    sub: 'LangGraph · Temporal · Google ADK · RBAC · Backstage · Multi-cloud',
    cta: 'Architecture deep-dive →',
    tint: '#9DFF66',
    ctas: [
      { label: 'Architecture deep-dive →', href: '#currently-building', primary: true },
      { label: 'Notes on agent reliability', href: '#currently-building' },
      { label: 'Stack →', href: '#multi-cloud' },
      { label: 'Career arc', href: '#career-arc' },
    ],
  },
  founder: {
    sub: 'Three shipped products · 30% rev lift · 35% cost out · 80% backup time out',
    cta: "Let's talk shipping →",
    tint: '#E6FF66',
    ctas: [
      { label: "Let's talk shipping →", href: '#contact', primary: true },
      { label: 'Hiiired ↗', href: 'https://www.hiiired.cv/' },
      { label: 'Noxstack ↗', href: 'https://www.noxstack.com/' },
      { label: 'WeDAA ↗', href: 'https://www.wedaa.tech/' },
    ],
  },
  client: {
    sub: 'AWS · GCP · Azure · Designed for teams of 20+ · Reliability + cost discipline',
    cta: 'See how I work →',
    tint: '#C6FF3D',
    ctas: [
      { label: 'See how I work →', href: '#currently-building', primary: true },
      { label: 'Multi-cloud stack', href: '#multi-cloud' },
      { label: 'Reliability + cost', href: '#currently-building' },
      { label: 'Get in touch', href: '#contact' },
    ],
  },
};