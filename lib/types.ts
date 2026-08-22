export const ROLES = ['recruiter', 'peer', 'founder', 'client'] as const;
export type Role = (typeof ROLES)[number];

export const SECTION_IDS = [
  'hero',
  'recognition',
  'currently-building',
  'career-arc',
  'ventures',
  'multi-cloud',
  'certifications',
  'principles',
  'contact',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const VENTURE_STATUSES = ['active', 'paused', 'archived'] as const;
export type VentureStatus = (typeof VENTURE_STATUSES)[number];

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

export interface ImpactMetric {
  label: string;
  value: string;
}

export interface CaseStudyMeta {
  slug: string;
  title: string;
  subtitle: string;
  period: string;
  role: string;
  stack: string[];
  impact?: ImpactMetric[];
}

export interface CertificationMeta {
  slug: string;
  title: string;
  issuer: string;
  issued: string;     // ISO YYYY-MM
  href?: string;
}
