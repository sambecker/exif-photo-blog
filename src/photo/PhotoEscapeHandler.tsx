'use client';

import { getEscapePath } from '@/app/paths';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import useEscapeHandler from '../utility/useEscapeHandler';

export default function PhotoEscapeHandler() {
  const router = useRouter();
 
  const pathname = usePathname();

  const escapePath = getEscapePath(pathname);

  const escapeHandler = useCallback(() => {
    if (escapePath) { router.push(escapePath, { scroll: false }); }
  }, [escapePath, router]);

  useEscapeHandler(escapeHandler);

  return null;
}
