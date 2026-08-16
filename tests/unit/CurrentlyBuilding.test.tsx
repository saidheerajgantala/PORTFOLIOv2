// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CurrentlyBuilding } from '@/components/sections/CurrentlyBuilding';

describe('CurrentlyBuilding', () => {
  it('renders section heading', () => {
    render(<CurrentlyBuilding index={3} total={9} />);
    expect(screen.getByRole('heading', { name: /currently building/i })).toBeInTheDocument();
  });

  it('renders at least one build with a tech stack tag', () => {
    render(<CurrentlyBuilding index={3} total={9} />);
    // Should mention LangGraph somewhere in the content
    expect(screen.getAllByText(/LangGraph|Temporal|LangSmith|Python/).length).toBeGreaterThan(0);
  });
});
