'use client';

import { useEffect, useRef } from 'react';
import { useWhoAmI } from '@/components/entry/whoami-store';
import { WhoAmIModal, type WhoAmIModalHandle } from '@/components/entry/WhoAmIModal';
import { AgentTrace } from '@/components/ambient/AgentTrace';
import { CursorTrail } from '@/components/ambient/CursorTrail';
import { SectionRail } from '@/components/hero/SectionRail';
import type { Role } from '@/lib/types';

interface Props {
  initialRole: Role;
  initialName: string | null;
  children: React.ReactNode;
}

export function HomeShell({ initialRole, initialName, children }: Props) {
  const setRole = useWhoAmI((s) => s.setRole);
  const setName = useWhoAmI((s) => s.setName);
  const modalRef = useRef<WhoAmIModalHandle>(null);

  useEffect(() => {
    setRole(initialRole);
    if (initialName) setName(initialName);
  }, [initialRole, initialName, setRole, setName]);

  useEffect(() => {
    const handler = () => modalRef.current?.open();
    window.addEventListener('whoami:open', handler);
    return () => window.removeEventListener('whoami:open', handler);
  }, []);

  return (
    <>
      <main id="main">{children}</main>
      <SectionRail />
      <AgentTrace />
      <CursorTrail />
      <WhoAmIModal ref={modalRef} />
    </>
  );
}