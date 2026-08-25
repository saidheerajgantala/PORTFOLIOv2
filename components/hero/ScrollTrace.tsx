'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { type Role, type SectionId } from '@/lib/types';
import { SECTION_ORDER } from '@/content/sections';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';

interface ScrollTraceProps {
  role: Role;
}

/**
 * Fixed-position scroll indicator pinned to the left edge.
 * A single ball that animates between section positions as the user scrolls —
 * snapping to whichever section currently dominates the viewport.
 *
 * Section positions are evenly distributed along the trace's full height
 * (matching the order this role sees on the page).
 *
 * Honors prefers-reduced-motion: ball jumps without spring.
 */
export function ScrollTrace({ role }: ScrollTraceProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const reduce = useReducedMotion();
  const orderRef = useRef<SectionId[]>([]);

  // Order sections per role (hero first, then role-specific tail).
  const order: SectionId[] = [
    'hero',
    ...SECTION_ORDER[role].filter((id) => id !== 'hero'),
  ];
  orderRef.current = order;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const orderNow = orderRef.current;
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
  }, [role]);

  const totalSlots = order.length;
  const activePct = totalSlots > 1 ? (activeIdx / (totalSlots - 1)) * 100 : 0;

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

      {/* Active ball — animates between section positions */}
      <motion.div
        className="absolute left-0 right-0 flex items-center justify-center"
        animate={{ top: `${activePct}%` }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: 'spring', stiffness: 220, damping: 26, mass: 0.7 }
        }
        style={{ translateY: '-50%' }}
      >
        <span
          className="inline-block h-3 w-3 rounded-full bg-accent ring-4 ring-accent/25"
          style={{
            boxShadow: '0 0 12px var(--accent), 0 0 0 4px color-mix(in oklab, var(--accent) 25%, transparent)',
          }}
        />
      </motion.div>
    </div>
  );
}
