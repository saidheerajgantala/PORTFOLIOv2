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
    'MCP · LangGraph · Temporal · Google ADK · Kubernetes · Backstage · RBAC. Multi-tenant. Operator-in-the-loop.',
  founder:
    'Three shipped products. 30% revenue lift, 35% cost out, 80% backup-time out — outcomes, not slogans.',
  client:
    'AWS, GCP, Azure. CI/CD, observability, IaC, AI in production. Designed for teams of 20+.',
};

export const HERO_HEADLINE = 'Building the operating layer where AI meets engineering.';
