// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeroFallback } from '@/components/hero/HeroFallback';

describe('HeroFallback', () => {
  it('renders one of the greeting phrases on mount', () => {
    const { container } = render(<HeroFallback text="ignored — phrase cycle drives content" />);
    // Phrase cycle: ['Hello.', 'Hi.', 'Hey.', 'Namaste.', 'Howdy.']
    expect(container.textContent).toMatch(/Hello\.|Hi\.|Hey\.|Namaste\.|Howdy\./);
  });

  it('renders the scroll hint', () => {
    const { container } = render(<HeroFallback text="x" />);
    expect(container.textContent).toMatch(/scroll to enter/i);
  });

  it('ignores the text prop (phrase cycle owns content)', () => {
    const { container } = render(<HeroFallback text="this should not appear" />);
    expect(container.textContent).not.toMatch(/this should not appear/);
  });
});
