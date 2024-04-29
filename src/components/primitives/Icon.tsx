import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import Spinner from '../Spinner';

export default function Icon({
  children,
  className,
  iconClassName,
  wide,
  loading,
  debug,
}: {
  children: ReactNode
  className?: string
  iconClassName?: string
  wide?: boolean
  loading?: boolean
  debug?: boolean,
}) {
  return (
    <span className={clsx(
      'h-[18px] md:h-[20px]',
      wide ? 'w-[28px]' : 'w-[14px]',
      'inline-flex items-center justify-center',
      debug && 'bg-gray-700',
      className,
    )}>
      {loading
        ? <Spinner />
        : <span className={iconClassName}>
          {children}
        </span>}
    </span>
  );
}
