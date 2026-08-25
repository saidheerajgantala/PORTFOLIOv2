'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';

interface BioChipProps {
  href: string;
  children: ReactNode;
}

/**
 * Inline accent chip used in the hero bio paragraph.
 * Hover: lifts (y -1px, scale 1.04)
 * Tap: pulses (scale 0.96)
 * Respects prefers-reduced-motion by falling back to instant transitions.
 */
export function BioChip({ href, children }: BioChipProps) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={href}
      className="text-accent hover:underline"
      whileHover={reduce ? undefined : { y: -1, scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    >
      {children}
    </motion.a>
  );
}
