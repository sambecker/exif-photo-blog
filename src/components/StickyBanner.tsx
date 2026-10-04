'use client';

import { clsx } from 'clsx/lite';
import { ReactNode, useRef } from 'react';
import AppGrid from './AppGrid';
import useStickyHeader from '@/app/useStickyHeader';

export default function StickyBanner({
  children,
  className,
  isEnabled,
}: {
  children: ReactNode
  className?: string
  isEnabled?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    containerClassName,
    containerStyle,
    contentClassName,
    contentStyle,
  } = useStickyHeader(ref, isEnabled, false);

  return (
    <AppGrid
      containerRef={ref}
      className={clsx(
        containerClassName,
        // Net 2px so the nav doesn't clip the card's top edge
        '-mt-2 pt-2.5',
        className,
      )}
      style={containerStyle}
      contentMain={
        <div
          className={contentClassName}
          style={contentStyle}
        >
          {children}
        </div>
      }
    />
  );
}
