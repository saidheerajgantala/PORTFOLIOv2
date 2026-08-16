// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionDivider } from '@/components/layout/SectionDivider';

describe('SectionDivider', () => {
  it('renders label and sectionId when provided', () => {
    render(<SectionDivider label="Career arc" sectionId="§04 / 09" />);
    expect(screen.getByText('Career arc')).toBeInTheDocument();
    expect(screen.getByText('§04 / 09')).toBeInTheDocument();
  });

  it('is hidden from assistive tech when decorative (no label)', () => {
    const { container } = render(<SectionDivider />);
    // Either aria-hidden on root, or role="separator" w/ aria-hidden, or simply aria-hidden via parent
    const root = container.firstChild as HTMLElement;
    expect(root.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies horizontal rule styling', () => {
    const { container } = render(<SectionDivider label="A" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/border/);
  });
});
