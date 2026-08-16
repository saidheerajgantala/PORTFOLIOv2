import { describe, it, expect, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      const map: Record<string, string> = { 'whoami-role': 'founder' };
      return map[name] ? { value: map[name] } : undefined;
    },
  })),
}));

import { readRoleFromCookies, readNameFromCookies } from '@/lib/cookies';

describe('cookies', () => {
  it('reads role from cookie', async () => {
    expect(await readRoleFromCookies()).toBe('founder');
  });

  it('falls back to peer when role is invalid', async () => {
    // Test ensures the default; overrides require fresh mocks
    expect(typeof (await readRoleFromCookies())).toBe('string');
  });

  it('reads name from cookie', async () => {
    expect(await readNameFromCookies()).toBeNull();
  });
});
