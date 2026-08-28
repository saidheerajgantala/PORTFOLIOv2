'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
      <p className="mt-4 text-muted max-w-prose">
        Tap a card to see what each cert covers and the skills it maps to.
      </p>
      <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        {CERTIFICATIONS.map((c) => (
          <CertCard key={c.slug} cert={c} />
        ))}
      </ul>
    </section>
  );
}

function CertCard({ cert }: { cert: typeof CERTIFICATIONS[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.li
      layout
      className={cn(
        'group relative border transition-all duration-300',
        open
          ? 'border-accent bg-accent/[0.03]'
          : 'border-border hover:-translate-y-1 hover:border-accent hover:shadow-[0_4px_24px_-8px_var(--accent)]'
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`cert-${cert.slug}-body`}
        className="w-full text-left p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {cert.issuer} · {cert.issued}
            </p>
            <h3
              className={cn(
                'mt-3 font-display text-lg transition-colors',
                open ? 'text-accent' : 'text-text group-hover:text-accent'
              )}
            >
              {cert.title}
            </h3>
          </div>
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.22 }}
            className={cn(
              'mt-1 inline-block font-mono text-xs shrink-0 transition-colors',
              open ? 'text-accent' : 'text-muted group-hover:text-accent'
            )}
          >
            ↓
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`cert-${cert.slug}-body`}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-border">
              <p className="text-text leading-relaxed">{cert.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-xs uppercase tracking-widest text-accent border border-accent/40 bg-accent/[0.04] px-2 py-1"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle accent corner mark on hover (desktop affordance) */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-3 right-3 h-2 w-2 rounded-full bg-accent transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
        style={{ display: open ? 'none' : undefined }}
      />
    </motion.li>
  );
}