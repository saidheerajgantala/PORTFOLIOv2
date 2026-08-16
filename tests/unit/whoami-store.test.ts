// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { useWhoAmI } from '@/components/entry/whoami-store';

describe('whoami-store', () => {
  beforeEach(() => {
    localStorage.clear();
    useWhoAmI.getState().reset();
  });

  it('defaults to peer role', () => {
    expect(useWhoAmI.getState().role).toBe('peer');
  });

  it('sets role', () => {
    useWhoAmI.getState().setRole('founder');
    expect(useWhoAmI.getState().role).toBe('founder');
  });

  it('sets name', () => {
    useWhoAmI.getState().setName('Dheeraj');
    expect(useWhoAmI.getState().name).toBe('Dheeraj');
  });

  it('resets to default', () => {
    useWhoAmI.getState().setRole('client');
    useWhoAmI.getState().setName('test');
    useWhoAmI.getState().reset();
    expect(useWhoAmI.getState().role).toBe('peer');
    expect(useWhoAmI.getState().name).toBeNull();
  });
});
