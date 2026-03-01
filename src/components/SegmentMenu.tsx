import clsx from 'clsx/lite';
import { ReactNode } from 'react';
import Spinner from './Spinner';

export default function SegmentMenu<T extends string>({
  items,
  selected,
  onChange,
  className,
}: {
  items: {
    value: T
    icon?: ReactNode
    iconSelected?: ReactNode
    isLoading?: boolean
  }[]
  selected: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div className={clsx(
      'flex justify-center gap-1',
      className,
    )}>
      {items.map(({ value, icon, iconSelected, isLoading }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={clsx(
            'link',
            'rounded-full',
            value === selected
              ? 'bg-dim text-main'
              : 'bg-transparent text-medium',
            'flex items-center justify-center',
            'h-7 min-w-14',
            'active:bg-extra-dim',
          )}
        >
          {isLoading
            ? <Spinner />
            : icon
              ? selected === value && iconSelected
                ? iconSelected
                : icon
              : <span className={clsx(
                'text-sm font-medium uppercase tracking-wider',
              )}>
                {value}
              </span>}
        </button>
      ))}
    </div>
  );
}
