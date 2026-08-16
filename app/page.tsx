import { readRoleFromCookies, readNameFromCookies } from '@/lib/cookies';
import { ROLE_LABELS } from '@/content/sections';
import { HERO_HEADLINE, HERO_SUBHEAD } from '@/content/audience-variants';
import type { Role } from '@/lib/types';
import { ParticleHero } from '@/components/hero/ParticleHero';
import { WhoAmIModal, type WhoAmIModalHandle } from '@/components/entry/WhoAmIModal';
import { RoleReshapedPage } from '@/components/RoleReshapedPage';
import { AgentTrace } from '@/components/ambient/AgentTrace';
import { CursorTrail } from '@/components/ambient/CursorTrail';
import { Footer } from '@/components/layout/Footer';
import { HomeShell } from '@/components/HomeShell';

// Default metadata; layout.tsx already exports a richer metadata object,
// so we leave page metadata to inherit / use static.

export default async function HomePage() {
  const role = await readRoleFromCookies();
  const name = await readNameFromCookies();
  return (
    <HomeShell initialRole={role} initialName={name}>
      <ParticleHero text="Hello." />
      <RoleReshapedPage />
      <Footer />
    </HomeShell>
  );
}