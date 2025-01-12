'use client';

import { formatDate } from '@/utility/date';
import { clsx } from 'clsx/lite';
import { useEffect, useState } from 'react';

export default function ResponsiveDate({
  date,
  className,
  titleLabel,
  timezone: timezoneFromProps,
}: {
  date: Date
  className?: string
  titleLabel?: string
  timezone?: string | null
}) {
  const [timezone, setTimezone] = useState(timezoneFromProps);

  useEffect(() => {
    if (timezoneFromProps === null) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, [timezoneFromProps]);

  const showPlaceholderContent = timezone === null;

  const titleDateFormatted = formatDate(date).toLocaleUpperCase();

  const title = titleLabel
    ? `${titleLabel}: ${titleDateFormatted}`
    : titleDateFormatted;

  const contentClass = showPlaceholderContent && 'opacity-0 select-none';

  return (
    <span
      title={showPlaceholderContent ? 'LOADING LOCAL TIME' : title}
      className={clsx(
        'uppercase rounded-md transition-colors',
        showPlaceholderContent && 'bg-dim',
        className,
      )}
    >
      {/* Small */}
      <span
        className={clsx('xs:hidden', contentClass)}
        aria-hidden
      >
        {formatDate(date, 'short', showPlaceholderContent)}
      </span>
      {/* Medium */}
      <span
        className={clsx('hidden xs:inline-block sm:hidden', contentClass)}
        aria-hidden
      >
        {formatDate(date, 'medium', showPlaceholderContent)}
      </span>
      {/* Large */}
      <span
        className={clsx('hidden sm:inline-block', contentClass)}
      >
        {formatDate(date, undefined, showPlaceholderContent)}
      </span>
    </span>
  );
}
