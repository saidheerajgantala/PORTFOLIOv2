'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PHRASES = ['Hello.', 'Hi.', 'Hey.', 'Namaste.', 'Howdy.'];
const ROTATE_MS = 2800;

export function HeroFallback({ text }: { text: string }) {
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
    const id = setInterval(() => setIndex((i) => (i + 1) % PHRASES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

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

      {/* Scanning accent beam — thin vertical lime line, full hero height */}
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

      {/* The headline with letter-staggered entrance and exit morph */}
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
            key={PHRASES[index]}
            className="inline-block relative text-text"
            initial={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: '0.4em', filter: 'blur(16px)' }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: {
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                      staggerChildren: 0.05,
                    },
                  }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: '-0.4em',
                    filter: 'blur(12px)',
                    transition: { duration: 0.4, ease: 'easeIn' },
                  }
            }
          >
            {PHRASES[index].split('').map((ch, i) => (
              <motion.span
                key={`${PHRASES[index]}-${i}`}
                className="inline-block"
                initial={reduceMotion ? undefined : { opacity: 0, y: '0.6em' }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 0.55, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }
                }
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </h1>

      {/* Subtitle hint */}
      <motion.p
        aria-hidden="true"
        className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-text-muted text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
      >
        ↓ scroll to enter
      </motion.p>
    </div>
  );
}
