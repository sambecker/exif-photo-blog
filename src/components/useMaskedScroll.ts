import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';

export interface MaskedScrollExternalProps {
  direction?: 'vertical' | 'horizontal'
  fadeHeight?: number
}

export default function useMaskedScroll({
  ref: containerRef,
  direction = 'vertical',
  fadeHeight = 24,
  // Disable when calling 'updateMask' explicitly
  updateMaskOnEvents = true,
}: MaskedScrollExternalProps & {
  ref: RefObject<HTMLDivElement | null>
  updateMaskOnEvents?: boolean
}) {
  const [position, setPosition] = useState({ start: true, end: true });

  const isVertical = direction === 'vertical';

  const updateMask = useCallback(() => {
    const ref = containerRef?.current;
    if (ref) {
      const start = isVertical
        ? ref.scrollTop === 0
        : ref.scrollLeft === 0;
      const end = isVertical
        ? ref.scrollHeight - ref.scrollTop === ref.clientHeight
        : ref.scrollWidth - ref.scrollLeft === ref.clientWidth;
      setPosition({ start, end });
    }
  }, [containerRef, isVertical]);

  useEffect(() => {
    const ref = containerRef?.current;
    if (ref) {
      updateMask();
      if (updateMaskOnEvents) {
        ref.onscroll = updateMask;
        ref.onresize = updateMask;
        return () => {
          ref.onscroll = null;
          ref.onresize = null;
        };
      }
    }
  }, [containerRef, updateMask, updateMaskOnEvents]);

  const maskImage = useMemo(() => {
    let mask = `linear-gradient(to ${isVertical ? 'bottom' : 'right'}, `;
    mask += 'transparent, black ';
    mask += `${!position.start ? fadeHeight : 0}px, black calc(100% - `;
    mask += `${!position.end ? fadeHeight : 0}px), transparent)`;
    return mask;
  }, [fadeHeight, isVertical, position]);

  return { maskImage, updateMask };
}
