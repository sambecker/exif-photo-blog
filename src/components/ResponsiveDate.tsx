import { formatDate } from '@/utility/date';

export default function ResponsiveDate({
  date,
}: {
  date: Date
}) {
  return (
    <>
      {/* Mobile */}
      <span className="inline-block sm:hidden">
        {formatDate(date, true)}
      </span>
      {/* Desktop */}
      <span className="hidden sm:inline-block">
        {formatDate(date)}
      </span>
    </>
  );
}
