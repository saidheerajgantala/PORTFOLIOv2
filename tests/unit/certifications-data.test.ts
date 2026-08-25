import { describe, it, expect } from 'vitest';
import { CERTIFICATIONS } from '@/content/certifications';

describe('CERTIFICATIONS', () => {
  it('has 7 entries', () => {
    expect(CERTIFICATIONS).toHaveLength(7);
  });

  it('includes the two Google Gemini Enterprise certs (Aug 2026)', () => {
    const slugs = CERTIFICATIONS.map((c) => c.slug);
    expect(slugs).toContain('google-gemini-agent-dev');
    expect(slugs).toContain('google-gemini-deployment');
  });

  it('slugs are unique', () => {
    const slugs = CERTIFICATIONS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every entry has non-empty title, issuer, issued', () => {
    for (const c of CERTIFICATIONS) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.issuer.length).toBeGreaterThan(0);
      expect(c.issued).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it('Credly links point at credly.com', () => {
    for (const c of CERTIFICATIONS) {
      if (c.href) expect(c.href).toMatch(/^https:\/\/(www\.)?credly\.com\//);
    }
  });
});