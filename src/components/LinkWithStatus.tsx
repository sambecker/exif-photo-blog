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
// Clear loading status after long duration
const MAX_LOADING_DURATION = 15_000;

export type LinkWithStatusProps = ComponentProps<typeof Link> & {
  loadingElement?: ReactNode
  loadingClassName?: string
  contentClassName?: string
}

export default function LinkWithStatus({
  loadingElement,
  loadingClassName,
  contentClassName,
  href, 
  className,
  onClick,
  children,
  ...props
}: LinkWithStatusProps) {
  const path = usePathname();

  const [pathWhenClicked, setPathWhenClicked] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  
  const isLoadingStartTime = useRef<number | undefined>(undefined);

  const startLoadingTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const stopLoadingTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const maxLoadingTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const clearTimeouts = useCallback(() => {
    [startLoadingTimeout, stopLoadingTimeout, maxLoadingTimeout]
      .forEach(timeout => {
        if (timeout.current) { clearTimeout(timeout.current); }
      });
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setPathWhenClicked(undefined);
  }, []);

  const isVisitingLinkHref = path === href;

  const shouldCancelLoading =
    (pathWhenClicked && pathWhenClicked !== path) ||
    isVisitingLinkHref;

  useEffect(() => {
    if (shouldCancelLoading) {
      clearTimeouts();
      const loadingDuration = isLoadingStartTime.current
        ? Date.now() - isLoadingStartTime.current
        : 0;
      if (loadingDuration < FLICKER_THRESHOLD) {
        stopLoadingTimeout.current = setTimeout(
          stopLoading,
          FLICKER_THRESHOLD - loadingDuration,
        );
      } else {
        stopLoading();
      }
    }
  }, [shouldCancelLoading, clearTimeouts, stopLoading]);

  // Clear timeouts when unmounting
  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  return <Link
    {...props }
    href={href}
    className={clsx(
      'relative transition-colors',
      className,
      isLoading && loadingClassName,
    )}
    onClick={e => {
      const isOpeningNewTab = e.metaKey || e.ctrlKey;
      if (!isVisitingLinkHref && !isOpeningNewTab) {
        setPathWhenClicked(path);
        startLoadingTimeout.current = setTimeout(
          () => {
            isLoadingStartTime.current = Date.now();
            setIsLoading(true);
          },
          FLICKER_THRESHOLD,
        );
        maxLoadingTimeout.current = setTimeout(
          stopLoading,
          MAX_LOADING_DURATION,
        );
      }
      onClick?.(e);
    }}
  >
    <span className={clsx(
      'flex transition-opacity',
      contentClassName,
      loadingElement
        ? isLoading ? 'opacity-0' : 'opacity-100'
        : loadingClassName
          ? 'opacity-100'
          : isLoading ? 'opacity-50' : 'opacity-100',
    )}>
      {children}
    </span>
    {isLoading && loadingElement && <span className={clsx(
      'absolute inset-0',
      'flex items-center justify-center',
    )}>
      {loadingElement}
    </span>}
  </Link>;
}
