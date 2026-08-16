'use client';

import { cn } from '@/lib/utils';

interface SectionNumberProps {
  index: number;
  total: number;
  className?: string;
}

export function SectionNumber({ index, total, className }: SectionNumberProps) {
  const label = `§${String(index).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  return (
    <span
      className={cn(
        'font-mono text-xs uppercase tracking-widest text-muted',
        className
      )}
    >
      {label}
    </span>
  );
}