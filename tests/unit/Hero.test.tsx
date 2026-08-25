// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Hero } from '@/components/hero/Hero';
import { useWhoAmI } from '@/components/entry/whoami-store';
import { ROLES } from '@/lib/types';
import type { Role } from '@/lib/types';

// Mock the Zustand store so each test can pin the role without cookies/RSC.
vi.mock('@/components/entry/whoami-store', () => ({
  useWhoAmI: vi.fn(),
}));

const mockUseWhoAmI = vi.mocked(useWhoAmI);

function setRole(role: Role) {
  mockUseWhoAmI.mockImplementation(
    ((selector: (s: { role: Role }) => unknown) =>
      selector({ role })) as never,
  );
}

beforeEach(() => {
  cleanup();
  mockUseWhoAmI.mockReset();
});

const GREETING_WORDS = ['Hello.', 'Hi.', 'Hey.', 'Namaste.', 'Howdy.'];

describe('Hero', () => {
  it('renders the static name', () => {
    setRole('recruiter');
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: /sai dheeraj gantala/i })).toBeInTheDocument();
  });

  it('renders the static role line', () => {
    setRole('recruiter');
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 2, name: /backend engineer.*agent platforms.*bengaluru/i })).toBeInTheDocument();
  });

  it('renders the role-specific bio intro', () => {
    setRole('recruiter');
    const { rerender } = render(<Hero />);
    expect(screen.getByText(/Backend engineer at/i)).toBeInTheDocument();

    setRole('peer');
    rerender(<Hero />);
    expect(screen.getByText(/Building agent platforms with/i)).toBeInTheDocument();

    setRole('founder');
    rerender(<Hero />);
    expect(screen.getByText(/Shipped:/i)).toBeInTheDocument();

    setRole('client');
    rerender(<Hero />);
    expect(screen.getByText(/AWS · Azure platforms that deliver/i)).toBeInTheDocument();
  });

  it.each(ROLES)('renders at least one bio accent span for %s', (role: Role) => {
    setRole(role);
    const { container } = render(<Hero />);
    const accents = Array.from(container.querySelectorAll('a.text-accent'));
    expect(accents.length).toBeGreaterThan(0);
  });

  it('renders the primary CTA link to #contact', () => {
    setRole('founder');
    const { container } = render(<Hero />);
    const cta = container.querySelector('a[href="#contact"]');
    expect(cta).toBeTruthy();
    expect(cta?.textContent).toMatch(/shipping/i);
  });

  it('does not render any greeting words', () => {
    setRole('recruiter');
    const { container } = render(<Hero />);
    const text = container.textContent ?? '';
    for (const word of GREETING_WORDS) {
      expect(text).not.toContain(word);
    }
  });

  it('renders three secondary links (mailto, EPAM anchor, notes anchor)', () => {
    setRole('recruiter');
    const { container } = render(<Hero />);
    const mailto = container.querySelector('a[href^="mailto:"]');
    const epam = container.querySelector('a[href="#career-arc"]');
    const notes = container.querySelector('a[href="#currently-building"]');
    expect(mailto).toBeTruthy();
    expect(epam).toBeTruthy();
    expect(notes).toBeTruthy();
  });
});