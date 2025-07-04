'use client';

import { useAppState } from '@/app/AppState';
import { clsx } from 'clsx/lite';
import { HTMLAttributes } from 'react';

export default function DivDebugBaselineGrid({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { shouldShowBaselineGrid } = useAppState();

  return (
    <div
      {...props}
      className={clsx(
        shouldShowBaselineGrid && 'bg-baseline-grid',
        className,
      )}
    >
      {children}
    </div>
  );
}
