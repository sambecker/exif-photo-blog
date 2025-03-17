import { ReactNode } from 'react';

export default function ResponsiveText({
  children,
  shortText,
}: {
  children: ReactNode
  shortText?: ReactNode
}) {
  return (
    <>
      {/* Short text */}
      <span className="inline sm:hidden" aria-hidden>
        {shortText ?? children}
      </span>
      {/* Full text */}
      <span className="hidden sm:inline">
        {children}
      </span>
    </>
  );
}
