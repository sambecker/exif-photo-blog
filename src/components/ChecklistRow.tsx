import { ReactNode } from 'react';
import { cc } from '@/utility/css';
import Spinner from '@/components/Spinner';

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
      'px-4 py-3',
      'text-left',
    )}>
      <div className="min-w-[1rem] pt-[1px]">
        {isPending
          ? <div className="translate-y-0.5">
            <Spinner size={14} />
          </div>
          : <div className="text-[0.8rem]" style={{ fontFamily: 'emoji' }}>
            {status
              ? '✅'
              : optional ? '⚠️' : '❌'}
          </div>}
      </div>
      <div className="flex flex-col items-start">
        <div className="font-bold dark:text-gray-300">
          {title}{optional && ' (optional)'}
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
