import { HTMLAttributes, RefObject, useRef } from 'react';
import useMaskedScroll from './useMaskedScroll';

export default function MaskedScroll({
  ref: refProp,
  enabled = true,
  direction,
  fadeSize,
  animationDuration,
  setMaxSize,
  hideScrollbar,
  updateMaskOnEvents,
  scrollToEndOnMount,
  style,
  children,
  ...props
}: {
  ref?: RefObject<HTMLDivElement | null>
  enabled?: boolean
} & HTMLAttributes<HTMLDivElement>
& Omit<Parameters<typeof useMaskedScroll>[0], 'ref'>) {
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
    scrollToEndOnMount,
  });

  return <div
    {...props}
    ref={ref}
    style={{
      ...enabled && styleMask,
      ...style,
    }}
  >
    {children}
  </div>;
}
