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
  hideTime,
}: {
  date: Date
  className?: string
  titleLabel?: string
  timezone?: Timezone
  hideTime?: boolean,
}) {
  const [timezone, setTimezone] = useState(timezoneFromProps);

  useEffect(() => {
    if (!timezoneFromProps) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, [timezoneFromProps]);

  const showPlaceholder = timezone === undefined;

  const titleDateFormatted = formatDate({ date, timezone })
    .toLocaleUpperCase();

  const title = titleLabel
    ? `${titleLabel}: ${titleDateFormatted}`
    : titleDateFormatted;

  const contentClass = showPlaceholder && 'opacity-0 select-none';

  const formatDateProps = {
    date,
    timezone,
    showPlaceholder,
    hideTime,
  } as const;

  return (
    <span
      title={showPlaceholder ? 'LOADING LOCAL TIME' : title}
      className={clsx(
        'uppercase rounded-md transition-colors whitespace-nowrap',
        showPlaceholder && 'bg-dim',
        className,
      )}
    >
      {/* Small */}
      <span
        className={clsx('xs:hidden', contentClass)}
        aria-hidden
      >
        {formatDate({ ...formatDateProps, length: 'short' })}
      </span>
      {/* Medium */}
      <span
        className={clsx('hidden xs:inline sm:hidden', contentClass)}
        aria-hidden
      >
        {formatDate({ ...formatDateProps, length: 'medium' })}
      </span>
      {/* Large */}
      <span
        className={clsx('hidden sm:inline', contentClass)}
      >
        {formatDate(formatDateProps)}
      </span>
    </span>
  );
}
