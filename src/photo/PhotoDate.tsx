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
  dateType?: 'takenAt' | 'createdAt' | 'updatedAt'
}) {
  const date = useMemo(() => {
    const date = new Date(dateType === 'takenAt'
      ? photo.takenAt
      : dateType === 'createdAt'
        ? photo.createdAt
        : photo.updatedAt);
    return isNaN(date.getTime()) ? new Date() : date;
  }, [
    dateType,
    photo.takenAt,
    photo.createdAt,
    photo.updatedAt,
  ]);

  const getTitleLabel = () => {
    switch (dateType) {
    case 'takenAt':
      return 'TAKEN';
    case 'createdAt':
      return 'CREATED';
    case 'updatedAt':
      return 'UPDATED';
    }
  };

  return (
    <ResponsiveDate {...{
      date,
      className,
      titleLabel: getTitleLabel(),
    }} />
  );
}
