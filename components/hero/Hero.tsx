import { HeroReveal } from '@/components/hero/HeroReveal';
import { HERO_BIO } from '@/content/hero-bio';
import { HERO_VARIANT } from '@/content/hero-variants';
import type { Role } from '@/lib/types';

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
            Saidheeraj Gantala
          </h1>
          <h2 className="mt-4 font-mono text-sm uppercase tracking-[0.3em] text-muted">
            Backend Engineer · Agent Platforms · Bengaluru
          </h2>

          <p
            className="mt-12 max-w-3xl text-text"
            style={{ fontSize: 'clamp(18px, 1.6vw, 22px)' }}
          >
            {bio.intro}{' '}
            {bio.spans.map((s, i) => (
              <span key={s.label}>
                {i > 0 && <span className="mx-2 text-muted">·</span>}
                <a href={s.href} className="text-accent hover:underline">
                  {s.label}
                </a>
              </span>
            ))}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-sm uppercase tracking-[0.2em]">
            <a
              href="#contact"
              className="text-text border-b-2 border-accent pb-1 hover:opacity-80"
            >
              {variant.cta}
            </a>
            <a
              href="mailto:gantala.saidheeraj@gmail.com"
              className="text-muted hover:text-text"
            >
              Available for platform engagements →
            </a>
            <a href="#career-arc" className="text-muted hover:text-text">
              Currently @ EPAM
            </a>
            <a href="#currently-building" className="text-muted hover:text-text">
              Notes on agent reliability
            </a>
          </div>
        </div>
      </HeroReveal>
    </section>
  );
}