// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VenturePortfolio } from '@/components/sections/VenturePortfolio';

describe('VenturePortfolio', () => {
  it('renders section heading', () => {
    render(<VenturePortfolio index={5} total={9} />);
    expect(screen.getByRole('heading', { name: /^ventures$/i })).toBeInTheDocument();
  });

  it('renders all three ventures', () => {
    render(<VenturePortfolio index={5} total={9} />);
    expect(screen.getByText('Hiiired')).toBeInTheDocument();
    expect(screen.getByText('Noxstack')).toBeInTheDocument();
    expect(screen.getByText('WeDAA')).toBeInTheDocument();
  });
});