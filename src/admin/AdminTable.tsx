import { clsx } from 'clsx/lite';
import { ReactNode } from 'react';

export default function AdminTable ({
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
    <div className="min-w-[14rem] overflow-x-auto py-[1px]">
      <div className={clsx(
        'w-full',
        'grid grid-cols-[auto_1fr_auto] ',
        'gap-2 sm:gap-3 items-center',
      )}>
        {children}
      </div>
    </div>
  </div>;
}
