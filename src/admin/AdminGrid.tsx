import { cc } from '@/utility/css';
import { ReactNode } from 'react';

export default function AdminGrid ({
  title,
  children,
}: {
  title?: string,
  children: ReactNode,
}) {
  return <div className="space-y-4">
    {title &&
      <div className="font-bold">
        {title}
      </div>}
    <div className="min-w-[14rem] overflow-x-scroll">
      <div className={cc(
        'w-full',
        'grid grid-cols-[auto_1fr_auto_auto] ',
        'gap-2 sm:gap-3 items-center',
      )}>
        {children}
      </div>
    </div>
  </div>;
}
