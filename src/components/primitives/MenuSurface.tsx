import { ReactNode, RefObject } from 'react';
import clsx from 'clsx/lite';

export default function MenuSurface({
  ref,
  children,
  className,
}: {
  ref?: RefObject<HTMLDivElement | null>
  children: ReactNode
  className?: string
}) {
  return (
    <div
      ref={ref}
      className={clsx(
        'component-surface',
        'px-2 py-1.5 max-w-[14rem]',
        'shadow-xs',
        'text-[0.8rem] leading-tight',
        'text-balance text-center',
        className,
      )}
    >
      {children}
    </div>
  );
}
