import { ComponentProps, ReactNode } from 'react';
import LinkWithStatus from './LinkWithStatus';
import clsx from 'clsx/lite';
import Link from 'next/link';

export default function LinkWithLoader({
  loader,
  children,
  ...props
}: ComponentProps<typeof Link> & {
  loader: ReactNode
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
        {isLoading && <span className={clsx(
          'absolute inset-0',
          'flex items-center justify-center',
        )}>
          {loader}
        </span>}
      </>}
    </LinkWithStatus>
  );
}
