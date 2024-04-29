import ResponsiveDate from '@/components/ResponsiveDate';
import { Photo } from '.';
import { useMemo } from 'react';

export default function PhotoDate({
  photo: { takenAtNaive },
}: {
  photo: Photo
}) {
  const date = useMemo(() => {
    const date = new Date(takenAtNaive);
    return isNaN(date.getTime()) ? new Date() : date;
  }, [takenAtNaive]);
  return (
    <ResponsiveDate {...{ date }} />
  );
}
