'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { SECTION_IDS, type Role, type SectionId } from '@/lib/types';
import { SECTION_ORDER } from '@/content/sections';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';

// Display label for each section id.
// (Kept in sync with SECTION_IDS in lib/types.ts.)
const SECTION_LABELS: Record<SectionId, string> = {
  'hero': 'Hero',
  'career-arc': 'Career arc',
  'currently-building': 'Currently building',
  'ventures': 'Ventures',
  'multi-cloud': 'Multi-cloud',
  'certifications': 'Certifications',
  'recognition': 'Recognition',
  'principles': 'Principles',
  'contact': 'Get in touch',
};

interface SectionRailProps {
  role: Role;
  initialActive?: SectionId;
}

export function SectionRail({ role, initialActive = 'hero' }: SectionRailProps) {
  // Order the rail items by the role's SECTION_ORDER (excluding 'hero' since the
  // rail only makes sense for content sections; 'hero' is always item §01).
  const order = useMemo<SectionId[]>(() => {
    const tail = SECTION_ORDER[role].filter((id) => id !== 'hero');
    return ['hero', ...tail];
  }, [role]);

  const [active, setActive] = useState<SectionId>(initialActive);
  const reduce = useReducedMotion();

  useEffect(() => {
    const sectionEls = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionEls.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId && bestRatio > 0) {
          setActive(bestId as SectionId);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const el of sectionEls) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      });
      history.replaceState(null, '', `#${id}`);
      setActive(id);
    },
    [reduce]
  );

  return (
    <nav
      aria-label="Section navigation"
      className="hidden md:block fixed right-6 top-1/2 -translate-y-1/2 z-40"
    >
      <ol className="flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.2em]">
        {order.map((id, i) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'group flex items-center justify-end gap-3 transition-colors duration-200',
                  isActive ? 'text-text' : 'text-muted hover:text-text'
                )}
              >
                <span
                  className={cn(
                    'overflow-hidden transition-all duration-300 whitespace-nowrap',
                    isActive
                      ? 'max-w-[140px] opacity-100'
                      : 'max-w-0 opacity-0 group-hover:max-w-[140px] group-hover:opacity-100 group-focus-visible:max-w-[140px] group-focus-visible:opacity-100'
                  )}
                >
                  {SECTION_LABELS[id]}
                </span>
                <span
                  className={cn(
                    'transition-all duration-200',
                    isActive
                      ? 'text-accent'
                      : 'text-muted group-hover:text-text'
                  )}
                >
                  §{String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'inline-block h-3 w-px transition-all duration-200',
                    isActive
                      ? 'bg-accent h-6'
                      : 'bg-border group-hover:bg-text'
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
