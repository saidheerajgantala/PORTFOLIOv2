'use client';

import { useEffect, useState, useCallback } from 'react';
import { SECTION_IDS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';

// Display label for each section id, in the order they appear in the page.
// (Kept in sync with SECTION_IDS in lib/types.ts.)
const SECTION_LABELS: Record<(typeof SECTION_IDS)[number], string> = {
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
  // Which section is the rail currently highlighting (controlled by IntersectionObserver)
  // When undefined, the rail will detect on its own.
  initialActive?: (typeof SECTION_IDS)[number];
}

export function SectionRail({ initialActive = 'hero' }: SectionRailProps) {
  const [active, setActive] = useState<(typeof SECTION_IDS)[number]>(initialActive);
  const reduce = useReducedMotion();

  useEffect(() => {
    // Track which section is most in view using IntersectionObserver
    const observers: IntersectionObserver[] = [];
    const sectionEls = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionEls.length === 0) return;

    // Keep track of intersection ratios to pick the section with the highest visibility
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        // Pick the section with the highest visible ratio
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId && bestRatio > 0) {
          setActive(bestId as (typeof SECTION_IDS)[number]);
        }
      },
      {
        // Trigger when section crosses into upper-third of viewport — feels natural
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const el of sectionEls) {
      observer.observe(el);
    }
    observers.push(observer);

    return () => {
      for (const o of observers) o.disconnect();
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: (typeof SECTION_IDS)[number]) => {
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      });
      // Update the URL hash without triggering a scroll jump
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
        {SECTION_IDS.map((id, i) => {
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
                {/* Label slides in on hover/active */}
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
                {/* The §NN marker is always visible */}
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
                {/* The vertical bar marker — accent when active */}
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
