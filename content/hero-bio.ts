import type { Role } from '@/lib/types';

export interface BioSpan {
  label: string;
  href: string;
}

export interface HeroBio {
  intro: string;
  spans: BioSpan[];
  outro?: string;
}

export const HERO_BIO: Record<Role, HeroBio> = {
  recruiter: {
    intro: 'Backend engineer at',
    spans: [
      { label: 'EPAM',         href: '#career-arc' },
      { label: 'Bengaluru',    href: '#career-arc' },
      { label: 'AWS',          href: '#multi-cloud' },
      { label: 'LangGraph',    href: '#currently-building' },
      { label: '30% rev lift', href: '#career-arc' },
    ],
  },
  peer: {
    intro: 'Building agent platforms with',
    spans: [
      { label: 'LangGraph',    href: '#currently-building' },
      { label: 'Temporal',     href: '#currently-building' },
      { label: 'Google ADK',   href: '#currently-building' },
      { label: 'RBAC',         href: '#currently-building' },
      { label: 'Backstage',    href: '#currently-building' },
    ],
  },
  founder: {
    intro: 'Shipped:',
    spans: [
      { label: 'Hiiired',         href: '#ventures' },
      { label: 'Noxstack',        href: '#ventures' },
      { label: '30% rev lift',    href: '#career-arc' },
      { label: '35% cost out',    href: '#career-arc' },
      { label: '80% backup out',  href: '#career-arc' },
    ],
  },
  client: {
    intro: 'AWS · Azure platforms that deliver',
    spans: [
      { label: '70% fraud cut',   href: '#multi-cloud' },
      { label: '35% cost out',    href: '#multi-cloud' },
      { label: '30% MTTD out',    href: '#multi-cloud' },
    ],
  },
};
