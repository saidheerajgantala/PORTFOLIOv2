'use client';

import { useState } from 'react';
import { SectionNumber } from '@/components/layout/SectionNumber';
import { cn } from '@/lib/utils';

type Kind = 'award';

interface Item {
  kind: Kind;
  title: string;
  period: string;
  body: string;
  href?: string;
}

// All entries from current recognition history.
// Note: Cipher Combat is intentionally retained even though it was dropped from the
// latest resume PDF — flagged as a CTF-style security recognition the user wants to keep.
const ITEMS: Item[] = [
  {
    kind: 'award',
    title: 'GEM Award — Xebia',
    period: 'Jan 2024',
    body: 'Quarterly engineering excellence award at Xebia.',
    href:
      'https://media.licdn.com/dms/image/v2/D562DAQFNqIwJgaZG6Q/profile-treasury-image-shrink_1280_1280/profile-treasury-image-shrink_1280_1280/0/1738944384902',
  },
  {
    kind: 'award',
    title: 'Hall of Fame — BigBasket',
    period: 'Jan 2022',
    body: "Listed on BigBasket's security hall of fame for a disclosed vulnerability.",
    href: 'https://tech.bigbasket.com/security-at-bigbasket-5eaaa6fa7c89',
  },
  {
    kind: 'award',
    title: 'Cipher Combat 3.0 — 17th place',
    period: 'Jan 2020',
    body: 'National-level CTF-style competition.',
  },
];

export function Recognition({ index, total }: { index: number; total: number }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

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
      <ul className="mt-12 space-y-6">
        {ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <li
              key={item.title}
              className={cn(
                'group relative border border-border transition-all duration-300',
                'hover:-translate-y-1 hover:border-accent hover:shadow-[0_4px_24px_-8px_var(--accent)]',
                isOpen && 'border-accent'
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full text-left p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-muted">
                      {item.kind} · {item.period}
                    </p>
                    <h3
                      className={cn(
                        'mt-2 font-display text-xl transition-colors',
                        isOpen ? 'text-accent' : 'text-text group-hover:text-accent'
                      )}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-1 inline-block font-mono text-xs text-muted transition-transform duration-300',
                      isOpen && 'rotate-180 text-accent'
                    )}
                  >
                    ↓
                  </span>
                </div>
              </button>
              <div
                className={cn(
                  'grid transition-all duration-300 ease-out',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-2 border-t border-border">
                    <p className="text-text">{item.body}</p>
                    {item.href && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
                      >
                        View source →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
