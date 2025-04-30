import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';

export interface MaskedScrollExternalProps {
  direction?: 'vertical' | 'horizontal'
  fadeSize?: number
  scrollToEndOnMount?: boolean
}

export default function useMaskedScroll({
  ref: containerRef,
  direction = 'vertical',
  fadeSize = 24,
  // Disable when calling 'updateMask' explicitly
  updateMaskOnEvents = true,
  scrollToEndOnMount,
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
        ? Math.abs((ref.scrollHeight - ref.scrollTop) - ref.clientHeight) < 1
        : Math.abs((ref.scrollWidth - ref.scrollLeft) - ref.clientWidth) < 1;
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

  useEffect(() => {
    const ref = containerRef?.current;
    const contentRect = ref?.children[0].getBoundingClientRect();
    if (scrollToEndOnMount && ref && contentRect) {
      ref.scrollTo(isVertical
        ? { top: contentRect.height }
        : { left: contentRect.width });
    }
  }, [containerRef, scrollToEndOnMount, isVertical]);

  const maskImage = useMemo(() => {
    let mask = `linear-gradient(to ${isVertical ? 'bottom' : 'right'}, `;
    mask += 'transparent, black ';
    mask += `${!position.start ? fadeSize : 0}px, black calc(100% - `;
    mask += `${!position.end ? fadeSize : 0}px), transparent)`;
    return mask;
  }, [fadeSize, isVertical, position]);

  return { maskImage, updateMask };
}
