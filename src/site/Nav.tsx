import { authCachedSafe } from '@/auth/cache';
import NavClient from './NavClient';

export default async function Nav({
  animate,
}: {
  animate?: boolean
}) {
  const session = await authCachedSafe();
  return (
    <NavClient
      showAdmin={Boolean(session?.user?.email)}
      animate={animate}
    />
  );
}
