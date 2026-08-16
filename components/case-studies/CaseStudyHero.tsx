import type { CaseStudyMeta } from '@/lib/types';
import { SectionNumber } from '@/components/layout/SectionNumber';

export function CaseStudyHero({ meta }: { meta: CaseStudyMeta }) {
  return (
    <header className="mx-auto max-w-3xl px-6 pt-24 pb-12">
      <SectionNumber index={1} total={1} className="block" />
      <h1 className="mt-4 font-display text-5xl text-text">{meta.title}</h1>
      <p className="mt-2 font-display text-2xl text-muted">{meta.subtitle}</p>
      <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border pt-6">
        <div>
          <dt className="font-mono text-xs uppercase tracking-widest text-muted">Period</dt>
          <dd className="mt-1 font-mono text-sm text-text">{meta.period}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-widest text-muted">Role</dt>
          <dd className="mt-1 font-mono text-sm text-text">{meta.role}</dd>
        </div>
        <div className="col-span-2">
          <dt className="font-mono text-xs uppercase tracking-widest text-muted">Stack</dt>
          <dd className="mt-1 flex flex-wrap gap-2">
            {meta.stack.map((s) => (
              <span key={s} className="font-mono text-xs uppercase tracking-widest text-muted border border-border px-2 py-1">
                {s}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-6">
        {meta.impact.map((m) => (
          <div key={m.label}>
            <div className="font-display text-4xl text-accent">{m.value}</div>
            <div className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">{m.label}</div>
          </div>
        ))}
      </div>
    </header>
  );
}
