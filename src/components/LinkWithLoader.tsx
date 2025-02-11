import { ComponentProps, ReactNode } from 'react';
import LinkWithStatus from './LinkWithStatus';
import clsx from 'clsx/lite';
import Link from 'next/link';

export default function LinkWithLoader({
  loader,
  children,
  debugLoading,
  ...props
}: ComponentProps<typeof Link> & {
  loader: ReactNode
  debugLoading?: boolean
}) {
  return (
    <LinkWithStatus {...props}>
      {({ isLoading }) => <>
        <span className={clsx(
          'flex transition-opacity',
          isLoading ? 'opacity-0' : 'opacity-100',
        )}>
          {children}
        </span>
        {(isLoading || debugLoading) && <span className={clsx(
          'absolute inset-0',
          'flex items-center justify-center',
        )}>
          {loader}
        </span>}
      </>}
    </LinkWithStatus>
  );
}
