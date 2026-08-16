// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { CursorTrail } from '@/components/ambient/CursorTrail';

describe('CursorTrail', () => {
  afterEach(() => cleanup());

  it('renders a fixed overlay container with pointer-events-none', () => {
    const { container } = render(<CursorTrail />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/fixed/);
    expect(root.className).toMatch(/pointer-events-none/);
  });

  it('is hidden from assistive tech', () => {
    const { container } = render(<CursorTrail />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
