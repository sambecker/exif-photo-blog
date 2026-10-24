'use client';

import { clsx } from 'clsx/lite';
import { HTMLAttributes, ReactNode, RefObject, useRef } from 'react';
import AppGrid from './AppGrid';
import useStickyHeader from '@/app/useStickyHeader';

const BANNER_SURFACE_CLASS = clsx(
  'component-surface-frosted',
  'text-gray-900! dark:text-gray-100!',
  'bg-gray-100/90 dark:bg-gray-900/70',
  'shadow-xl/5',
);

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
    <div
      ref={ref}
      className={clsx(
        containerClassName,
        // Cancel the shell margin in app/layout.tsx
        // so the bar meets the viewport
        isOutOfPosition && clsx(
          '-mx-3 w-[calc(100%+1.5rem)]',
          'lg:-mx-6 lg:w-[calc(100%+3rem)]',
        ),
      )}
      style={containerStyle}
    >
      <div
        className={contentClassName}
        style={contentStyle}
      >
        <div className={clsx(
          isOutOfPosition && clsx(
            // Inset the column back to the shell after the viewport bleed
            'px-3 lg:px-6',
            BANNER_SURFACE_CLASS,
            'bg-white/90! dark:bg-gray-950/80!',
            'rounded-none outline-none!',
          ),
        )}>
          <AppGrid
            // Column stays out of hit testing; the surface opts back in
            classNameMain="pointer-events-none!"
            contentMain={
              <div
                {...props}
                ref={surfaceRef}
                className={clsx(
                  'pointer-events-auto',
                  'p-2',
                  // Square off once stuck so the banner meets the content
                  'transition-[border-radius] duration-200',
                  !isOutOfPosition && clsx(
                    BANNER_SURFACE_CLASS,
                    // Don't clip next child content that uses outline
                    'mt-px rounded-xl',
                  ),
                  className,
                )}
              >
                {children}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
