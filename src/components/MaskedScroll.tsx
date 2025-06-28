import { HTMLAttributes, RefObject, useRef } from 'react';
import useMaskedScroll from './useMaskedScroll';

export default function MaskedScroll({
  ref: refProp,
  direction,
  fadeSize,
  animationDuration,
  setMaxSize,
  hideScrollbar,
  updateMaskOnEvents,
  updateMaskAfterDelay,
  scrollToEndOnMount,
  style,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> &
Omit<Parameters<typeof useMaskedScroll>[0], 'ref'> &
{ ref?: RefObject<HTMLDivElement | null> }) {
  const refInternal = useRef<HTMLDivElement>(null);
  const ref = refProp ?? refInternal;

  const { styleMask } = useMaskedScroll({
    ref,
    direction,
    fadeSize,
    animationDuration,
    setMaxSize,
    hideScrollbar,
    updateMaskOnEvents,
    updateMaskAfterDelay,
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
