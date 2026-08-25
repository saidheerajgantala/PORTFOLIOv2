'use client';

import { AnimatePresence, motion } from 'motion/react';
import { HeroReveal } from '@/components/hero/HeroReveal';
import { MagneticChip } from '@/components/hero/MagneticChip';
import { HERO_BIO } from '@/content/hero-bio';
import { HERO_VARIANT } from '@/content/hero-variants';
import type { Role } from '@/lib/types';

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href) || /^mailto:/i.test(href);
}

export function Hero({ role }: { role: Role }) {
  const bio = HERO_BIO[role];
  const variant = HERO_VARIANT[role];
  return (
    <section
      id="hero"
      className="relative w-full min-h-[80vh] flex items-center justify-center px-6 py-24"
    >
      <HeroReveal>
        <div className="w-full max-w-5xl mx-auto">
          <h1
            className="font-display font-bold leading-none tracking-[-0.04em] text-text"
            style={{ fontSize: 'clamp(48px, 10vw, 128px)' }}
          >
            Sai Dheeraj Gantala
          </h1>
          <h2 className="mt-4 font-mono text-sm uppercase tracking-[0.3em] text-muted">
            Backend Engineer · Agent Platforms · Bengaluru
          </h2>

          {/* Inline bio + role-aware span chips */}
          <p
            className="mt-12 max-w-3xl text-text"
            style={{ fontSize: 'clamp(18px, 1.6vw, 22px)' }}
          >
            {bio.intro}{' '}
            {bio.spans.map((s, i) => (
              <span key={s.label}>
                {i > 0 && <span className="mx-2 text-muted">·</span>}
                <MagneticChip href={s.href}>{s.label}</MagneticChip>
              </span>
            ))}
          </p>

          {/* Role-aware CTA strip — 4 buttons per role, 1 primary + 3 secondary */}
          <div
            key={role}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-sm uppercase tracking-[0.2em]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {variant.ctas.map((cta, i) => {
                const external = isExternal(cta.href);
                return (
                  <motion.a
                    key={`${role}-${cta.label}`}
                    href={cta.href}
                    {...(external && {
                      target: cta.href.startsWith('mailto:') ? undefined : '_blank',
                      rel: 'noopener noreferrer',
                    })}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, delay: 0.04 * i }}
                    className={
                      cta.primary
                        ? 'text-text border-b-2 border-accent pb-1 hover:opacity-80'
                        : 'text-muted hover:text-text'
                    }
                  >
                    {cta.label}
                  </motion.a>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </HeroReveal>
    </section>
  );
}