'use client';

import { ReactNode, useState } from 'react';
import Link, { LinkProps } from 'next/link';
import LinkWithStatusChild from './primitives/LinkWithStatusChild';
import clsx from 'clsx/lite';

export default function LinkWithStatus({
  children,
  className,
  loadingClassName,
  isLoading: isLoadingProp = false,
  setIsLoading: setIsLoadingProp,
  ...props
}: LinkProps & {
  children: ReactNode | ((props: { isLoading: boolean }) => ReactNode)
  className?: string
  loadingClassName?: string
  // For hoisting state to a parent component, e.g., <EntityLink />
  isLoading?: boolean
  setIsLoading?: (isLoading: boolean) => void
}) {
  const [_isLoading, _setIsLoading] = useState(false);
  const isLoading = isLoadingProp || _isLoading;
  const setIsLoading = setIsLoadingProp || _setIsLoading;

  const isControlled = typeof children === 'function';

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
    <LinkWithStatusChild {...{ isLoading, setIsLoading }}>
      {typeof children === 'function'
        ? children({ isLoading })
        : children}
    </LinkWithStatusChild>
  </Link>;
}
