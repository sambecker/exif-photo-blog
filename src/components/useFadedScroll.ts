import { RefObject, useEffect, useMemo, useState } from 'react';

export default function useFadedScroll(
  containerRef?: RefObject<HTMLDivElement | null>,
  direction: 'vertical' | 'horizontal' = 'vertical',
  fadeHeight = 24,
) {
  const [position, setPosition] = useState<'start' | 'middle' | 'end'>('start');

  const isVertical = direction === 'vertical';

  const ref = containerRef?.current?.children[0] as HTMLElement;
  useEffect(() => {
    if (ref) {
      const handleScroll = () => {
        const isStart = isVertical
          ? ref.scrollTop === 0
          : ref.scrollLeft === 0;
        const isEnd = isVertical
          ? ref.scrollHeight - ref.scrollTop === ref.clientHeight
          : ref.scrollWidth - ref.scrollLeft === ref.clientWidth;
        setPosition(isStart ? 'start' : isEnd ? 'end' : 'middle');
      };
      ref.addEventListener('scroll', handleScroll);
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, [ref, isVertical]);

  const maskImage = useMemo(() => {
    // eslint-disable-next-line max-len
    let mask = `linear-gradient(to ${isVertical ? 'bottom' : 'right'}, transparent, black `;
    mask += `${position !== 'start' ? fadeHeight : 0}px, black calc(100% - `;
    mask += `${position !== 'end' ? fadeHeight : 0}px), transparent)`;
    return mask;
  }, [fadeHeight, isVertical, position]);

  return { maskImage };
}
