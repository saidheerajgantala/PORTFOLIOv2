// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { RoleReshapedPage } from '@/components/RoleReshapedPage';
import { useWhoAmI } from '@/components/entry/whoami-store';

describe('RoleReshapedPage', () => {
  beforeEach(() => {
    // Reset store to default role
    useWhoAmI.getState().reset();
  });

  it('renders sections for the active role without crashing', () => {
    const { container } = render(<RoleReshapedPage />);
    expect(container.firstChild).toBeTruthy();
    // At least one <section> should be rendered
    expect(container.querySelectorAll('section').length).toBeGreaterThan(0);
  });
});
