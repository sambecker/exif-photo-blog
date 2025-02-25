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
      'divide-medium',
      'border rounded-md',
      type === 'regular'
        ? 'border-medium'
        : 'border-transparent',
      type === 'regular' && 'shadow-xs',
    )}>
      {children}
    </div>
  );
};
