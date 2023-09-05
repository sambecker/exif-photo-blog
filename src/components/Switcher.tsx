import { ReactNode } from 'react';
import { cc } from '@/utility/css';

export default function Switcher({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className={cc(
      'flex divide-x',
      'divide-gray-300 dark:divide-gray-800',
      'border rounded-[0.25rem]',
      'border-gray-300 dark:border-gray-800',
      'overflow-hidden',
      'shadow-sm',
    )}>
      {children}
    </div>
  );
};
