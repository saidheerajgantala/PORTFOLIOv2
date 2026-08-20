import { describe, it, expect } from 'vitest';
import { CASE_STUDIES, getCaseStudy } from '@/content/case-studies';

describe('case-studies registry', () => {
  it('contains agent-platform', () => {
    const slugs = CASE_STUDIES.map((c) => c.slug);
    expect(slugs).toContain('agent-platform');
  });

  it('does not include fabricated entries', () => {
    const slugs = CASE_STUDIES.map((c) => c.slug);
    expect(slugs).not.toContain('jobharvester');
  });

  it('getCaseStudy returns the right meta or undefined', () => {
    expect(getCaseStudy('agent-platform')?.title).toBe('Enterprise Agent Platform');
    expect(getCaseStudy('nope')).toBeUndefined();
  });
});
