'use client';

import { useState } from 'react';
import { SectionNumber } from '@/components/layout/SectionNumber';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL = 'gantala.saidheeraj@gmail.com';
const PHONE = '+91 91009 44342';

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback: select the text manually
      const el = document.createElement('textarea');
      el.value = value;
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      } catch {
        /* ignore */
      }
      document.body.removeChild(el);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className={cn(
        'group inline-flex items-center gap-2 border px-3 py-2 font-mono text-xs uppercase tracking-[0.2em]',
        'transition-all duration-200',
        copied
          ? 'border-accent text-accent'
          : 'border-border text-muted hover:border-accent hover:text-accent'
      )}
    >
      <span aria-hidden="true">{copied ? '✓' : '⧉'}</span>
      {copied ? 'Copied' : `Copy ${label}`}
    </button>
  );
}

export function Contact({ index, total }: { index: number; total: number }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto w-full max-w-3xl px-6 py-24"
    >
      <SectionNumber index={index} total={total} className="block" />
      <h2 id="contact-heading" className="mt-4 font-display text-4xl text-text">
        Get in touch
      </h2>
      <p className="mt-4 text-muted max-w-prose">
        Send a note about what you're building. I read everything and reply within a couple of days.
      </p>

      {/* Direct contact methods */}
      <div className="mt-8 flex flex-wrap gap-3">
        <CopyButton value={EMAIL} label="email" />
        <CopyButton value={PHONE} label="phone" />
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center gap-2 border border-border px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:border-accent hover:text-accent transition-colors"
        >
          Open mail →
        </a>
      </div>

      {status === 'success' ? (
        <div
          role="status"
          className="mt-12 border border-accent p-6 text-text animate-[fadeIn_0.4s_ease-out]"
        >
          <p className="font-display text-xl text-accent">Thanks — message received.</p>
          <p className="mt-2 text-muted">I'll reply soon. In the meantime, grab my email above if you need it.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          <div>
            <label htmlFor="contact-name" className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
              Name
            </label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
              Email
            </label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
              Message
            </label>
            <Textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
            />
          </div>
          {status === 'error' && (
            <p role="alert" className="text-accent font-mono text-xs uppercase tracking-widest">
              Something went wrong. Email me directly at {EMAIL}.
            </p>
          )}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Send message'}
            </Button>
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              or use copy buttons above
            </span>
          </div>
        </form>
      )}
    </section>
  );
}
