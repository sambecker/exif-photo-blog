import ResponsiveDate from '@/components/ResponsiveDate';
import { Photo } from '.';
import { useMemo } from 'react';

export default function PhotoDate({
  photo,
  className,
  dateType = 'takenAt',
}: {
  photo: Photo
  className?: string
  dateType?: 'takenAt' | 'createdAt'
}) {
  const date = useMemo(() => {
    const date = new Date(dateType === 'takenAt'
      ? photo.takenAt
      : photo.createdAt);
    return isNaN(date.getTime()) ? new Date() : date;
  }, [
    dateType,
    photo.createdAt,
    photo.takenAt,
  ]);
  return (
    <ResponsiveDate {...{ date, className }} />
  );
}
