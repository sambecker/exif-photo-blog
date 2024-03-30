'use client';

import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import { ReactNode } from 'react';

export default function DivDebugBaselineGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { shouldShowBaselineGrid } = useAppState();

  return (
    <div className={clsx(
      className,
      shouldShowBaselineGrid && 'bg-baseline-grid',
    )}>
      {children}
    </div>
  );
}
