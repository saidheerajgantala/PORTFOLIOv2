'use client';

import { SectionNumber } from '@/components/layout/SectionNumber';
import { CERTIFICATIONS } from '@/content/certifications';
import { cn } from '@/lib/utils';

export function Certifications({ index, total }: { index: number; total: number }) {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="mx-auto w-full max-w-3xl px-6 py-24"
    >
      <SectionNumber index={index} total={total} className="block" />
      <h2 id="certifications-heading" className="mt-4 font-display text-4xl text-text">
        Certifications
      </h2>
      <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {CERTIFICATIONS.map((c) => (
          <li
            key={c.slug}
            className={cn(
              'group relative border border-border p-6 transition-all duration-300',
              'hover:-translate-y-1 hover:border-accent hover:shadow-[0_4px_24px_-8px_var(--accent)]'
            )}
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {c.issuer} · {c.issued}
            </p>
            <h3 className="mt-3 font-display text-lg text-text">
              {c.href ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {c.title}
                </a>
              ) : (
                c.title
              )}
            </h3>
            {/* Subtle accent corner mark on hover */}
            <span
              aria-hidden="true"
              className={cn(
                'absolute top-3 right-3 h-2 w-2 rounded-full bg-accent transition-opacity duration-300',
                'opacity-0 group-hover:opacity-100'
              )}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
