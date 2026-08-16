import type { CaseStudyMeta } from '@/lib/types';

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug: 'agent-platform',
    title: 'Enterprise Agent Platform',
    subtitle: 'Production-grade agent orchestration at EPAM',
    period: '2022 — Present',
    role: 'SDE2',
    stack: ['LangGraph', 'Temporal', 'LangSmith', 'Python', 'Postgres'],
    impact: [
      { label: 'Clients shipped to', value: '12+' },
      { label: 'Production uptime', value: '99.9%' },
      { label: 'Cost reduction', value: '35%' },
    ],
  },
  {
    slug: 'jobharvester',
    title: 'JobHarvester',
    subtitle: 'Aggregated job feed with skill-gap analysis',
    period: '2023',
    role: 'Solo builder',
    stack: ['Python', 'Postgres', 'FastAPI', 'OpenSearch'],
    impact: [
      { label: 'Listings indexed', value: '50k+' },
      { label: 'Daily active users', value: '200' },
      { label: 'Avg session', value: '4 min' },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudyMeta | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
