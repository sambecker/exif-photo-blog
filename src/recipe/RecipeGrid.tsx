import clsx from 'clsx/lite';
import { ReactNode } from 'react';

// Literal classes so Tailwind can detect them
const SPAN_CLASSES = {
  3: 'col-span-3',
  4: 'col-span-4',
  6: 'col-span-6',
  8: 'col-span-8',
  12: 'col-span-12',
} as const;

export default function RecipeGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('grid grid-cols-12 gap-2', className)}>
      {children}
    </div>
  );
}

export function RecipeGridCell({
  children,
  label,
  span = 4,
  isChart,
  className,
}: {
  children: ReactNode
  label?: string
  span?: keyof typeof SPAN_CLASSES
  isChart?: boolean
  className?: string
}) {
  return (
    <div className={clsx(
      'flex flex-col items-center justify-center gap-0.5 min-w-0',
      'rounded-lg border',
      'border-neutral-200/40',
      'bg-neutral-100/30 hover:bg-neutral-100/50',
      isChart ? 'p-2' : label ? 'p-1' : 'py-0.5',
      SPAN_CLASSES[span],
      className,
    )}>
      <div className={isChart ? 'w-full' : 'truncate max-w-full tracking-wide'}>
        {children}
      </div>
      {label && <div className={clsx(
        'text-[10px] leading-none tracking-wide font-medium text-black/50',
        'uppercase truncate max-w-full',
      )}>
        {label}
      </div>}
    </div>
  );
}
