import clsx from 'clsx/lite';
import { HTMLAttributes, useRef } from 'react';
import useMaskedScroll, { MaskedScrollExternalProps } from './useMaskedScroll';

export default function MaskedScroll({
  direction = 'vertical',
  fadeHeight,
  hideScrollbar,
  className,
  style,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> &
MaskedScrollExternalProps & {
  hideScrollbar?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { maskImage } = useMaskedScroll({ ref, direction, fadeHeight });

  return <div
    {...props}
    ref={ref}
    className={clsx(
      direction === 'vertical'
        ? 'max-h-full overflow-y-scroll'
        : 'max-w-full overflow-x-scroll',
      hideScrollbar && '[scrollbar-width:none]',
      className,
    )}
    style={{ maskImage, ...style }}
  >
    {children}
  </div>;
}
