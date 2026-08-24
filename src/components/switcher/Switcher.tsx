import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import { CONTROL_OUTLINE_CLASSNAME } from '..';

export default function Switcher({
  children,
  type = 'regular',
  divide = true,
  className,
}: {
  children: ReactNode
  type?: 'regular' | 'borderless'
  divide?: boolean
  className?: string
}) {
  return (
    <div className={clsx(
      'flex overflow-hidden',
      'rounded-lg',
      divide && 'divide-x divide-medium',
      type === 'regular' && CONTROL_OUTLINE_CLASSNAME,
      className,
    )}>
      {children}
    </div>
  );
};
