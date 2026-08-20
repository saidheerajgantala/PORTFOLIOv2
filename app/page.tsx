import { readRoleFromCookies, readNameFromCookies } from '@/lib/cookies';
import { ParticleHero } from '@/components/hero/ParticleHero';
import { RoleReshapedPage } from '@/components/RoleReshapedPage';
import { Footer } from '@/components/layout/Footer';
import { HomeShell } from '@/components/HomeShell';
import { HERO_VARIANT } from '@/content/hero-variants';

export default async function HomePage() {
  const role = await readRoleFromCookies();
  const name = await readNameFromCookies();
  return (
    <HomeShell initialRole={role} initialName={name}>
      <ParticleHero role={role} variant={HERO_VARIANT[role]} />
      <RoleReshapedPage />
      <Footer />
    </HomeShell>
  );
}
