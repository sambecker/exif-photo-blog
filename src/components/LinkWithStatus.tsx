'use client';

import { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import LinkWithStatusChild from './primitives/LinkWithStatusChild';
import clsx from 'clsx/lite';

export default function LinkWithStatus({
  children,
  className,
  loadingClassName,
  isLoading: isLoadingProp = false,
  setIsLoading: setIsLoadingProp,
  onLoad,
  flickerThreshold,
  ...props
}: Omit<ComponentProps<typeof Link>, 'children'> & {
  children: ReactNode | ((props: { isLoading: boolean }) => ReactNode)
  loadingClassName?: string
  // For hoisting state to a parent component, e.g., <EntityLink />
  isLoading?: boolean
  setIsLoading?: (isLoading: boolean) => void
  onLoad?: () => void
  flickerThreshold?: number
}) {
  const [_isLoading, _setIsLoading] = useState(false);
  const isLoading = isLoadingProp || _isLoading;
  const setIsLoading = setIsLoadingProp || _setIsLoading;

  const isControlled = typeof children === 'function';

  const didStartLoading = useRef(false);
  useEffect(() => {
    console.log('link: 01', {isLoading, ref: didStartLoading.current});
    if (isLoading) {
      console.log('link: 02', {isLoading, ref: didStartLoading.current});
      didStartLoading.current = true;
      return () => {
        // Call onload when component unmounts while loading
        console.log('link: 03', {isLoading, ref: didStartLoading.current});
        if (isLoading) { onLoad?.(); }
      };
    } else if (didStartLoading.current) {
      console.log('link: 04', {isLoading, ref: didStartLoading.current});
      onLoad?.();
      didStartLoading.current = false;
    }
  }, [isLoading, onLoad]);

  return <Link
    {...props}
    className={clsx(
      'transition-[colors,opacity]',
      (loadingClassName || isControlled)
        ? 'opacity-100'
        : isLoading ? 'opacity-50' : 'opacity-100',
      className,
      isLoading && loadingClassName,
    )}
  >
    <LinkWithStatusChild {...{ setIsLoading, flickerThreshold }}>
      {typeof children === 'function'
        ? children({ isLoading })
        : children}
    </LinkWithStatusChild>
  </Link>;
}
