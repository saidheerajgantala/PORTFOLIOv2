// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>X</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-accent');
  });

  it('applies ghost variant', () => {
    render(<Button variant="ghost">X</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-text');
  });

  it('forwards ref', () => {
    const ref = { current: null } as unknown as React.RefObject<HTMLButtonElement>;
    render(<Button ref={ref}>X</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});