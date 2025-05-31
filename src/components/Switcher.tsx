import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';

export default function Switcher({
  children,
  type = 'regular',
}: {
  children: ReactNode
  type?: 'regular' | 'borderless'
}) {
  return (
    <div className={clsx(
      'flex divide-x overflow-hidden',
      // Apply offset due to outline strategy
      'translate-x-[1px] rounded-[5px]',
      'divide-medium',
      type === 'regular' && 'outline-medium shadow-xs',
    )}>
      {children}
    </div>
  );
};
