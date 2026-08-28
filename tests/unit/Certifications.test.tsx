// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Certifications } from '@/components/sections/Certifications';
import { CERTIFICATIONS } from '@/content/certifications';

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

  it('has Credly URLs for aws-devops-pro and gcp-architect in the cert data', () => {
    // The verify-badge <a> is rendered inside the expanded card body, so we
    // assert against the data source rather than querying collapsed DOM.
    const credlyHrefs = CERTIFICATIONS
      .map((c) => c.href)
      .filter((h): h is string => !!h && h.includes('credly.com'));
    expect(credlyHrefs).toHaveLength(2);
    expect(CERTIFICATIONS.find((c) => c.slug === 'aws-devops-pro')?.href).toMatch(/credly\.com/);
    expect(CERTIFICATIONS.find((c) => c.slug === 'gcp-architect')?.href).toMatch(/credly\.com/);
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
