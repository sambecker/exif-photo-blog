import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import { CONTROL_OUTLINE_CLASSNAME } from '..';

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
      'rounded-lg',
      'divide-medium',
      type === 'regular' && CONTROL_OUTLINE_CLASSNAME,
      className,
    )}>
      {children}
    </div>
  );
};
