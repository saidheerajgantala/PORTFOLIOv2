'use client';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import type { ReactNode } from 'react';

export function HeroReveal({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}