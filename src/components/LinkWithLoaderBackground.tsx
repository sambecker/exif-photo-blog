import clsx from 'clsx/lite';
import { ComponentProps } from 'react';
import LinkWithStatus from './LinkWithStatus';

export default function LinkWithLoaderBackground({
  className,
  loadingClassName,
  offsetPadding,
  ...props
}: ComponentProps<typeof LinkWithStatus> & {
  offsetPadding?: boolean
}) {
  return (
    <LinkWithStatus
      {...props}
      className={clsx(
        offsetPadding && '-mx-1 -my-0.5',
        'px-1 py-0.5',
        'rounded-md',
        className,
      )}
      loadingClassName={clsx(
        'bg-gray-200/50 dark:bg-gray-700/50',
        loadingClassName,
      )}
    />
  ); 
}
