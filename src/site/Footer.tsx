import { authCached } from '@/cache';
import FooterClient from './FooterClient';

export default async function Footer() {
  // Make footer auth resilient to error on first time setup
  const session = await authCached().catch(() => null);
  return (
    <FooterClient userEmail={session?.user?.email} />
  );
}
