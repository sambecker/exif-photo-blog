import { formatDate } from '@/utility/date';
import { clsx } from 'clsx/lite';

export default function ResponsiveDate({
  date,
  className,
}: {
  date: Date
  className?: string
}) {
  return (
    <span
      title={formatDate(date).toLocaleUpperCase()}
      className={clsx(className, 'uppercase')}
    >
      {/* Small */}
      <span className="xs:hidden">
        {formatDate(date, 'short')}
      </span>
      {/* Medium */}
      <span className="hidden xs:inline-block sm:hidden">
        {formatDate(date, 'medium')}
      </span>
      {/* Large */}
      <span className="hidden sm:inline-block">
        {formatDate(date)}
      </span>
    </span>
  );
}
