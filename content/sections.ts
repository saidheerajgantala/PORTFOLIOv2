import type { Role, SectionId } from '@/lib/types';

export const SECTION_ORDER: Record<Role, SectionId[]> = {
  recruiter: [
    'hero', 'recognition', 'currently-building', 'career-arc',
    'ventures', 'multi-cloud', 'principles', 'contact',
  ],
  peer: [
    'hero', 'career-arc', 'currently-building', 'multi-cloud',
    'ventures', 'principles', 'recognition', 'contact',
  ],
  founder: [
    'hero', 'ventures', 'currently-building', 'career-arc',
    'multi-cloud', 'principles', 'recognition', 'contact',
  ],
  client: [
    'hero', 'multi-cloud', 'principles', 'ventures',
    'career-arc', 'currently-building', 'recognition', 'contact',
  ],
};

export const ROLE_LABELS: Record<Role, string> = {
  recruiter: 'Recruiter',
  peer: 'Peer',
  founder: 'Founder',
  client: 'Client',
};

export const ROLE_VALUE_PROPS: Record<Role, string> = {
  recruiter: 'Outcome metrics & resume',
  peer: 'Architecture depth',
  founder: 'Builder track record',
  client: 'Business outcomes & reliability',
};
