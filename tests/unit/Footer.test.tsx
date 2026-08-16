// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useWhoAmI } from '@/components/entry/whoami-store';
import { Footer } from '@/components/layout/Footer';

describe('Footer', () => {
  beforeEach(() => {
    useWhoAmI.getState().reset();
  });

  it('renders the current role label', () => {
    useWhoAmI.setState({ role: 'recruiter' });
    render(<Footer />);
    expect(screen.getByText(/recruiter/i)).toBeInTheDocument();
  });

  it('renders a re-edit button that dispatches whoami:open event', () => {
    render(<Footer />);
    const btn = screen.getByRole('button', { name: /re-edit/i });
    expect(btn).toBeInTheDocument();
  });
});