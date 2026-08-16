import { SectionNumber } from '@/components/layout/SectionNumber';

const PRINCIPLES = [
  {
    title: 'Operators, not magicians',
    body: 'AI agents should be observable, debuggable, and interruptible. Black boxes are for demos, not production.',
  },
  {
    title: 'Ship to learn',
    body: 'Most of what I know about agent reliability came from incidents, not documentation. I optimize for fast feedback loops.',
  },
  {
    title: 'Cost is a feature',
    body: 'A 3x cost reduction is usually a 3x latency reduction with better architecture. FinOps is engineering.',
  },
  {
    title: 'Boring tech for the core, novel tech at the edges',
    body: 'Postgres, queues, and well-understood patterns handle 90% of agent platforms. The novel 10% is where AI lives.',
  },
];

export function Principles({ index, total }: { index: number; total: number }) {
  return (
    <section
      id="principles"
      aria-labelledby="principles-heading"
      className="mx-auto w-full max-w-3xl px-6 py-24"
    >
      <SectionNumber index={index} total={total} className="block" />
      <h2 id="principles-heading" className="mt-4 font-display text-4xl text-text">
        Principles
      </h2>
      <dl className="mt-12 space-y-8">
        {PRINCIPLES.map((p) => (
          <div key={p.title}>
            <dt className="font-display text-xl text-accent">{p.title}</dt>
            <dd className="mt-2 text-text">{p.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}