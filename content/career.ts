import type { CareerStop } from '@/lib/types';

export const CAREER: CareerStop[] = [
  {
    id: 'epam-enterprise-agent',
    period: '2022 — Present',
    title: 'SDE2 — Enterprise Agent Platform',
    company: 'EPAM Systems',
    location: 'Remote / Global',
    achievements: [
      'Built the production agent platform shipping to enterprise clients',
      'Designed RBAC and operator-in-the-loop patterns for long-running workflows',
      'Cut runtime costs by 35% across multi-cloud deployments',
    ],
  },
  {
    id: 'cloud-platform-engineer',
    period: '2020 — 2022',
    title: 'Cloud Platform Engineer',
    company: 'Series-B SaaS',
    location: 'Bengaluru, India',
    achievements: [
      'Led migration from monolith to multi-cloud Kubernetes platform',
      'Boot time reduced 70% via image optimization and aggressive caching',
      'Owned CI/CD, observability, and on-call rotation for 20+ engineers',
    ],
  },
  {
    id: 'backend-engineer',
    period: '2018 — 2020',
    title: 'Backend Engineer',
    company: 'Product Studio',
    location: 'Hyderabad, India',
    achievements: [
      'Shipped core APIs for two consumer products in the first year',
      'Introduced async job processing that handled 10x prior throughput',
      'Mentored two junior engineers through their first on-call rotations',
    ],
  },
];
