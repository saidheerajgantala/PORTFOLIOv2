// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CareerArc } from '@/components/sections/CareerArc';

describe('CareerArc', () => {
  it('renders a section number and heading', () => {
    render(<CareerArc index={4} total={9} />);
    expect(screen.getByRole('heading', { name: /career arc/i })).toBeInTheDocument();
    expect(screen.getByText(/§04/)).toBeInTheDocument();
  });

  it('renders at least one career stop from content', () => {
    render(<CareerArc index={4} total={9} />);
    // Should show at least one period string from CAREER content
    // Use a flexible check — any text matching pattern MM/YYYY or YYYY
    expect(screen.getAllByText(/\d{4}/).length).toBeGreaterThan(0);
  });
});
