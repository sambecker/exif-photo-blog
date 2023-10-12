import { ReactNode } from 'react';
import { cc } from '@/utility/css';
import StatusIcon from './StatusIcon';

export default function ChecklistRow({
  title,
  status,
  isPending,
  optional,
  children,
}: {
  title: string
  status: boolean
  isPending: boolean
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div className={cc(
      'flex gap-2.5',
      'px-4 pt-2 pb-2.5',
    )}>
      <StatusIcon
        type={status ? 'checked' : optional ? 'optional' : 'missing'}
        loading={isPending}
      />
      <div className="flex flex-col min-w-0">
        <div className="font-bold dark:text-gray-300">
          {title}
          {optional && ' (optional)'}
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
