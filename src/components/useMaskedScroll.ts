import { RefObject, useCallback, useEffect, useMemo } from 'react';
 
const CSS_VAR_START = '--mask-start';
const CSS_VAR_END   = '--mask-end';

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
      ref.style.setProperty(CSS_VAR_START, `${!start ? fadeSize : 0}px`);
      ref.style.setProperty(CSS_VAR_END, `${!end ? fadeSize : 0}px`);
    }
  }, [containerRef, fadeSize, isVertical]);

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
    mask += `var(${CSS_VAR_START}), black calc(100% - `;
    mask += `var(${CSS_VAR_END})), transparent)`;
    return mask;
  }, [isVertical]);

  return { maskImage, updateMask };
}
