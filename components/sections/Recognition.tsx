import { SectionNumber } from '@/components/layout/SectionNumber';

const ITEMS = [
  {
    kind: 'award' as const,
    title: 'EPAM Spotlight Award — Engineering Excellence',
    period: '2024',
    body: 'Awarded for shipping the enterprise agent platform ahead of schedule with 99.9% production reliability.',
  },
  {
    kind: 'talk' as const,
    title: 'PyConf India — "Temporal for Agent Durability"',
    period: '2024',
    body: '30-minute talk on using Temporal workflows for production agent orchestration.',
  },
  {
    kind: 'press' as const,
    title: 'Mentioned in "The New Stack" agent platform coverage',
    period: '2025',
    body: 'Background commentary on LangGraph + Temporal integration patterns.',
  },
];

export function Recognition({ index, total }: { index: number; total: number }) {
  return (
    <section
      id="recognition"
      aria-labelledby="recognition-heading"
      className="mx-auto w-full max-w-3xl px-6 py-24"
    >
      <SectionNumber index={index} total={total} className="block" />
      <h2 id="recognition-heading" className="mt-4 font-display text-4xl text-text">
        Recognition
      </h2>
      <ul className="mt-12 space-y-8">
        {ITEMS.map((item) => (
          <li key={item.title} className="border-l border-border pl-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {item.kind} · {item.period}
            </p>
            <h3 className="mt-2 font-display text-xl text-text">{item.title}</h3>
            <p className="mt-2 text-text">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}