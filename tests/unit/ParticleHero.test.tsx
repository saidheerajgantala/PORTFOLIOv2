// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeroFallback } from '@/components/hero/HeroFallback';

describe('HeroFallback', () => {
  it('renders the text', () => {
    const { container } = render(<HeroFallback text="Hello world" />);
    expect(container.textContent).toMatch(/Hello world/);
  });
});
