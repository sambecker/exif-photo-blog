import { ReactNode } from 'react';
import { cc } from '@/utility/css';
import Spinner from '@/components/Spinner';

export default function SiteChecklistRow({
  title,
  status,
  isPending,
  children,
}: {
  title: string
  status: boolean
  isPending: boolean
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
          : <div className="text-[0.8rem]">
            {status ? '✅' : '❌'}
          </div>}
      </div>
      <div className="flex flex-col items-start">
        <div className="font-bold dark:text-gray-300">{title}</div>
        <div>{children}</div>
      </div>
    </div>
  );
}
