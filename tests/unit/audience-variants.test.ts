import { describe, it, expect } from 'vitest';
import { HERO_HEADLINE, CONTACT_CTA } from '@/content/audience-variants';
import { HERO_VARIANT } from '@/content/hero-variants';

describe('audience variants', () => {
  it('HERO_HEADLINE is set', () => {
    expect(HERO_HEADLINE).toMatch(/AI/);
  });

  it('all 4 roles have a CONTACT_CTA', () => {
    expect(Object.keys(CONTACT_CTA)).toHaveLength(4);
  });

  it('CONTACT_CTAs are non-empty', () => {
    for (const cta of Object.values(CONTACT_CTA)) {
      expect(cta.length).toBeGreaterThan(0);
    }
  });

  it('hero-variants exports 4 role variants with required fields', () => {
    for (const variant of Object.values(HERO_VARIANT)) {
      expect(variant.greeting.length).toBeGreaterThan(0);
      expect(variant.sub.length).toBeGreaterThan(0);
      expect(variant.cta.length).toBeGreaterThan(0);
      expect(variant.tint).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(['tug', 'ripple', 'tilt', 'hue']).toContain(variant.motif);
    }
  });
});
