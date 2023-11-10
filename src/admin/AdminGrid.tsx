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
    {/* py-[1px] fixes Safari vertical scroll bug */}
    <div className="min-w-[14rem] overflow-x-scroll py-[1px]">
      <div className={cc(
        'w-full',
        'grid grid-cols-[auto_1fr_auto] ',
        'gap-2 sm:gap-3 items-center',
      )}>
        {children}
      </div>
    </div>
  </div>;
}
