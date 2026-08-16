'use client';

/**
 * WhoAmI client store — single source of truth ON THE CLIENT for {role, name}.
 *
 * Cross-request source of truth is the `whoami-role` / `whoami-name` cookies,
 * set by the WhoAmIModal alongside writes here. The cookie wins on each new
 * page load because the server reads it during RSC. This store rehydrates
 * from `localStorage` to keep client state in sync with the cookie.
 *
 * If the cookie and localStorage ever disagree (e.g., cookies were cleared
 * but localStorage was not), the cookie is authoritative — the modal will
 * resync this store on its next open.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Role } from '@/lib/types';

interface WhoAmIState {
  role: Role;
  name: string | null;
  setRole: (role: Role) => void;
  setName: (name: string | null) => void;
  reset: () => void;
}

export const useWhoAmI = create<WhoAmIState>()(
  persist(
    (set) => ({
      role: 'peer',
      name: null,
      setRole: (role) => set({ role }),
      setName: (name) => set({ name }),
      reset: () => set({ role: 'peer', name: null }),
    }),
    {
      name: 'whoami',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
