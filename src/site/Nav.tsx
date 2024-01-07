import { authCached } from '@/cache';
import NavClient from './NavClient';

export default async function Nav() {
  // Make nav auth resilient to error on first time setup
  const session = await authCached().catch(() => null);
  return (
    <NavClient showAdmin={Boolean(session?.user?.email)} />
  );
}
