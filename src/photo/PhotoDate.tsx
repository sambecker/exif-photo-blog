import ResponsiveDate from '@/components/ResponsiveDate';
import { Photo } from '.';
import { useMemo } from 'react';

export default function PhotoDate({
  photo: { takenAtNaive },
  className,
}: {
  photo: Photo
  className?: string
}) {
  const date = useMemo(() => {
    const date = new Date(takenAtNaive);
    return isNaN(date.getTime()) ? new Date() : date;
  }, [takenAtNaive]);
  return (
    <ResponsiveDate {...{ date, className }} />
  );
}
