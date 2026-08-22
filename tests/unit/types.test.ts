import { describe, it, expect } from 'vitest';
import { ROLES, SECTION_IDS, VENTURE_STATUSES } from '@/lib/types';
import type { Role, SectionId, VentureStatus } from '@/lib/types';

describe('types', () => {
  it('Role has 4 members', () => {
    expect(ROLES).toHaveLength(4);
    expect(ROLES).toEqual(['recruiter', 'peer', 'founder', 'client']);
  });

  it('SectionId has 9 members', () => {
    expect(SECTION_IDS).toHaveLength(9);
    expect(SECTION_IDS).toEqual([
      'hero',
      'recognition',
      'currently-building',
      'career-arc',
      'ventures',
      'multi-cloud',
      'certifications',
      'principles',
      'contact',
    ]);
  });

  it('VentureStatus has 3 members', () => {
    expect(VENTURE_STATUSES).toHaveLength(3);
    expect(VENTURE_STATUSES).toEqual(['active', 'paused', 'archived']);
  });

  it('Role type includes every ROLES element (compile-time exhaustiveness)', () => {
    const _exhaust: Role[] = [...ROLES];
    expect(_exhaust).toHaveLength(ROLES.length);
  });

  it('SectionId type includes every SECTION_IDS element (compile-time exhaustiveness)', () => {
    const _exhaust: SectionId[] = [...SECTION_IDS];
    expect(_exhaust).toHaveLength(SECTION_IDS.length);
  });

  it('VentureStatus type includes every VENTURE_STATUSES element (compile-time exhaustiveness)', () => {
    const _exhaust: VentureStatus[] = [...VENTURE_STATUSES];
    expect(_exhaust).toHaveLength(VENTURE_STATUSES.length);
  });
});
