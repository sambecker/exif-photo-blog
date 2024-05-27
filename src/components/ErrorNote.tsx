import { clsx } from 'clsx/lite';
import { ReactNode } from 'react';
import { BiErrorAlt } from 'react-icons/bi';

export default function ErrorNote({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={clsx(
      'flex w-full items-center gap-3',
      'px-3 py-2 border',
      'text-red-600 dark:text-red-500/90',
      'bg-red-50/50 dark:bg-red-950/50',
      'border-red-100 dark:border-red-950',
      'rounded-md',
      className,
    )}>
      <BiErrorAlt
        size={18}
        className="text-red-600/80 dark:text-red-500/70"
      />
      {children}
    </div>
  );
}
