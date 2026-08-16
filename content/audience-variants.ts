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
