import clsx from 'clsx/lite';
import { ReactNode } from 'react';

export default function ScoreCard({
  title,
  children,
  className,
}: {
  title?: ReactNode,
  children: ReactNode,
  className?: string,
}) {
  return (
    <div className="space-y-2">
      {title &&
        <div className={clsx(
          'pl-[15px] h-7 pb-1 flex items-end',
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
