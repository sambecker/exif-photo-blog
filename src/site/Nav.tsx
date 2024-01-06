import { authCached } from '@/cache';
import NavClient from './NavClient';
import { Suspense } from 'react';

export default async function Nav() {
  const session = await authCached();
  return (
    <Suspense fallback={<NavClient />}>
      <NavClient showAdmin={Boolean(session?.user?.email)} />
    </Suspense>
  );
}
