import { authCached } from '@/cache';
import FooterClient from './FooterClient';

export default async function Footer() {
  const session = await authCached();
  return (
    <FooterClient userEmail={session?.user?.email} />
  );
}
