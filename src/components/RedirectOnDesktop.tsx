'use client';

import useIsDesktop from '@/utility/useIsDesktop';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectOnDesktop({
  redirectPath,
  shouldPrefetchRedirect = true,
}: {
  redirectPath: string
  shouldPrefetchRedirect?: boolean
}) {
  const router = useRouter();
  
  const pathname = usePathname();

  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (shouldPrefetchRedirect) {
      router.prefetch(redirectPath);
    }
  }, [router, shouldPrefetchRedirect, redirectPath]);

  useEffect(() => {
    if (isDesktop && pathname !== redirectPath) {
      router.push(redirectPath);
    }
  }, [router, isDesktop, pathname, redirectPath]);

  return null;
}
