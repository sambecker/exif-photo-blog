import { ReactNode, RefObject } from 'react';
import clsx from 'clsx/lite';

export default function MenuSurface({
  ref,
  children,
  className,
  color,
}: {
  ref?: RefObject<HTMLDivElement | null>
  children: ReactNode
  className?: string
  color?: 'light' | 'dark' | 'frosted'
}) {
  return (
    <div
      ref={ref}
      className={clsx(
        color === undefined && 'component-surface shadow-xs dark:shadow-md',
        color === 'light' && 'component-surface-light shadow-xs',
        color === 'dark' && 'component-surface-dark shadow-md',
        color === 'frosted' && 'component-surface-frosted shadow-xs',
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
