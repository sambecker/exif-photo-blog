import { clsx } from 'clsx/lite';

export default function Badge({
  children,
  className,
  type = 'large',
  dimContent,
  contrast = 'low',
  uppercase,
  interactive,
}: {
  children: React.ReactNode
  className?: string
  type?: 'large' | 'small' | 'text-only'
  dimContent?: boolean
  contrast?: 'low' | 'medium' | 'high' | 'frosted'
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
        'text-[0.7rem] leading-none font-medium rounded-[0.25rem]',
        contrast === 'high'
          ? 'text-invert bg-invert'
          : contrast === 'frosted'
            ? 'text-black bg-neutral-100/30 border border-neutral-200/40'
            : 'text-medium bg-gray-300/30 dark:bg-gray-700/50',
        interactive && (contrast === 'high'
          ? 'hover:opacity-70'
          : 'hover:text-gray-900 dark:hover:text-gray-100'),
        interactive && (contrast === 'high'
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
        'max-w-full inline-block truncate',
        dimContent && 'opacity-50',
      )}>
        {children}
      </span>
    </span>
  );
}
