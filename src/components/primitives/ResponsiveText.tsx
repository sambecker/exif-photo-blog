import clsx from 'clsx/lite';
import { ReactNode } from 'react';

export default function ResponsiveText({
  shortText,
  className,
  children,
}: {
  shortText?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <>
      {/* Short text */}
      <span
        className={clsx('inline sm:hidden', className)}
        aria-hidden
      >
        {shortText ?? children}
      </span>
      {/* Full text */}
      <span className={clsx('hidden sm:inline', className)}>
        {children}
      </span>
    </>
  );
}
