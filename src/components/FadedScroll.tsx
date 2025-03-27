import clsx from 'clsx/lite';
import { HTMLAttributes, RefObject } from 'react';
import useFadedScroll from './useFadedScroll';

export default function FadedScroll({
  ref,
  direction = 'vertical',
  fadeHeight = 24,
  hideScrollbar,
  className,
  classNameContent,
  style,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  ref?: RefObject<HTMLDivElement | null>
  direction?: 'vertical' | 'horizontal'
  fadeHeight?: number
  classNameContent?: string
  hideScrollbar?: boolean
}) {
  const { maskImage } = useFadedScroll(ref, direction, fadeHeight);

  return <div
    {...props}
    ref={ref}
    className={clsx(
      direction === 'vertical'
        ? 'overflow-y-hidden'
        : 'overflow-x-hidden',
      className,
    )}
    style={{ maskImage, ...style }}
  >
    <div
      className={clsx(
        direction === 'vertical'
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
