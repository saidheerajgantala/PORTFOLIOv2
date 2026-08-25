import { describe, it, expect } from 'vitest';
import { HERO_BIO } from '@/content/hero-bio';
import { ROLES } from '@/lib/types';

describe('HERO_BIO', () => {
  it('has an entry for every role', () => {
    for (const role of ROLES) {
      expect(HERO_BIO[role]).toBeDefined();
      expect(HERO_BIO[role].intro.length).toBeGreaterThan(0);
    }
  });

  it('every role has 3+ spans', () => {
    for (const role of ROLES) {
      expect(HERO_BIO[role].spans.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('every span href is an in-page anchor or mailto', () => {
    for (const role of ROLES) {
      for (const span of HERO_BIO[role].spans) {
        expect(span.href.startsWith('#') || span.href.startsWith('mailto:')).toBe(true);
      }
    }
  });

  it('every span label is non-empty', () => {
    for (const role of ROLES) {
      for (const span of HERO_BIO[role].spans) {
        expect(span.label.length).toBeGreaterThan(0);
      }
    }
  });

  it('roles have distinct intro text', () => {
    const intros = new Set(ROLES.map((r) => HERO_BIO[r].intro));
    expect(intros.size).toBe(ROLES.length);
  });

  it('peer bio surfaces MCP, Kubernetes, and LangGraph (latest resume stack)', () => {
    const labels = HERO_BIO.peer.spans.map((s) => s.label);
    expect(labels).toContain('MCP');
    expect(labels).toContain('Kubernetes');
    expect(labels).toContain('LangGraph');
  });

  it('recruiter bio mentions 7 certs (was 5)', () => {
    const labels = HERO_BIO.recruiter.spans.map((s) => s.label);
    // Surface count as accent so a recruiter sees the breadth of certification
    expect(labels.some((l) => /7 certs|7 certifications/i.test(l))).toBe(true);
  });
});
