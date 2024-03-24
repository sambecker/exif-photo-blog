'use client';

import { clsx } from 'clsx/lite';
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
    <span className={clsx(
      className,
      'relative inline-flex items-center',
      'w-[1rem] h-[1.1rem]',
    )}>
      {!isLoading
        ? <button
          onClick={onClick}
          className={clsx(
            'inline-flex items-center justify-center',
            'p-0 border-none shadow-none',
            'active:bg-transparent bg-transparent dark:bg-transparent',
            'translate-x-[-1px]',
            onClick !== undefined && 'cursor-pointer',
            'active:opacity-50',
          )}
        >
          {icon}
        </button>
        : <span className={clsx(
          'inline-flex items-center justify-center',
          'h-full w-full',
        )}>
          <Spinner
            color={spinnerColor}
            size={spinnerSize}
          />
        </span>}
    </span>
  );
}
