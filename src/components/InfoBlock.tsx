import { cc } from '@/utility/css';
import { ReactNode } from 'react';

export default function InfoBlock({
  children,
  className,
  padding = 'normal',
  centered = true,
}: {
  children: ReactNode
  className?: string
  padding?: 'loose' | 'normal' | 'tight';
  centered?: boolean;
} ) {
  const getPaddingClasses = () => {
    switch (padding) {
    case 'loose': return 'p-4 md:p-24';
    case 'normal': return 'p-4 md:p-8';
    case 'tight': return 'py-2 px-3';
    }
  };

  return (
    <div className={cc(
      'flex flex-col items-center justify-center',
      'rounded-lg border',
      'bg-gray-50 border-gray-200',
      'dark:bg-gray-900/40 dark:border-gray-800',
      getPaddingClasses(),
      className,
    )}>
      <div className={cc(
        'flex flex-col justify-center w-full',
        centered && 'items-center',
        'space-y-4',
        'text-medium',
      )}>
        {children}
      </div>
    </div>
  );
}
