export type Role = 'recruiter' | 'peer' | 'founder' | 'client';

export type SectionId =
  | 'hero'
  | 'recognition'
  | 'currently-building'
  | 'career-arc'
  | 'ventures'
  | 'multi-cloud'
  | 'principles'
  | 'writing'
  | 'contact';

export type VentureStatus = 'active' | 'paused' | 'archived';

export interface Venture {
  slug: string;
  name: string;
  role: string;
  period: string;
  status: VentureStatus;
  tagline: string;
  href: string;
  tags: string[];
}

export interface CareerStop {
  id: string;
  period: string;
  title: string;
  company: string;
  location: string;
  achievements: string[];
}

export interface CaseStudyMeta {
  slug: string;
  title: string;
  subtitle: string;
  period: string;
  role: string;
  stack: string[];
  impact: Array<{ label: string; value: string }>;
}