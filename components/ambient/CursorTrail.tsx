'use client';

import { useEffect, useRef, useState } from 'react';

interface Dot {
  id: number;
  x: number;
  y: number;
  born: number;
}

const MAX_DOTS = 12;
const LIFESPAN_MS = 600;
const SPAWN_THROTTLE_MS = 50;
const PEAK_OPACITY = 0.6;

export function CursorTrail() {
  const ref = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const idRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      return;
    }
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < SPAWN_THROTTLE_MS) return;
      lastSpawnRef.current = now;
      const dots = dotsRef.current;
      dots.push({ id: idRef.current++, x: e.clientX, y: e.clientY, born: now });
      if (dots.length > MAX_DOTS) dots.shift();
      render();
    };

    const render = () => {
      const root = ref.current;
      if (!root) return;
      const now = performance.now();
      const dots = dotsRef.current;
      // Reconcile: keep only live dots
      const live = dots.filter((d) => now - d.born < LIFESPAN_MS);
      dotsRef.current = live;
      root.innerHTML = live
        .map((d) => {
          const age = (now - d.born) / LIFESPAN_MS;
          const opacity = PEAK_OPACITY * (1 - age);
          return `<span data-id="${d.id}" style="position:absolute;left:${d.x}px;top:${d.y}px;width:6px;height:6px;border-radius:9999px;background:#C6FF3D;opacity:${opacity};transform:translate(-50%,-50%)"></span>`;
        })
        .join('');
    };

    const tick = setInterval(render, 100);
    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearInterval(tick);
    };
  }, []);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
}
