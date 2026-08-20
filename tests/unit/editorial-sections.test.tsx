// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Principles } from '@/components/sections/Principles';
import { Recognition } from '@/components/sections/Recognition';

describe('Principles', () => {
  it('renders heading', () => {
    render(<Principles index={7} total={8} />);
    expect(screen.getByRole('heading', { name: /^principles$/i })).toBeInTheDocument();
  });
  it('renders at least one principle title', () => {
    render(<Principles index={7} total={8} />);
    expect(screen.getByText(/operators, not magicians/i)).toBeInTheDocument();
  });
});

describe('Recognition', () => {
  it('renders heading', () => {
    render(<Recognition index={2} total={8} />);
    expect(screen.getByRole('heading', { name: /^recognition$/i })).toBeInTheDocument();
  });
  it('mentions the Xebia GEM award', () => {
    render(<Recognition index={2} total={8} />);
    expect(screen.getByText(/GEM/i)).toBeInTheDocument();
  });
});
