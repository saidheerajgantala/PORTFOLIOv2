import { cookies } from 'next/headers';
import type { Role } from '@/lib/types';

export const ROLE_COOKIE = 'whoami-role';
export const NAME_COOKIE = 'whoami-name';

export async function readRoleFromCookies(): Promise<Role> {
  const c = (await cookies()).get(ROLE_COOKIE)?.value;
  if (c === 'recruiter' || c === 'peer' || c === 'founder' || c === 'client') return c;
  return 'peer';
}

export async function readNameFromCookies(): Promise<string | null> {
  return (await cookies()).get(NAME_COOKIE)?.value ?? null;
}
