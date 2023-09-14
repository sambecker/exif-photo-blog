'use client';

import { cc } from '@/utility/css';
import Spinner, { SpinnerColor } from './Spinner';

export default function IconButton({
  icon,
  onClick,
  isLoading,
  className,
  spinnerColor,
  spinnerSize,
}: {
  icon: JSX.Element
  onClick?: () => void
  isLoading?: boolean
  className?: string
  spinnerColor?: SpinnerColor
  spinnerSize?: number
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
          {icon}
        </span>
        : <span className={cc(
          'inline-block translate-y-[1.5px]',
        )}>
          <Spinner
            color={spinnerColor}
            size={spinnerSize}
          />
        </span>}
    </span>
  );
}
