// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';

describe('useReducedMotion', () => {
  it('returns false when prefers-reduced-motion is no-preference', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});