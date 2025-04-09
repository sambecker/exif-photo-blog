import { ComponentProps, ReactNode } from 'react';
import LinkWithStatus from './LinkWithStatus';
import clsx from 'clsx/lite';

export default function LinkWithIconLoader({
  className,
  icon,
  loader,
  ...props
}: Omit<ComponentProps<typeof LinkWithStatus>, 'children'> & {
  icon: ReactNode
  loader: ReactNode
}) {
  return (
    <LinkWithStatus
      {...props}
      className={clsx('relative', className)}
    >
      {({ isLoading }) => <>
        <span className={clsx(
          'flex transition-opacity',
          isLoading ? 'opacity-0' : 'opacity-100',
        )}>
          {icon}
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
