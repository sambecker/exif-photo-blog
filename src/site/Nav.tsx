import { authCached } from '@/cache';
import NavClient from './NavClient';

export default async function Nav() {
  const session = await authCached();
  return (
    <NavClient showAdmin={Boolean(session?.user?.email)} />
  );
}
