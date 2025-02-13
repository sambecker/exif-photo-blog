import clsx from 'clsx/lite';
import { ReactNode } from 'react';

export default function ScoreCard({
  children,
  className,
}: {
  children: ReactNode,
  className?: string,
}) {
  return (
    <div className={clsx(
      'component-surface shadow-xs divide-y divide-main',
      className,
    )}>
      {children}
    </div>
  );
}
