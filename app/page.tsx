import { readRoleFromCookies, readNameFromCookies } from '@/lib/cookies';
import { Hero } from '@/components/hero/Hero';
import { RoleReshapedPage } from '@/components/RoleReshapedPage';
import { Footer } from '@/components/layout/Footer';
import { HomeShell } from '@/components/HomeShell';

export default async function HomePage() {
  const role = await readRoleFromCookies();
  const name = await readNameFromCookies();
  return (
    <HomeShell initialRole={role} initialName={name}>
      <Hero role={role} />
      <RoleReshapedPage />
      <Footer />
    </HomeShell>
  );
}
