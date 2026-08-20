import type { Role } from '@/lib/types';

// Single greeting cycle used for every role — the original five phrases.
// Kept short on purpose so the particle text sampler can render them legibly.
export const HERO_GREETING_CYCLE: readonly string[] = [
  'Hello.',
  'Hi.',
  'Hey.',
  'Namaste.',
  'Howdy.',
];

export interface HeroVariant {
  sub: string;   // role-aware subhead under the headline
  cta: string;   // role-aware CTA label
  tint: string;  // accent color (CSS variable, scoped to the hero container)
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
