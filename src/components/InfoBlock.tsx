import { clsx } from 'clsx/lite';
import { ReactNode } from 'react';

export default function InfoBlock({
  children,
  className,
  color = 'gray',
  padding = 'normal',
  centered = true,
}: {
  children: ReactNode
  className?: string
  color?: 'gray' | 'blue'
  padding?: 'loose' | 'normal' | 'tight';
  centered?: boolean;
} ) {
  const getColorClasses = () => {
    switch (color) {
    case 'gray': return [
      'text-medium',
      'bg-gray-50 border-gray-200',
      'dark:bg-gray-900/40 dark:border-gray-800',
    ];
    case 'blue': return [
      'text-main',
      'bg-blue-50/50 border-blue-200',
      'dark:bg-blue-950/30 dark:border-blue-600/50',
    ];
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
    case 'loose': return 'p-4 md:p-24';
    case 'normal': return 'p-4 md:p-8';
    case 'tight': return 'py-2 px-3';
    }
  };

  return (
    <div className={clsx(
      'flex flex-col items-center justify-center',
      'rounded-lg border',
      ...getColorClasses(),
      getPaddingClasses(),
      className,
    )}>
      <div className={clsx(
        'flex flex-col justify-center w-full',
        centered && 'items-center',
        'space-y-4',
      )}>
        {children}
      </div>
    </div>
  );
}
