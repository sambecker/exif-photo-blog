import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import ExperimentalBadge from './ExperimentalBadge';
import Badge from './Badge';

export default function Checklist({
  title,
  icon,
  optional,
  experimental,
  children,
}: {
  title: string
  icon?: ReactNode
  optional?: boolean
  experimental?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <div className={clsx(
        'inline-flex items-center',
        'text-gray-600 dark:text-gray-300',
        'pl-[18px] mb-3 text-lg',
      )}>
        <span className="w-7 shrink-0">{icon}</span>
        <span className="inline-flex flex-wrap items-center gap-y-1 gap-x-1.5">
          {title}
          {optional &&
            <Badge type="small">Optional</Badge>}
          {experimental &&
            <ExperimentalBadge />}
        </span>
      </div>
      <div className={clsx(
        'bg-white dark:bg-black',
        'dark:text-gray-400',
        'border border-gray-200 dark:border-gray-800 rounded-md',
        'divide-y divide-gray-200 dark:divide-gray-800',
      )}>
        {children}
      </div>
    </div>
  );
}
