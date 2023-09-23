import { ReactNode } from 'react';
import { cc } from '@/utility/css';

export default function Checklist({
  title,
  icon,
  children,
}: {
  title: string
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <div className={cc(
        'flex items-center gap-3',
        'text-gray-600 dark:text-gray-300',
        'pl-[18px] mb-3',
      )}>
        {icon}
        <div className="text-lg">
          {title}
        </div>
      </div>
      <div className={cc(
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
