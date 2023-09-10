'use client';

import { cc } from '@/utility/css';
import Spinner from './Spinner';

export default function IconButton({
  children,
  onClick,
  isLoading,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  isLoading?: boolean
  className?: string
}) {
  return (
    <span className={cc(
      className,
      'relative inline-flex items-center justify-center',
      'min-w-[1.2rem] min-h-[1.3rem]',
    )}>
      {!isLoading
        ? <span
          onClick={onClick}
          className={cc(
            onClick !== undefined && 'cursor-pointer',
            'active:opacity-50',
          )}
        >
          {children}
        </span>
        : <span className={cc(
          'inline-block translate-y-[1.5px]',
        )}>
          <Spinner size={12} />
        </span>}
    </span>
  );
}
