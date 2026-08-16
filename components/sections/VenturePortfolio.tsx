import { VENTURES } from '@/content/ventures';
import { SectionNumber } from '@/components/layout/SectionNumber';
import { StatusDot } from '@/components/layout/StatusDot';

export function VenturePortfolio({ index, total }: { index: number; total: number }) {
  return (
    <section
      id="ventures"
      aria-labelledby="ventures-heading"
      className="mx-auto w-full max-w-3xl px-6 py-24"
    >
      <SectionNumber index={index} total={total} className="block" />
      <h2 id="ventures-heading" className="mt-4 font-display text-4xl text-text">
        Ventures
      </h2>
      <p className="mt-4 text-muted max-w-prose">
        Side projects and products I've shipped or am currently running outside of my day job.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {VENTURES.map((v) => (
          <article
            key={v.slug}
            className="border border-border p-6 transition hover:border-accent"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-2xl text-text">{v.name}</h3>
              <StatusDot status={v.status} />
            </div>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
              {v.role} · {v.period}
            </p>
            <p className="mt-4 text-text">{v.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {v.tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-xs uppercase tracking-widest text-muted border border-border px-2 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
            {v.href && (
              <a
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
              >
                Visit →
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}