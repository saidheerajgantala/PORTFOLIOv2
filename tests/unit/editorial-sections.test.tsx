// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Principles } from '@/components/sections/Principles';
import { Recognition } from '@/components/sections/Recognition';
import { Writing } from '@/components/sections/Writing';

describe('Principles', () => {
  it('renders heading', () => {
    render(<Principles index={7} total={9} />);
    expect(screen.getByRole('heading', { name: /^principles$/i })).toBeInTheDocument();
  });
  it('renders at least one principle title', () => {
    render(<Principles index={7} total={9} />);
    expect(screen.getByText(/operators, not magicians/i)).toBeInTheDocument();
  });
});

describe('Recognition', () => {
  it('renders heading', () => {
    render(<Recognition index={2} total={9} />);
    expect(screen.getByRole('heading', { name: /^recognition$/i })).toBeInTheDocument();
  });
  it('mentions the EPAM spotlight award', () => {
    render(<Recognition index={2} total={9} />);
    expect(screen.getByText(/spotlight/i)).toBeInTheDocument();
  });
});

describe('Writing', () => {
  it('renders heading', () => {
    render(<Writing index={8} total={9} />);
    expect(screen.getByRole('heading', { name: /^writing$/i })).toBeInTheDocument();
  });
  it('renders a post about Temporal + LangGraph', () => {
    render(<Writing index={8} total={9} />);
    expect(screen.getByText(/temporal \+ langgraph/i)).toBeInTheDocument();
  });
});