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
  peer: ['Hello, peer.', 'Hey, builder.', 'Ship it.'],
  founder: ['Hey.', "Let's talk shipping.", 'Show me the receipts.'],
  client: ['Building the operating layer.', 'Reliability + cost discipline.', 'AI in production.'],
};
