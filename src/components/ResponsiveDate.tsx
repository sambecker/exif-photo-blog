'use client';

import { useAppState } from '@/app/AppState';
import { formatDate } from '@/utility/date';
import { clsx } from 'clsx/lite';

export default function ResponsiveDate({
  date,
  length,
  className,
  titleLabel,
  timezone: timezoneFromProps,
  hideTime,
}: {
  className?: string
  titleLabel?: string
} & Parameters<typeof formatDate>[0]) {
  const { timezone: timezoneFromState } = useAppState();

  const timezone = timezoneFromProps ?? timezoneFromState;

  const showPlaceholder = timezone === undefined;

  const formatDateProps: Parameters<typeof formatDate>[0] = {
    date,
    length,
    timezone,
  };

  const formatDateDynamic: Parameters<typeof formatDate>[0] = {
    ...formatDateProps,
    showPlaceholder,
    hideTime,
  };

  const titleDateFormatted = formatDate(formatDateProps)
    .toLocaleUpperCase();

  const title = titleLabel
    ? `${titleLabel}: ${titleDateFormatted}`
    : titleDateFormatted;

  const contentClass = showPlaceholder && 'opacity-0 select-none';

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
        {formatDate({ ...formatDateDynamic, length: 'short' })}
      </span>
      {/* Medium */}
      <span
        className={clsx('hidden xs:inline sm:hidden', contentClass)}
        aria-hidden
      >
        {formatDate({ ...formatDateDynamic, length: 'medium' })}
      </span>
      {/* Large */}
      <span
        className={clsx('hidden sm:inline', contentClass)}
      >
        {formatDate(formatDateDynamic)}
      </span>
    </span>
  );
}
