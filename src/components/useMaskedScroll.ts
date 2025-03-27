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
  listenForScrollEvents = true,
}: MaskedScrollExternalProps & {
  ref: RefObject<HTMLDivElement | null>
  listenForScrollEvents?: boolean
}) {
  const [position, setPosition] = useState<'start' | 'middle' | 'end'>('start');

  const isVertical = direction === 'vertical';

  const updateMask = useCallback(() => {
    const ref = containerRef?.current;
    if (ref) {
      const isStart = isVertical
        ? ref.scrollTop === 0
        : ref.scrollLeft === 0;
      const isEnd = isVertical
        ? ref.scrollHeight - ref.scrollTop === ref.clientHeight
        : ref.scrollWidth - ref.scrollLeft === ref.clientWidth;
      setPosition(isStart ? 'start' : isEnd ? 'end' : 'middle');
    }
  }, [containerRef, isVertical]);

  useEffect(() => {
    const ref = containerRef?.current;
    if (ref && listenForScrollEvents) {
      ref.addEventListener('scroll', updateMask);
      return () => ref.removeEventListener('scroll', updateMask);
    }
  }, [containerRef, updateMask, listenForScrollEvents]);

  const maskImage = useMemo(() => {
    // eslint-disable-next-line max-len
    let mask = `linear-gradient(to ${isVertical ? 'bottom' : 'right'}, transparent, black `;
    mask += `${position !== 'start' ? fadeHeight : 0}px, black calc(100% - `;
    mask += `${position !== 'end' ? fadeHeight : 0}px), transparent)`;
    return mask;
  }, [fadeHeight, isVertical, position]);

  return { maskImage, updateMask };
}
