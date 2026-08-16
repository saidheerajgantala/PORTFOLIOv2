import { describe, it, expect } from 'vitest';
import { HERO_CTA, HERO_HEADLINE } from '@/content/audience-variants';

describe('audience variants', () => {
  it('HERO_HEADLINE is set', () => {
    expect(HERO_HEADLINE).toMatch(/AI/);
  });

  it('all 4 roles have a CTA', () => {
    expect(Object.keys(HERO_CTA)).toHaveLength(4);
  });

  it('CTAs are non-empty', () => {
    for (const cta of Object.values(HERO_CTA)) {
      expect(cta.length).toBeGreaterThan(0);
    }
  });
});
