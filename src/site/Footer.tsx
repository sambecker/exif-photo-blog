import { authCachedSafe } from '@/auth/cache';
import FooterClient from './FooterClient';

export default async function Footer() {
  const session = await authCachedSafe();
  return (
    <FooterClient userEmail={session?.user?.email} />
  );
}
