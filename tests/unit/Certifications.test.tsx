// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Certifications } from '@/components/sections/Certifications';

describe('Certifications', () => {
  it('renders heading', () => {
    render(<Certifications index={7} total={9} />);
    expect(screen.getByRole('heading', { name: /^certifications$/i })).toBeInTheDocument();
  });

  it('renders all 5 certs', () => {
    render(<Certifications index={7} total={9} />);
    expect(screen.getByText(/AWS Certified Machine Learning/i)).toBeInTheDocument();
    expect(screen.getByText(/AWS Certified DevOps Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Ethical Hacker/i)).toBeInTheDocument();
    expect(screen.getByText(/Google Professional Cloud Architect/i)).toBeInTheDocument();
    expect(screen.getByText(/Infosys Certified Software Programmer/i)).toBeInTheDocument();
  });

  it('links Credly URLs for aws-devops-pro and gcp-architect', () => {
    const { container } = render(<Certifications index={7} total={9} />);
    const credlyLinks = Array.from(container.querySelectorAll('a'))
      .filter((a) => (a.getAttribute('href') ?? '').includes('credly.com'));
    expect(credlyLinks).toHaveLength(2);
  });

  it('does not link non-Credly certs', () => {
    const { container } = render(<Certifications index={7} total={9} />);
    const text = container.textContent ?? '';
    expect(text).toContain('Ethical Hacker');
    const ethicalHackerH3 = Array.from(container.querySelectorAll('h3'))
      .find((h) => h.textContent?.includes('Ethical Hacker'));
    expect(ethicalHackerH3?.querySelector('a')).toBeNull();
  });
});
