// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeroFallback } from '@/components/hero/HeroFallback';
import { HERO_VARIANT, HERO_GREETING_CYCLE } from '@/content/hero-variants';
import type { Role } from '@/lib/types';

const ROLES: Role[] = ['recruiter', 'peer', 'founder', 'client'];

describe('HeroFallback', () => {
  it.each(ROLES)('renders a greeting from %s role cycle on mount', (role) => {
    const { container } = render(
      <HeroFallback role={role} variant={HERO_VARIANT[role]} />,
    );
    const text = container.textContent ?? '';
    const matched = HERO_GREETING_CYCLE[role].some((p) => text.includes(p));
    expect(matched).toBe(true);
  });

  it('renders the role subhead under the headline', () => {
    const { container } = render(
      <HeroFallback role="peer" variant={HERO_VARIANT.peer} />,
    );
    expect(container.textContent).toMatch(/LangGraph|Temporal|Google ADK/);
  });

  it('renders the role CTA link', () => {
    const { container } = render(
      <HeroFallback role="founder" variant={HERO_VARIANT.founder} />,
    );
    const links = Array.from(container.querySelectorAll('a'));
    expect(links.some((a) => /Let.s talk shipping/.test(a.textContent ?? ''))).toBe(true);
  });

  it('renders distinct copy per role (recruiter shows name, client shows headline)', () => {
    const recruiter = render(
      <HeroFallback role="recruiter" variant={HERO_VARIANT.recruiter} />,
    );
    const client = render(
      <HeroFallback role="client" variant={HERO_VARIANT.client} />,
    );
    expect(recruiter.container.textContent).toMatch(/Gantala Sai Dheeraj/);
    expect(client.container.textContent).toMatch(/Building the operating layer/);
  });
});
