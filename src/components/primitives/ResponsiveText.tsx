import clsx from 'clsx/lite';
import { ReactNode, useMemo } from 'react';

// Show long text at 'lg' breakpoint when 32 characters
const CHARACTER_CUTOFF_LG = 32;
// Show long text at 'md' breakpoint when 24 characters
const CHARACTER_CUTOFF_MD = 24;
// Otherwise show long text at 'sm' breakpoint

export default function ResponsiveText({
  shortText,
  className,
  children,
}: {
  shortText?: ReactNode
  className?: string
  children: ReactNode
}) {
  const cutoffClasses = useMemo(() => {
    const textLength = typeof children === 'string'
      ? children.length
      : 0;
    return textLength >= CHARACTER_CUTOFF_LG
      ? { short: 'lg:hidden', long: 'max-lg:hidden' }
      : textLength >= CHARACTER_CUTOFF_MD
        ? { short: 'md:hidden', long: 'max-md:hidden' }
        : { short: 'sm:hidden', long: 'max-sm:hidden' };
  }, [children]);

  return (
    <>
      {/* Short text */}
      <span
        className={clsx(cutoffClasses.short, className)}
        aria-hidden
      >
        {shortText ?? children}
      </span>
      {/* Full text */}
      <span className={clsx(cutoffClasses.long, className)}>
        {children}
      </span>
    </>
  );
}
