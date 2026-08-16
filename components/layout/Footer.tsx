'use client';

import { useWhoAmI } from '@/components/entry/whoami-store';
import { ROLE_LABELS } from '@/content/sections';

export function Footer() {
  const role = useWhoAmI((s) => s.role);
  const name = useWhoAmI((s) => s.name);
  return (
    <footer className="border-t border-border mt-24 py-12">
      <div className="mx-auto max-w-3xl px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono text-xs uppercase tracking-widest text-muted">
          {name ? `Hello, ${name}.` : 'Hello.'} · Viewing as {ROLE_LABELS[role]}
        </div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('whoami:open'))}
          className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
        >
          Re-edit role
        </button>
      </div>
    </footer>
  );
}