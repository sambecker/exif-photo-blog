import { clsx } from 'clsx/lite';
import { HTMLAttributes, ReactNode, RefObject } from 'react';

export default function Container({
  children,
  className,
  color = 'gray-border',
  padding = 'normal',
  centered = true,
  spaceChildren = true,
  ...props
}: {
  ref?: RefObject<HTMLDivElement | null>
  children: ReactNode
  className?: string
  color?: 'gray' | 'gray-border' | 'blue' | 'red' | 'yellow'
  padding?:
    'loose' |
    'normal' |
    'tight' |
    'tight-cta-right' |
    'tight-cta-right-left'
  centered?: boolean
  spaceChildren?: boolean
} & HTMLAttributes<HTMLDivElement>) {
  const getColorClasses = () => {
    switch (color) {
      case 'gray': return [
        'text-medium',
        'bg-dim',
      ];
      case 'gray-border': return [
        'text-medium',
        'bg-extra-dim',
        'border-medium',
      ];
      case 'blue': return [
        'text-blue-800 dark:text-blue-400',
        'bg-blue-50 dark:bg-blue-950/50',
      ];
      case 'red': return [
        'text-red-700 dark:text-red-400',
        'bg-red-100/50 dark:bg-red-950/55',
      ];
      case 'yellow': return [
        'text-amber-700 dark:text-amber-500',
        'bg-amber-100/55 dark:bg-amber-950/55',
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
    <div
      {...props}
      className={clsx(
        'flex flex-col items-center justify-center',
        'rounded-lg',
        ...getColorClasses(),
        getPaddingClasses(),
        className,
      )}
    >
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
