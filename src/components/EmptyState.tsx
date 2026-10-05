import clsx from 'clsx/lite';
import { ReactNode } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

export default function EmptyState({
  icon,
  children,
  className,
  includeContainer = true,
}: {
  icon?: ReactNode
  children: ReactNode
  className?: string
  includeContainer?: boolean
}) {
  return (
    <div className={clsx(
      'flex flex-col gap-4 justify-center items-center p-8',
      includeContainer && clsx(
        'min-h-72',
        'component-surface shadow-xs',
        'bg-extra-extra-dim',
      ),
      className,
    )}>
      <div className={clsx(
        'size-14 flex justify-center items-center',
        'text-[1.75rem] text-medium',
        'outline outline-medium rounded-xl shadow-sm',
        'bg-main dark:bg-extra-dim',
      )}>
        {icon ?? <IoInformationCircleOutline />}
      </div>
      {children}
    </div>
  );
}
