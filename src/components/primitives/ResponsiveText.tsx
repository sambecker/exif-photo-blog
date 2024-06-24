import { ReactNode } from 'react';

export default function ResponsiveText({
  children,
  shortText,
}: {
  children: ReactNode
  shortText?: string
}) {
  return (
    <>
      {/* Full text */}
      <span className="hidden sm:inline">
        {children}
      </span>
      {/* Short text */}
      <span className="sm:hidden" aria-hidden>
        {shortText ?? children}
      </span>
    </>
  );
}
