// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RefObject } from 'react';
import { WhoAmIModal } from '@/components/entry/WhoAmIModal';
import type { WhoAmIModalHandle } from '@/components/entry/WhoAmIModal';

describe('WhoAmIModal', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = '';
  });

  it('opens on first visit', async () => {
    render(<WhoAmIModal />);
    expect(await screen.findByText('Identify yourself')).toBeInTheDocument();
  });

  it('does not open if already seen', async () => {
    localStorage.setItem('whoami-seen', '1');
    render(<WhoAmIModal />);
    expect(screen.queryByText('Identify yourself')).not.toBeInTheDocument();
  });

  it('skip sets role to peer', async () => {
    render(<WhoAmIModal />);
    await screen.findByText('Identify yourself');
    await userEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(document.cookie).toMatch(/whoami-role=peer/);
  });

  it('confirm sets chosen role', async () => {
    render(<WhoAmIModal />);
    await screen.findByText('Identify yourself');
    await userEvent.click(screen.getByRole('radio', { name: /Founder/ }));
    await userEvent.click(screen.getByRole('button', { name: /Continue as Founder/ }));
    expect(document.cookie).toMatch(/whoami-role=founder/);
  });

  it('Esc persists peer and sets whoami-seen', async () => {
    render(<WhoAmIModal />);
    await screen.findByText('Identify yourself');
    await userEvent.keyboard('{Escape}');
    expect(document.cookie).toMatch(/whoami-role=peer/);
    expect(localStorage.getItem('whoami-seen')).toBe('1');
  });

  it('exposes imperative open() via ref', () => {
    const ref = { current: null } as unknown as RefObject<WhoAmIModalHandle>;
    render(<WhoAmIModal ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(typeof ref.current!.open).toBe('function');
  });
});
