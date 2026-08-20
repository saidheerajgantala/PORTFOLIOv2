// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MultiCloud } from '@/components/sections/MultiCloud';

describe('MultiCloud', () => {
  it('renders section heading', () => {
    render(<MultiCloud index={6} total={9} />);
    expect(screen.getByRole('heading', { name: /multi-cloud devops/i })).toBeInTheDocument();
  });

  it('renders AWS and Azure', () => {
    render(<MultiCloud index={6} total={8} />);
    expect(screen.getByRole('heading', { name: 'AWS' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Azure' })).toBeInTheDocument();
  });
});