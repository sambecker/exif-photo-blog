'use client';

import useIsDesktop from '@/utility/useIsDesktop';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectOnDesktop({
  redirectPath,
}: {
  redirectPath: string
}) {
  const router = useRouter();
  
  const pathname = usePathname();

  const isDesktop = useIsDesktop();

  router.prefetch(redirectPath);

  useEffect(() => {
    if (isDesktop && pathname !== redirectPath) {
      router.push(redirectPath);
    }
  }, [isDesktop, pathname, redirectPath, router]);

  return null;
}
