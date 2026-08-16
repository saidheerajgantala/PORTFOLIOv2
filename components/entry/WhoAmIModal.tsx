'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { useWhoAmI } from '@/components/entry/whoami-store';
import { RoleCard } from '@/components/entry/RoleCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Role } from '@/lib/types';
import { ROLES } from '@/lib/types';
import { ROLE_LABELS } from '@/content/sections';

export interface WhoAmIModalHandle {
  open: () => void;
}

export const WhoAmIModal = forwardRef<WhoAmIModalHandle>(function WhoAmIModal(_, ref) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Role>('peer');
  const [name, setName] = useState('');
  const setRole = useWhoAmI((s) => s.setRole);
  const setNameStore = useWhoAmI((s) => s.setName);

  useEffect(() => {
    const seen = localStorage.getItem('whoami-seen');
    if (!seen) setOpen(true);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setOpen(true),
    }),
    [],
  );

  const persist = (role: Role, n: string | null) => {
    document.cookie = `whoami-role=${role}; path=/; max-age=31536000; SameSite=Lax`;
    if (n) document.cookie = `whoami-name=${encodeURIComponent(n)}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem('whoami-seen', '1');
    setRole(role);
    setNameStore(n);
  };

  const handleConfirm = () => {
    persist(selected, name.trim() || null);
    setOpen(false);
  };

  const handleSkip = () => {
    persist('peer', null);
    setOpen(false);
  };

  return (
    <Dialog.Root
      modal={false}
      open={open}
      onOpenChange={(next) => {
        // If the dialog is closing without a confirm or skip, treat as skip
        if (!next && localStorage.getItem('whoami-seen') !== '1') {
          persist('peer', null);
        }
        setOpen(next);
      }}
    >
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[min(640px,calc(100vw-32px))] bg-surface-2 border border-border p-8"
              >
                <Dialog.Title className="font-mono text-xs text-text-muted mb-2">
                  $ whoami --interactive
                </Dialog.Title>
                <Dialog.Description className="font-display text-2xl font-bold text-text mb-1">
                  Identify yourself
                </Dialog.Description>
                <p className="text-sm text-text-muted mb-6">
                  Pick a role so the page surfaces what's relevant to you. Skip to default to peer.
                </p>

                <div role="radiogroup" aria-label="Role" className="grid grid-cols-2 gap-3 mb-6">
                  {ROLES.map((role) => (
                    <RoleCard
                      key={role}
                      role={role}
                      selected={selected === role}
                      onSelect={setSelected}
                    />
                  ))}
                </div>

                <label className="block mb-6">
                  <span className="font-mono text-xs text-text-muted block mb-2">
                    $ whoami --name (optional)
                  </span>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    maxLength={60}
                  />
                </label>

                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip
                  </Button>
                  <Button onClick={handleConfirm}>
                    Continue as {ROLE_LABELS[selected]}
                  </Button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
});

WhoAmIModal.displayName = 'WhoAmIModal';
