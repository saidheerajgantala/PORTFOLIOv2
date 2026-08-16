import { SectionNumber } from '@/components/layout/SectionNumber';

const POSTS = [
  {
    title: 'Temporal + LangGraph: durable agent orchestration',
    venue: 'Personal blog',
    date: '2025-04',
    href: 'https://example.com/temporal-langgraph',
    blurb: 'A practical guide to wrapping LangGraph state machines in Temporal workflows.',
  },
  {
    title: 'FinOps for AI workloads',
    venue: 'EPAM Engineering Blog',
    date: '2024-11',
    href: 'https://example.com/finops-ai',
    blurb: 'How we cut agent platform compute spend by 60% without sacrificing throughput.',
  },
  {
    title: 'Observability for production agents',
    venue: 'The New Stack',
    date: '2024-07',
    href: 'https://example.com/observability-agents',
    blurb: 'Tracing, logging, and metrics patterns that actually work for multi-agent systems.',
  },
];

export function Writing({ index, total }: { index: number; total: number }) {
  return (
    <section
      id="writing"
      aria-labelledby="writing-heading"
      className="mx-auto w-full max-w-3xl px-6 py-24"
    >
      <SectionNumber index={index} total={total} className="block" />
      <h2 id="writing-heading" className="mt-4 font-display text-4xl text-text">
        Writing
      </h2>
      <ul className="mt-12 space-y-8">
        {POSTS.map((p) => (
          <li key={p.title} className="border-l border-border pl-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {p.venue} · {p.date}
            </p>
            <h3 className="mt-2 font-display text-xl text-text">
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                {p.title}
              </a>
            </h3>
            <p className="mt-2 text-text">{p.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}