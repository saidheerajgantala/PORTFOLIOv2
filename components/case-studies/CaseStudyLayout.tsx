import type { ReactNode } from 'react';

export function CaseStudyLayout({ children }: { children: ReactNode }) {
  return (
    <article className="prose prose-invert max-w-none">
      {children}
    </article>
  );
}
