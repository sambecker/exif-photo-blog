import clsx from 'clsx/lite';
import { HTMLAttributes, useRef } from 'react';
import useMaskedScroll, { MaskedScrollExternalProps } from './useMaskedScroll';

export default function MaskedScroll({
  direction = 'vertical',
  fadeHeight = 24,
  hideScrollbar,
  className,
  classNameContent,
  style,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> &
MaskedScrollExternalProps & {
  classNameContent?: string
  hideScrollbar?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { maskImage } = useMaskedScroll({ ref, direction, fadeHeight });

  return <div
    {...props}
    className={clsx(
      direction === 'vertical'
        ? 'overflow-y-hidden'
        : 'overflow-x-hidden',
      className,
    )}
    style={{ maskImage, ...style }}
  >
    <div
      ref={ref}
      className={clsx(
        direction === 'vertical'
          ? 'max-h-full overflow-y-auto'
          : 'max-w-full overflow-x-auto',
        hideScrollbar && '[scrollbar-width:none]',
        classNameContent,
      )}
    >
      {children}
    </div>
  </div>;
}
