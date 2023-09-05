'use client';

import { formatDate } from '@/utility/date';

export default function LocalDate({ date }: { date: Date }) {
  return (
    <>
      {formatDate(date)}
    </>
  );
};
