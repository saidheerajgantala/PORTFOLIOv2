import { describe, it, expect } from 'vitest';
import { HERO_VARIANT } from '@/content/hero-variants';
import { ROLES } from '@/lib/types';

describe('hero variants', () => {
  it('has a variant for every role', () => {
    for (const role of ROLES) {
      const v = HERO_VARIANT[role];
      expect(v.sub.length).toBeGreaterThan(0);
      expect(v.cta.length).toBeGreaterThan(0);
      expect(v.tint).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('does not export a greeting cycle (removed in redesign)', async () => {
    const mod = await import('@/content/hero-variants');
    expect((mod as Record<string, unknown>).HERO_GREETING_CYCLE).toBeUndefined();
  });
});
