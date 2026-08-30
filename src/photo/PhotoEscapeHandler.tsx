'use client';

import { getEscapePath, isPathHome } from '@/app/path';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useLayoutEffect, useRef } from 'react';
import useEscapeHandler from '../utility/useEscapeHandler';
import usePrefersReducedMotion from '../utility/usePrefersReducedMotion';
import useScrollPositionMemory, {
  getSavedScrollPosition,
} from '../utility/useScrollPositionMemory';

export default function PhotoEscapeHandler() {
  const router = useRouter();

  const pathname = usePathname();

  useScrollPositionMemory(pathname);

  const prefersReducedMotion = usePrefersReducedMotion();

  const pendingScrollRef = useRef<{
    path: string
    y: number
  } | null>(null);

  const escapePath = getEscapePath(pathname);

  useLayoutEffect(() => {
    const pending = pendingScrollRef.current;
    if (!pending) { return; }
    if (pathname !== pending.path) { return; }
    window.scrollTo(0, pending.y);
    const frame = requestAnimationFrame(() => {
      window.scrollTo(0, pending.y);
      pendingScrollRef.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const onKeyDown = useCallback(() => {
    if (escapePath) {
      pendingScrollRef.current = {
        path: escapePath,
        y: getSavedScrollPosition(escapePath) ?? 0,
      };
      router.push(escapePath, { scroll: false });
    } else if (isPathHome(pathname) && window.scrollY > 0) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [escapePath, pathname, prefersReducedMotion, router]);

  useEscapeHandler({ onKeyDown });

  return null;
}
