// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/hero/Hero';
import { ROLES } from '@/lib/types';
import type { Role } from '@/lib/types';

const GREETING_WORDS = ['Hello.', 'Hi.', 'Hey.', 'Namaste.', 'Howdy.'];

describe('Hero', () => {
  it('renders the static name', () => {
    render(<Hero role="recruiter" />);
    expect(screen.getByRole('heading', { level: 1, name: /sai dheeraj gantala/i })).toBeInTheDocument();
  });

  it('renders the static role line', () => {
    render(<Hero role="recruiter" />);
    expect(screen.getByRole('heading', { level: 2, name: /backend engineer.*agent platforms.*bengaluru/i })).toBeInTheDocument();
  });

  it('renders the role-specific bio intro', () => {
    const { rerender } = render(<Hero role="recruiter" />);
    expect(screen.getByText(/Backend engineer at/i)).toBeInTheDocument();
    rerender(<Hero role="peer" />);
    expect(screen.getByText(/Building agent platforms with/i)).toBeInTheDocument();
    rerender(<Hero role="founder" />);
    expect(screen.getByText(/Shipped:/i)).toBeInTheDocument();
    rerender(<Hero role="client" />);
    expect(screen.getByText(/AWS · Azure platforms that deliver/i)).toBeInTheDocument();
  });

  it.each(ROLES)('renders at least one bio accent span for %s', (role: Role) => {
    const { container } = render(<Hero role={role} />);
    const accents = Array.from(container.querySelectorAll('a.text-accent'));
    expect(accents.length).toBeGreaterThan(0);
  });

  it('renders the primary CTA link to #contact', () => {
    const { container } = render(<Hero role="founder" />);
    const cta = container.querySelector('a[href="#contact"]');
    expect(cta).toBeTruthy();
    expect(cta?.textContent).toMatch(/shipping/i);
  });

  it('does not render any greeting words', () => {
    const { container } = render(<Hero role="recruiter" />);
    const text = container.textContent ?? '';
    for (const word of GREETING_WORDS) {
      expect(text).not.toContain(word);
    }
  });

  it('renders three secondary links (mailto, EPAM anchor, notes anchor)', () => {
    const { container } = render(<Hero role="recruiter" />);
    const mailto = container.querySelector('a[href^="mailto:"]');
    const epam = container.querySelector('a[href="#career-arc"]');
    const notes = container.querySelector('a[href="#currently-building"]');
    expect(mailto).toBeTruthy();
    expect(epam).toBeTruthy();
    expect(notes).toBeTruthy();
  });
});