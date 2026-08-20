// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeroFallback } from '@/components/hero/HeroFallback';
import { HERO_VARIANT, HERO_GREETING_CYCLE } from '@/content/hero-variants';
import type { Role } from '@/lib/types';

const ROLES: Role[] = ['recruiter', 'peer', 'founder', 'client'];

describe('HeroFallback', () => {
  it('renders one of the canonical greeting phrases on mount (shared across roles)', () => {
    const { container } = render(
      <HeroFallback role="recruiter" variant={HERO_VARIANT.recruiter} />,
    );
    const text = container.textContent ?? '';
    const matched = HERO_GREETING_CYCLE.some((p) => text.includes(p));
    expect(matched).toBe(true);
  });

  it.each(ROLES)('renders the role subhead for %s', (role) => {
    const { container } = render(
      <HeroFallback role={role} variant={HERO_VARIANT[role]} />,
    );
    // Subhead differs per role; just check something non-empty renders.
    expect(container.textContent?.length ?? 0).toBeGreaterThan(10);
  });

  it('renders a CTA link with #contact href', () => {
    const { container } = render(
      <HeroFallback role="founder" variant={HERO_VARIANT.founder} />,
    );
    const links = Array.from(container.querySelectorAll('a'));
    const ctaLink = links.find((a) => a.getAttribute('href') === '#contact');
    expect(ctaLink).toBeTruthy();
    expect(ctaLink?.textContent).toMatch(/Let.s talk shipping/);
  });

  it('renders distinct subhead copy per role', () => {
    const peer = render(
      <HeroFallback role="peer" variant={HERO_VARIANT.peer} />,
    );
    const client = render(
      <HeroFallback role="client" variant={HERO_VARIANT.client} />,
    );
    expect(peer.container.textContent).toMatch(/LangGraph|Temporal|Google ADK/);
    expect(client.container.textContent).toMatch(/AWS|GCP|Azure/);
  });
});
