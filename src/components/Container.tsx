import { clsx } from 'clsx/lite';
import { ReactNode } from 'react';

export default function Container({
  children,
  className,
  color = 'gray',
  padding = 'normal',
  centered = true,
  spaceChildren = true,
}: {
  children: ReactNode
  className?: string
  color?: 'gray' | 'blue' | 'red' | 'yellow'
  padding?:
    'loose' |
    'normal' |
    'tight' |
    'tight-cta-right' |
    'tight-cta-right-left'
  centered?: boolean
  spaceChildren?: boolean
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
    case 'red': return [
      'text-red-600 dark:text-red-500/90',
      'bg-red-50/50 dark:bg-red-950/50',
      'border-red-100 dark:border-red-950',
    ];
    case 'yellow': return [
      'text-amber-700 dark:text-amber-500/90',
      'bg-amber-50/50 dark:bg-amber-950/30',
      'border-amber-200/80 dark:border-amber-800/30',
    ];
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
    case 'loose': return 'p-4 md:p-24';
    case 'normal': return 'p-4 md:p-8';
    case 'tight': return 'py-1.5 px-2.5';
    case 'tight-cta-right': return 'py-1.5 pl-2.5 pr-1.5';
    case 'tight-cta-right-left': return 'py-1.5 px-1.5';
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
        spaceChildren && 'space-y-4',
      )}>
        {children}
      </div>
    </div>
  );
}
