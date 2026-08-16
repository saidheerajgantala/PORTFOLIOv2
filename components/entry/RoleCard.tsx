'use client';

import type { Role } from '@/lib/types';
import { ROLE_LABELS, ROLE_VALUE_PROPS } from '@/content/sections';
import { cn } from '@/lib/utils';

export interface RoleCardProps {
  role: Role;
  selected: boolean;
  onSelect: (role: Role) => void;
}

export function RoleCard({ role, selected, onSelect }: RoleCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(role)}
      className={cn(
        'flex flex-col items-start gap-2 p-5 border text-left transition-all duration-150',
        'bg-surface hover:bg-surface-2',
        selected ? 'border-accent' : 'border-border',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4',
      )}
    >
      <span className="font-mono text-xs text-text-muted">$ role={role}</span>
      <span className="text-lg font-display font-bold text-text">{ROLE_LABELS[role]}</span>
      <span className="text-sm text-text-muted">{ROLE_VALUE_PROPS[role]}</span>
    </button>
  );
}