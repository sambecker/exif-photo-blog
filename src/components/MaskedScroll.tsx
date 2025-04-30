import clsx from 'clsx/lite';
import { HTMLAttributes, useRef } from 'react';
import useMaskedScroll from './useMaskedScroll';

export default function MaskedScroll({
  direction = 'vertical',
  fadeSize,
  animationDuration,
  hideScrollbar,
  updateMaskOnEvents,
  scrollToEndOnMount,
  className,
  style,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> &
Omit<Parameters<typeof useMaskedScroll>[0], 'ref'>) {
  const ref = useRef<HTMLDivElement>(null);

  const { styleMask } = useMaskedScroll({
    ref,
    direction,
    fadeSize,
    animationDuration,
    hideScrollbar,
    updateMaskOnEvents,
    scrollToEndOnMount,
  });

  return <div
    {...props}
    ref={ref}
    className={clsx(
      direction === 'vertical'
        ? 'max-h-full overflow-y-scroll'
        : 'max-w-full overflow-x-scroll',
      className,
    )}
    style={{ ...styleMask, ...style }}
  >
    {children}
  </div>;
}
