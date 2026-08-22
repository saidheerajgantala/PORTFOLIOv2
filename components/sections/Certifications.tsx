import { SectionNumber } from '@/components/layout/SectionNumber';
import { CERTIFICATIONS } from '@/content/certifications';

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
          <li key={c.slug} className="border border-border p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {c.issuer} · {c.issued}
            </p>
            <h3 className="mt-3 font-display text-lg text-text">
              {c.href ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  {c.title}
                </a>
              ) : (
                c.title
              )}
            </h3>
          </li>
        ))}
      </ul>
    </section>
  );
}
