import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import StatusIcon from './StatusIcon';
import ExperimentalBadge from './ExperimentalBadge';

export default function ChecklistRow({
  title,
  status,
  isPending,
  optional,
  experimental,
  children,
}: {
  title: string
  status: boolean
  isPending: boolean
  optional?: boolean
  experimental?: boolean
  children: ReactNode
}) {
  return (
    <div className={clsx(
      'flex gap-2.5',
      'px-4 pt-2 pb-2.5',
    )}>
      <StatusIcon
        type={status ? 'checked' : optional ? 'optional' : 'missing'}
        loading={isPending}
      />
      <div className="flex flex-col min-w-0">
        <div className={clsx(
          'flex flex-wrap items-center gap-2 pb-1',
          'font-bold dark:text-gray-300',
        )}>
          {title}
          {experimental &&
            <ExperimentalBadge className="translate-y-[-0.5px]" />}
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
