import { clsx } from 'clsx/lite';

export default function Badge({
  children,
  className,
  type = 'large',
  dimContent,
  highContrast,
  uppercase,
  interactive,
}: {
  children: React.ReactNode
  className?: string
  type?: 'large' | 'small' | 'text-only'
  dimContent?: boolean
  highContrast?: boolean
  uppercase?: boolean
  interactive?: boolean
}) {
  const stylesForType = () => {
    switch (type) {
    case 'large':
      return clsx(
        'px-1.5 h-[26px]',
        'rounded-md',
        'bg-gray-100/80 dark:bg-gray-900/80',
        'border border-gray-200/60 dark:border-gray-800/75',
      );
    case 'small':
      return clsx(
        'px-[5px] h-[17px] md:h-[18px]',
        'text-[0.7rem] font-medium rounded-[0.25rem]',
        highContrast
          ? 'text-invert bg-invert'
          : 'text-medium bg-gray-300/30 dark:bg-gray-700/50',
        interactive && (highContrast
          ? 'hover:opacity-70'
          : 'hover:text-gray-900 dark:hover:text-gray-100'),
        interactive && (highContrast
          ? 'active:opacity-90'
          : 'active:bg-gray-200 dark:active:bg-gray-700/60'),
      );
    }
  };
  return (
    <span className={clsx(
      'max-w-full',
      'inline-flex items-center',
      stylesForType(),
      uppercase && 'uppercase tracking-wider',
      className,
    )}>
      <span className={clsx(
        'max-w-full inline-flex',
        // Truncate 1 + 2 levels deep
        'truncate [&>*]:truncate',
        dimContent && 'opacity-50',
      )}>
        {children}
      </span>
    </span>
  );
}
