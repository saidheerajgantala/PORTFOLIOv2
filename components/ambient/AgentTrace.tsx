'use client';

import { useEffect, useState } from 'react';
import { generateTraceLine, type TraceLine } from './trace-generator';

const LINE_COUNT = 6;
const ROTATE_MS = 2500;

function levelClass(level: TraceLine['level']): string {
  switch (level) {
    case 'retry':
      return 'text-signal-pause';
    case 'fail':
      return 'text-accent';
    default:
      return 'text-text';
  }
}

function Line({ line }: { line: TraceLine }) {
  return (
    <li className="flex gap-2 font-mono text-xs leading-relaxed opacity-70">
      <span className="text-muted shrink-0">{line.timestamp}</span>
      <span className="text-muted shrink-0">{line.component}</span>
      <span className={levelClass(line.level)}>{line.message}</span>
    </li>
  );
}

export function AgentTrace() {
  const [lines, setLines] = useState<TraceLine[]>(() =>
    Array.from({ length: LINE_COUNT }, () => generateTraceLine()),
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = setInterval(() => {
      setLines((prev) => [generateTraceLine(), ...prev.slice(0, LINE_COUNT - 1)]);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-0 pointer-events-none max-w-md">
      <ul role="list" aria-hidden="true" className="flex flex-col gap-1">
        {lines.map((line) => (
          <Line key={line.id} line={line} />
        ))}
      </ul>
    </div>
  );
}