'use client';

import { clsx } from 'clsx/lite';
import { ReactNode, useRef } from 'react';
import AppGrid from './AppGrid';
import useStickyHeader from '@/app/useStickyHeader';

export default function StickySubNav({
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
  } = useStickyHeader(ref, isEnabled);

  return (
    <AppGrid
      containerRef={ref}
      className={containerClassName}
      style={containerStyle}
      classNameMain="pointer-events-auto"
      contentMain={
        <div
          className={clsx(
            'bg-main',
            // Enlarge nav to ensure it fully masks underlying content
            'md:w-[calc(100%+8px)] md:translate-x-[-4px] md:px-[4px]',
            contentClassName,
            className,
          )}
          style={contentStyle}
        >
          {children}
        </div>
      }
    />
  );
}
