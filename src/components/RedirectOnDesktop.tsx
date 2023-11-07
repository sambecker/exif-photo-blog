'use client';

import useIsDesktop from '@/utility/useIsDesktop';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectOnDesktop({
  redirectPath,
  shouldPrefetch = true,
}: {
  redirectPath: string
  shouldPrefetch?: boolean
}) {
  const router = useRouter();
  
  const pathname = usePathname();

  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (shouldPrefetch) {
      router.prefetch(redirectPath);
    }
  }, [router, shouldPrefetch, redirectPath]);

  useEffect(() => {
    if (isDesktop && pathname !== redirectPath) {
      router.push(redirectPath);
    }
  }, [router, isDesktop, pathname, redirectPath]);

  return null;
}
