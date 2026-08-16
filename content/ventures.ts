import type { Venture } from '@/lib/types';

export const VENTURES: Venture[] = [
  {
    slug: 'noxtag',
    name: 'Noxtag',
    role: 'Founder',
    period: '2024 — Present',
    status: 'active',
    tagline: 'Privacy-first NFC tags that route to anything you choose. Built for the post-QR era.',
    href: 'https://noxtag.example.com',
    tags: ['NFC', 'Hardware', 'Privacy'],
  },
  {
    slug: 'wedaa',
    name: 'WeDAA',
    role: 'Co-founder',
    period: '2023 — Present',
    status: 'active',
    tagline: 'Workspace for distributed agent architectures. Plan, deploy, and observe multi-agent systems.',
    href: 'https://wedaa.example.com',
    tags: ['Agents', 'DevTools', 'LangGraph'],
  },
  {
    slug: 'jobharvester',
    name: 'JobHarvester',
    role: 'Solo builder',
    period: '2023',
    status: 'paused',
    tagline: 'Aggregator that turns scattered job listings into a single ranked feed with skill-gap analysis.',
    href: 'https://jobharvester.example.com',
    tags: ['Python', 'Postgres', 'Search'],
  },
];