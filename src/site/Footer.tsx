import FooterClient from './FooterClient';
import { Suspense } from 'react';
import { authCached } from '@/cache';

export default async function Footer() {
  const session = await authCached();
  return (
    <Suspense fallback={<FooterClient />}>
      <FooterClient userEmail={session?.user?.email} />
    </Suspense>
  );
}
