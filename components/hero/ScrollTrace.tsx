'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { type Role, type SectionId } from '@/lib/types';
import { SECTION_ORDER } from '@/content/sections';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';

interface ScrollTraceProps {
  role: Role;
}

/**
 * Fixed-position scroll indicator pinned to the left edge.
 *
 * The ball's vertical position is driven by the page's continuous scroll
 * fraction (0 = top of page, 1 = bottom of page), not by a discrete section
 * index. A spring layer smooths the raw scroll value and adds a soft
 * follow-delay (stiffness: 90 / damping: 26 / mass: 0.8) — buttery rather
 * than snappy.
 *
 * Tick marks at each section position act as visual landmarks; the ball
 * glides past them as the user scrolls between sections.
 *
 * Honors prefers-reduced-motion: ball jumps without spring.
 */
export function ScrollTrace({ role }: ScrollTraceProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const reduce = useReducedMotion();

  // Order sections per role (hero first, then role-specific tail).
  const order: SectionId[] = [
    'hero',
    ...SECTION_ORDER[role].filter((id) => id !== 'hero'),
  ];
  const totalSlots = order.length;

  // Continuous scroll fraction across the full page: 0 at top → 1 at bottom.
  const progress = useMotionValue(0);

  // Spring layer — smooth follow with a subtle trailing feel.
  // (Lower stiffness + higher mass = laggier. Tuned for "soft chase".)
  const smooth = useSpring(progress, {
    stiffness: 90,
    damping: 26,
    mass: 0.8,
  });

  // Map [0,1] → CSS `top` percentage so the ball travels the full rail.
  const topPct = useTransform(smooth, (v) => `${v * 100}%`);

  // Track active section index for tick-mark highlighting.
  const orderRef = useRef<SectionId[]>(order);
  orderRef.current = order;
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const orderNow = orderRef.current;

      // Continuous page-scroll fraction.
      const docH = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const frac = Math.min(1, Math.max(0, window.scrollY / docH));
      progress.set(frac);

      // Discrete active section for tick highlighting: last section whose
      // top has scrolled past the 40% viewport line.
      const mid = window.scrollY + window.innerHeight * 0.4;
      let bestIdx = 0;
      for (let i = 0; i < orderNow.length; i++) {
        const el = document.getElementById(orderNow[i]);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= mid) bestIdx = i;
      }
      setActiveIdx((prev) => (prev === bestIdx ? prev : bestIdx));

      raf = 0;
    };
    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [role, progress]);

  // Discrete-snap position for reduced-motion users (no spring).
  const snapPct =
    totalSlots > 1 ? (activeIdx / (totalSlots - 1)) * 100 : 0;

  return (
    <div
      aria-hidden="true"
      className="hidden lg:block fixed left-4 top-0 bottom-0 w-10 z-30 pointer-events-none"
    >
      {/* Vertical rail */}
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-border" />

      {/* Tick marks at each section position */}
      {order.map((id, i) => {
        const pct = totalSlots > 1 ? (i / (totalSlots - 1)) * 100 : 0;
        const isActive = i === activeIdx;
        return (
          <div
            key={id}
            style={{ top: `${pct}%` }}
            className="absolute left-0 right-0 flex items-center justify-center"
          >
            <span
              className={`inline-block rounded-full transition-all duration-200 ${
                isActive
                  ? 'h-2 w-2 bg-accent scale-150'
                  : 'h-1 w-1 bg-muted/60'
              }`}
            />
          </div>
        );
      })}

      {/* Active ball — smooth, delayed follow of scroll progress. */}
      <motion.div
        className="absolute left-0 right-0 flex items-center justify-center"
        style={reduce ? { top: `${snapPct}%` } : { top: topPct }}
      >
        <span
          className="inline-block h-3 w-3 rounded-full bg-accent ring-4 ring-accent/25"
          style={{
            boxShadow:
              '0 0 12px var(--accent), 0 0 0 4px color-mix(in oklab, var(--accent) 25%, transparent)',
            transform: 'translateY(-50%)',
          }}
        />
      </motion.div>
    </div>
  );
}