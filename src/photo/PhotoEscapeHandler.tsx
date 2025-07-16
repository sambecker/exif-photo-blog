'use client';

import { getEscapePath } from '@/app/path';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import useEscapeHandler from '../utility/useEscapeHandler';

export default function PhotoEscapeHandler() {
  const router = useRouter();
 
  const pathname = usePathname();

  const escapePath = getEscapePath(pathname);

  const onKeyDown = useCallback(() => {
    if (escapePath) { router.push(escapePath, { scroll: false }); }
  }, [escapePath, router]);

  useEscapeHandler({ onKeyDown });

  return null;
}
