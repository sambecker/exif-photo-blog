import clsx from 'clsx/lite';
import { ReactNode } from 'react';

export default function ScoreCard({
  title,
  children,
  className,
}: {
  title?: string,
  children: ReactNode,
  className?: string,
}) {
  return (
    <div className="space-y-3">
      {title &&
        <div className={clsx(
          'pl-[15px]',
          'uppercase font-medium tracking-wider text-[0.8rem]',
          'text-medium',
        )}>
          {title}
        </div>}
      <div className={clsx(
        'component-surface shadow-xs divide-y divide-medium',
        className,
      )}>
        {children}
      </div>
    </div>
  );
}
