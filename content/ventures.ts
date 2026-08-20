import type { Venture } from '@/lib/types';

export const VENTURES: Venture[] = [
  {
    slug: 'hiiired',
    name: 'Hiiired',
    role: 'Solo builder',
    period: '2024 — Present',
    status: 'active',
    tagline:
      'AI-powered recruitment: resume tailoring, job matching, authentication, workflows.',
    href: 'https://www.hiiired.cv/',
    tags: ['FastAPI', 'Next.js', 'RAG', 'OpenAI', 'CrewAI'],
  },
  {
    slug: 'noxstack',
    name: 'Noxstack',
    role: 'Solo builder',
    period: '2024 — Present',
    status: 'active',
    tagline:
      'Community-driven local service discovery — find and book neighborhood pros.',
    href: 'https://www.noxstack.com/',
    tags: ['FastAPI', 'PostgreSQL', 'AWS', 'Terraform', 'LangChain'],
  },
  {
    slug: 'wedaa',
    name: 'WeDAA',
    role: 'Co-founder',
    period: '2023 — Present',
    status: 'active',
    tagline:
      'Cloud-native app prototyping + backend code generation. Scaffold to deploy in minutes.',
    href: 'https://www.wedaa.tech/',
    tags: ['Spring Boot', 'Terraform', 'Kubernetes', 'AWS'],
  },
];
