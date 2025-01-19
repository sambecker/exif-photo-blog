'use client';

import {
  ComponentProps,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx/lite';

// Avoid showing spinner for too short a time
const FLICKER_THRESHOLD = 400;
// Clear loading status after 10 seconds of inactivity
const MAX_LOADING_DURATION = 10_000;

export type LinkWithStatusProps = ComponentProps<typeof Link> & {
  loader?: ReactNode
}

export default function LinkWithStatus({
  loader,
  href, 
  className,
  onClick,
  children,
  ...props
}: LinkWithStatusProps) {
  const path = usePathname();

  const [isLoading, setIsLoading] = useState(false);
  
  const isLoadingStartTime = useRef<number | undefined>(undefined);

  const startLoadingTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const stopLoadingTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const maxLoadingTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const clearTimeouts = useCallback(() =>
    [startLoadingTimeout, stopLoadingTimeout, maxLoadingTimeout]
      .forEach(timeout => {
        if (timeout.current) { clearTimeout(timeout.current); }
      }),
  []);

  const isVisitingLinkHref = path === href;

  useEffect(() => {
    if (isVisitingLinkHref) {
      clearTimeouts();
      const loadingDuration = isLoadingStartTime.current
        ? Date.now() - isLoadingStartTime.current
        : 0;
      if (loadingDuration < FLICKER_THRESHOLD) {
        stopLoadingTimeout.current = setTimeout(
          () => { setIsLoading(false); },
          FLICKER_THRESHOLD - loadingDuration,
        );
      } else {
        setIsLoading(false);
      }
    }
  }, [isVisitingLinkHref, clearTimeouts]);

  // Clear timeouts when unmounting
  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  return <Link
    {...props }
    href={href}
    className={clsx(
      className,
      'relative',
    )}
    onClick={e => {
      const isOpeningNewTab = e.metaKey || e.ctrlKey;
      if (!isVisitingLinkHref && !isOpeningNewTab) {
        startLoadingTimeout.current = setTimeout(
          () => {
            isLoadingStartTime.current = Date.now();
            setIsLoading(true);
          },
          FLICKER_THRESHOLD,
        );
        maxLoadingTimeout.current = setTimeout(
          () => { setIsLoading(false); },
          MAX_LOADING_DURATION,
        );
      }
      onClick?.(e);
    }}
  >
    <span className={clsx(
      'flex transition-opacity',
      loader
        ? isLoading ? 'opacity-0' : 'opacity-100'
        : isLoading ? 'opacity-50' : 'opacity-100',
    )}>
      {children}
    </span>
    {isLoading && loader && <span className={clsx(
      'absolute inset-0',
      'flex items-center justify-center',
    )}>
      {loader}
    </span>}
  </Link>;
}
