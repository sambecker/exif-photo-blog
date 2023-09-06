'use client';

import { cc } from '@/utility/css';
import Spinner from './Spinner';

export default function IconButton({
  children,
  onClick,
  isLoading,
}: {
  children: React.ReactNode
  onClick?: () => void
  isLoading?: boolean
}) {
  return (
    <span className="min-w-[1.1rem]">
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
          'inline-block translate-x-[2px] translate-y-[1px]',
        )}>
          <Spinner size={12} />
        </span>}
    </span>
  );
}
