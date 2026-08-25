import { describe, it, expect } from 'vitest';
import { HERO_VARIANT } from '@/content/hero-variants';
import { ROLES } from '@/lib/types';

describe('hero variants', () => {
  it('has a variant for every role with sub, cta, and tint', () => {
    for (const role of ROLES) {
      const v = HERO_VARIANT[role];
      expect(v.sub.length).toBeGreaterThan(0);
      expect(v.cta.length).toBeGreaterThan(0);
      expect(v.tint).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('has 4 CTAs per role with exactly one primary', () => {
    for (const role of ROLES) {
      const v = HERO_VARIANT[role];
      expect(v.ctas).toHaveLength(4);
      const primaries = v.ctas.filter((c) => c.primary);
      expect(primaries).toHaveLength(1);
      for (const c of v.ctas) {
        expect(c.label.length).toBeGreaterThan(0);
        expect(c.href.length).toBeGreaterThan(0);
      }
    }
  });

  it('does not export a greeting cycle (removed in redesign)', async () => {
    const mod = await import('@/content/hero-variants');
    expect((mod as Record<string, unknown>).HERO_GREETING_CYCLE).toBeUndefined();
  });
});