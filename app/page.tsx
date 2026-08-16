import { readRoleFromCookies, readNameFromCookies } from '@/lib/cookies';
import { ParticleHero } from '@/components/hero/ParticleHero';
import { RoleReshapedPage } from '@/components/RoleReshapedPage';
import { Footer } from '@/components/layout/Footer';
import { HomeShell } from '@/components/HomeShell';

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