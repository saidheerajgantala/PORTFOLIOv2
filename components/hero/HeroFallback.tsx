'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HERO_GREETING_CYCLE } from '@/content/hero-variants';
import type { Role } from '@/lib/types';
import type { HeroVariant } from '@/content/hero-variants';

const HOLD_MS = 1400;
const FADE_MS = 300;

export function HeroFallback({ role, variant }: { role: Role; variant: HeroVariant }) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mql.matches);
    const onChange = () => setReduceMotion(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    // Each phrase: typewriter (~60ms/char × ≤8 chars ≈ ≤480ms) + hold 1400ms
    // + fade 300ms. We approximate with a single interval that fires after
    // hold + fade, which is long enough that the typewriter always finishes
    // before the next phrase starts.
    const id = setInterval(
      () => setIndex((i) => (i + 1) % HERO_GREETING_CYCLE.length),
      HOLD_MS + FADE_MS + 600,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  const phrase = HERO_GREETING_CYCLE[index];

  return (
    <div className="relative w-full">
      {/* Subtle radial backdrop — sits behind the text */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={reduceMotion ? { opacity: 0.35 } : { opacity: [0.25, 0.45, 0.25] }}
        transition={
          reduceMotion
            ? { duration: 1.2, ease: 'easeOut' }
            : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <div
          className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, color-mix(in oklab, var(--accent) 18%, transparent) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      {/* Animated grid — only visible in center, very subtle */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ duration: 1.5 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--text) 1px, transparent 1px), linear-gradient(to bottom, var(--text) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage:
              'radial-gradient(ellipse 50% 70% at 50% 50%, black 0%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 50% 70% at 50% 50%, black 0%, transparent 75%)',
          }}
        />
      </motion.div>

      {/* Scanning accent beam — thin vertical line, full hero height */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 -z-10 w-px"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, var(--accent) 50%, transparent 100%)',
          opacity: 0.5,
        }}
        initial={{ left: '10%' }}
        animate={
          reduceMotion
            ? undefined
            : { left: ['10%', '90%', '10%'] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating accent dots — positioned around the hero */}
      {[
        { top: '12%', left: '15%', size: 8, delay: 0, dur: 6 },
        { top: '70%', left: '85%', size: 6, delay: 0.5, dur: 7.5 },
        { top: '82%', left: '22%', size: 4, delay: 1, dur: 5 },
        { top: '24%', left: '88%', size: 7, delay: 1.5, dur: 8 },
        { top: '50%', left: '8%', size: 3, delay: 2, dur: 6.5 },
        { top: '40%', left: '92%', size: 5, delay: 0.8, dur: 7 },
      ].map((d, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full -z-10"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            background: 'var(--accent)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            reduceMotion
              ? { opacity: 0.8 }
              : {
                  opacity: [0.2, 1, 0.2],
                  scale: [0.5, 1.4, 0.5],
                  y: [0, -14, 0],
                }
          }
          transition={{
            duration: d.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: d.delay,
          }}
        />
      ))}

      {/* The headline with typewriter animation + hold + fade out */}
      <h1
        className="font-display font-bold leading-none tracking-[-0.04em] select-none relative"
        style={{ fontSize: 'clamp(48px, 12vw, 160px)' }}
      >
        {/* Lime gradient sweep across the text via mix-blend-mode */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--accent) 40%, transparent) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            mixBlendMode: 'screen',
          }}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={phrase}
            className="inline-block relative text-text"
            initial={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      ease: 'easeOut',
                      // Stagger each character so it types in 60ms/char.
                      staggerChildren: 0.06,
                      delayChildren: 0.05,
                    },
                  }
            }
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.1 } }
                : {
                    opacity: 0,
                    filter: 'blur(8px)',
                    transition: { duration: FADE_MS / 1000, ease: 'easeIn' },
                  }
            }
          >
            {phrase.split('').map((ch, i) => (
              <motion.span
                key={`${phrase}-${i}`}
                className="inline-block"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: '0.2em' }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                }
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </h1>

      {/* Role-aware subhead */}
      <motion.p
        aria-hidden="true"
        className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-text-muted text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
      >
        {variant.sub}
      </motion.p>

      {/* Role-aware CTA */}
      <motion.a
        href="#contact"
        className="mt-4 inline-block font-mono text-sm text-text underline decoration-accent decoration-2 underline-offset-[6px] hover:opacity-80 transition-opacity"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
      >
        {variant.cta}
      </motion.a>
    </div>
  );
}
