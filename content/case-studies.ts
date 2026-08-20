import type { CaseStudyMeta } from '@/lib/types';

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug: 'agent-platform',
    title: 'Enterprise Agent Platform',
    subtitle: 'Production agent orchestration @ EPAM',
    period: '2025 — Present',
    role: 'SDE2',
    stack: ['LangGraph', 'Temporal', 'Google ADK', 'Backstage', 'Python', 'FastAPI'],
  },
];

export function getCaseStudy(slug: string): CaseStudyMeta | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
