'use client';

import { useState } from 'react';
import { SectionNumber } from '@/components/layout/SectionNumber';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

type Status = 'idle' | 'submitting' | 'success' | 'error';

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

      {status === 'success' ? (
        <div
          role="status"
          className="mt-12 border border-accent p-6 text-text"
        >
          Thanks — message received. I'll reply soon.
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
              Something went wrong. Email me directly at gantala.saidheeraj@gmail.com.
            </p>
          )}
          <Button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send message'}
          </Button>
        </form>
      )}
    </section>
  );
}
