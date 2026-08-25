'use client';

import { useState } from 'react';
import { SectionNumber } from '@/components/layout/SectionNumber';
import { cn } from '@/lib/utils';

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
  const [openIdx, setOpenIdx] = useState<number | null>(0); // First open by default

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
      <p className="mt-4 text-muted max-w-prose">
        Tap a principle to read the reasoning behind it.
      </p>
      <dl className="mt-12 space-y-3">
        {PRINCIPLES.map((p, i) => {
          const isOpen = openIdx === i;
          const num = String(i + 1).padStart(2, '0');
          return (
            <div
              key={p.title}
              className={cn(
                'border transition-all duration-300',
                isOpen
                  ? 'border-accent bg-accent/[0.03]'
                  : 'border-border hover:border-accent/60'
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full text-left p-5 flex items-start gap-4"
              >
                <span
                  className={cn(
                    'font-mono text-xs uppercase tracking-widest transition-colors',
                    isOpen ? 'text-accent' : 'text-muted'
                  )}
                >
                  {num}
                </span>
                <dt
                  className={cn(
                    'flex-1 font-display text-xl transition-colors',
                    isOpen ? 'text-accent' : 'text-text'
                  )}
                >
                  {p.title}
                </dt>
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-1 inline-block font-mono text-xs text-muted transition-transform duration-300',
                    isOpen && 'rotate-180 text-accent'
                  )}
                >
                  ↓
                </span>
              </button>
              <div
                className={cn(
                  'grid transition-all duration-300 ease-out',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <dd className="px-5 pb-5 pl-12 text-text leading-relaxed">
                    {p.body}
                  </dd>
                </div>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
