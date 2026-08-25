'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import { useWhoAmI } from '@/components/entry/whoami-store';
import { WhoAmIModal, type WhoAmIModalHandle } from '@/components/entry/WhoAmIModal';
import { AgentTrace } from '@/components/ambient/AgentTrace';
import { CursorTrail } from '@/components/ambient/CursorTrail';
import { SectionRail } from '@/components/hero/SectionRail';
import { ScrollTrace } from '@/components/hero/ScrollTrace';
import type { Role } from '@/lib/types';

interface Props {
  initialRole: Role;
  initialName: string | null;
  children: React.ReactNode;
}

/**
 * Smoothly scroll the window to an absolute Y position using a critically-damped
 * spring on a normalized progress value (0 = start, 1 = target). Matches the
 * soft follow-feel of the ScrollTrace ball. Honors prefers-reduced-motion.
 */
function useSmoothScrollTo() {
  const reduce = useReducedMotion();
  const rafRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  useEffect(
    () => () => {
      cancelledRef.current = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return function scrollTo(targetY: number) {
    if (typeof window === 'undefined') return;
    // Cancel any in-flight scroll so back-to-back role edits feel snappy.
    cancelledRef.current = false;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    if (reduce) {
      window.scrollTo({ top: targetY, left: 0, behavior: 'auto' });
      return;
    }

    const startY = window.scrollY;
    const delta = targetY - startY;
    if (delta === 0) return;

    // Critically-damped-ish spring constants on a 0→1 progress value.
    // Same family as ScrollTrace (stiffness 90 / damping 26 / mass 0.8).
    const stiffness = 90;
    const damping = 28;
    let v = 0; // velocity
    let p = 0; // progress

    const step = () => {
      if (cancelledRef.current) return;
      const force = -stiffness * (p - 1) - damping * v;
      v += force * (1 / 60); // approx dt for rAF
      p += v * (1 / 60);

      // Clamp at the target so overshoot can't fling past 0.
      const clamped = Math.max(0, Math.min(1, p));
      const eased = clamped; // spring already provides easing
      window.scrollTo({ top: startY + delta * eased, left: 0, behavior: 'auto' });

      if (Math.abs(p - 1) < 0.001 && Math.abs(v) < 0.001) {
        window.scrollTo({ top: targetY, left: 0, behavior: 'auto' });
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  };
}

export function HomeShell({ initialRole, initialName, children }: Props) {
  const role = useWhoAmI((s) => s.role);
  const setRole = useWhoAmI((s) => s.setRole);
  const setName = useWhoAmI((s) => s.setName);
  const modalRef = useRef<WhoAmIModalHandle>(null);
  const smoothScrollTo = useSmoothScrollTo();

  useEffect(() => {
    setRole(initialRole);
    if (initialName) setName(initialName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRole, initialName]);

  // Smoothly scroll to top whenever the user picks a different role.
  const isFirstRoleRender = useRef(true);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isFirstRoleRender.current) {
      isFirstRoleRender.current = false;
      return;
    }
    smoothScrollTo(0);
  }, [role, smoothScrollTo]);

  useEffect(() => {
    const handler = () => modalRef.current?.open();
    window.addEventListener('whoami:open', handler);
    return () => window.removeEventListener('whoami:open', handler);
  }, []);

  return (
    <>
      <main id="main">{children}</main>
      <ScrollTrace role={role} />
      <SectionRail role={role} />
      <AgentTrace />
      <CursorTrail />
      <WhoAmIModal ref={modalRef} />
    </>
  );
}