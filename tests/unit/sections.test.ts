import { describe, it, expect } from 'vitest';
import { SECTION_ORDER, ROLE_LABELS } from '@/content/sections';

describe('SECTION_ORDER', () => {
  it('every role has 8 sections', () => {
    for (const order of Object.values(SECTION_ORDER)) {
      expect(order).toHaveLength(8);
    }
  });

  it('recruiter surfaces recognition second', () => {
    expect(SECTION_ORDER.recruiter[1]).toBe('recognition');
  });

  it('founder surfaces ventures second', () => {
    expect(SECTION_ORDER.founder[1]).toBe('ventures');
  });

  it('peer surfaces career-arc second', () => {
    expect(SECTION_ORDER.peer[1]).toBe('career-arc');
  });

  it('client surfaces multi-cloud second', () => {
    expect(SECTION_ORDER.client[1]).toBe('multi-cloud');
  });

  it('every section appears exactly once per role', () => {
    for (const order of Object.values(SECTION_ORDER)) {
      expect(new Set(order).size).toBe(order.length);
    }
  });
});

describe('ROLE_LABELS', () => {
  it('has labels for all four roles', () => {
    expect(Object.keys(ROLE_LABELS)).toHaveLength(4);
  });
});