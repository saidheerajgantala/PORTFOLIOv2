// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleCard } from '@/components/entry/RoleCard';

describe('RoleCard', () => {
  it('renders role label and value prop', () => {
    render(<RoleCard role="peer" selected={false} onSelect={() => {}} />);
    expect(screen.getByText('Peer')).toBeInTheDocument();
    expect(screen.getByText('Architecture depth')).toBeInTheDocument();
  });

  it('shows selected state', () => {
    render(<RoleCard role="peer" selected={true} onSelect={() => {}} />);
    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn();
    render(<RoleCard role="founder" selected={false} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('radio'));
    expect(onSelect).toHaveBeenCalledWith('founder');
  });
});