import clsx from 'clsx/lite';
import {
  HTMLAttributes,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export default function FadedScroll({
  ref: containerRef,
  direction = 'vertical',
  fadeHeight = 24,
  hideScrollbar,
  className,
  classNameContent,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  ref?: RefObject<HTMLDivElement | null>
  direction?: 'vertical' | 'horizontal'
  fadeHeight?: number
  classNameContent?: string
  hideScrollbar?: boolean
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<'start' | 'middle' | 'end'>('start');

  const isVertical = direction === 'vertical';

  useEffect(() => {
    const ref = contentRef.current;
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
  }, [isVertical]);

  const maskImage = useMemo(() => {
    // eslint-disable-next-line max-len
    let mask = `linear-gradient(to ${isVertical ? 'bottom' : 'right'}, transparent, black `;
    mask += `${position !== 'start' ? fadeHeight : 0}px, black calc(100% - `;
    mask += `${position !== 'end' ? fadeHeight : 0}px), transparent)`;
    return mask;
  }, [fadeHeight, isVertical, position]);

  return <div
    {...props}
    ref={containerRef}
    className={clsx(
      isVertical
        ? 'overflow-y-hidden'
        : 'overflow-x-hidden',
      className,
    )}
    style={{ maskImage }}
  >
    <div
      ref={contentRef}
      className={clsx(
        isVertical
          ? 'max-h-full overflow-y-auto'
          : 'max-w-full overflow-x-auto',
        hideScrollbar && '[scrollbar-width:none]',
        classNameContent,
      )}
    >
      {children}
    </div>
  </div>;
}
