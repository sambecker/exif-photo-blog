'use client';

import { formatDate } from '@/utility/date';
import { Timezone } from '@/utility/timezone';
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
  timezone?: Timezone
}) {
  const [timezone, setTimezone] = useState(timezoneFromProps);

  useEffect(() => {
    if (!timezoneFromProps) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, [timezoneFromProps]);

  const showPlaceholderContent = timezone === undefined;

  const titleDateFormatted = formatDate(date, undefined, timezone)
    .toLocaleUpperCase();

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
        {formatDate(date, 'short', timezone, showPlaceholderContent)}
      </span>
      {/* Medium */}
      <span
        className={clsx('hidden xs:inline-block sm:hidden', contentClass)}
        aria-hidden
      >
        {formatDate(date, 'medium', timezone,showPlaceholderContent)}
      </span>
      {/* Large */}
      <span
        className={clsx('hidden sm:inline-block', contentClass)}
      >
        {formatDate(date, undefined, timezone, showPlaceholderContent)}
      </span>
    </span>
  );
}
