'use client';

import { clsx } from 'clsx/lite';
import { HTMLAttributes, ReactNode, RefObject, useRef } from 'react';
import AppGrid from './AppGrid';
import useStickyHeader from '@/app/useStickyHeader';

export default function StickyBanner({
  ref: surfaceRef,
  children,
  className,
  isVisible,
  ...props
}: {
  ref?: RefObject<HTMLDivElement | null>
  children: ReactNode
  className?: string
  isVisible: boolean
} & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    containerClassName,
    containerStyle,
    contentClassName,
    contentStyle,
    isOutOfPosition,
  } = useStickyHeader(ref, isVisible, false);

  if (!isVisible) { return null; }

  return (
    <AppGrid
      containerRef={ref}
      className={containerClassName}
      style={containerStyle}
      contentMain={
        <div
          className={contentClassName}
          style={contentStyle}
        >
          <div
            {...props}
            ref={surfaceRef}
            className={clsx(
              'p-2',
              'component-surface-frosted',
              // Square off once stuck so the banner meets the content below
              'transition-[border-radius] duration-200',
              isOutOfPosition ? 'rounded-none' : 'rounded-xl',
              isOutOfPosition && 'outline-none!',
              'text-gray-900! dark:text-gray-100!',
              'bg-gray-100/90! dark:bg-gray-900/70!',
              'shadow-xl/5',
              className,
            )}
          >
            {children}
          </div>
        </div>
      }
    />
  );
}
