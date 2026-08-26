'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { CAREER } from '@/content/career';
import { SectionNumber } from '@/components/layout/SectionNumber';
import { cn } from '@/lib/utils';

export function CareerArc({ index, total }: { index: number; total: number }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="career-arc"
      aria-labelledby="career-arc-heading"
      className="mx-auto w-full max-w-3xl px-6 py-24"
    >
      <SectionNumber index={index} total={total} className="block" />

      <h2
        id="career-arc-heading"
        className="mt-4 font-display text-4xl text-text"
      >
        Career arc
      </h2>

      <ol className="mt-12 space-y-12 border-l border-border pl-6">
        {CAREER.map((stop, idx) => {
          const isOpen = openId === stop.id;
          const hasMore = stop.achievements.length > 2;
          const visible = isOpen ? stop.achievements : stop.achievements.slice(0, 2);
          return (
            <motion.li
              key={stop.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.35, delay: idx * 0.06, ease: 'easeOut' }}
              className="group relative"
            >
              {/* Bullet dot — scales on row hover for interactive affordance */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -left-[27px] top-2 inline-block h-2 w-2 rounded-full bg-accent',
                  'transition-transform duration-200 group-hover:scale-150'
                )}
              />
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {stop.period}
              </p>
              <h3 className="mt-2 font-display text-2xl text-text transition-colors group-hover:text-accent">
                {stop.title}
              </h3>
              <p className="mt-1 font-display text-lg text-text">{stop.company}</p>
              {stop.location && (
                <p className="mt-1 font-mono text-xs text-muted">{stop.location}</p>
              )}
              <ul className="mt-4 list-disc space-y-1 pl-5 text-text">
                {visible.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : stop.id)}
                  aria-expanded={isOpen}
                  className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors"
                >
                  {isOpen ? 'Hide' : `Show all (${stop.achievements.length})`}
                  <span
                    aria-hidden="true"
                    className={`inline-block transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ↓
                  </span>
                </button>
              )}
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}