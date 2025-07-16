import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';

export default function Switcher({
  children,
  type = 'regular',
  className,
}: {
  children: ReactNode
  type?: 'regular' | 'borderless'
  className?: string
}) {
  return (
    <div className={clsx(
      'flex divide-x overflow-hidden',
      'rounded-[5px]',
      'divide-medium',
      type === 'regular' &&
        'outline-medium shadow-[0_2px_4px_rgba(0,0,0,0.07)]',
      className,
    )}>
      {children}
    </div>
  );
};
