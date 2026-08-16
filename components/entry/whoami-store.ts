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
