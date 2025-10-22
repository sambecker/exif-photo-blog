'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { SharedHoverProps, useSharedHoverState } from '../shared-hover/state';
import useSupportsHover from '@/utility/useSupportsHover';
import clsx from 'clsx/lite';

export default function SharedHover({
  hoverKey: key,
  children,
  content,
  className,
  width,
  height,
  offsetAbove = -1,
  offsetBelow = -6,
  color,
}: {
  hoverKey: string
  children :ReactNode
  content: ReactNode
  className?: string
  width: number
  height: number
  offsetAbove?: number
  offsetBelow?: number
  color?: SharedHoverProps['color']
}) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    showHover,
    dismissHover,
    renderHover,
    isHoverBeingShown,
  } = useSharedHoverState();

  const isHovering = isHoverBeingShown?.(key);

  const supportsHover = useSupportsHover();

  useEffect(() => {
    const trigger = ref.current;
    return () => dismissHover?.(trigger);
  }, [dismissHover]);

  useEffect(() => {
    if (isHovering) {
      renderHover?.(content);
    }
  }, [isHovering, renderHover, content]);

  return (
    <div
      className={clsx('max-w-full', className)}
      ref={ref}
      onMouseEnter={() => supportsHover &&
        showHover?.(ref.current, {
          key,
          width,
          height,
          offsetAbove,
          offsetBelow,
          color,
        })}
      onMouseLeave={() => supportsHover &&
        dismissHover?.(ref.current)}
    >
      {children}
    </div>
  );
}
