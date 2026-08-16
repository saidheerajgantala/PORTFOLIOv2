'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type ReactNode } from 'react';
import { HeroFallback } from '@/components/hero/HeroFallback';

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
  text: string;
}

export function ParticleHero({ text }: Props) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  let overlay: ReactNode = null;
  if (webgl === true) {
    overlay = (
      <div className="absolute inset-0 mix-blend-screen" aria-hidden="true">
        <ParticleField text={text} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[60vh] min-h-[480px] flex items-center justify-center px-6">
      <h1 className="sr-only">{text}</h1>
      {/* Static animated fallback — always present, centered */}
      <div className="relative w-full max-w-5xl mx-auto text-center">
        <HeroFallback text={text} />
      </div>
      {overlay}
      <noscript>
        <HeroFallback text={text} />
      </noscript>
    </div>
  );
}
