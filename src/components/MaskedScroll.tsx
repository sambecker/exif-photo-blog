import { HTMLAttributes, useRef } from 'react';
import useMaskedScroll from './useMaskedScroll';

export default function MaskedScroll({
  direction,
  fadeSize,
  animationDuration,
  hideScrollbar,
  updateMaskOnEvents,
  scrollToEndOnMount,
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
    style={{ ...styleMask, ...style }}
  >
    {children}
  </div>;
}
