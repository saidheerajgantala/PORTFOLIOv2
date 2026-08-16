// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { AgentTrace } from '@/components/ambient/AgentTrace';

describe('AgentTrace', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('renders at least 5 trace lines on mount', () => {
    render(<AgentTrace />);
    const list = screen.getByRole('list', { hidden: true });
    expect(list.textContent).toBeTruthy();
    const items = screen.getAllByRole('listitem', { hidden: true });
    expect(items.length).toBeGreaterThanOrEqual(5);
    const timestamps = screen.getAllByText(/^\d{2}:\d{2}:\d{2}$/);
    expect(timestamps.length).toBeGreaterThanOrEqual(5);
  });

  it('is positioned as fixed overlay with pointer-events none', () => {
    const { container } = render(<AgentTrace />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/fixed/);
    expect(root.className).toMatch(/pointer-events-none/);
  });

  it('aria-hidden=true so screen readers skip it', () => {
    render(<AgentTrace />);
    expect(screen.getByRole('list', { hidden: true })).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});