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
  type?: 'large' | 'medium' | 'small' |'text-only'
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
          'bg-gray-100/40 dark:bg-gray-900/60',
          'border border-medium',
        );
      case 'small':
      case 'medium':
        return clsx(
          type === 'small'
            ? 'px-[5px] h-[17px] md:h-[18px]'
            : 'px-2 h-6.5',
          type === 'small'
            ? 'text-[0.7rem] font-medium rounded-md'
            : 'text-[0.9rem] rounded-lg',
          contrast === 'high'
            ? 'text-invert bg-invert'
            : contrast === 'frosted'
              ? 'text-black bg-neutral-100/30 border border-neutral-200/40'
              : 'text-medium-dark bg-gray-300/30 dark:bg-gray-700/50',
          interactive && (contrast === 'high'
            ? 'hover:opacity-70'
            : contrast === 'frosted'
              ? 'hover:text-black dark:hover:text-black'
              : 'hover:text-gray-900 dark:hover:text-gray-100'),
          interactive && (contrast === 'high'
            ? 'active:opacity-90'
            : contrast === 'frosted'
              ? 'active:bg-neutral-100/50 dark:active:bg-neutral-900/10'
              : 'active:bg-gray-200 dark:active:bg-gray-700/60'),
        );
    }
  };
  return (
    <span className={clsx(
      'max-w-full',
      'inline-flex items-center',
      stylesForType(),
      uppercase && 'uppercase',
      uppercase && type !== 'medium' && 'tracking-wider',
      className,
    )}>
      <span className={clsx(
        'max-w-full truncate',
        dimContent && 'opacity-50',
      )}>
        {children}
      </span>
    </span>
  );
}
