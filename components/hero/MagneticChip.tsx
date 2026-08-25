'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useRef, useState, type ReactNode } from 'react';

interface MagneticChipProps {
  href: string;
  children: ReactNode;
}

/**
 * Bio accent chip that, on click, clones itself and animates a flying copy
 * from its current position to the target section's heading — while the
 * page scrolls to the destination in parallel.
 *
 * Honors prefers-reduced-motion: falls back to instant scroll, no clone.
 */
export function MagneticChip({ href, children }: MagneticChipProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const reduce = useReducedMotion();
  const [fly, setFly] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith('#')) return;
    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    const source = linkRef.current;
    if (!target || !source) return;

    e.preventDefault();

    // Reduce-motion: instant scroll, no clone.
    if (reduce) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      history.replaceState(null, '', `#${targetId}`);
      return;
    }

    // Capture source bounding rect for the flying clone.
    const sourceRect = source.getBoundingClientRect();

    // Trigger the flying clone; it will animate from sourceRect to the
    // section's heading using the sourceRect as both start and via state.
    setFly({
      x: sourceRect.left,
      y: sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
    });

    // Scroll the page in parallel with the fly animation.
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${targetId}`);

    // Clear the flying clone shortly after the scroll finishes.
    window.setTimeout(() => setFly(null), 900);
  };

  return (
    <>
      <motion.a
        ref={linkRef}
        href={href}
        onClick={handleClick}
        className="text-accent hover:underline inline-block"
        whileHover={reduce ? undefined : { y: -1, scale: 1.04 }}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      >
        {children}
      </motion.a>
      {fly && (
        <motion.span
          aria-hidden="true"
          initial={{
            x: fly.x,
            y: fly.y,
            width: fly.width,
            height: fly.height,
            opacity: 0.95,
            scale: 1,
          }}
          animate={{
            // Animate to a point slightly below the top of the viewport
            // (where the target section heading will arrive after scroll).
            x: window.innerWidth / 2 - fly.width / 2,
            y: window.innerHeight * 0.18,
            opacity: 0,
            scale: 0.7,
          }}
          transition={{ duration: 0.85, ease: [0.7, 0, 0.3, 1] }}
          className="fixed left-0 top-0 z-50 pointer-events-none rounded-full bg-accent/30 ring-1 ring-accent text-text font-mono text-xs uppercase tracking-[0.2em] flex items-center justify-center"
          style={{ width: fly.width, height: fly.height }}
        >
          {children}
        </motion.span>
      )}
    </>
  );
}
