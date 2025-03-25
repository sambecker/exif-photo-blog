import clsx from 'clsx/lite';
import { ComponentProps } from 'react';
import LinkWithStatus from './LinkWithStatus';

export default function LinkWithLoaderBadge({
  className,
  loadingClassName,
  ...props
}: ComponentProps<typeof LinkWithStatus>) {
  return (
    <LinkWithStatus
      {...props}
      className={clsx(
        'px-1 py-0.5 rounded-md',
        className,
      )}
      loadingClassName={clsx(
        'bg-gray-200/50 dark:bg-gray-700/50',
        loadingClassName,
      )}
    />
  ); 
}
