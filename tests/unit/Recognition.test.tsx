// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Recognition } from '@/components/sections/Recognition';

describe('Recognition', () => {
  it('renders heading', () => {
    render(<Recognition index={2} total={9} />);
    expect(screen.getByRole('heading', { name: /^recognition$/i })).toBeInTheDocument();
  });

  it('lists both remaining awards (no Cipher Combat on latest resume)', () => {
    render(<Recognition index={2} total={9} />);
    expect(screen.getByText(/GEM Award — Xebia/i)).toBeInTheDocument();
    expect(screen.getByText(/Hall of Fame — BigBasket/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cipher Combat/i)).not.toBeInTheDocument();
  });

  it('does not list any certification issuer', () => {
    const { container } = render(<Recognition index={2} total={9} />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/Amazon Web Services/);
    expect(text).not.toMatch(/Cisco/);
    expect(text).not.toMatch(/Google/);
    expect(text).not.toMatch(/Infosys/);
  });
});