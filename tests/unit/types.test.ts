import { describe, it, expect } from 'vitest';
import type { Role, SectionId } from '@/lib/types';

describe('types', () => {
  it('Role is a string literal union', () => {
    const roles: Role[] = ['recruiter', 'peer', 'founder', 'client'];
    expect(roles).toHaveLength(4);
  });

  it('SectionId has 9 sections', () => {
    const sections: SectionId[] = [
      'hero', 'recognition', 'currently-building', 'career-arc',
      'ventures', 'multi-cloud', 'principles', 'writing', 'contact',
    ];
    expect(sections).toHaveLength(9);
  });
});