'use client';

import { useEffect, useRef } from 'react';
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

export function HomeShell({ initialRole, initialName, children }: Props) {
  const role = useWhoAmI((s) => s.role);
  const setRole = useWhoAmI((s) => s.setRole);
  const setName = useWhoAmI((s) => s.setName);
  const modalRef = useRef<WhoAmIModalHandle>(null);

  useEffect(() => {
    setRole(initialRole);
    if (initialName) setName(initialName);
  }, [initialRole, initialName, setRole, setName]);

  // Auto-scroll to top whenever the user picks a different role
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [role]);

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