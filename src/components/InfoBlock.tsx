import { cc } from '@/utility/css';
import { ReactNode } from 'react';

export default function InfoBlock({
  children,
  className,
  padding = 'loose',
}: {
  children: ReactNode
  className?: string
  padding?: 'loose' | 'normal';
} ) {
  return (
    <div className={cc(
      'flex flex-col items-center justify-center',
      'px-8 rounded-lg',
      padding === 'loose' ? 'py-24' : 'py-8',
      'border',
      'bg-gray-50 border-gray-200',
      'dark:bg-gray-900/40 dark:border-gray-800',
      'text-center',
    )}>
      <div className={cc(
        'flex flex-col items-center justify-center',
        'space-y-4',
        'text-gray-500 dark:text-gray-400',
        className,
      )}>
        {children}
      </div>
    </div>
  );
}
