'use client';

import dynamic from 'next/dynamic';
import { HeroFallback } from '@/components/hero/HeroFallback';

const ParticleField = dynamic(
  () => import('@/components/hero/ParticleField').then((m) => m.ParticleField),
  { ssr: false, loading: () => <HeroFallback text="..." /> },
);

interface Props {
  text: string;
}

export function ParticleHero({ text }: Props) {
  return (
    <div className="relative w-full h-[60vh] flex items-center">
      <div className="absolute inset-0">
        <ParticleField text={text} />
      </div>
      <noscript>
        <HeroFallback text={text} />
      </noscript>
    </div>
  );
}
