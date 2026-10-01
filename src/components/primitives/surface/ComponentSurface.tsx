import { ReactNode, RefObject } from 'react';
import clsx from 'clsx/lite';

export default function ComponentSurface({
  ref,
  children,
  className,
  color,
}: {
  ref?: RefObject<HTMLDivElement | null>
  children: ReactNode
  className?: string
  color?: 'light' | 'dark' | 'frosted-light'
}) {
  return (
    <div
      ref={ref}
      className={clsx(
        color === undefined && 'component-surface shadow-sm dark:shadow-md',
        color === 'light' && 'component-surface-light shadow-sm',
        color === 'dark' && 'component-surface-dark shadow-md',
        color === 'frosted-light' &&
          'component-surface-frosted-light shadow-sm',
        'px-2 py-1.5 max-w-[14rem]',
        'text-[0.8rem] leading-tight',
        'text-balance text-center',
        className,
      )}
    >
      {children}
    </div>
  );
}
