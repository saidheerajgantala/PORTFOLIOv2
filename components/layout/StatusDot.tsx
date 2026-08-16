import { cn } from '@/lib/utils';

export type StatusKind = 'active' | 'paused' | 'archived';

interface StatusDotProps {
  status: StatusKind;
  className?: string;
}

const statusColor: Record<StatusKind, string> = {
  active: 'bg-accent',
  paused: 'bg-signal-pause',
  archived: 'bg-text-muted',
};

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className={cn('inline-block w-2 h-2 rounded-full', statusColor[status])}
      />
      <span className="font-mono text-xs uppercase">{status}</span>
    </span>
  );
}