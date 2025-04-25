'use client';

import useKeydownHandler from '@/utility/useKeydownHandler';
import { PATH_FEED_INFERRED, PATH_GRID_INFERRED } from './paths';
import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const PATH_MAPS = {
  G: PATH_GRID_INFERRED,
  F: PATH_FEED_INFERRED,
};

export default function AppKeyListener() {
  const pathname = usePathname();

  const router = useRouter();

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const path = PATH_MAPS[e.key.toLocaleUpperCase() as keyof typeof PATH_MAPS];
    if (path && pathname !== path) {
      router.push(path);
    }
  }, [router, pathname]);

  useKeydownHandler({ onKeyDown });

  return null;
}
