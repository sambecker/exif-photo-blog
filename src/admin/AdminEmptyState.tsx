import clsx from 'clsx/lite';
import { ReactNode } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

export default function AdminEmptyState({
  icon,
  children,
  includeContainer = true,
}: {
  icon?: ReactNode
  children: ReactNode
  includeContainer?: boolean
}) {
  return (
    <div className={clsx(
      'flex flex-col gap-4 justify-center items-center p-8',
      includeContainer &&'component-surface shadow-xs',
    )}>
      <div className={clsx(
        'size-14 flex justify-center items-center',
        'text-[1.75rem] text-medium',
        'border border-main rounded-xl shadow-xs',
      )}>
        {icon ?? <IoInformationCircleOutline />}
      </div>
      {children}
    </div>
  );
}