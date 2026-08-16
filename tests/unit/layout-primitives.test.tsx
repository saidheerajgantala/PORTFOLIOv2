// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionNumber } from '@/components/layout/SectionNumber';
import { StatusDot } from '@/components/layout/StatusDot';

describe('SectionNumber', () => {
  it('formats index and total with leading zeros', () => {
    render(<SectionNumber index={4} total={9} />);
    expect(screen.getByText('§04 / 09')).toBeInTheDocument();
  });

  it('applies monospace styling', () => {
    const { container } = render(<SectionNumber index={1} total={2} />);
    expect(container.firstChild).toHaveClass('font-mono');
  });
});

describe('StatusDot', () => {
  it('renders status label', () => {
    render(<StatusDot status="active" />);
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('uses accent color for active status', () => {
    const { container } = render(<StatusDot status="active" />);
    const dot = container.querySelector('span > span') as HTMLElement;
    expect(dot.className).toMatch(/bg-accent/);
  });
});