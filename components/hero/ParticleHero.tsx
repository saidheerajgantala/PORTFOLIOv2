'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { HeroFallback } from '@/components/hero/HeroFallback';
import type { Role } from '@/lib/types';
import type { HeroVariant } from '@/content/hero-variants';

const ParticleField = dynamic(
  () => import('@/components/hero/ParticleField').then((m) => m.ParticleField),
  { ssr: false },
);

/**
 * Try to create a WebGL context the same way THREE.WebGLRenderer does.
 * Returns false on any failure.
 */
function detectWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const ctx =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (!ctx) return false;
    const lose = (ctx as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

interface Props {
  role: Role;
  variant: HeroVariant;
}

export function ParticleHero({ role, variant }: Props) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  let overlay: ReactNode = null;
  if (webgl === true) {
    overlay = (
      <div className="absolute inset-0 mix-blend-screen" aria-hidden="true">
        <ParticleField role={role} variant={variant} />
      </div>
    );
  }

  // Bake the variant's tint into --accent so HeroFallback's CSS-driven accent
  // (lime sweep, scanning beam, floating dots) follows the role. Other
  // sections on the page read --accent from the body, not this container.
  const style = { '--accent': variant.tint } as CSSProperties;

  return (
    <div
      className="relative w-full h-[60vh] min-h-[480px] flex items-center justify-center px-6"
      style={style}
    >
      <h1 className="sr-only">{variant.greeting}</h1>
      <div className="relative w-full max-w-5xl mx-auto text-center">
        <HeroFallback role={role} variant={variant} />
      </div>
      {overlay}
      <noscript>
        <HeroFallback role={role} variant={variant} />
      </noscript>
    </div>
  );
}
