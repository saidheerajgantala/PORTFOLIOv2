'use client';

import { motion } from 'motion/react';
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
        {VENTURES.map((v, idx) => (
          <motion.article
            key={v.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.35, delay: idx * 0.08, ease: 'easeOut' }}
            whileHover={{ y: -2 }}
            className="group relative border border-border p-6 transition-all duration-300 hover:border-accent hover:shadow-[0_4px_24px_-8px_var(--accent)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-2xl text-text transition-colors group-hover:text-accent">
                {v.name}
              </h3>
              <motion.span
                whileHover={{ scale: 1.4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="inline-block"
              >
                <StatusDot status={v.status} />
              </motion.span>
            </div>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
              {v.role} · {v.period}
            </p>
            <p className="mt-4 text-text">{v.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {v.tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-xs uppercase tracking-widest text-muted border border-border px-2 py-1 transition-colors group-hover:border-accent/60 group-hover:text-accent"
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
          </motion.article>
        ))}
      </div>
    </section>
  );
}