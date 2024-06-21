import { formatDate } from '@/utility/date';
import { clsx } from 'clsx/lite';

export default function ResponsiveDate({
  date,
  className,
  titleLabel,
}: {
  date: Date
  className?: string
  titleLabel?: string
}) {
  const title = titleLabel
    ? `${titleLabel}: ${formatDate(date).toLocaleUpperCase()}`
    : formatDate(date).toLocaleUpperCase();
  return (
    <span
      title={title}
      className={clsx(className, 'uppercase')}
    >
      {/* Small */}
      <span
        className="xs:hidden"
        aria-hidden
      >
        {formatDate(date, 'short')}
      </span>
      {/* Medium */}
      <span
        className="hidden xs:inline-block sm:hidden"
        aria-hidden
      >
        {formatDate(date, 'medium')}
      </span>
      {/* Large */}
      <span className="hidden sm:inline-block">
        {formatDate(date)}
      </span>
    </span>
  );
}
